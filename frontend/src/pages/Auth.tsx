import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { ArrowRight, Dice5, ShieldCheck } from 'lucide-react';
import { api, errorMessage } from '../api/client';
import { credentialsSchema, isDemo } from '../api/models';
import { useApp } from '../store/AppProvider';

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
