import { useRegisterSW } from 'virtual:pwa-register/react';
export function PwaNotice() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div className="pwa-notice" role="status">
      <p>Có phiên bản mới. Lưu thay đổi trước khi cập nhật.</p>
      <button className="button primary" onClick={() => void updateServiceWorker(true)}>
        Cập nhật
      </button>
      <button className="text-button" onClick={() => setNeedRefresh(false)}>
        Để sau
      </button>
    </div>
  );
}
