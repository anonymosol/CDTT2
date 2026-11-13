import createClient from 'openapi-fetch';
import { z } from 'zod';
import type { paths } from './schema';
import {
  gameSchema,
  recommendationSchema,
  userGameSchema,
  userSchema,
  type UserGame,
} from './models';

const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  credentials: 'include',
  fetch: (request) =>
    fetch(request, { signal: AbortSignal.any([request.signal, AbortSignal.timeout(20000)]) }),
});
export class ApiError extends Error {
  status: number;
  retryAfter?: number;
  constructor(message: string, status = 0, retryAfter?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.retryAfter = retryAfter;
  }
}
type Result = { data?: unknown; error?: unknown; response: Response };
function check<T>(result: Result, schema: z.ZodType<T>): T {
  if (!result.response.ok) {
    const error = z
      .object({ message: z.string(), retryAfter: z.number().optional() })
      .safeParse(result.error);
    throw new ApiError(
      error.success ? error.data.message : 'Yêu cầu chưa thực hiện được. Vui lòng thử lại.',
      result.response.status,
      error.success ? error.data.retryAfter : undefined,
    );
  }
  const parsed = schema.safeParse(result.data);
  if (!parsed.success)
    throw new ApiError('Dữ liệu trả về chưa đúng định dạng. Vui lòng thử lại sau.', 502);
  return parsed.data;
}
export const errorMessage = (error: unknown) =>
  error instanceof ApiError
    ? `${error.message}${error.retryAfter ? ` Thử lại sau ${error.retryAfter} giây.` : ''}`
    : 'Không kết nối được dịch vụ. Kiểm tra mạng rồi thử lại nhé.';
export type Filters = {
  q?: string;
  players?: number;
  time?: number;
  weight?: number;
  genre?: string;
  page?: number;
};
export const api = {
  async games(filters: Filters = {}, signal?: AbortSignal) {
    const result = await client.GET('/api/games', { params: { query: filters }, signal });
    const items = check(result, z.array(gameSchema));
    const count = result.response.headers.get('X-Total-Count');
    const pageSize = Number(result.response.headers.get('X-Page-Size'));
    return {
      items,
      total: count !== null && Number.isFinite(Number(count)) ? Number(count) : null,
      pageSize: pageSize > 0 ? pageSize : 6,
    };
  },
  async game(id: string, signal?: AbortSignal) {
    return check(
      await client.GET('/api/games/{id}', { params: { path: { id } }, signal }),
      gameSchema,
    );
  },
  async recommend(query: string, excludedIds: string[], signal?: AbortSignal) {
    return check(
      await client.POST('/api/recommend', { body: { query, excludedIds }, signal }),
      recommendationSchema,
    );
  },
  async me() {
    const result = await client.GET('/api/me');
    if (result.response.status === 401) return null;
    return check(result, userSchema);
  },
  async authenticate(
    mode: 'login' | 'register',
    body: { name?: string; email: string; password: string },
  ) {
    return check(
      mode === 'login'
        ? await client.POST('/api/auth/login', { body })
        : await client.POST('/api/auth/register', { body }),
      userSchema,
    );
  },
  async logout() {
    const result = await client.POST('/api/auth/logout');
    if (!result.response.ok && result.response.status !== 401) check(result, z.unknown());
  },
  async google() {
    return check(await client.POST('/api/auth/google'), z.object({ url: z.string().url() }));
  },
  async shelf() {
    return check(await client.GET('/api/me/games'), z.array(userGameSchema));
  },
  async save(record: UserGame) {
    return check(
      await client.PUT('/api/me/games/{gameId}', {
        params: { path: { gameId: record.gameId } },
        body: record,
      }),
      userGameSchema,
    );
  },
  async merge(games: UserGame[]) {
    return check(
      await client.POST('/api/me/merge-guest', { body: { games } }),
      z.array(userGameSchema),
    );
  },
};
