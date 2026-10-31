# data/ — kho dữ liệu game và tài liệu luật

Thư mục này do trưởng dữ liệu (thành viên 4) điều phối. Mọi thay đổi dữ liệu
phải đi kèm dòng tương ứng trong `LICENSES.md` trong **cùng một pull request**.

## games.csv

Mỗi thành viên nhập 10–15 game (tổng kho mục tiêu 40–60 game).

| Cột | Kiểu | Quy tắc |
|---|---|---|
| `id` | slug | chữ thường ASCII, gạch ngang, duy nhất toàn kho (vd: `ti-len`, `co-tuong`) |
| `name` | text | tên hiển thị, có thể có dấu tiếng Việt |
| `players_min`, `players_max` | số | số người chơi hỗ trợ chính thức |
| `play_time_min`, `play_time_max` | số phút | thời lượng một ván thông thường |
| `weight` | số 1.0–5.0 | độ khó theo thang BoardGameGeek (1 nhẹ, 5 nặng), một chữ số thập phân |
| `genres` | danh sách | phân tách bằng `;` (dùng `;` thay vì `,` để CSV không cần escape), chỉ dùng từ vựng bên dưới |
| `description` | text | 1–2 câu tiếng Việt, đặt trong ngoặc kép |
| `source_url` | URL | nguồn dữ kiện, phải kiểm tra HTTP 200 trước khi nhập |

Từ vựng `genres` dùng chung (chỉ chọn trong danh sách này):
`abstract`, `card`, `dice`, `tiles`, `family`, `children`, `party`, `co-op`,
`strategy`, `trivia`, `bluffing`, `deduction`, `dexterity`, `word`.

**Quan trọng:** game thương mại chỉ được lưu metadata dạng dữ kiện (số người,
thời lượng, độ khó, thể loại). Không chép luật game thương mại vào repo —
xem `LICENSES.md`. Chỉ game dân gian / public domain / giấy phép mở mới được
soạn bộ luật đầy đủ.

## rules/ — bộ luật cho hỏi đáp RAG

- Mỗi game một file Markdown tên `<id>.md` khớp với `id` trong `games.csv`
  (vd: `rules/ti-len.md`).
- Chỉ soạn cho 8–10 game trong danh sách được phép dùng ở `LICENSES.md`.
- Cấu trúc đề xuất: tiêu đề game, sau đó các mục đánh số
  (`## 1. Mục tiêu`, `## 2. Thành phần`, `## 3. Chuẩn bị`, `## 4. Luật chơi`,
  `## 5. Kết thúc và tính thắng`, `## 6. Thuật ngữ`) — pipeline RAG chia đoạn
  theo mục và trích dẫn theo mục.
- ⚠️ Việc trích dẫn cho game dân gian không có số trang gốc: đề xuất dùng
  **số mục** làm anchor trích dẫn (citations trả về `section`, `page` để
  null). Cần thành viên 2 (Backend AI) và cả nhóm chốt trước khi soạn hàng
  loạt, vì bộ câu hỏi đánh giá (`eval/questions.json`) cũng phải theo đúng
  anchor đó.
