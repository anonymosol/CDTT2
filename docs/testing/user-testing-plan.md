# Kế hoạch thử nghiệm người dùng (tuần 7)

> Chủ trì: thành viên 4 · Mục tiêu: 10–15 người dùng thật dùng luồng học luật
> và hỏi đáp, thu phản hồi để chỉnh UI + làm dữ liệu cho chương đánh giá.

## 1. Người tham gia

- 10–15 người, ưu tiên đủ 3 nhóm: (a) người mới chơi boardgame 4–5 người,
  (b) người chơi thường 5–7, (c) người chơi lâu năm 2–3.
- Không cần đăng nhập — dùng chế độ khách đúng như sản phẩm.
- Thiết bị: tối thiểu 1/3 số người chỉ dùng **điện thoại** (kiểm tra PWA/hiển thị).

## 2. Kịch bản 15 phút mỗi người (task có mục tiêu rõ)

| # | Task | Quan sát cái gì |
|---|---|---|
| T1 | Mở trang học luật game Tiến Lên, đọc tóm tắt 5 phút | Có hiểu mục tiêu/chuẩn bị không, chỗ nào đọc hơi khó |
| T2 | Bấm "Chế độ dạy luật", học đến phần kiểm tra, tự trả lời 2 câu | Stepper có trực quan không, quiz có giúp nhớ không |
| T3 | Tự đặt 1 câu hỏi luật của riêng mình ở trang Hỏi đáp | Họ diễn đạt thế nào, câu trả lời/trích dẫn có đủ tin không |
| T4 | Tìm 1 câu hỏi mà họ **nghĩ** hệ thống phải biết — ghi nhận nếu ra "Không tìm thấy" | Phản ứng trước found:false, có mất niềm tin không |
| T5 | Bấm Đúng hoặc Báo sai cho 1 câu trả lời | Có hiểu nút này làm gì không |
| T6 | Dùng Công cụ tính điểm cho 3 người, thử "Hết lượt" | Có đủ dùng cho một ván thật không |

## 3. Phiếu khảo sát (sau task, 3 phút)

- Likert 1–5 cho từng câu: dễ hiểu / đáng tin (có trích dẫn) / dùng trên điện
  thoại thuận tiện / sẽ dùng lại khi chơi thật.
- 2 câu mở: "Lần tới bạn muốn hỏi gì mà hệ thống chưa trả lời được?" và
  "Chỗ nào khiến bạn phân vân nhất?".
- Ghi nhận dữ kiện: thời gian hoàn thành từng task, số lần cần trợ giúp.

## 4. Cách ghi và tổng hợp

- Mỗi người thử nghiệm một dòng trong bảng (`docs/testing/results.md`, tạo khi
  chạy): task × kết quả, lỗi UI gặp, trích dẫn nhận xét nguyên văn.
- Lỗi UI gom vào issues, sửa trong tuần 7–8; câu hỏi "hệ thống chưa trả lời
  được" đưa vào danh sách mở rộng `eval/questions.json` nếu thuộc phạm vi
  bộ luật (trưởng dữ liệu duyệt).
- Tổng hợp thành mục "Kết quả thử nghiệm người dùng" trong chương đánh giá.

## 5. Chuẩn bị đã xong trước tuần 7

- [x] Luồng học luật + dạy luật + hỏi đáp + công cụ chạy được trên mock.
- [ ] Backend thật cho `/api/rules/ask` (phụ thuộc bạn 2) — nếu chưa kịp,
      chạy thử nghiệm với mock vẫn thu được phản hồi UI, ghi rõ trong kết quả.
- [ ] In phiếu khảo sát / tạo form online.
