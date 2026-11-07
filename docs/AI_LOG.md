# AI usage log

Record meaningful AI-agent use during the project so the team can compare
assisted and unassisted work.

For each entry, capture:

- Date and contributor
- Tool/model and task
- Prompt or a link to the prompt
- Useful output and changes accepted/rejected
- Errors or incorrect suggestions and how they were corrected
- Approximate time with AI and estimated time without AI

## Entries

### 2026-11-07 — thành viên 4 — dựng frontend học luật / hỏi đáp / quản trị (MSW)

- **Tool/model:** ZCode (agent GLM).
- **Task:** bootstrap frontend (Vite + React + TypeScript + Tailwind v4 +
  MSW) và hiện thực phần việc frontend của thành viên 4 theo khung 5.5:
  trang học luật, giao diện hỏi đáp luật có trích dẫn, trang quản trị — chạy
  song song backend bằng dữ liệu giả (khung mục 4). Thêm job frontend vào
  `.github/workflows/ci.yml` đối xứng job backend.
- **Prompt:** "Tiếp tục hoàn thiện toàn bộ phần việc của tôi và push".
- **Kết quả chấp nhận:** 3 trang (`/games/:id/learn`, `/games/:id/rules`,
  `/admin`) + lớp API đề xuất (`src/api/types.ts`) + MSW handlers cho 8
  endpoint + 13 test (Vitest + Testing Library); `data.json` sinh tự động từ
  `data/` bằng `src/mocks/generate.py`, không thêm dữ kiện ngoài tài liệu;
  typecheck/lint/build/test đều xanh.
- **Lỗi AI mắc phải / cách sửa:**
  1. Generator parse theo từng dòng làm bullet xuống dòng bị cắt, gán nhầm
     "players" — viết lại có bước gộp dòng tiếp nối.
  2. TypeScript: `RegExpExecArray` dùng `m[1]` chứ không có `.group()`;
     `ChatMessage` phải là union phân biệt để narrowing hoạt động.
  3. Test: thiếu `cleanup()` giữa các test gây trùng phần tử; bộ máy tìm
     kiếm chấm điểm mục cha gồm cả text mục con làm trích dẫn trỏ sai —
     sửa để mục cha chỉ chấm trên thân riêng, trích dẫn luôn trỏ mục cụ thể.
  4. npm 12 chặn postinstall (esbuild không cài được binary) — dùng
     `npm install-scripts approve` + `npm rebuild`.
  5. Chạy generator trên nhánh tách từ main khi `data/` còn trống → ra 0
     game; phải chạy trên nhánh có dữ liệu rồi commit artifact.
  6. Thiếu `public/mockServiceWorker.js` (phải chạy `npx msw init public/`)
     khiến `npm run dev` ra trang trắng — test không phát hiện vì dùng MSW
     node server; phát hiện khi demo bằng trình duyệt thật. Đã sửa + thêm
     fallback render khi worker mock lỗi.
- **Cần người review:** đề xuất hợp đồng API trong `src/api/types.ts` cần
  bạn 1–2 chính thức hóa vào `openapi.yaml` rồi cả nhóm duyệt; khung UI là
  placeholder chờ bạn 3 thay design system; mock trả lời bằng tìm từ khóa
  (không phải RAG thật) — hành vi `found:false` đã được test.
- **Thời gian:** với AI khoảng 1,5 giờ; tự làm ước tính 2 ngày.

> Lưu ý merge: nhánh này tách từ `main`, các entry 2026-10-31/11-01 khác
> nằm ở PR #12 — khi merge hai PR sẽ xung đột nhẹ ở file này, giữ cả hai
> phần entry theo thứ tự thời gian.
