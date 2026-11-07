// Kiểu dữ liệu API — ĐỀ XUẤT hợp đồng, chờ thành viên 1–2 chính thức hóa
// trong docs/openapi.yaml. Đặt tên trường theo camelCase khớp schema `Game`
// hiện có của openapi (minPlayers, maxPlayers, duration...).

export interface Game {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  durationMin: number;
  durationMax: number;
  weight: number;
  genres: string[];
  description: string;
  sourceUrl: string;
  hasRules: boolean;
}

export interface SummaryBlock {
  num: string;
  title: string;
  paragraphs: string[];
  bullets: string[];
}

export interface ChecklistItem {
  text: string;
  /** Số người mà mục này áp dụng; null = áp dụng cho mọi số người. */
  players: number | null;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

/** GET /api/games/:id/learn — tóm tắt 5 phút + bày bàn + thuật ngữ. */
export interface LearnPack {
  summary5: SummaryBlock[];
  checklist: ChecklistItem[];
  glossary: GlossaryEntry[];
  game: Game;
}

/** POST /api/rules/ask — theo khung sườn: answer, found, citations (mục). */
export interface Citation {
  gameId: string;
  section: string;
  title: string;
  snippet: string;
}

export interface RulesAnswer {
  found: boolean;
  answer: string;
  citations: Citation[];
}

export interface AskPayload {
  gameId: string;
  question: string;
}

export type FeedbackKind = 'correct' | 'wrong';
export type FeedbackStatus = 'open' | 'resolved' | 'rejected';

export interface FeedbackPayload {
  kind: FeedbackKind;
  gameId: string;
  question: string;
  section?: string;
  comment?: string;
}

export interface FeedbackItem extends FeedbackPayload {
  id: string;
  status: FeedbackStatus;
  createdAt: string;
}

/** GET /api/games/:id/teach — chế độ dạy luật từng phần + quiz tự kiểm tra. */
export interface TeachStep {
  num: string;
  title: string;
  paragraphs: string[];
  bullets: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  answer: string;
  /** Số mục trong bộ luật để đọc lại nếu trả lời sai. */
  anchor: string;
}

export interface TeachPack {
  game: Game;
  steps: TeachStep[];
  quiz: QuizQuestion[];
}

export interface QuestionStat {
  gameId: string;
  gameName: string;
  seedCount: number;
  askedCount: number;
  topQuestions: { question: string; count: number }[];
}
