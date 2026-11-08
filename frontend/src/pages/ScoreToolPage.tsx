import { useEffect, useState } from 'react';

interface Player {
  name: string;
  score: number;
}

const STORAGE_KEY = 'ba-score-tool-v1';

function loadInitial(): { players: Player[]; turn: number; round: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as { players?: Player[]; turn?: number; round?: number };
      if (Array.isArray(saved.players) && saved.players.length > 0) {
        return {
          players: saved.players,
          turn: Math.min(saved.turn ?? 0, saved.players.length - 1),
          round: saved.round ?? 1,
        };
      }
    }
  } catch {
    // localStorage không khả dụng — dùng trạng thái mặc định
  }
  return { players: [], turn: 0, round: 1 };
}

/** Công cụ phụ trợ (khung 5.5, mục 4): tính điểm và đếm lượt cho ván chơi thật. */
export default function ScoreToolPage() {
  const [state, setState] = useState(loadInitial);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // bỏ qua — không lưu được thì chỉ mất dữ liệu khi refresh
    }
  }, [state]);

  function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    const base = newName.trim();
    if (!base) return;
    setState((s) => {
      // Trùng tên thì thêm hậu tố số thứ tự để nút bấm không nhập nhằng
      let name = base;
      let n = 2;
      while (s.players.some((p) => p.name === name)) {
        name = `${base} (${n++})`;
      }
      return { ...s, players: [...s.players, { name, score: 0 }] };
    });
    setNewName('');
  }

  function addScore(idx: number, delta: number) {
    setState((s) => ({
      ...s,
      players: s.players.map((p, i) => (i === idx ? { ...p, score: p.score + delta } : p)),
    }));
  }

  function removePlayer(idx: number) {
    setState((s) => {
      const players = s.players.filter((_, i) => i !== idx);
      return { players, turn: players.length ? s.turn % players.length : 0, round: s.round };
    });
  }

  function nextTurn() {
    setState((s) => {
      if (s.players.length === 0) return s;
      const next = (s.turn + 1) % s.players.length;
      return { ...s, turn: next, round: next === 0 ? s.round + 1 : s.round };
    });
  }

  const current = state.players[state.turn];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Tính điểm & đếm lượt</h1>

      {current && (
        <p
          aria-label={`Đến lượt: ${current.name}, vòng ${state.round}`}
          className="rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-900"
        >
          🎯 Đến lượt: <span className="font-semibold">{current.name}</span> · Vòng thứ{' '}
          <span className="font-semibold tabular-nums">{state.round}</span>
        </p>
      )}

      {state.players.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-500">
          Thêm người chơi để bắt đầu ghi điểm. Dữ liệu lưu ngay trên máy bạn.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {state.players.map((p, i) => (
            <li
              key={`${p.name}-${i}`}
              className={`flex flex-wrap items-center gap-2 rounded-xl border bg-white p-3 ${
                i === state.turn ? 'border-amber-600' : 'border-stone-200'
              }`}
            >
              <span className="min-w-28 text-sm font-medium">{p.name}</span>
              <span
                aria-label={`Điểm của ${p.name}`}
                className="w-12 text-right text-lg font-semibold tabular-nums"
              >
                {p.score}
              </span>
              <span className="ml-auto flex gap-1">
                {[-5, -1, 1, 5].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => addScore(i, d)}
                    className="cursor-pointer rounded-lg border border-stone-300 px-2.5 py-1 text-xs text-stone-700 hover:bg-stone-100"
                    aria-label={`${d > 0 ? 'Cộng' : 'Trừ'} ${Math.abs(d)} điểm cho ${p.name}`}
                  >
                    {d > 0 ? `+${d}` : d}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => removePlayer(i)}
                  className="cursor-pointer rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
                  aria-label={`Xóa ${p.name}`}
                >
                  Xóa
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        {state.players.length > 0 && (
          <>
            <button
              type="button"
              onClick={nextTurn}
              className="cursor-pointer rounded-lg bg-amber-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-800"
            >
              Hết lượt →
            </button>
            <button
              type="button"
              onClick={() =>
                setState((s) => ({
                  ...s,
                  players: s.players.map((p) => ({ ...p, score: 0 })),
                  round: 1,
                  turn: 0,
                }))
              }
              className="cursor-pointer rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
            >
              Về 0 điểm cả bàn
            </button>
          </>
        )}
      </div>

      <form className="flex gap-2" onSubmit={addPlayer}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Tên người chơi…"
          aria-label="Tên người chơi mới"
          className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-amber-700"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          Thêm
        </button>
      </form>
    </div>
  );
}
