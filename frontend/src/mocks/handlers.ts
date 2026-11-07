import { http, HttpResponse, delay } from 'msw';
import { z } from 'zod';
import {
  credentialsSchema,
  recommendationRequestSchema,
  userGameSchema,
  userSchema,
  type User,
  type UserGame,
} from '../api/models';
import { games, filterGames, learning, mergeRecords, sampleRecommendations } from './catalog';

const error = (message: string, status = 400) => HttpResponse.json({ message }, { status });
const read = (key: string): unknown => {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? 'null');
  } catch {
    return null;
  }
};
const currentUser = (): User | null => {
  const result = userSchema.safeParse(read('bga-demo-user'));
  return result.success ? result.data : null;
};
const shelfKey = (user: User) => `bga-demo-shelf:${user.id}`;
const shelf = (user: User): UserGame[] => {
  const result = z.array(userGameSchema).safeParse(read(shelfKey(user)));
  return result.success ? result.data : [];
};
const saveShelf = (user: User, records: UserGame[]) =>
  sessionStorage.setItem(shelfKey(user), JSON.stringify(records));
// Development-only fault controls. No hidden magic words in user-facing inputs.
async function fault() {
  const scenario = sessionStorage.getItem('bga-demo-scenario');
  await delay(scenario === 'slow' ? 2200 : 180);
  if (scenario === 'error') return error('Không thể kết nối lúc này. Bạn thử lại nhé.', 503);
  if (scenario === 'rate-limit')
    return HttpResponse.json(
      { message: 'Đã đạt giới hạn yêu cầu. Vui lòng thử lại sau.', retryAfter: 10 },
      { status: 429, headers: { 'Retry-After': '10' } },
    );
}
export const handlers = [
  http.get('*/api/games', async ({ request }) => {
    const failed = await fault();
    if (failed) return failed;
    const params = new URL(request.url).searchParams;
    for (const key of ['players', 'time', 'weight', 'page']) {
      const value = params.get(key);
      if (value && (!Number.isFinite(Number(value)) || Number(value) <= 0))
        return error('Bộ lọc không hợp lệ.');
    }
    const all =
      sessionStorage.getItem('bga-demo-scenario') === 'empty' ? [] : filterGames(games, params);
    const page = Math.max(1, Math.floor(Number(params.get('page') || 1)));
    return HttpResponse.json(all.slice((page - 1) * 6, page * 6), {
      headers: { 'X-Total-Count': String(all.length), 'X-Page-Size': '6' },
    });
  }),
  http.get('*/api/games/:id/learn', async ({ params }) => {
    const failed = await fault();
    if (failed) return failed;
    return learning[String(params.id)]
      ? HttpResponse.json(learning[String(params.id)])
      : error('Chưa có tài liệu đã được duyệt cho game này.', 404);
  }),
  http.get('*/api/games/:id', async ({ params }) => {
    const failed = await fault();
    if (failed) return failed;
    const game = games.find((item) => item.id === params.id);
    return game ? HttpResponse.json(game) : error('Không tìm thấy boardgame này.', 404);
  }),
  http.post('*/api/recommend', async ({ request }) => {
    const failed = await fault();
    if (failed) return failed;
    const parsed = recommendationRequestSchema.safeParse(await request.json());
    return parsed.success
      ? HttpResponse.json(sampleRecommendations(parsed.data.query, parsed.data.excludedIds ?? []))
      : error('Hãy mô tả nhu cầu từ 3 đến 1.000 ký tự.');
  }),
  ...['login', 'register'].map((action) =>
    http.post(`*/api/auth/${action}`, async ({ request }) => {
      const failed = await fault();
      if (failed) return failed;
      const parsed = credentialsSchema.safeParse(await request.json());
      if (!parsed.success) return error('Kiểm tra email và mật khẩu (8–128 ký tự).');
      // Demonstrates UI only: no password is persisted; this is not real authentication.
      const email = parsed.data.email.toLowerCase();
      const user: User = {
        id: `demo-${email}`,
        name: parsed.data.name?.trim() || email.split('@')[0],
        email,
      };
      sessionStorage.setItem('bga-demo-user', JSON.stringify(user));
      return HttpResponse.json(user, { status: action === 'register' ? 201 : 200 });
    }),
  ),
  http.post('*/api/auth/google', () =>
    error(
      'Đăng nhập Google cần kết nối dịch vụ tài khoản thật. Bạn có thể dùng biểu mẫu trải nghiệm.',
      503,
    ),
  ),
  http.post('*/api/auth/logout', () => {
    sessionStorage.removeItem('bga-demo-user');
    return new HttpResponse(null, { status: 204 });
  }),
  http.get('*/api/me', () => {
    const user = currentUser();
    return user ? HttpResponse.json(user) : error('Bạn chưa đăng nhập.', 401);
  }),
  http.delete('*/api/me', () => {
    const user = currentUser();
    if (!user) return error('Bạn chưa đăng nhập.', 401);
    sessionStorage.removeItem(shelfKey(user));
    sessionStorage.removeItem('bga-demo-user');
    return new HttpResponse(null, { status: 204 });
  }),
  http.get('*/api/me/export', () => {
    const user = currentUser();
    return user
      ? HttpResponse.json({ user, games: shelf(user) })
      : error('Bạn chưa đăng nhập.', 401);
  }),
  http.get('*/api/me/games', ({ request }) => {
    const user = currentUser();
    if (!user) return error('Phiên đăng nhập đã hết hạn.', 401);
    const flag = new URL(request.url).searchParams.get('status');
    return HttpResponse.json(
      shelf(user).filter((item) => !flag || item[flag as keyof UserGame] === true),
    );
  }),
  http.put('*/api/me/games/:gameId', async ({ request, params }) => {
    const failed = await fault();
    if (failed) return failed;
    const user = currentUser();
    if (!user) return error('Phiên đăng nhập đã hết hạn.', 401);
    const parsed = userGameSchema.safeParse(await request.json());
    if (
      !parsed.success ||
      parsed.data.gameId !== params.gameId ||
      !games.some((game) => game.id === params.gameId)
    )
      return error('Thông tin game không hợp lệ.');
    saveShelf(user, [...shelf(user).filter((item) => item.gameId !== params.gameId), parsed.data]);
    return HttpResponse.json(parsed.data);
  }),
  http.post('*/api/me/merge-guest', async ({ request }) => {
    const failed = await fault();
    if (failed) return failed;
    const user = currentUser();
    if (!user) return error('Phiên đăng nhập đã hết hạn.', 401);
    const parsed = z
      .object({ games: z.array(userGameSchema).max(200) })
      .safeParse(await request.json());
    if (
      !parsed.success ||
      parsed.data.games.some((record) => !games.some((game) => game.id === record.gameId))
    )
      return error('Dữ liệu khách không hợp lệ.');
    const merged = mergeRecords(shelf(user), parsed.data.games);
    saveShelf(user, merged);
    return HttpResponse.json(merged);
  }),
];
