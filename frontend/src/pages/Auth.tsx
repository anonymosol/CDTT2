import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { ArrowRight, Dice5, Download, LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import { api, errorMessage } from '../api/client';
import { credentialsSchema, isDemo } from '../api/models';
import { useApp } from '../store/AppProvider';
import { Loading, Modal, PageIntro } from '../components/ui';

export function Auth({ mode }: { mode: 'login' | 'register' }) {
  const { user, sessionLoading, authenticate } = useApp();
  const [name, setName] = useState(''),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const navigate = useNavigate();
  if (!sessionLoading && user) return <Navigate to="/library" replace />;
  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = credentialsSchema.safeParse({
      name: mode === 'register' ? name.trim() : undefined,
      email: email.trim(),
      password,
    });
    if (!parsed.success) {
      setError('Kiểm tra tên, email và mật khẩu từ 8 đến 128 ký tự.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await authenticate(mode, parsed.data);
      setPassword('');
      navigate('/library');
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    setBusy(true);
    setError('');
    try {
      const { url } = await api.google();
      const target = new URL(url);
      if (target.origin !== window.location.origin)
        throw new Error('OAuth redirect must be same-origin');
      window.location.assign(target.href);
    } catch (error) {
      setError(errorMessage(error));
      setBusy(false);
    }
  }
  return (
    <div className="content-page auth-page">
      <div className="auth-art">
        <Dice5 size={46} />
        <span className="eyebrow">DÀNH CHỖ CHO NHỮNG NIỀM VUI</span>
        <h1>
          Một kệ game.
          <br />
          Rất nhiều
          <br />
          <em>kỷ niệm.</em>
        </h1>
        <p>Lưu sở thích của bạn, rồi cùng tìm một ván chơi đáng nhớ.</p>
        <div className="auth-art-symbol">✳</div>
      </div>
      <section className="auth-form">
        <span className="eyebrow">CHÀO BẠN ĐẾN VỚI BOARDGAME ADVISOR</span>
        <h2>{mode === 'login' ? 'Mừng bạn trở lại' : 'Tạo góc chơi của bạn'}</h2>
        <p className="muted">
          {mode === 'login'
            ? 'Đăng nhập để tiếp tục với kệ game của mình.'
            : 'Bắt đầu một bộ sưu tập những điều bạn thích.'}
        </p>
        {isDemo && (
          <div className="auth-demo-note">
            <ShieldCheck size={19} />
            <span>
              Đây là tài khoản mô phỏng, không xác thực mật khẩu thật. Dùng email và mật khẩu mẫu;
              mật khẩu không được lưu.
            </span>
          </div>
        )}
        <form onSubmit={(event) => void submit(event)}>
          {mode === 'register' && (
            <label className="form-label">
              Tên của bạn
              <input
                autoComplete="nickname"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={60}
                placeholder="Mình gọi bạn là gì?"
              />
            </label>
          )}
          <label className="form-label">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={254}
              placeholder={isDemo ? 'banchoi@example.com' : 'Email của bạn'}
            />
          </label>
          <label className="form-label">
            Mật khẩu
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              maxLength={128}
              required
              placeholder="Từ 8 ký tự"
            />
          </label>
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <button
            className="button primary auth-submit"
            type="submit"
            disabled={busy || sessionLoading}
          >
            {busy ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            <ArrowRight size={17} />
          </button>
        </form>
        <div className="auth-or">
          <span />
          hoặc
          <span />
        </div>
        <button
          className="button secondary auth-submit"
          disabled={busy}
          onClick={() => void google()}
        >
          <span className="google-g">G</span>Tiếp tục với Google
        </button>
        <p className="auth-switch">
          {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <Link to={mode === 'login' ? '/register' : '/login'}>
            {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
          </Link>
        </p>
        <Link className="guest-link" to="/games">
          Tiếp tục khám phá với chế độ khách
        </Link>
      </section>
    </div>
  );
}

export function Account() {
  const { user, sessionLoading, logout, deleteAccount, notify } = useApp();
  const [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const navigate = useNavigate();
  if (sessionLoading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  async function exportData() {
    setError('');
    try {
      const data = await api.export();
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = 'boardgame-du-lieu-ca-nhan.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify('Đã tải dữ liệu của bạn.');
    } catch (error) {
      setError(errorMessage(error));
    }
  }
  return (
    <div className="content-page reading-page">
      <PageIntro eyebrow="GÓC RIÊNG CỦA BẠN" title="Tài khoản">
        <p>Bạn kiểm soát dữ liệu và bộ sưu tập của mình.</p>
      </PageIntro>
      <section className="reading-card account-card">
        <span className="avatar large">{user.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </section>
      <section className="reading-card account-actions">
        <button className="button secondary" onClick={() => void exportData()}>
          <Download size={17} />
          Xuất dữ liệu của tôi
        </button>
        <button
          className="button secondary"
          onClick={() =>
            void logout()
              .then(() => navigate('/games'))
              .catch((error) => setError(errorMessage(error)))
          }
        >
          <LogOut size={17} />
          Đăng xuất
        </button>
        <button className="button danger" onClick={() => setConfirm(true)}>
          <Trash2 size={17} />
          Xóa tài khoản
        </button>
      </section>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {confirm && (
        <Modal
          title="Xóa tài khoản này?"
          close={() => {
            if (!busy) setConfirm(false);
          }}
        >
          <p>
            Tài khoản cùng kệ và dữ liệu liên quan sẽ được xóa khỏi dịch vụ. Thao tác này không thể
            khôi phục.
          </p>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button className="button secondary" disabled={busy} onClick={() => setConfirm(false)}>
              Giữ tài khoản
            </button>
            <button
              className="button danger"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError('');
                try {
                  await deleteAccount();
                  setConfirm(false);
                  navigate('/games');
                } catch (error) {
                  setError(errorMessage(error));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? 'Đang xóa…' : 'Xác nhận xóa'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
