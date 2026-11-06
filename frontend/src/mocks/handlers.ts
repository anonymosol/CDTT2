import { http, HttpResponse } from 'msw';
import type {
  AskPayload,
  FeedbackItem,
  FeedbackPayload,
  FeedbackStatus,
  Game,
  QuestionStat,
} from '../api/types';
import type { RuleDoc } from './search';
import { answerFromIndex, buildSearchIndex } from './search';
import mockData from './data.json';

// Trạng thái in-memory của mock — reset bằng resetMocksState() trong test.
const games = structuredClone(mockData.games) as Game[];
const rules = structuredClone(mockData.rules) as Record<string, RuleDoc>;
const learnPacks = structuredClone(mockData.learn) as Record<string, unknown>;
const seedQuestions = mockData.seedQuestions as { id: string; game: string; question: string }[];

let index = buildSearchIndex(rules);
const feedback: FeedbackItem[] = [];
const askedLog: { gameId: string; question: string; at: string }[] = [];

export function resetMocksState() {
  feedback.length = 0;
  askedLog.length = 0;
}

function uid(): string {
  return `fb-${Math.random().toString(36).slice(2, 10)}`;
}

function findGame(gameId: string): Game | undefined {
  return games.find((g) => g.id === gameId);
}

function badRequest(message: string) {
  return HttpResponse.json({ error: message }, { status: 400 });
}

export const handlers = [
  http.get('/api/games', () => HttpResponse.json(games)),

  http.get('/api/games/:gameId/learn', ({ params }) => {
    const gameId = String(params.gameId);
    const game = findGame(gameId);
    const pack = learnPacks[gameId];
    if (!game || !pack) {
      return HttpResponse.json(
        { error: 'Chưa có bộ luật cho game này' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ ...pack, game });
  }),

  http.post('/api/rules/ask', async ({ request }) => {
    const body = (await request.json()) as Partial<AskPayload>;
    if (!body.gameId || !body.question?.trim()) {
      return badRequest('Cần gameId và question');
    }
    askedLog.push({
      gameId: body.gameId,
      question: body.question.trim(),
      at: new Date().toISOString(),
    });
    return HttpResponse.json(answerFromIndex(index, body.gameId, body.question));
  }),

  http.post('/api/feedback', async ({ request }) => {
    const body = (await request.json()) as Partial<FeedbackPayload>;
    if (body.kind !== 'correct' && body.kind !== 'wrong') {
      return badRequest('kind phải là correct hoặc wrong');
    }
    if (!body.gameId || !body.question?.trim()) {
      return badRequest('Cần gameId và question');
    }
    const item: FeedbackItem = {
      id: uid(),
      kind: body.kind,
      gameId: body.gameId,
      question: body.question.trim(),
      section: body.section,
      comment: body.comment,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    feedback.push(item);
    return HttpResponse.json({ ok: true as const });
  }),

  http.get('/api/admin/feedback', () => HttpResponse.json(feedback)),

  http.patch('/api/admin/feedback', async ({ request }) => {
    const body = (await request.json()) as { id?: string; status?: FeedbackStatus };
    const item = feedback.find((f) => f.id === body.id);
    if (!item) return HttpResponse.json({ error: 'Không tìm thấy phản hồi' }, { status: 404 });
    if (body.status !== 'open' && body.status !== 'resolved' && body.status !== 'rejected') {
      return badRequest('status không hợp lệ');
    }
    item.status = body.status;
    return HttpResponse.json(item);
  }),

  http.post('/api/admin/games', async ({ request }) => {
    const body = (await request.json()) as Partial<Game>;
    if (!body.name?.trim()) return badRequest('Cần name');
    if (
      typeof body.minPlayers !== 'number' ||
      typeof body.maxPlayers !== 'number' ||
      body.minPlayers < 1 ||
      body.minPlayers > body.maxPlayers
    ) {
      return badRequest('Số người chơi không hợp lệ');
    }
    const slug =
      body.id?.trim() ||
      body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    if (games.some((g) => g.id === slug)) return badRequest(`id "${slug}" đã tồn tại`);
    const game: Game = {
      id: slug,
      name: body.name.trim(),
      minPlayers: body.minPlayers,
      maxPlayers: body.maxPlayers,
      durationMin: body.durationMin ?? 20,
      durationMax: body.durationMax ?? 60,
      weight: body.weight ?? 2,
      genres: body.genres ?? ['family'],
      description: body.description ?? '',
      sourceUrl: body.sourceUrl ?? '',
      hasRules: false,
    };
    games.push(game);
    return HttpResponse.json(game, { status: 201 });
  }),

  http.post('/api/admin/games/:gameId/rules', async ({ params, request }) => {
    const gameId = String(params.gameId);
    if (!findGame(gameId)) {
      return HttpResponse.json({ error: 'Game không tồn tại' }, { status: 404 });
    }
    const body = (await request.json()) as { content?: string; sourceUrl?: string };
    const content = body.content?.trim();
    if (!content) return badRequest('Cần content');

    // Chia thô theo "## " để có thể hỏi đáp ngay trên nội dung vừa tải.
    const chunks = content.split(/^## /m).filter((c) => c.trim());
    const sections = chunks.map((chunk, i) => {
      const [first, ...rest] = chunk.split('\n');
      const m = /^(\d+)\.\s*(.+)/.exec(first.trim());
      return {
        num: m ? m[1] : String(i + 1),
        title: m ? m[2].trim() : first.trim(),
        body: rest,
        subs: [],
      };
    });
    rules[gameId] = { title: findGame(gameId)!.name, sections };
    index = buildSearchIndex(rules);
    const game = findGame(gameId)!;
    game.hasRules = true;
    return HttpResponse.json({ ok: true as const, sections: sections.length });
  }),

  http.get('/api/admin/questions/stats', () => {
    const stats: QuestionStat[] = games.map((g) => {
      const asked = askedLog.filter((a) => a.gameId === g.id);
      const counts = new Map<string, number>();
      for (const a of asked) counts.set(a.question, (counts.get(a.question) ?? 0) + 1);
      const topQuestions = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([question, count]) => ({ question, count }));
      return {
        gameId: g.id,
        gameName: g.name,
        seedCount: seedQuestions.filter((q) => q.game === g.id).length,
        askedCount: asked.length,
        topQuestions,
      };
    });
    return HttpResponse.json(stats);
  }),
];
