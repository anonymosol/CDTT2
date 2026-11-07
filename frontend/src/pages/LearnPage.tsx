import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { ChecklistItem, LearnPack } from '../api/types';

function ChecklistRow({ item }: { item: ChecklistItem }) {
  const [done, setDone] = useState(false);
  return (
    <label className="flex cursor-pointer items-start gap-2 py-1">
      <input
        type="checkbox"
        checked={done}
        onChange={(e) => setDone(e.target.checked)}
        className="mt-0.5 accent-amber-700"
      />
      <span className={done ? 'text-stone-400 line-through' : ''}>
        {item.text}
        {item.players !== null && (
          <span className="ml-1 rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-500">
            {item.players} người
          </span>
        )}
      </span>
    </label>
  );
}

export default function LearnPage() {
  const { gameId = '' } = useParams();
  const [state, setState] = useState<{ loading: boolean; error?: string; data?: LearnPack }>({
    loading: true,
  });
  const [playersFilter, setPlayersFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true });
    api
      .getLearn(gameId)
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
          {notFound ? 'Chưa có bộ luật cho game này.' : 'Không tải được trang học luật.'}
        </p>
        <p className="mt-1 text-stone-600">{state.error}</p>
        <Link to="/games/ti-len/learn" className="mt-2 inline-block text-amber-800 underline">
          Về game mặc định
        </Link>
      </div>
    );
  }

  const { game, summary5, checklist, glossary } = state.data;
  const counts: number[] = [];
  for (let n = game.minPlayers; n <= game.maxPlayers; n++) counts.push(n);
  const shown = checklist.filter(
    (c) => c.players === null || playersFilter === 'all' || c.players === playersFilter,
  );
  const specificCount =
    playersFilter === 'all'
      ? checklist.filter((c) => c.players !== null).length
      : checklist.filter((c) => c.players === playersFilter).length;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">{game.name}</h1>
        <p className="mt-1 text-sm text-stone-500">{game.description}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-500">
          <span>
            👥 {game.minPlayers}–{game.maxPlayers} người
          </span>
          <span>
            ⏱ {game.durationMin}–{game.durationMax} phút
          </span>
          <span>⚖ độ khó {game.weight}/5</span>
          <span>{game.genres.join(', ')}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to={`/games/${game.id}/rules`}
            className="rounded-lg bg-amber-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-800"
          >
            Hỏi đáp luật →
          </Link>
          <Link
            to={`/games/${game.id}/teach`}
            className="rounded-lg border border-amber-700 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-50"
          >
            Chế độ dạy luật →
          </Link>
        </div>
      </div>

      <section aria-label="Tóm tắt 5 phút" className="flex flex-col gap-3">
        {summary5.map((block) => (
          <div key={block.num} className="rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
                Mục {block.num}
              </span>
              {block.title}
            </h2>
            {block.paragraphs.map((p, i) => (
              <p key={i} className="mt-2 text-sm text-stone-700">
                {p}
              </p>
            ))}
            {block.bullets.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">
                {block.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <section aria-label="Checklist bày bàn" className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Checklist bày bàn</h2>
        {counts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setPlayersFilter('all')}
              className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs ${
                playersFilter === 'all'
                  ? 'border-amber-700 bg-amber-700 text-white'
                  : 'border-stone-300 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Tất cả
            </button>
            {counts.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPlayersFilter(n)}
                className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs ${
                  playersFilter === n
                    ? 'border-amber-700 bg-amber-700 text-white'
                    : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {n} người
              </button>
            ))}
          </div>
        )}
        <div className="mt-2">
          {shown.map((item, i) => (
            <ChecklistRow key={`${gameId}-${i}`} item={item} />
          ))}
          {playersFilter !== 'all' && specificCount === 0 && (
            <p className="mt-1 text-sm text-stone-500">
              Chưa có ghi chú riêng cho số người này trong tài liệu luật — các mục trên áp dụng
              cho mọi số người.
            </p>
          )}
          {shown.length === 0 && (
            <p className="text-sm text-stone-500">Bộ luật này chưa có mục chuẩn bị.</p>
          )}
        </div>
      </section>

      <section aria-label="Bảng thuật ngữ" className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Bảng thuật ngữ</h2>
        {glossary.length > 0 ? (
          <table className="mt-2 w-full text-sm">
            <tbody>
              {glossary.map((g) => (
                <tr key={g.term} className="border-b border-stone-100 last:border-0">
                  <td className="py-1.5 pr-4 align-top font-medium text-stone-800">{g.term}</td>
                  <td className="py-1.5 text-stone-600">{g.definition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-2 text-sm text-stone-500">Bộ luật này chưa có mục thuật ngữ.</p>
        )}
      </section>
    </div>
  );
}
