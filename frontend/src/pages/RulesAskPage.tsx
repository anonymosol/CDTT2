import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { RulesAnswer } from '../api/types';
import CitationChip from '../components/CitationChip';
import FeedbackButtons from '../components/FeedbackButtons';

type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; answer: RulesAnswer };

type AssistantMessageData = Extract<ChatMessage, { role: 'assistant' }>;

const SAMPLES = [
  'Làm sao để thắng?',
  'Tổ hợp hợp lệ gồm những gì?',
  'Khi nào bị thua hoặc hòa?',
  'Có biến thể nào không?',
];

function AssistantMessage({
  msg,
  gameName,
  gameId,
}: {
  msg: AssistantMessageData;
  gameName: string;
  gameId: string;
}) {
  const answer = msg.answer;
  if (!answer.found) {
    return (
      <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-3 text-sm">
        <p className="font-medium text-red-900">Không tìm thấy trong bộ luật này</p>
        <p className="mt-1 text-stone-600">
          Hệ thống trả <code>found: false</code> thay vì đoán. Thử hỏi nội dung có trong tài liệu.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-stone-200 border-l-4 border-l-amber-700 bg-white p-3">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {answer.citations.map((c) => (
          <CitationChip key={`${c.section}-${c.title}`} citation={c} gameName={gameName} />
        ))}
      </div>
      <p className="whitespace-pre-line text-sm text-stone-800">{answer.answer}</p>
      <div className="mt-3 border-t border-stone-100 pt-2">
        <FeedbackButtons gameId={gameId} question={msg.text} section={answer.citations[0]?.section} />
      </div>
    </div>
  );
}

export default function RulesAskPage() {
  const { gameId = '' } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameName, setGameName] = useState(gameId);

  useEffect(() => {
    api
      .listGames()
      .then((games) => {
        const g = games.find((x) => x.id === gameId);
        if (g) setGameName(g.name);
      })
      .catch(() => undefined);
  }, [gameId]);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    try {
      const answer = await api.askRules({ gameId, question: text });
      setMessages((m) => [...m, { role: 'assistant', text, answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi khi hỏi');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hỏi đáp luật · {gameName}</h1>
        <Link to={`/games/${gameId}/learn`} className="text-sm text-amber-800 underline">
          ← Học luật
        </Link>
      </div>

      <div className="flex flex-col gap-3" aria-live="polite">
        {messages.length === 0 && (
          <p className="text-sm text-stone-500">
            Đặt câu hỏi về luật của {gameName}. Câu trả lời kèm trích dẫn theo mục; nếu tài liệu
            không có thông tin, hệ thống sẽ nói rõ thay vì đoán.
          </p>
        )}
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <p key={i} className="ml-auto max-w-[80%] rounded-2xl bg-amber-700 px-3.5 py-2 text-sm text-white">
              {m.text}
            </p>
          ) : (
            <AssistantMessage key={i} msg={m} gameName={gameName} gameId={gameId} />
          ),
        )}
        {busy && <p className="text-sm text-stone-400">Đang tra bộ luật…</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi luật…"
          aria-label="Câu hỏi luật"
          className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-amber-700"
        />
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-xl bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50"
        >
          Hỏi
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="cursor-pointer rounded-full border border-stone-300 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
