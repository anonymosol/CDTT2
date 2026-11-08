// Bộ máy "RAG giả" cho MSW: tìm kiếm từ khóa trên các mục bộ luật, trả về
// đáp án + trích dẫn theo mục, hoặc found=false. Logic thuần để test được.
// Khi backend thật (thành viên 2) có RAG thật, MSW chỉ cần thay handler.

export interface RuleSection {
  num: string;
  title: string;
  body: string[];
  subs?: { num: string; title: string; body: string[] }[];
}

export interface RuleDoc {
  title: string;
  sections: RuleSection[];
}

export interface SearchEntry {
  gameId: string;
  section: string;
  title: string;
  text: string;
  body: string[];
  isSub: boolean;
}

export interface Citation {
  gameId: string;
  section: string;
  title: string;
  snippet: string;
}

export interface SearchResult {
  found: boolean;
  answer: string;
  citations: Citation[];
}

const STOP = new Set([
  'la', 'the', 'nao', 'lam', 'sao', 'bang', 'gi', 'de', 'cua', 'cac', 'va',
  'trong', 'mot', 'nhu', 'duoc', 'voi', 'khi', 'cho', 'khong', 'phai', 'bi',
  'ra', 'di', 've', 'tu', 'den', 'tren', 'vao', 'theo', 'nhung',
]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export function tokenize(q: string): string[] {
  return normalize(q)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildSearchIndex(rules: Record<string, RuleDoc>): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const [gameId, doc] of Object.entries(rules)) {
    for (const sec of doc.sections) {
      // Chấm điểm mục cha CHỈ trên phần thân riêng của nó: nội dung nằm ở
      // mục con thì trích dẫn phải trỏ tới mục con, không phải mục cha.
      out.push({
        gameId,
        section: sec.num,
        title: sec.title,
        text: sec.body.join(' '),
        body: sec.body,
        isSub: false,
      });
      for (const sb of sec.subs ?? []) {
        out.push({
          gameId,
          section: sb.num,
          title: sb.title,
          text: sb.body.join(' '),
          body: sb.body,
          isSub: true,
        });
      }
    }
  }
  return out;
}

const NOT_FOUND_ANSWER =
  'Không tìm thấy nội dung này trong bộ luật của game. Hệ thống trả found=false thay vì đoán.';

export function answerFromIndex(
  index: SearchEntry[],
  gameId: string,
  question: string,
): SearchResult {
  const tokens = tokenize(question);
  const scored = index
    .filter((e) => e.gameId === gameId)
    .map((entry) => {
      const hay = normalize(`${entry.title} ${entry.text}`);
      let score = 0;
      for (const t of tokens) {
        if (normalize(entry.title).includes(t)) score += 3;
        const matches = hay.match(new RegExp(escapeRegex(t), 'g'));
        if (matches) score += Math.min(matches.length, 4);
      }
      return { entry, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (scored.length === 0 || tokens.length === 0) {
    return { found: false, answer: NOT_FOUND_ANSWER, citations: [] };
  }

  const top = scored[0].entry;
  const answer = [`[${top.gameId} · Mục ${top.section} · ${top.title}]`, ...top.body]
    .map((l) => l.trim().replace(/\*\*/g, ''))
    .filter(Boolean)
    .join('\n');

  const citations: Citation[] = scored.map(({ entry }) => ({
    gameId: entry.gameId,
    section: entry.section,
    title: entry.title,
    snippet: entry.body
      .join(' ')
      .replace(/\*\*/g, '')
      .trim()
      .slice(0, 220),
  }));

  return { found: true, answer, citations };
}
