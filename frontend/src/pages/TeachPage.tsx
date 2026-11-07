import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { QuizQuestion, TeachPack, TeachStep } from '../api/types';

function StepCard({ step }: { step: TeachStep }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
          Mục {step.num}
        </span>
        {step.title}
      </h2>
      {step.paragraphs.map((p, i) => (
        <p key={i} className="mt-2 text-sm text-stone-700">
          {p}
        </p>
      ))}
      {step.bullets.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">
          {step.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function QuizCard({ q }: { q: QuizQuestion }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="text-sm font-medium text-stone-800">{q.question}</p>
      {revealed ? (
        <div className="mt-2 rounded-lg bg-emerald-50 p-2.5 text-sm text-stone-700">
          <p>{q.answer}</p>
          <p className="mt-1 text-xs text-stone-500">
            Trả lời sai? Đọc lại <span className="font-medium">Mục {q.anchor}</span> ở bước
            tương ứng phía trên hoặc trang hỏi đáp.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-2 cursor-pointer rounded-lg border border-stone-300 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100"
        >
          Xem đáp án
        </button>
      )}
    </div>
  );
}

/** Chế độ dạy luật (khung 5.5, mục 3): AI/tài liệu hướng dẫn từng phần rồi hỏi kiểm tra. */
export default function TeachPage() {
  const { gameId = '' } = useParams();
  const [state, setState] = useState<{ loading: boolean; error?: string; data?: TeachPack }>({
    loading: true,
  });
  const [phase, setPhase] = useState<'lesson' | 'quiz'>('lesson');
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true });
    setPhase('lesson');
    setStepIdx(0);
    api
      .getTeach(gameId)
      .then((data) => !cancelled && setState({ loading: false, data }))
      .catch((e: unknown) =>
        !cancelled && setState({ loading: false, error: e instanceof Error ? e.message : 'Lỗi' }),
      );
    return () => {
      cancelled = true;
    };
  }, [gameId]);

  if (state.loading) return <p className="text-stone-500">Đang tải…</p>;
  if (state.error || !state.data) {
    const notFound = state.error?.includes('404');
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm">
        <p className="font-medium">
          {notFound ? 'Chưa có bộ luật để dạy cho game này.' : 'Không tải được chế độ dạy luật.'}
        </p>
        <p className="mt-1 text-stone-600">{state.error}</p>
      </div>
    );
  }

  const { game, steps, quiz } = state.data;
  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Chế độ dạy luật · {game.name}</h1>
        <Link to={`/games/${game.id}/learn`} className="text-sm text-amber-800 underline">
          ← Học luật
        </Link>
      </div>

      {phase === 'lesson' ? (
        <>
          <div className="flex items-center gap-2" aria-label={`Bước ${stepIdx + 1} trên ${steps.length}`}>
            {steps.map((s, i) => (
              <span
                key={s.num}
                className={`h-1.5 w-8 rounded-full ${i <= stepIdx ? 'bg-amber-700' : 'bg-stone-200'}`}
              />
            ))}
            <span className="ml-1 text-xs text-stone-500 tabular-nums">
              Bước {stepIdx + 1}/{steps.length}
            </span>
          </div>
          <StepCard step={step} />
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={stepIdx === 0}
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              className="cursor-pointer rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 disabled:opacity-40"
            >
              ← Trước
            </button>
            <button
              type="button"
              onClick={() => (isLast ? setPhase('quiz') : setStepIdx((i) => i + 1))}
              className="cursor-pointer rounded-lg bg-amber-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-800"
            >
              {isLast ? 'Vào phần kiểm tra →' : 'Tiếp →'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-stone-600">
            Kiểm tra nhanh — <span className="font-medium">tự trả lời trước</span> rồi mới xem
            đáp án. Trả lời sai thì đọc lại mục gợi ý.
          </p>
          <div className="flex flex-col gap-3">
            {quiz.length > 0 ? (
              quiz.map((q) => <QuizCard key={q.id} q={q} />)
            ) : (
              <p className="text-sm text-stone-500">
                Chưa có câu hỏi kiểm tra cho game này trong bộ đánh giá.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setPhase('lesson');
                setStepIdx(0);
              }}
              className="cursor-pointer rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
            >
              Học lại từ đầu
            </button>
            <Link
              to={`/games/${game.id}/rules`}
              className="rounded-lg bg-amber-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-800"
            >
              Thực tập bằng hỏi đáp →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
