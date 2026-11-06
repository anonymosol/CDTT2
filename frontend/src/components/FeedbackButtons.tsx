import { useState } from 'react';
import { api } from '../api/client';
import type { FeedbackKind } from '../api/types';

interface Props {
  gameId: string;
  question: string;
  section?: string;
}

/** Nút Đúng / Báo sai — gửi feedback vào hàng đợi quản trị (khung mục 5.5). */
export default function FeedbackButtons({ gameId, question, section }: Props) {
  const [sent, setSent] = useState<FeedbackKind | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send(kind: FeedbackKind) {
    try {
      await api.sendFeedback({ kind, gameId, question, section });
      setSent(kind);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gửi phản hồi thất bại');
    }
  }

  if (sent) {
    return (
      <p className="text-xs text-emerald-700">
        {sent === 'correct'
          ? 'Đã ghi nhận: câu trả lời đúng.'
          : 'Đã ghi nhận báo sai — sẽ vào hàng đợi quản trị.'}
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => send('correct')}
        className="cursor-pointer rounded-lg border border-emerald-300 px-2.5 py-1 text-xs text-emerald-800 hover:bg-emerald-50"
      >
        Đúng
      </button>
      <button
        type="button"
        onClick={() => send('wrong')}
        className="cursor-pointer rounded-lg border border-red-300 px-2.5 py-1 text-xs text-red-800 hover:bg-red-50"
      >
        Báo sai
      </button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}
