import { describe, expect, it } from 'vitest';
import mockData from '../data.json';
import { answerFromIndex, buildSearchIndex } from '../search';
import type { RuleDoc } from '../search';

const rules = mockData.rules as unknown as Record<string, RuleDoc>;
const index = buildSearchIndex(rules);

describe('answerFromIndex (RAG giả)', () => {
  it('trả lời câu hỏi về chặt heo kèm trích dẫn mục 4.4 của Tiến Lên', () => {
    const r = answerFromIndex(index, 'ti-len', 'heo bị chặt bằng gì?');
    expect(r.found).toBe(true);
    expect(r.citations[0]?.gameId).toBe('ti-len');
    expect(r.citations[0]?.section).toBe('4.4');
    expect(r.answer).toContain('tứ quý');
  });

  it('trả về found=false khi nội dung không có trong tài liệu (chống bịa)', () => {
    const r = answerFromIndex(index, 'ti-len', 'Catan?');
    expect(r.found).toBe(false);
    expect(r.citations).toHaveLength(0);
  });

  it('không trả lời xuyên game: hỏi "phong cấp" trên Tiến Lên phải là không tìm thấy', () => {
    const r = answerFromIndex(index, 'ti-len', 'phong cấp là gì?');
    expect(r.found).toBe(false);
  });

  it('trả lời đúng game khi hỏi cùng câu ở game khác', () => {
    const r = answerFromIndex(index, 'co-vua', 'phong cấp là gì?');
    expect(r.found).toBe(true);
    expect(r.citations[0]?.gameId).toBe('co-vua');
    expect(r.citations[0]?.section).toBe('4.2');
  });
});
