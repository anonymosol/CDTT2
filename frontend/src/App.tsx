import { Component, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './app/Layout';
import { Discover } from './pages/Discover';
import { Detail } from './pages/Detail';
import { Recommend } from './pages/Recommend';
import { Library } from './pages/Library';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { EmptyState, ExploreLink } from './components/ui';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="fatal-error">
        <h1>Cần tải lại góc chơi</h1>
        <p>Ứng dụng gặp sự cố hiển thị. Dữ liệu đã lưu không bị xóa.</p>
        <button className="button primary" onClick={() => window.location.reload()}>
          Tải lại trang
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/games" replace />} />
        <Route path="games" element={<Discover />} />
        <Route path="games/:gameId" element={<Detail />} />
        <Route path="recommend" element={<Recommend />} />
        <Route path="library" element={<Library />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="login" element={<Auth key="login" mode="login" />} />
        <Route path="register" element={<Auth key="register" mode="register" />} />
        <Route
          path="*"
          element={
            <div className="content-page">
              <EmptyState
                title="Hình như bạn đi lạc một chút"
                description="Trang này không tồn tại. Cùng quay về bộ sưu tập nhé."
              >
                <ExploreLink />
              </EmptyState>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
