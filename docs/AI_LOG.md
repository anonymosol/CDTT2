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

### 2026-10-31 — thành viên 4 — soạn bộ luật và bộ câu hỏi đánh giá

- **Tool/model:** ZCode (agent GLM) trong môi trường làm việc cục bộ, làm việc
  theo chỉ đạo của thành viên 4.
- **Task:** (1) khảo sát và nhập 14 game dân gian/public domain vào
  `data/games.csv`; (2) tự soạn 10 bộ luật vào `data/rules/`; (3) soạn
  `eval/questions.json` (64 câu) + `eval/README.md` định nghĩa schema chấm.
- **Prompt:** chỉ đạo dạng hội thoại ("Tạo feat và bắt đầu làm", "Làm tiếp
  nhiệm vụ của tôi không cần đợi ai", "Ok"); không lưu prompt gốc từng ký tự.
- **Kết quả chấp nhận:** toàn bộ dữ liệu trên; 14 URL nguồn Wikipedia được
  verify HTTP 200 trước khi nhập; CSV và JSON được script kiểm tra tự động
  (số cột, id duy nhất, anchor khớp bộ luật).
- **Lỗi AI mắc phải / cách sửa:** (1) script validate lần đầu quên thư mục con
  `rules/` và dùng ngưỡng độ dài tùy ý gây báo lỗi nhầm — sửa path, nới ngưỡng;
  (2) ban đầu định gộp luật "chặt" của Tiến Lên theo trí nhớ — rủi ro sai biến
  thể, xử lý bằng cách ghi rõ "bản quy ước chuẩn của nhóm" + mục Biến thể để
  nhóm rà soát; (3) demo JS bị lỗi regex trong script kiểm tra (không phải lỗi
  sản phẩm) — tách bước kiểm tra.
- **Cần người review:** các quy ước chuẩn trong 10 bộ luật (chặt Tiến Lên,
  người chia 8 lá Phỏm, cái dừng ≥16 Xì Dách...) và 64 đáp án trong
  `questions.json` phải được thành viên khác kiểm chứng lại trước khi merge.
- **Thời gian:** với AI khoảng 45–60 phút toàn bộ; ước tính tự làm (tra nguồn,
  tự viết 10 bộ luật, tự soạn 64 câu) khoảng 6–10 giờ.
