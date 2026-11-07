import type {
  AskPayload,
  FeedbackItem,
  FeedbackPayload,
  FeedbackStatus,
  Game,
  LearnPack,
  QuestionStat,
  RulesAnswer,
  TeachPack,
} from './types';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return (await res.json()) as T;
}

export const api = {
  listGames: () => request<Game[]>('/games'),

  getLearn: (gameId: string) => request<LearnPack>(`/games/${encodeURIComponent(gameId)}/learn`),

  getTeach: (gameId: string) => request<TeachPack>(`/games/${encodeURIComponent(gameId)}/teach`),

  askRules: (payload: AskPayload) =>
    request<RulesAnswer>('/rules/ask', { method: 'POST', body: JSON.stringify(payload) }),

  sendFeedback: (payload: FeedbackPayload) =>
    request<{ ok: true }>('/feedback', { method: 'POST', body: JSON.stringify(payload) }),

  getFeedbackQueue: () => request<FeedbackItem[]>('/admin/feedback'),

  patchFeedback: (id: string, status: FeedbackStatus) =>
    request<FeedbackItem>('/admin/feedback', {
      method: 'PATCH',
      body: JSON.stringify({ id, status }),
    }),

  addGame: (
    game: Omit<Game, 'id' | 'hasRules'> & { id?: string },
  ) => request<Game>('/admin/games', { method: 'POST', body: JSON.stringify(game) }),

  uploadRules: (gameId: string, payload: { content: string; sourceUrl?: string }) =>
    request<{ ok: true; sections: number }>(`/admin/games/${encodeURIComponent(gameId)}/rules`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getQuestionStats: () => request<QuestionStat[]>('/admin/questions/stats'),
};
