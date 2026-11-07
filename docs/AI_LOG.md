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

## 2026-11-07 — Frontend Khám phá (Thành viên 3)

- **Người yêu cầu:** thành viên phụ trách frontend, thông qua chat này.
- **Công cụ:** Codex trong phiên làm việc hiện tại; chưa sử dụng GitHub Copilot
  để thực hiện các thay đổi này. Không có số liệu so sánh công cụ hoặc thời gian
  tiết kiệm được thực đo.
- **Yêu cầu thực tế:** “Hãy thay tôi làm nhiệm vụ Thành viên 3 — Frontend Khám phá
  (kiêm trưởng thiết kế). Trình bày, giải thích mọi bước thực hiện để tôi nắm được
  quy trình thực hiện.”
- **Phân tích:** kiểm tra repo sạch ở main, đọc chỉ dẫn/SPEC/OpenAPI. Frontend
  chưa có package.json; backend nghiệp vụ chưa sẵn sàng; API chỉ có bản nháp GET games.
- **Thiết kế:** tạo hệ thống nền giấy/xanh lá, SVG gốc, wireframe desktop/mobile,
  luồng tìm–gợi ý–lưu, nhiều nhãn kệ, merge và phân biệt demo/live.
- **Hiện thực:** nhánh feature/frontend-discovery; React/Vite/TS/Tailwind, client
  sinh kiểu, Zod, MSW, IndexedDB, tài khoản mẫu, PWA; không đặt API key phía client.
- **Kiểm thử:** TypeScript, 15 test logic/component, 16 tình huống E2E trên hai
  viewport, kiểm tra trực quan 6 route × 4 độ rộng, build và kiểm tra PWA/demo.
- **Lỗi và chỉnh sửa:** bổ sung accessible name cho select, sửa toggle bộ lọc,
  xử lý user state khi 401, inert/focus cho menu mobile, đổi font hỗ trợ tiếng Việt.
  Test đếm sai số fixture được sửa sau khi đối chiếu dữ liệu, không thay dữ liệu.
  Kiểm tra PWA được sửa để đợi worker ready rồi điều hướng lại đúng lifecycle.
- **Bằng chứng trong repo:** frontend/src, frontend/e2e, frontend/src/tests,
  docs/screenshots, docs/DESIGN.md, docs/FRONTEND_GUIDE.md, docs/report/FRONTEND.md.
- **Đầu ra cần review:** schema thêm trong docs/openapi.yaml là đề xuất tích hợp,
  không phải xác nhận backend đã có các API. Review trong PR trước merge.
- **Giới hạn:** game/luật mẫu hư cấu, gợi ý không gọi LLM, đăng nhập không xác thực
  mật khẩu thật, Google chưa tích hợp. Chưa khảo sát người dùng hoặc so sánh Copilot.
- **Thời gian:** không ghi đồng hồ bắt đầu/kết thúc riêng cho từng tác vụ;
  không đưa ra con số thực đo hay ước lượng hiệu suất chưa có căn cứ.

Người học cần dùng Copilot review/giải thích mã hoặc thực hiện một tác vụ thật,
lưu prompt/output/diff và kiểm chứng vào mục riêng. Không sửa tên công cụ ở mục này.
