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

### 2026-11-01 — thành viên 4 — chương báo cáo 1 và bộ persona đánh giá

- **Tool/model:** ZCode (agent GLM), kèm tìm kiếm web để khảo sát giải pháp
  có sẵn.
- **Task:** (1) viết chương 1 báo cáo (giới thiệu, mục tiêu, khảo sát phần
  mềm có sẵn) vào `docs/report/`; (2) soạn `eval/personas.json` 20 persona
  cho chỉ số Hit@5 và cập nhật schema + cách chấm đề xuất trong
  `eval/README.md`.
- **Prompt:** chỉ đạo hội thoại ngắn ("tiếp tục"); các truy vấn khảo sát:
  số liệu BGG, số liệu BGA 2025, các trợ lý AI luật boardgame kiểu RAG.
- **Kết quả chấp nhận:** chương 1 (178 dòng, 4 nguồn có URL + ngày truy cập);
  20 persona phủ đủ phổ người chơi (2 persona cold-start để test khởi động
  nguội), mọi id game tham chiếu đều nằm trong `data/games.csv`.
- **Lỗi AI mắc phải / cách sửa:** số liệu game của BGA không có con số công
  khai kiểm chứng được trong kết quả tìm kiếm — xử lý bằng cách chỉ dùng số
  liệu từ bài "Year in re-Play" chính thức của nền tảng (giờ chơi, số bàn),
  không bịa số game; các dự án AI cá nhân (Tabletop Assistant, Board Game
  Guru) không có trang chính thức — ghi rõ trong tài liệu tham khảo là
  "hiện tượng chưa kiểm chứng", không dùng làm số liệu định lượng.
- **Cần người review:** phần định vị đề tài (mục 1.5) cần cả nhóm đọc vì ảnh
  hưởng cách trình bày toàn bộ báo cáo; cách tính Hit@5 đề xuất trong
  `eval/README.md` cần thành viên 2 xác nhận trước khi viết runner.
- **Thời gian:** với AI khoảng 40 phút; ước tính tự làm khoảng 4–5 giờ.

### 2026-11-01 — thành viên 4 — kiểm tra chéo toàn bộ sản phẩm với nguồn thật

- **Tool/model:** ZCode (agent GLM); WebFetch đọc trực tiếp 8 bài Wikipedia
  được trích trong `data/LICENSES.md` (Tiến Lên, Phỏm, Xì Dách, Yacht,
  Dominoes, Ludo, Draughts, Gomoku).
- **Task:** double-check toàn bộ sản phẩm đã làm theo khung đề tài — đúng
  phạm vi thành viên 4, không có nội dung bịa.
- **Phát hiện sai lệch so với nguồn (đã sửa cùng ngày):**
  1. `ti-len.md`: thứ tự chất viết ngược so với nguồn (nguồn: Cơ ♥ cao
     nhất); luật chặt thiếu trường hợp tứ quý chặt được đôi heo; cấm 2
     trong đôi thông trong khi nguồn ghi biến thể cho phép.
  2. `phom.md`: định nghĩa "cạ" sai (nguồn: cạ là 2 lá chờ, không phải 3
     lá); giới hạn gửi 3 lá không có trong nguồn (nguồn: không giới hạn);
     lá của người chia không khớp mô tả nguồn.
  3. `xi-dach.md`: "xì bàn" theo nguồn là 2 lá A (không phải A + 10 —
     tổ hợp A+10 là "xì dách"); "ngũ hành nhỏ/lớn" không có trong nguồn,
     đúng là "ngũ linh" (5 lá dưới 21, thắng tuyệt đối); bằng điểm là hòa
     "chạy làng" chứ không phải cái thắng hòa.
  4. `yacht.md`: "bốn giống nhau" tính tổng 4 lá giống nhau, không phải cả
     5 lá.
  5. `domino.md`: bị chặn thì người gây chặn thắng và nhận điểm đối thủ
     (không phải ai ít điểm hơn thắng); nguồn không chỉ định ai đi trước —
     quy tắc cũ chưa được gắn nhãn quy ước.
  6. `co-ca-ngua.md`: bản gốc chỉ quy định đường về là ô an toàn (ô tô màu
     là biến thể); thiếu luật tung 6 ba lần liên tiếp thì mất lượt.
- **Không sai:** `co-dam.md`, `co-caro.md` khớp 100% với nguồn; 57/64 câu
  hỏi giữ nguyên, 7 câu được sửa theo luật mới (q002, q010, q016, q017,
  q039, q044, q046).
- **Cách phòng tái diễn:** mọi quy ước không có trong nguồn phải gắn nhãn
  "quy ước của sản phẩm" ngay trong tài liệu; `LICENSES.md` ghi ngày đối
  chiếu nội dung nguồn; script validate chạy lại toàn bộ trước mỗi commit.
- **Bài học:** phần rủi ro "bịa" lớn nhất của dự án không phải câu trả lời
  LLM mà là tài liệu luật do AI soạn từ kiến thức chung — phải đối chiếu
  nguồn thật trước khi dùng làm corpus RAG.
- **Thời gian:** với AI khoảng 50 phút; tự làm thủ công (đọc 8 bài, so từng
  mục, sửa 6 file) ước tính 3–4 giờ.
