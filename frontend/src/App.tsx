import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import LearnPage from './pages/LearnPage';
import RulesAskPage from './pages/RulesAskPage';
import AdminPage from './pages/AdminPage';
import TeachPage from './pages/TeachPage';
import ScoreToolPage from './pages/ScoreToolPage';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 ${
    isActive ? 'bg-amber-100 font-medium text-amber-900' : 'text-stone-600 hover:bg-stone-100'
  }`;

// Khung ứng dụng tối giản — bạn 3 (trưởng thiết kế) sẽ thay bằng design system
// dùng chung và bổ sung định tuyến PWA khi ghép luồng khám phá.
export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="font-semibold">
            🎲 Boardgame Advisor
          </Link>
          <nav className="flex gap-1 text-sm" aria-label="Điều hướng chính">
            <NavLink to="/games/ti-len/learn" className={navClass}>
              Học luật
            </NavLink>
            <NavLink to="/games/ti-len/rules" className={navClass}>
              Hỏi đáp
            </NavLink>
            <NavLink to="/tools/score" className={navClass}>
              Công cụ
            </NavLink>
            <NavLink to="/admin" className={navClass}>
              Quản trị
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/games/ti-len/learn" replace />} />
          <Route path="/games/:gameId/learn" element={<LearnPage />} />
          <Route path="/games/:gameId/rules" element={<RulesAskPage />} />
          <Route path="/games/:gameId/teach" element={<TeachPage />} />
          <Route path="/tools/score" element={<ScoreToolPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<p className="text-stone-500">Không tìm thấy trang.</p>} />
        </Routes>
      </main>
      <footer className="mx-auto max-w-3xl px-4 pb-6 text-xs text-stone-400">
        Bản demo frontend chạy bằng dữ liệu giả MSW sinh từ <code>data/</code> — hợp đồng API
        chờ cả nhóm chốt trong <code>docs/openapi.yaml</code>.
      </footer>
    </div>
  );
}
