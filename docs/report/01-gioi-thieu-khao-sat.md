# Chương 1. Giới thiệu đề tài và khảo sát phần mềm có sẵn

> Tác giả: thành viên 4 · Cập nhật: 31/10/2026 · Chương thuộc báo cáo đề tài
> "Sử dụng GitHub Copilot (AI agent) cùng các công cụ AI miễn phí hỗ trợ xây
> dựng website gợi ý boardgame và hướng dẫn luật chơi tích hợp LLM".

## 1.1. Đặt vấn đề

Boardgame đang trong giai đoạn tăng trưởng mạnh: thị trường boardgame toàn cầu
được định giá khoảng **15,82 tỷ USD năm 2025** và dự báo đạt **17,44 tỷ USD
năm 2026** [1]. Song song với đó, cách người chơi tiếp cận boardgame vẫn còn
hai nút thắt cổ điển:

1. **Không biết chọn game nào.** Với hàng chục nghìn tựa game, việc chọn game
   phù hợp cho một buổi chơi cụ thể (đúng số người, đúng thời gian rảnh, độ
   khó mà cả nhóm chấp nhận được, đúng gu của những người có mặt) chủ yếu dựa
   vào kinh nghiệm cá nhân hoặc hỏi trên cộng đồng — mất thời gian và kết quả
   không chắc.
2. **Tranh cãi về luật khi đang chơi.** Sách luật nhiều game dài hàng chục
   trang, viết bằng văn bản pháp lý khó đọc; khi xảy ra bất đồng, cả nhóm phải
   dừng chơi để lục lại rulebook. Trường hợp không ai mang rulebook thì tranh
   cãi thường kết thúc bằng "quyết định của người hiểu luật nhất", không có
   nguồn kiểm chứng.

Ngoài ra, trong bối cảnh học tập, đề tài cần trả lời một câu hỏi nghiên cứu:
**AI agent hỗ trợ lập trình hiệu quả đến đâu** so với cách làm thủ công — được
đo qua nhật ký sử dụng, thời gian hoàn thành, số lỗi phát hiện khi review và
các tác vụ so sánh công cụ được thiết kế riêng (xem Chương 5).

## 1.2. Mục tiêu đề tài

### 1.2.1. Mục tiêu sản phẩm

- **Gợi ý game** theo điều kiện buổi chơi (số người, thời gian, độ khó, thể
  loại) bằng chat ngôn ngữ tự nhiên, kèm lý do cho từng gợi ý.
- **Hướng dẫn học luật nhanh**: tóm tắt "học luật trong 5 phút", checklist bày
  bàn theo số người chơi, hỏi đáp luật bằng câu tự nhiên với **trích dẫn mục
  trong tài liệu luật**; nếu tài liệu không đề cập thì hệ thống trả lời rõ là
  không tìm thấy thay vì đoán.
- **Tài khoản tùy chọn**: khách dùng được mọi tính năng chính; người đăng nhập
  lưu lịch sử chơi, trạng thái sở hữu và đánh giá để gợi ý hợp gu hơn.

### 1.2.2. Mục tiêu học thuật

- Có sản phẩm chạy được và triển khai được (cục bộ bằng Docker Compose, trực
  tuyến trên dịch vụ hosting).
- Có nhật ký dùng AI agent trung thực (prompt, lỗi AI mắc phải, cách sửa,
  thời gian so với tự làm).
- Có **đánh giá định lượng** cho phần LLM: tỷ lệ trả lời đúng, tỷ lệ trích
  dẫn đúng mục, tỷ lệ bịa khi tài liệu không có thông tin; so sánh có/không
  RAG và so sánh ít nhất hai công cụ AI trên hai tác vụ giống nhau.

## 1.3. Phạm vi đề tài

**Trong phạm vi:** kho 40–60 game có metadata; 8–10 game có bộ luật đầy đủ
(chỉ dùng game dân gian, public domain hoặc giấy phép mở); bộ lọc và gợi ý
bằng chat; hồ sơ người chơi (đã chơi, sở hữu, muốn thử, không thích, chấm sao);
hỏi đáp luật bằng RAG có trích dẫn; nút báo sai và trang quản trị; hỏi đáp về
lịch sử đã chơi bằng function calling.

**Ngoài phạm vi** (chỉ nêu là hướng phát triển): lọc cộng tác (cần nhiều người
dùng), chế độ nhóm nhiều tài khoản, nhật ký ván chơi chi tiết, nhận diện bàn
chơi bằng ảnh.

Chi tiết đầy đủ nằm trong `docs/SPEC.md`.

## 1.4. Khảo sát các giải pháp có sẵn

### 1.4.1. Cơ sở dữ liệu và cộng đồng boardgame — BoardGameGeek

BoardGameGeek (BGG) là cơ sở dữ liệu boardgame lớn nhất thế giới với khoảng
**156.600 mục entry** (bao gồm game, bản mở rộng, phiên bản lại...) [2], trong
đó chỉ khoảng 20.000–30.000 game đủ lượt đánh giá để vào bảng xếp hạng. BGG
cung cấp đầy đủ metadata (số người, thời lượng, độ khó theo thang 1–5, thể
loại), hệ thống đánh giá của người dùng và **diễn đàn hỏi đáp luật** cho từng
game.

**Hạn chế so với đề tài:** gợi ý trên BGG dựa vào điểm số cộng đồng chứ không
hiểu điều kiện buổi chơi cụ thể; hỏi đáp luật là dạng diễn đàn (chờ người trả
lời, câu trả lời không chuẩn hóa, khó kiểm chứng), giao diện và nội dung chủ
yếu tiếng Anh.

### 1.4.2. Nền tảng chơi trực tuyến — Board Game Arena, Tabletopia

Board Game Arena (BGA) là nền tảng chơi boardgame trực tuyến lớn nhất, riêng
năm 2025 người chơi đã dành hơn **69 triệu giờ** và hoàn thành hơn **78 triệu
bàn chơi thời gian thực** [3]. BGA và Tabletopia (mô phỏng bàn chơi 3D) đều
hiển thị gợi nhớ luật ngay trong lúc chơi.

**Hạn chế:** luật được "cài cắm" vào từng bản số hóa của từng game — hữu ích
khi chơi online nhưng không trả lời được câu hỏi tự do ngoài các tình huống
đã lập trình, không dạy luật trước khi chơi, và không liên quan gì đến kho
game vật lý của người chơi.

### 1.4.3. Cách học luật truyền thống

- **Đọc PDF rulebook** tải từ nhà xuất bản: chính xác nhưng dài, khó tra nhanh
  khi đang chơi, nhiều game tiếng Anh.
- **Video hướng dẫn** (kiểu "how to play" trên YouTube): dễ hiểu nhưng người
  xem không tra cứu được câu hỏi cụ thể của mình.
- **Trợ lý trong từng app game riêng lẻ** (app cờ tướng, app Tiến lên...):
  chỉ phục vụ đúng một game, không thống nhất cách trình bày.

Nhóm sử dụng chính các nguồn này làm tài liệu tham khảo khi tự soạn bộ luật,
song phải tuân thủ ràng buộc bản quyền: đề tài **không chép nguyên văn** sách
luật của game thương mại, chỉ dùng game dân gian/public domain và tự viết lại
bằng lời của nhóm (ghi nguồn trong `data/LICENSES.md`).

### 1.4.4. Trợ lý AI tổng quát áp dụng vào luật boardgame

Xu hướng gần đây nhất là dùng mô hình ngôn ngữ lớn trả lời câu hỏi luật:

- Người chơi **tải PDF rulebook lên ChatGPT** rồi hỏi làm rõ trong lúc chơi —
  cách làm phổ biến trong cộng đồng [4].
- **NotebookLM** (Google) được dùng để "học" các rulebook dài của wargame nhờ
  khả năng trả lời có trích dẫn nguồn [4].
- Các dự án chuyên biệt đã xuất hiện: **Tabletop Assistant** (thư viện game +
  chatbot AI riêng cho từng game) [4], **Board Game Guru** (hệ thống hỏi đáp
  luật dựng trên model OpenAI, Python/Flask) [4].

**Điểm chung:** đều theo hướng RAG — nạp rulebook vào cơ sở tìm kiếm, LLM trả
lời dựa trên đoạn được truy. **Các khoảng trống mà đề tài nhắm tới:**

1. **Không có đánh giá định lượng công khai**: hầu như không dự án nào công
   bố tỷ lệ trả lời đúng hay tỷ lệ bịa; người dùng phải tự tin tưởng.
2. **Chủ yếu tiếng Anh**, cần người dùng tự chuẩn bị PDF; chưa có giải pháp
   tiếng Việt cho các game dân gian Việt Nam (Tiến Lên, Phỏm, Cờ cá ngựa...).
3. **Tách rời hai nhu cầu**: công cụ gợi ý game và công cụ hỏi luật là hai sản
   phẩm riêng; chưa nơi nào nối "gợi ý game → học luật → hỏi trong lúc chơi"
   trong một luồng.
4. **Bản quyền**: giải pháp trên rulebook PDF thương mại tiềm ẩn rủi ro pháp
   lý khi phân phối lại nội dung.

### 1.4.5. Bảng so sánh tổng hợp

| Tiêu chí | BGG | BGA / Tabletopia | ChatGPT / NotebookLM / Tabletop Assistant | **Đề tài** |
|---|---|---|---|---|
| Gợi ý game theo điều kiện buổi chơi bằng chat tự nhiên | ✗ (xếp hạng cộng đồng) | ✗ | ✗ (tự do, không kiểm soát kho) | ✓ |
| Hỏi đáp luật bằng ngôn ngữ tự nhiên | ✗ (diễn đàn) | ✗ (chỉ gợi nhớ trong game) | ✓ | ✓ |
| Trích dẫn nguồn (mục/trang) cho câu trả lời | ✗ | ✗ | Một phần (NotebookLM ✓) | ✓ — bắt buộc |
| Đo lường tỷ lệ bịa / độ chính xác | ✗ | ✗ | ✗ | ✓ — bộ đánh giá 64+ câu |
| Dữ liệu luật hợp pháp, không chép rulebook thương mại | n/a | n/a | tùy người dùng | ✓ — game dân gian + tự viết |
| Tiếng Việt + game dân gian Việt Nam | ✗ | ✗ | ✗ | ✓ |
| Dùng không cần đăng nhập | ✓ | một phần | tùy gói | ✓ |
| Lưu hồ sơ gu chơi để gợi ý hợp gu hơn | ✓ (thư viện, đánh giá) | ✓ (lịch sử ván) | ✗ | ✓ |

## 1.5. Khoảng trống và định vị đề tài

Từ khảo sát trên, đề tài định vị ở giao điểm chưa có sản phẩm nào lấp đầy:

> **Một website tiếng Việt duy nhất** vừa gợi ý boardgame theo điều kiện buổi
> chơi bằng chat tự nhiên, vừa dạy luật nhanh và hỏi đáp luật có trích dẫn từ
> bộ dữ liệu hợp pháp do nhóm tự biên soạn — với chất lượng phần AI được đo
> lường công khai bằng bộ đánh giá chạy lại được (độ đúng, độ đúng trích dẫn,
> tỷ lệ bịa), thay vì chỉ "tin là được".

Về phương pháp, đề tài không đặt ra mục tiêu xây dựng mô hình LLM mới, mà tập
trung vào **kiến trúc hệ thống an toàn** (LLM chỉ được chọn trong danh sách
ứng viên do code đưa ra; mọi câu trả lời luật phải truy được về mục cụ thể)
và **quy trình xây dựng có AI agent** có nhật ký đo lường được.

## 1.6. Kết luận chương

Các giải pháp hiện có giải quyết tốt từng mảnh riêng lẻ — dữ liệu game, chơi
trực tuyến, hoặc hỏi đáp AI — nhưng chưa nơi nào kết hợp gợi ý theo ngữ cảnh
buổi chơi, hỏi đáp luật tiếng Việt có trích dẫn bắt buộc và đánh giá chống bịa
định lượng trên dữ liệu hợp pháp. Đó chính là khoảng trống đề tài này nhắm
tới; các chương sau trình bày yêu cầu, thiết kế và kết quả đánh giá của giải
pháp.

## Tài liệu tham khảo

*(ngày truy cập: 31/10/2026)*

1. Fortune Business Insights — *Board Games Market Report*: https://www.fortunebusinessinsights.com/board-games-market-104972
2. BoardGameGeek — dữ liệu và bảng xếp hạng: https://boardgamegeek.com ; số liệu entry tổng hợp từ các thống kê cộng đồng dựa trên API BGG (khoảng 156.600 entry tính đến 2026)
3. Board Game Arena — "2025: A Year in re-Play" (thống kê chính thức của nền tảng): https://en.boardgamearena.com/news?id=1025
4. Tổng hợp từ thảo luận cộng đồng và các dự án cá nhân năm 2025–2026: người chơi dùng ChatGPT với PDF rulebook; NotebookLM cho wargame; dự án Tabletop Assistant (thư viện + chatbot "Mage" cho từng game); Board Game Guru (OpenAI + Python/Flask). Đây là các sản phẩm/dự án chưa có trang công bố chính thức được kiểm chứng, nhóm ghi nhận ở mức "hiện tượng đang diễn ra" và dùng để xác định khoảng trống, không trích làm số liệu định lượng.
