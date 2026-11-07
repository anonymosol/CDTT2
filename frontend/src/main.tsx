import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Frontend chạy song song với backend bằng dữ liệu giả MSW (khung sườn mục 4).
// Tắt bằng biến môi trường VITE_USE_MOCKS=false để gọi backend thật.
// Nếu worker mock lỗi (vd thiếu service worker), app vẫn render và báo lỗi rõ.
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS === 'false') return;
  try {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  } catch (e) {
    console.error('[mocks] Không bật được MSW — app sẽ chạy không có dữ liệu:', e);
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
});
