# Boardgame Advisor — Frontend Khám phá

Ứng dụng React + TypeScript + Vite + Tailwind, thực hiện vai trò Thành viên 3.
Hướng dẫn học theo mã nguồn: [`../docs/FRONTEND_GUIDE.md`](../docs/FRONTEND_GUIDE.md).
Thiết kế: [`../docs/DESIGN.md`](../docs/DESIGN.md).

## Chạy trên Windows

Yêu cầu Node.js >= 22.12 cùng npm, Git và trình duyệt hiện đại.
Mở terminal ở thư mục `frontend`:

```powershell
npm ci
npm run dev
```

Mở http://127.0.0.1:5173/games. Lệnh dev mặc định bật MSW: không cần backend,
database hay API key để trải nghiệm. Game và gợi ý là dữ liệu mẫu có nhãn rõ ràng.
Không đăng nhập bằng thông tin cá nhân thật trong bản mô phỏng.

Nếu npm chưa có trên máy, cài Node.js kèm npm rồi mở lại terminal VS Code.
Môi trường agent dùng Node và npm tạm bên ngoài repo; đường dẫn riêng đó không
phải điều kiện để thành viên khác chạy dự án.

## Chuyển sang backend thật

Tạo `frontend/.env.local`:

```dotenv
VITE_API_MODE=live
VITE_API_BASE_URL=
```

Khởi động lại Vite. `/api` được proxy đến http://localhost:3000 trong dev.
Backend hiện tại chưa hiện thực các endpoint nghiệp vụ. Ứng dụng sẽ hiện lỗi thật,
không âm thầm thay bằng dữ liệu mẫu. Hợp đồng đề xuất nằm ở `docs/openapi.yaml`.
Nếu gọi backend ở origin khác, đặt `VITE_API_BASE_URL` và cấu hình cookie/CORS,
CSRF phía backend đúng với môi trường. Không đặt khóa LLM vào biến `VITE_*`.

## Các luồng đã triển khai

- `/games`: tìm kiếm không dấu, lọc số người/thời gian/độ khó/thể loại, sắp xếp,
  phân trang, giữ bộ lọc trên URL, loading/empty/error và retry.
- `/games/:id`: chi tiết; cập nhật nhiều nhãn, điểm sao và ghi chú.
- `/recommend`: nhập câu tự nhiên, kết quả và lý do; loại game không thích,
  tùy chọn loại game đã chơi; trường hợp rỗng/lỗi/429 và timeout.
- `/library`: kệ cá nhân, lọc nhãn, thống kê, chỉnh sửa; khách lưu IndexedDB.
- `/onboarding`: chọn game đã chơi, chấm điểm hoặc bỏ qua.
- `/login`, `/register`, `/account`: giao diện tài khoản, gộp kệ, xuất/xóa dữ liệu.
  MSW mô phỏng phiên của tab và KHÔNG xác thực mật khẩu thật.
- `/games/:id/learn`: trang bàn giao tối thiểu cho tài liệu học luật đã duyệt;
  ba bản luật tự biên soạn của game hư cấu. Chưa có RAG/hỏi đáp luật.
- `/about`: giải thích nguồn dữ liệu, chế độ và cách lưu kệ.

Luồng hỏi luật RAG, quản trị và hỏi lịch sử thuộc các phần khác của đề tài,
chưa được thực hiện trong bàn giao Thành viên 3 này.

## Kiểm chứng

```powershell
npm run api:generate
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Kiểu API được sinh từ OpenAPI và lưu trong `src/api/schema.d.ts`.
Không sửa tệp sinh tự động. Zod kiểm tra phản hồi ở thời điểm chạy.
Playwright chạy các tình huống trên desktop và viewport di động Chromium.
Đây là mô phỏng viewport, chưa thay thế kiểm tra trên điện thoại thật/Safari.

## Build, preview và PWA

```powershell
npm run build
npm run preview
```

Build mặc định là live (trừ khi bạn đặt `VITE_API_MODE=demo` trong môi trường).
Service worker chỉ lưu tài nguyên ứng dụng; không cache API hay dữ liệu cá nhân.
Gợi ý qua dịch vụ vẫn cần mạng. Manifest/icon có sẵn, có thông báo cập nhật.
Hosting SPA cần rewrite các đường dẫn giao diện về `index.html`, trừ `/api`.
HTTPS cần thiết khi triển khai PWA ngoài localhost.

Muốn preview dữ liệu mẫu thay vì backend:

```powershell
npm run build:demo
npm run preview
```

Build demo dùng MSW và tắt service worker PWA để tránh hai worker cùng scope.
Khi đổi giữa demo và live, DevTools → Application → Service Workers → Unregister
worker cũ nếu trình duyệt còn dùng nó. Không xóa IndexedDB nếu muốn giữ kệ khách.

## Thử lỗi khi phát triển

Trong Console trình duyệt của bản demo:

```javascript
sessionStorage.setItem('bga-demo-scenario', 'error'); // lỗi 503
sessionStorage.setItem('bga-demo-scenario', 'rate-limit'); // lỗi 429
sessionStorage.setItem('bga-demo-scenario', 'empty'); // danh sách rỗng
sessionStorage.setItem('bga-demo-scenario', 'slow'); // phản hồi chậm
sessionStorage.removeItem('bga-demo-scenario'); // bình thường
```

Sau đó tải lại trang hoặc bấm thử lại. Các điều khiển này chỉ là công cụ QA,
không xuất hiện trong luồng người dùng.

## Dữ liệu và artwork

12 game hư cấu được biên soạn tại `src/mocks/catalog.ts`. Hình SVG do mã nguồn
`scripts/generate-art.mjs` tự tạo; không sao chép hình hộp game thương mại.
Chạy `node scripts/generate-art.mjs` để tạo lại SVG. Icon PNG PWA là hình xúc xắc
gốc của dự án. Ghi nguồn tại `data/LICENSES.md`.

## Giới hạn cần phối hợp

- Backend mới có health check; cần review và hiện thực hợp đồng trước tích hợp.
- Đăng nhập Google trả thông báo chưa khả dụng trong mock; cần OAuth ở backend.
- Không có LLM thật, dữ liệu game thương mại, khảo sát người dùng hoặc số liệu
  so sánh Copilot với công cụ khác trong kết quả này.
- Chưa push/merge hoặc triển khai website công khai. Review thay đổi API bằng PR.
