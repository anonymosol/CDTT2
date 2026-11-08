# Đặc tả Tác vụ so sánh 1 — Thẻ game + Bộ lọc

> **Ai làm:** thành viên 3 dùng Copilot agent mode (VS Code); thành viên 4 dùng
> Cline hoặc OpenCode + Gemini API key miễn phí. **Cả hai làm độc lập từ đúng
> đặc tả này**, không xem code của nhau cho đến khi cả hai xong.
> **Người duyệt đặc tả:** thành viên 3 (trưởng thiết kế) — mọi thắc mắc về đặc
> tả phải hỏi cả nhóm, không tự ý đổi; nếu phải đổi, cả hai cùng áp dụng lại.

## 1. Mục đích

So sánh hai công cụ AI trên cùng một đặc tả, đo theo 8 chỉ số ở mục 8. Kết
quả (component tốt hơn) sẽ là đầu vào cho trang danh sách thật của thành viên 3.

## 2. Phạm vi

Làm trên nhánh riêng `feature/task1-<ten-cong-cu>` (vd `feature/task1-cline`),
chỉ **thêm file mới**, không sửa file có sẵn:

```
frontend/src/components/GameCard.tsx        # thẻ game
frontend/src/components/GameFilterBar.tsx   # thanh bộ lọc
frontend/src/lib/filters.ts                 # hàm lọc thuần (test được)
frontend/src/pages/GameLabPage.tsx          # trang lắp ráp tại /lab/games
frontend/src/**/__tests__/*.test.tsx        # test bắt buộc mục 6
```

Route mới `/lab/games` — không đụng route thật của thành viên 3. Gắn route
vào `App.tsx` là chỉnh sửa duy nhất được phép (1 dòng import + 1 dòng Route).

## 3. Dữ liệu đầu vào

- Kiểu `Game` từ `frontend/src/api/types.ts` (id, name, minPlayers, maxPlayers,
  durationMin, durationMax, weight, genres, description, sourceUrl, hasRules).
- Dữ liệu từ mock sẵn: `GET /api/games` trả 14 game thật (MSW, đã có).
- Từ vựng genres: `abstract, card, dice, tiles, family, children, party,
  co-op, strategy, trivia, bluffing, deduction, dexterity, word` (xem
  `data/README.md`). Không được thêm thể loại ngoài từ vựng.

## 4. Đặc tả `GameCard`

**Props:** `{ game: Game }` — component thuần hiển thị + trạng thái cục bộ.

**Hiển thị bắt buộc:**
- `name` (tiêu đề), `description` (tối đa 2 dòng, clamp bằng CSS);
- dòng meta: `👥 minPlayers–maxPlayers người` · `⏱ durationMin–durationMax phút` ·
  `⚖ độ khó weight/5` (weight hiển thị 1 chữ số thập phân);
- `genres` dưới dạng các chip;
- liên kết "Nguồn" trỏ `sourceUrl` (chỉ hiện khi có).

**Nút nhanh (bấm chuyển trạng thái, độc lập nhau, lưu state cục bộ):**
Đã chơi · Muốn thử · Đang sở hữu · Không thích — mỗi nút dùng
`aria-pressed` thể hiện đang chọn hay không.

**Chấm sao:** 5 sao; bấm sao thứ n → chọn n sao; bấm lại đúng sao cao nhất
đang chọn → bỏ chọn (0 sao). Trạng thái đọc được bằng máy (`aria-checked`
trên từng sao hoặc `aria-label` dạng "4 trên 5 sao").

**A11y + style:** mọi nút có accessible name; chỉ Tailwind, không thêm
thư viện; responsive: 2 cột ≥ 640px, 1 cột dưới đó.

## 5. Đặc tả `GameFilterBar`

**Props:** `{ games: Game[]; onChange: (result: Game[]) => void }` (hoặc controlled
`{ filters, onFiltersChange }` — chọn một, ghi rõ trong AI_LOG).

Bộ lọc (tất cả tùy chọn, rỗng = không lọc):
| Bộ lọc | Kiểu | Ý nghĩa |
|---|---|---|
| players | number | game phải chứa đúng số người này: `minPlayers ≤ players ≤ maxPlayers` |
| maxTime | number | `durationMax ≤ maxTime` (đảm bảo chơi xong trong ngân sách) |
| weight | [min, max] | khoảng độ khó, gồm cả biên, thang 1–5, bước 0.5 |
| genres | string[] | game có **ít nhất một** thể loại trong danh sách (OR) |
| q | string | khớp `name` hoặc `description`, **không phân biệt hoa thường và dấu** |

Có nút "Xóa lọc" đưa về trạng thái rỗng.

## 6. Hàm `applyFilters(games, filters)` — thuần trong `lib/filters.ts`

Semantics đúng như bảng mục 5. Chuẩn hóa `q`: lowercase + NFD bỏ dấu + `đ→d`.
Kết quả **giữ nguyên thứ tự** danh sách vào, không sort.

**Test bắt buộc (cả hai phải viết đủ — được dùng để đo "tỷ lệ test đạt ngay
lần đầu"):**
1. chỉ `players` → chỉ còn game chứa số người đó;
2. `maxTime` loại hết game có `durationMax` vượt;
3. `weight` gồm cả biên (1.0 và 5.0);
4. `genres` hoạt động kiểu OR;
5. `q = "tien len"` khớp "Tiến Lên" (không dấu vẫn khớp có dấu);
6. không có filter nào → nguyên danh sách, giữ thứ tự;
7. `GameCard` render đủ name/players/duration/weight/genres;
8. bấm nút nhanh → `aria-pressed` đổi đúng;
9. chọn 4 sao → trạng thái 4/5; bấm lại → bỏ chọn;
10. tích hợp: dùng FilterBar trên 14 game thật từ mock, chọn 1 genre → số
    card kết quả đúng bằng kết quả `applyFilters` tương ứng;
11. mọi nút trong FilterBar + GameCard có accessible name (assert không có
    nút nào name rỗng).

## 7. Trang `GameLabPage` tại `/lab/games`

Layout: FilterBar trên cùng → lưới card (grid responsive). Nạp games từ
`GET /api/games` (dùng `api.listGames()` có sẵn). Hiện tổng số kết quả
("14 game"). Không cần phân trang, không cần lưu filter vào URL.

## 8. Giao thức đo (cả hai ghi vào `docs/AI_LOG.md` theo cùng template)

| # | Chỉ số | Cách ghi |
|---|---|---|
| 1 | Thời gian hoàn thành | từ khi bắt đầu prompt đầu đến khi đạt DoD |
| 2 | Số lần phải sửa | số vòng "chỉ dẫn lại agent" sau khi code chạy sai |
| 3 | Số lỗi phát hiện khi review | review chéo sau khi cả hai xong |
| 4 | Tỷ lệ test đạt ngay lần đầu | test mục 6 pass chưa qua sửa / tổng |
| 5 | Tuân thủ AGENTS.md + đặc tả | số điểm lệch đặc tả được review bắt ra |
| 6 | Chi phí công cụ | credit/token tiêu tốn (chụp màn hình hạn mức) |
| 7 | Chất lượng code | nhận xét định tính của người review |
| 8 | Số prompt/tổng token | đếm số lượt tương tác |

Template entry AI_LOG: ngày — thành viên — công cụ + model (ghi đúng tên
hiển thị) — số prompt — thời gian — test pass lần đầu Y/N — lỗi agent mắc
phải — link PR.

## 9. Tiêu chí xong (DoD của tác vụ)

- [ ] `npm run lint && npm run typecheck && npm test && npm run build` xanh;
- [ ] đủ 11 test mục 6;
- [ ] trang `/lab/games` chạy được với MSW, dùng được trên width 360px;
- [ ] không sửa file ngoài phạm vi mục 2;
- [ ] AI_LOG entry đủ 8 chỉ số;
- [ ] PR vào `main`, nhãn `ai-assisted`, người kia review chéo.

## 10. Sau khi cả hai xong

Review chéo 30 phút mỗi bên (đếm lỗi cho chỉ số 3), chụp lại bảng so sánh 8
chỉ số vào `docs/EVAL.md`, chọn component tốt hơn làm nền cho trang danh
sách thật. Nếu model Gemini/Copilot đổi hành vi giữa hai lần chạy, chạy lại
một lần nữa và ghi cả hai kết quả.
