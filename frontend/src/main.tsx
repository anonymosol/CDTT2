import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App, { ErrorBoundary } from './App';
import { AppProvider } from './store/AppProvider';
import { isDemo } from './api/models';
import './styles.css';

async function start() {
  if (isDemo) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest(request, print) {
        if (new URL(request.url).pathname.startsWith('/api/')) print.error();
      },
      quiet: true,
    });
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
void start().catch(() => {
  const root = document.getElementById('root')!;
  const heading = document.createElement('h1');
  heading.textContent = 'Chưa mở được bản trải nghiệm';
  const message = document.createElement('p');
  message.textContent =
    'Thử tải lại trang trên localhost hoặc HTTPS. Nếu lỗi tiếp diễn, kiểm tra service worker và hướng dẫn chạy trong README.';
  root.className = 'fatal-error';
  root.append(heading, message);
});
