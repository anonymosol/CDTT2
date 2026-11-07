# Quy trình làm việc với AI agent — phần của thành viên 4

> Chương dùng chung "Quy trình làm việc với AI agent, bài học, hạn chế" do
> thành viên 2 tổng hợp; file này là nguyên liệu phần của thành viên 4, viết
> theo nhật ký thật trong `docs/AI_LOG.md` (các entry 2026-10-31 → 2026-11-08).

## 1. Phần việc đã làm với AI

Toàn bộ mảng dữ liệu + frontend học luật của thành viên 4 được xây theo kiểu
"chỉ đạo agent theo từng gói việc nhỏ, có tiêu chí xong rõ ràng":

| Gói việc | Sản phẩm | Thời gian với AI | Ước tính tự làm |
|---|---|---|---|
| Kho dữ liệu 14 game + LICENSES | `data/games.csv`, `data/README.md` | ~15 phút | ~2 giờ |
| 10 bộ luật tự soạn | `data/rules/*.md` | ~45 phút | 6–10 giờ |
| Bộ đánh giá 64 câu + 20 persona | `eval/` | ~40 phút | ~4 giờ |
| Chương 1 báo cáo | `docs/report/01-*.md` | ~40 phút | ~4–5 giờ |
| Frontend học luật / hỏi đáp / dạy luật / quản trị / công cụ | `frontend/` | ~1,5 giờ | ~2 ngày |

Cách chia việc theo kinh nghiệm của nhóm: giao agent từng gói có ranh giới rõ
(một nhánh một việc), yêu cầu script kiểm tra tự động cho mọi dữ liệu, và giữ
con người ở vai trò **duyệt và chốt quy ước** — agent không tự coi quyết định
của nhóm là đã xong.

## 2. Quy trình cụ thể đã chạy được

1. **Mỗi việc một nhánh, mỗi PR một nhãn `ai-assisted`** dẫn tới entry
   tương ứng trong AI_LOG — khớp quy tắc mục 9 của khung sườn.
2. **Mọi dữ liệu đều sinh từ nguồn, không cho agent "sáng tác":** URL nguồn
   verify HTTP 200 trước khi nhập; mock data frontend sinh bằng script từ
   `data/` thay vì viết tay; checklist theo số người chỉ được tag khi tài
   liệu luật ghi rõ.
3. **Hai vòng đối chiếu nguồn:** (1) verify URL, (2) đối chiếu nội dung 8 bài
   Wikipedia với 10 bộ luật — vòng 2 bắt được 6 bộ luật lệch nguồn (thứ tự
   chất Tiến Lên, định nghĩa "cạ", "ngũ linh" thay "ngũ hành", luật chặn
   Domino, ô an toàn Ludo, tính điểm Yacht).
4. **Nhãn "quy ước của sản phẩm"** bắt buộc cho mọi chỗ bản chuẩn khác
   nguồn hoặc nguồn có nhiều biến thể — ranh giới giữa "nguồn nói" và
   "nhóm chọn" phải nhìn thấy được.
5. **Validate tự động trước mỗi commit:** cấu trúc CSV/JSON, anchor khớp bộ
   luật, persona nhất quán trạng thái — script ngắn chạy bằng một lệnh.

## 3. Lỗi AI điển hình và cách phát hiện, sửa

| Lỗi | Phát hiện bằng | Cách sửa / phòng tái diễn |
|---|---|---|
| 6 bộ luật lệch nguồn so với Wikipedia | Đối chiếu trực tiếp bài nguồn | Ghi ngày đối chiếu vào LICENSES; nhãn "quy ước" cho chỗ khác nguồn |
| Generator cắt bullet xuống dòng, gán nhầm "players" | Script validate + test | Viết lại có bước gộp dòng |
| Thiếu `mockServiceWorker.js` → `npm run dev` trang trắng | **Demo bằng trình duyệt thật** (test không bắt được vì test dùng MSW node) | Sau mỗi tính năng UI phải mở app thật chạy một vòng |
| Search chấm điểm mục cha gồm cả text mục con → trích dẫn trỏ sai mục | Unit test trích dẫn | Mục cha chỉ chấm trên thân riêng |
| Thiếu `cleanup()` giữa các test → phần tử trùng | Test suite | setup.ts chuẩn |
| TypeScript: `RegExpExecArray.group()`, union chưa phân biệt | `npm run typecheck` | — |

Bài học rút ra quan trọng nhất: **rủi ro "bịa" lớn nhất của dự án không nằm
ở câu trả lời LLM cho người dùng, mà ở dữ liệu nền do AI soạn** — bộ luật
lệch nguồn nếu dùng làm corpus RAG thì mọi câu trả lời phía sau đều sai theo.
Vì vậy dữ liệu phải qua đối chiếu nguồn thật trước khi vào `data/`.

## 4. Hạn chế

- Mock hỏi đáp trong frontend là tìm từ khóa, chưa phải RAG thật — chỉ dùng
  để hoàn thiện UI; chất lượng trả lời thật phụ thuộc pipeline của thành
  viên 2 và sẽ đo bằng `eval/questions.json`.
- Phần "nếu còn thời gian" (dạy luật, tính điểm) làm trên mock trước; cần
  ghép backend thật và thử với người mới để xem có giữ lại được không.
- Chưa chạy thử nghiệm người dùng thật (kế hoạch sẵn ở
  `docs/testing/user-testing-plan.md`) — mọi kết quả "dễ dùng" hiện tại mới
  chỉ là quan sát của nhóm.
