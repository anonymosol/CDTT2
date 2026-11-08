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

### 2026-11-08 — thành viên 4 — soạn đặc tả Tác vụ so sánh 1

- **Tool/model:** ZCode (agent GLM).
- **Task:** soạn đặc tả dùng chung cho Tác vụ so sánh 1 (thẻ game + bộ lọc,
  khung mục 7) để thành viên 3 (Copilot agent mode) và thành viên 4
  (Cline/OpenCode + Gemini) làm độc lập trên cùng một văn bản.
- **Prompt:** "Kiểm tra phần nào tôi chưa làm" → "Có" (đồng ý soạn đặc tả).
- **Kết quả chấp nhận:** `docs/specs/task1-game-card-filter.md` — khóa dữ
  liệu vào `Game` type + mock 14 game thật, pin semantics từng bộ lọc
  (players/maxTime/weight/genres/q chuẩn hóa bỏ dấu), 11 test bắt buộc làm
  thước đo "tỷ lệ test đạt ngay lần đầu", template 8 chỉ số đo khớp khung
  mục 7, DoD và quy trình review chéo.
- **Cần người review:** thành viên 3 duyệt đặc tả trước khi cả hai bắt đầu;
  mọi thay đổi đặc tả sau khi bắt đầu phải áp dụng cho cả hai bên.
- **Thời gian:** với AI khoảng 20 phút; tự viết ước tính 1–1,5 giờ.

> Lưu ý merge: nhánh này tách từ `main`; các entry khác nằm ở PR #12 và
> #14 — khi merge sẽ xung đột nhẹ ở file này, giữ tất cả entry theo thứ
> tự thời gian.
