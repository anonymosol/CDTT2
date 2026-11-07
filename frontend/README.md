# Frontend — Boardgame Advisor

Phần frontend của thành viên 4 (học luật, dạy luật, hỏi đáp luật, công cụ,
quản trị), chạy song song với backend bằng dữ liệu giả MSW — đúng nguyên tắc
"frontend dùng dữ liệu giả, không chờ backend" của khung sườn mục 4.

## Chạy

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 — tự bật MSW mock
npm test           # Vitest + Testing Library (dùng MSW node server)
npm run lint && npm run typecheck && npm run build
```

Tắt mock để gọi backend thật (vite proxy `/api` → `localhost:3000`):

```bash
VITE_USE_MOCKS=false npm run dev
```

## Trang hiện có (phần việc thành viên 4, khung 5.5)

| Đường dẫn | Tính năng |
|---|---|
| `/games/:id/learn` | Học luật: tóm tắt 5 phút, checklist bày bàn (lọc theo số người), bảng thuật ngữ |
| `/games/:id/teach` | Chế độ dạy luật: hướng dẫn từng mục có thanh tiến độ, phần kiểm tra tự trả lời từ bộ câu hỏi đánh giá |
| `/games/:id/rules` | Hỏi đáp luật: khung chat, chip trích dẫn theo mục (bung đoạn trích), trạng thái không tìm thấy (`found:false`), nút Đúng/Báo sai |
| `/tools/score` | Công cụ tính điểm & đếm lượt: nhiều người chơi, +/- điểm, luân chuyển lượt, đếm vòng, lưu localStorage |
| `/admin` | Quản trị: form nhập game, nạp tài liệu luật, hàng đợi báo sai (GET/PATCH), thống kê câu hỏi hay gặp |

## Dữ liệu giả

- `src/mocks/data.json` — **sinh tự động** từ kho dữ liệu thật của repo:
  ```bash
  npm run generate:mocks   # cần data/games.csv + data/rules/ (nhánh dữ liệu đã merge)
  ```
  Script `src/mocks/generate.py` parse 10 bộ luật thành mục/tiêu đề/checklist/
  thuật ngữ/bước dạy luật; không thêm dữ kiện nào ngoài tài liệu.
- `src/mocks/search.ts` — bộ máy "RAG giả" (tìm từ khóa, chấm điểm, trích
  mục, trả `found:false`); là hàm thuần nên được test trực tiếp.
- `src/mocks/handlers.ts` — các endpoint mock: `/api/games`,
  `/api/games/:id/learn`, `/api/games/:id/teach`, `/api/rules/ask`,
  `/api/feedback`, `/api/admin/feedback` (GET/PATCH), `/api/admin/games`,
  `/api/admin/games/:id/rules`, `/api/admin/questions/stats`.

## Hợp đồng API — ĐỀ XUẤT chờ chốt

`src/api/types.ts` là đề xuất hợp đồng cho các endpoint phía trên (camelCase
khớp schema `Game` sẵn có của `docs/openapi.yaml`). Thành viên 1–2 chính
thức hóa vào `openapi.yaml` rồi cả nhóm duyệt; khi backend thật sẵn sàng chỉ
cần tắt MSW, client không đổi.

## Phần của thành viên 3 (trưởng thiết kế)

Khung app (`App.tsx`), điều hướng và màu sắc chỉ là placeholder tối giản —
bạn 3 thay bằng design system dùng chung, định tuyến PWA và các luồng khám
phá khi ghép.
