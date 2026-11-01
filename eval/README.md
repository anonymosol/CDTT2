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

> ⚠️ **Chênh lệch với kế hoạch đề tài:** kế hoạch ghi bộ câu hỏi "có đáp án
> và **số trang**". Toàn bộ tài liệu luật của dự án do nhóm tự viết nên
> không có số trang gốc; bộ này dùng **số mục** thay vì bịa số trang. Việc
> đổi này cần cả nhóm (đặc biệt thành viên 2 — Backend AI) phê duyệt; nếu
> bắt buộc giữ "số trang", tài liệu luật phải được phân trang thật trước.

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

## personas.json — người dùng giả lập cho Hit@5

20 persona đại diện các kiểu người chơi thật (mẹ bỉm sữa, cặp đôi, nhóm văn
phòng, trẻ em, heavy gamer, người mới hoàn toàn...), tham chiếu **chỉ các
game có trong `data/games.csv`**. Khi kho mở rộng lên 40–60 game, cần rà lại
để đảm bảo mọi id game vẫn tồn tại.

### Schema

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | string | `p01`–`pNN`, duy nhất |
| `name` | string | tên gợi tả nhân vật (demo + báo cáo dùng được) |
| `description` | string | 1 câu bối cảnh: chơi với ai, nhu cầu gì |
| `experience` | string | `moi` / `trung-binh` / `cao-thu` |
| `group_size` | int | số người thường chơi cùng (2–6) |
| `time_budget_min` | int | thời lượng một buổi chơi chấp nhận được (phút) |
| `liked_genres` / `disliked_genres` | string[] | từ vựng genre của `data/README.md` |
| `weight_range` | [min, max] | khoảng độ khó chấp nhận, thang BGG 1–5 |
| `played` | [{game, rating 1–5}] | lịch sử + điểm sao (đầu vào trọng số hồ sơ sở thích) |
| `owned` / `wishlist` / `disliked` | string[] | trạng thái kệ game theo đúng API `user_games` |

**Lưu ý nhất quán:** mỗi game chỉ nằm trong **một** trong bốn danh sách
`played` / `owned` / `wishlist` / `disliked`, khớp mô hình một trạng thái
mỗi game của `PUT /api/me/games/:gameId`. Đã kiểm tra tự động: 20 persona,
mọi id game đều tồn tại trong `data/games.csv`, không có trùng trạng thái.

### Cách dùng cho chỉ số Hit@5 (đề xuất cho `run_eval.ts`)

- **Kho ứng viên** của mỗi persona = toàn kho − `played` − `owned` −
  `disliked` (mô phỏng đúng luật nghiệp vụ "không gợi ý lại game đã chơi,
  đã sở hữu hoặc đã không thích").
- Một game là **phù hợp (relevant)** nếu: phủ `group_size`, `play_time_max ≤
  time_budget_min`, `weight` nằm trong `weight_range`, và genre nằm trong
  `liked_genres` (không rơi vào `disliked_genres`).
- **Hit@5** = trung bình trên 20 persona của tỉ lệ game phù hợp xuất hiện
  trong top-5 gợi ý. Hai persona `p04` và `p19` **không có lịch sử** để kiểm
  tra hành vi cold-start (nên gợi ý theo điều kiện cứng, không nên lỗi).
- Các persona có `disliked` game rất phổ biến (ví dụ `p20` chấm `co-caro` 1
  sao) dùng để phát hiện hệ thống gợi ý trùng game không thích — chỉ số này
  **phải bằng 0** theo Definition of Done.

## results/

Kết quả chạy `run_eval.ts` xuất ra đây (bảng trong `docs/EVAL.md`).
