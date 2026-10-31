# eval/ — bộ đánh giá chất lượng AI

Trưởng dữ liệu (thành viên 4) soạn và duy trì bộ dữ liệu; thành viên 2 review
và hiện thực runner (`run_eval.ts`) theo schema dưới đây.

## questions.json — bộ câu hỏi luật

- Nguồn đáp án: **chỉ** các file `data/rules/<game>.md` (bản quy ước chuẩn của
  nhóm). Mỗi thay đổi bộ luật phải được kiểm tra lại các câu hỏi liên quan
  trong **cùng một pull request**.
- Anchor trích dẫn là **số mục** theo cấu trúc đề xuất trong
  `data/README.md` (game dân gian không có số trang gốc). Nếu nhóm chốt đổi
  sang anchor khác, chỉ cần đổi giá trị `anchor` trong file này.

### Schema

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | string | `q001`–`qNNN`, duy nhất |
| `game` | string | id khớp `data/games.csv` — câu hỏi luôn hỏi trong ngữ cảnh một game |
| `type` | string | `factual` (có đáp án trong tài liệu) hoặc `unanswerable` (tài liệu không có thông tin) |
| `question` | string | câu hỏi tiếng Việt tự nhiên |
| `expected.answer` | string | đáp án chuẩn ngắn (chỉ với `factual`) |
| `expected.keywords` | string[] | từ khóa để chấm tự động; so sánh sau khi chuẩn hóa (lowercase, bỏ dấu) |
| `expected.anchor` | object | `{game, section}` — trích dẫn đúng phải trỏ tới mục này (chấp nhận mục cha chứa nó) |
| `expected.found` | boolean | với `unanswerable`: hệ thống **phải** trả về `found: false` |
| `tags` | string[] | `luat-choi`, `chuan-bi`, `thanh-phan`, `ket-thuc`, `thuat-ngu`, `bien-the`, `nguon-goc`, `ngoai-pham-vi` |
| `note` | string | (tùy chọn) giải thích vì sao câu hỏi không có trong tài liệu |

### Cách chấm (khi thành viên 2 viết `run_eval.ts`)

| Chỉ số trong README / EVAL.md | Cách tính từ bộ này |
|---|---|
| Tỷ lệ trả lời luật đúng | `factual`: tỷ lệ câu có đủ `keywords` trong câu trả lời |
| Tỷ lệ trích dẫn đúng mục | `factual`: tỷ lệ câu có citation chứa `anchor` |
| Tỷ lệ bịa khi không có thông tin | `unanswerable`: tỷ lệ câu trả lời `found: true` hoặc đưa ra nội dung — **chỉ số an toàn, càng thấp càng tốt** |
| So sánh có/không RAG, so công cụ | chạy cùng bộ câu hỏi nhiều lần, ghi bối cảnh vào `docs/AI_LOG.md` |

### Phân bố hiện tại (64 câu)

- 50 câu `factual` — 5 câu mỗi game × 10 game có bộ luật, phủ đủ các mục
  (chuẩn bị, luật chơi, kết thúc, biến thể).
- 10 câu `unanswerable` trong phạm vi game (lịch sử, chất liệu, pháp lý...)
  đo chống bịa.
- 4 câu `unanswerable` ngoài phạm vi (UNO, Mau-Mau chưa có luật; Pháo trong
  cờ vua; Catan ngoài kho) kiểm tra rào chắn.
- Mục tiêu 50–100 câu theo kế hoạch; mở rộng bằng cách thêm câu mới tuân thủ
  schema, giữ tỷ lệ `unanswerable` khoảng 20–25%.

## personas.json

Khoảng 20 người dùng giả lập cho Hit@5 (gợi ý theo hồ sơ) — soạn khi làm
phần đánh giá gợi ý, phối hợp với thành viên 2. Đang rỗng.

## results/

Kết quả chạy `run_eval.ts` xuất ra đây (bảng trong `docs/EVAL.md`).
