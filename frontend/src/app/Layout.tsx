import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Dice5,
  Leaf,
  LogOut,
  Menu,
  Search,
  Sparkles,
  UserRound,
  WifiOff,
  X,
} from 'lucide-react';
import { isDemo } from '../api/models';
import { errorMessage } from '../api/client';
import { useApp } from '../store/AppProvider';
import { Modal } from '../components/ui';
import { PwaNotice } from '../pwa/PwaNotice';

export function Layout() {
  const [menu, setMenu] = useState(false);
  const [smallScreen, setSmallScreen] = useState(
    () => window.matchMedia('(max-width: 760px)').matches,
  );
  const menuPanel = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  function closeMenu() {
    setMenu(false);
    requestAnimationFrame(() => menuButton.current?.focus());
  }
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const change = () => setSmallScreen(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!menu || !smallScreen) return;
    menuPanel.current?.querySelector<HTMLButtonElement>('.mobile-close')?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
      if (event.key !== 'Tab') return;
      const elements = Array.from(
        menuPanel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((element) => element.getClientRects().length);
      const first = elements[0],
        last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [menu, smallScreen]);
  const [search, setSearch] = useState('');
  const [online, setOnline] = useState(navigator.onLine);
  const [merging, setMerging] = useState(false);
  const [mergeError, setMergeError] = useState('');
  const {
    user,
    sessionLoading,
    records,
    guestsToMerge,
    merge,
    dismissMerge,
    notice,
    toast,
    logout,
    notify,
    reload,
  } = useApp();
  const location = useLocation(),
    navigate = useNavigate();
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [location.pathname]);
  useEffect(() => {
    const change = () => setOnline(navigator.onLine);
    window.addEventListener('online', change);
    window.addEventListener('offline', change);
    return () => {
      window.removeEventListener('online', change);
      window.removeEventListener('offline', change);
    };
  }, []);
  function submitSearch(event: FormEvent) {
    event.preventDefault();
    navigate(`/games${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`);
  }
  const title = location.pathname.startsWith('/library')
    ? 'Kệ game của tôi'
    : location.pathname.startsWith('/recommend')
      ? 'Gợi ý cho bạn'
      : location.pathname.startsWith('/onboarding')
        ? 'Làm quen sở thích'
        : location.pathname.startsWith('/account')
          ? 'Tài khoản'
          : 'Khám phá';
  useEffect(() => {
    document.title = `${title} · Boardgame Advisor`;
  }, [title]);
  const savedCount = records.filter((record) => record.wishlist).length;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      {menu && <button className="sidebar-scrim" aria-label="Đóng menu" onClick={closeMenu} />}
      <aside
        ref={menuPanel}
        inert={smallScreen && !menu}
        className={`sidebar ${menu ? 'open' : ''}`}
      >
        <Link to="/games" className="brand" aria-label="Boardgame Advisor - Trang khám phá">
          <span className="brand-icon">
            <Dice5 size={27} />
          </span>
          <span>
            boardgame<span className="brand-sub">ADVISOR</span>
          </span>
        </Link>
        <button className="mobile-close icon-button" aria-label="Đóng menu" onClick={closeMenu}>
          <X size={20} />
        </button>
        <div className="nav-caption">GÓC CHƠI CỦA BẠN</div>
        <nav aria-label="Điều hướng chính">
          <NavLink to="/games">
            <Compass size={19} />
            Khám phá
          </NavLink>
          <NavLink to="/recommend">
            <Sparkles size={19} />
            Gợi ý cho bạn
            <span className="nav-dot" />
          </NavLink>
          <NavLink to="/library">
            <BookOpen size={19} />
            Kệ game của tôi{savedCount > 0 && <span className="nav-count">{savedCount}</span>}
          </NavLink>
        </nav>
        <div className="sidebar-guide">
          <span className="guide-icon">
            <Leaf size={22} />
          </span>
          <h3>Mới chơi boardgame?</h3>
          <p>Bắt đầu từ sở thích của bạn. Chúng mình sẽ cùng tìm game phù hợp.</p>
          <Link to="/onboarding">
            Làm quen một chút <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="sidebar-bottom">
          <span className="tiny-dice">✳</span>
          <p>
            Một ván chơi,
            <br />
            <strong>nhiều kết nối.</strong>
          </p>
          <span>ĐỒ ÁN CHUYÊN ĐỀ THỰC TẾ 2</span>
        </div>
      </aside>
      <div className="workspace" inert={smallScreen && menu}>
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuButton}
              className="icon-button mobile-menu"
              aria-label="Mở menu"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Menu size={22} />
            </button>
            <span>Góc boardgame</span>
            <ChevronRight size={13} />
            <strong>{title}</strong>
          </div>
          <div className="topbar-actions">
            <form className="header-search" role="search" onSubmit={submitSearch}>
              <Search size={16} />
              <input
                aria-label="Tìm nhanh boardgame"
                placeholder="Tìm một boardgame…"
                value={search}
                maxLength={100}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="sr-only" type="submit">
                Tìm
              </button>
            </form>
            <span className="header-divider" />
            {sessionLoading ? (
              <span className="session-wait">Đang kiểm tra phiên…</span>
            ) : user ? (
              <>
                <Link className="account-link" to="/account">
                  <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
                  <span>{user.name}</span>
                </Link>
                <button
                  className="icon-button"
                  aria-label="Đăng xuất"
                  onClick={() => void logout().catch((error) => notify(errorMessage(error)))}
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <Link className="login-link" to="/login">
                <UserRound size={17} />
                Đăng nhập
              </Link>
            )}
          </div>
        </header>
        {isDemo && (
          <div className="demo-strip">
            <span className="status-dot" />
            Bản trải nghiệm · Game, tài khoản và gợi ý mẫu<Link to="/about">Tìm hiểu</Link>
          </div>
        )}
        {!online && (
          <div className="network-notice" role="status">
            <WifiOff size={17} />
            Bạn đang ngoại tuyến. Một số nội dung đã xem có thể dùng được; gợi ý trực tuyến cần kết
            nối mạng.
          </div>
        )}
        {notice && (
          <div className="network-notice" role="alert">
            {notice}
            <button className="text-button" onClick={() => void reload()}>
              Thử kết nối lại
            </button>
            <Link to="/login">Đăng nhập</Link>
          </div>
        )}
        <main id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="footer">
          <span>
            <Dice5 size={15} /> Boardgame Advisor
          </span>
          <span>Tìm game hợp gu. Dành thời gian cho nhau.</span>
          <Link to="/about">
            Về dự án <ArrowUpRight size={13} />
          </Link>
        </footer>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
      {guestsToMerge.length > 0 && (
        <Modal
          title="Mang kệ game theo bạn"
          close={() => {
            if (!merging) dismissMerge();
          }}
        >
          <p>
            Bạn có {guestsToMerge.length} game đã lưu khi dùng chế độ khách. Gộp chúng vào tài khoản
            hiện tại?
          </p>
          <p className="muted small">
            Nhãn được kết hợp. Điểm và ghi chú đã có trong tài khoản được giữ lại. Dữ liệu khách chỉ
            được xóa sau khi gộp thành công.
          </p>
          {mergeError && (
            <p className="field-error" role="alert">
              {mergeError}
            </p>
          )}
          <div className="modal-actions">
            <button className="button secondary" disabled={merging} onClick={dismissMerge}>
              Để sau
            </button>
            <button
              className="button primary"
              disabled={merging}
              onClick={async () => {
                setMerging(true);
                setMergeError('');
                try {
                  await merge();
                } catch (error) {
                  setMergeError(errorMessage(error));
                } finally {
                  setMerging(false);
                }
              }}
            >
              {merging ? 'Đang gộp…' : 'Gộp vào tài khoản'}
            </button>
          </div>
        </Modal>
      )}
      {!isDemo && <PwaNotice />}
    </div>
  );
}
