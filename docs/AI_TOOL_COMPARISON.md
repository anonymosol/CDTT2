# Kế hoạch so sánh công cụ AI cho frontend

Trạng thái: **chưa thực hiện thí nghiệm so sánh**. Không có kết quả hay kết luận
về công cụ nào tốt hơn. Mã hiện tại do Codex triển khai, không phải bằng chứng đã
dùng GitHub Copilot.

## Tác vụ có thể tái lập

Tạo GameCard và một form lọc từ cùng một mã nền tối thiểu, cùng schema Game,
cùng fixture và cùng các ca nghiệm thu. Hai công cụ chạy ở hai bản sao riêng,
không ghi đè frontend đã bàn giao. Không cho công cụ thứ hai xem lời giải thứ nhất.

Đặc tả cố định trước khi chạy:

1. Hiển thị tên, số người và thời lượng; thiếu trường thì báo chưa rõ, không dùng 0.
2. Có nhãn thể loại và nút muốn thử dùng callback, có trạng thái đang lưu.
3. Form nhận số người/thời gian, có Áp dụng và Xóa bộ lọc.
4. Responsive một cột trên điện thoại; có label và điều khiển bàn phím.
5. Loading/empty/error và retry.
6. Không gọi LLM hay viết lại backend trong tác vụ này.

## Thiết kế đo

- Cố định commit nền, prompt, dữ liệu, phiên bản thư viện và thời gian tối đa.
- Ghi công cụ, chế độ agent/chat, model nếu giao diện hiển thị và ngày chạy.
- Ghi thời gian từ lúc bắt đầu tới bản đạt nghiệm thu, số vòng sửa và lỗi review.
- Dùng cùng bộ test nghiệm thu; không thay tiêu chí để ưu ái kết quả nào.
- Nếu người vận hành khác nhau, ghi đây là yếu tố ảnh hưởng; có thể đổi chéo.
- Chạy lặp nếu đủ thời gian; không suy rộng từ một tác vụ thành kết luận phổ quát.
- Lưu prompt/output/diff và nhận xét của người review để đối chiếu.

## Bảng để điền sau khi làm thật

| Thuộc tính | GitHub Copilot | Công cụ thứ hai |
|---|---|---|
| Ngày, người thực hiện | Chưa ghi nhận | Chưa ghi nhận |
| Model/chế độ | Chưa ghi nhận | Chưa ghi nhận |
| Commit nền | Chưa ghi nhận | Chưa ghi nhận |
| Thời gian thực đo | Chưa đo | Chưa đo |
| Số vòng chỉnh sửa | Chưa đo | Chưa đo |
| Test đạt lần đầu | Chưa chạy | Chưa chạy |
| Lỗi review | Chưa review | Chưa review |
| Credit/chi phí hiển thị | Chưa ghi nhận | Chưa ghi nhận |
| Liên kết minh chứng | Chưa có | Chưa có |

Trường chưa đo không được ghi thành 0. Ước lượng phải ghi rõ là ước lượng.
