import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import type { FeedbackItem, FeedbackStatus, Game, QuestionStat } from '../api/types';

type Tab = 'game' | 'rules' | 'queue' | 'stats';

const TABS: { id: Tab; label: string }[] = [
  { id: 'game', label: 'Nhập game' },
  { id: 'rules', label: 'Tải tài liệu luật' },
  { id: 'queue', label: 'Hàng đợi báo sai' },
  { id: 'stats', label: 'Thống kê câu hỏi' },
];

const tabClass = (active: boolean) =>
  `cursor-pointer rounded-lg px-3 py-1.5 text-sm ${
    active ? 'bg-amber-100 font-medium text-amber-900' : 'text-stone-600 hover:bg-stone-100'
  }`;

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm focus:outline-2 focus:outline-amber-700';

function AddGameForm({ onAdded }: { onAdded: (g: Game) => void }) {
  const [form, setForm] = useState({
    name: '',
    minPlayers: '2',
    maxPlayers: '4',
    durationMin: '15',
    durationMax: '45',
    weight: '1.5',
    genres: 'family',
    description: '',
    sourceUrl: '',
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const game = await api.addGame({
        name: form.name,
        minPlayers: Number(form.minPlayers),
        maxPlayers: Number(form.maxPlayers),
        durationMin: Number(form.durationMin),
        durationMax: Number(form.durationMax),
        weight: Number(form.weight),
        genres: form.genres.split(',').map((s) => s.trim()).filter(Boolean),
        description: form.description,
        sourceUrl: form.sourceUrl,
      });
      setMessage(`Đã thêm game "${game.name}" (id: ${game.id}).`);
      onAdded(game);
      setForm((f) => ({ ...f, name: '', description: '', sourceUrl: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thêm game thất bại');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4">
      <label className="text-sm">
        <span className="mb-1 block">Tên game *</span>
        <input required value={form.name} onChange={set('name')} className={inputClass} />
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block">Ít nhất (người)</span>
          <input type="number" min={1} value={form.minPlayers} onChange={set('minPlayers')} className={inputClass} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block">Nhiều nhất (người)</span>
          <input type="number" min={1} value={form.maxPlayers} onChange={set('maxPlayers')} className={inputClass} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block">Thời lượng từ (phút)</span>
          <input type="number" min={1} value={form.durationMin} onChange={set('durationMin')} className={inputClass} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block">đến (phút)</span>
          <input type="number" min={1} value={form.durationMax} onChange={set('durationMax')} className={inputClass} />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block">Độ khó (1–5)</span>
          <input type="number" min={1} max={5} step={0.1} value={form.weight} onChange={set('weight')} className={inputClass} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block">Thể loại (phân tách bởi dấu phẩy)</span>
          <input value={form.genres} onChange={set('genres')} className={inputClass} />
        </label>
      </div>
      <label className="text-sm">
        <span className="mb-1 block">Mô tả ngắn</span>
        <textarea rows={2} value={form.description} onChange={set('description')} className={inputClass} />
      </label>
      <label className="text-sm">
        <span className="mb-1 block">URL nguồn dữ kiện</span>
        <input value={form.sourceUrl} onChange={set('sourceUrl')} className={inputClass} />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="cursor-pointer self-start rounded-lg bg-amber-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50"
      >
        {busy ? 'Đang lưu…' : 'Thêm game'}
      </button>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
      <p className="text-xs text-stone-400">
        Game thêm vào mock chỉ tồn tại trong phiên — bản thật cần backend + quyền quản trị.
      </p>
    </form>
  );
}

function UploadRulesForm({ games }: { games: Game[] }) {
  const [gameId, setGameId] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.uploadRules(gameId, { content, sourceUrl: sourceUrl || undefined });
      setMessage(`Đã nạp ${res.sections} mục vào bộ luật của "${gameId}".`);
      setContent('');
      setSourceUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nạp tài liệu thất bại');
    } finally {
      setBusy(false);
    }
  }

  const eligible = games.filter((g) => !g.hasRules);
  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4">
      <label className="text-sm">
        <span className="mb-1 block">Game *</span>
        <select required value={gameId} onChange={(e) => setGameId(e.target.value)} className={inputClass}>
          <option value="">— chọn game —</option>
          {eligible.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.id}){g.hasRules ? ' — đã có luật' : ''}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block">Nội dung bộ luật (Markdown, các mục bắt đầu bằng "## N. Tên mục")</span>
        <textarea required rows={8} value={content} onChange={(e) => setContent(e.target.value)} className={`${inputClass} font-mono text-xs`} />
      </label>
      <label className="text-sm">
        <span className="mb-1 block">URL nguồn (bắt buộc ghi vào data/LICENSES.md sau khi duyệt)</span>
        <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className={inputClass} />
      </label>
      <button
        type="submit"
        disabled={busy || !gameId}
        className="cursor-pointer self-start rounded-lg bg-amber-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50"
      >
        {busy ? 'Đang nạp…' : 'Nạp tài liệu'}
      </button>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}

function FeedbackQueue() {
  const [items, setItems] = useState<FeedbackItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    api
      .getFeedbackQueue()
      .then(setItems)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Lỗi'));
  }, []);

  useEffect(reload, [reload]);

  async function setStatus(id: string, status: FeedbackStatus) {
    await api.patchFeedback(id, status);
    reload();
  }

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!items) return <p className="text-sm text-stone-500">Đang tải…</p>;
  if (items.length === 0) {
    return <p className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-500">Hàng đợi trống — chưa có ai báo sai hoặc đánh giá câu trả lời.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((f) => (
        <li key={f.id} className="rounded-xl border border-stone-200 bg-white p-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                f.kind === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {f.kind === 'correct' ? 'Đánh giá đúng' : 'Báo sai'}
            </span>
            <span className="text-xs text-stone-400">{f.gameId}</span>
            {f.section && <span className="text-xs text-stone-400">Mục {f.section}</span>}
            <span
              className={`ml-auto rounded px-2 py-0.5 text-xs ${
                f.status === 'open' ? 'bg-stone-100 text-stone-600' : 'bg-amber-50 text-amber-800'
              }`}
            >
              {f.status}
            </span>
          </div>
          <p className="mt-1.5 text-stone-800">“{f.question}”</p>
          {f.comment && <p className="text-xs text-stone-500">Ghi chú: {f.comment}</p>}
          {f.status === 'open' && (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStatus(f.id, 'resolved')}
                className="cursor-pointer rounded-lg border border-emerald-300 px-2.5 py-1 text-xs text-emerald-800 hover:bg-emerald-50"
              >
                Đã xử lý
              </button>
              <button
                type="button"
                onClick={() => setStatus(f.id, 'rejected')}
                className="cursor-pointer rounded-lg border border-stone-300 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100"
              >
                Từ chối
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function QuestionStats() {
  const [stats, setStats] = useState<QuestionStat[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getQuestionStats()
      .then(setStats)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Lỗi'));
  }, []);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!stats) return <p className="text-sm text-stone-500">Đang tải…</p>;
  const withRules = stats.filter((s) => s.seedCount > 0);
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-left text-xs text-stone-500">
              <th className="px-3 py-2">Game</th>
              <th className="px-3 py-2">Câu hỏi trong bộ đánh giá</th>
              <th className="px-3 py-2">Người dùng đã hỏi (phiên này)</th>
            </tr>
          </thead>
          <tbody>
            {withRules.map((s) => (
              <tr key={s.gameId} className="border-b border-stone-100 last:border-0">
                <td className="px-3 py-2 font-medium">{s.gameName}</td>
                <td className="px-3 py-2 tabular-nums">{s.seedCount}</td>
                <td className="px-3 py-2 tabular-nums">{s.askedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {stats.some((s) => s.topQuestions.length > 0) && (
        <div className="rounded-xl border border-stone-200 bg-white p-3 text-sm">
          <h3 className="text-sm font-semibold">Câu hỏi hay gặp nhất</h3>
          <ul className="mt-2 list-disc pl-5 text-stone-700">
            {stats
              .flatMap((s) => s.topQuestions.map((t) => ({ ...t, gameName: s.gameName })))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((t, i) => (
                <li key={i}>
                  {t.question} — {t.gameName} (×{t.count})
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('game');
  const [games, setGames] = useState<Game[]>([]);

  const reloadGames = useCallback(() => {
    api
      .listGames()
      .then(setGames)
      .catch(() => undefined);
  }, []);

  useEffect(reloadGames, [reloadGames]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Trang quản trị</h1>
      <div className="flex flex-wrap gap-1" role="tablist" aria-label="Chức năng quản trị">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={tabClass(tab === t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'game' && <AddGameForm onAdded={reloadGames} />}
      {tab === 'rules' && <UploadRulesForm games={games} />}
      {tab === 'queue' && <FeedbackQueue />}
      {tab === 'stats' && <QuestionStats />}
    </div>
  );
}
