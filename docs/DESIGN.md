# Hệ thống thiết kế Frontend Khám phá

## Định hướng

Một góc kệ boardgame yên tĩnh, gần gũi: nền giấy, xanh lá, hình minh họa kiểu
poster, chữ serif ở tiêu đề và sans-serif ở điều khiển. Tác vụ chính là tìm,
chọn, hiểu lý do và lưu game. Giao diện tiếng Việt.

## Token

| Vai trò | Giá trị |
|---|---|
| Xanh chính | #234e40 |
| Chữ chính | #273d32 |
| Nền giấy | #f7f7f2 |
| Sidebar | #f0f2e9 |
| Nền hero | #e9eedf |
| Viền | #e3e6dc |
| Nút lỗi/xóa | #a24637 |
| Font nội dung | Segoe UI / Arial / sans-serif |
| Font tiêu đề | Cambria / Georgia / Times New Roman / serif |
| Bo góc | 6px nút, 9px thẻ, 12px hero, 14px dialog |

Nguồn chuẩn các giá trị thực tế: frontend/src/styles.css.
Tailwind được tích hợp bằng @tailwindcss/vite; các utility có thể dùng tiếp
trong component. CSS có tên ngữ nghĩa giữ các trạng thái/phần dùng chung rõ ràng.

## Wireframe desktop

```text
┌────────────────┬────────────────────────────────────────────────────┐
│ Thương hiệu    │ Breadcrumb                  Tìm nhanh    Tài khoản │
│                ├────────────────────────────────────────────────────┤
│ Khám phá       │ Nhãn bản trải nghiệm (chỉ demo)                     │
│ Gợi ý          │ ┌───────────────────────┬────────────────────────┐ │
│ Kệ của tôi     │ │ Tối nay, mình chơi gì?│ Hộp game minh họa      │ │
│                │ │ Nút tìm gợi ý         │                        │ │
│ Làm quen gu    │ └───────────────────────┴────────────────────────┘ │
│                │ Bộ sưu tập                               Bộ lọc   │
│                │ Tìm tên | Người | Phút | Độ khó | Áp dụng          │
│                │ Thể loại                                          │
│                │ ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│                │ │ Hình       │ │ Hình       │ │ Hình       │      │
│                │ │ Tên + meta │ │ Tên + meta │ │ Tên + meta │      │
│                │ └────────────┘ └────────────┘ └────────────┘      │
│                │ Phân trang                                        │
└────────────────┴────────────────────────────────────────────────────┘
```

## Wireframe điện thoại

```text
┌─────────────────────────────┐
│ ☰  Khám phá       Đăng nhập │
├─────────────────────────────┤
│ Nhãn demo                   │
│ Tối nay, mình chơi gì?       │
│ Nút tìm gợi ý               │
│ Minh họa hộp game           │
│ Bộ sưu tập        [Bộ lọc]  │
│ (bộ lọc mở theo yêu cầu)    │
│ Chip thể loại...            │
│ ┌─────────────────────────┐ │
│ │ Ảnh                    │ │
│ │ Tên, mô tả, metadata    │ │
│ └─────────────────────────┘ │
│ Một cột thẻ + phân trang    │
└─────────────────────────────┘
```

## Trạng thái và tương tác

- GameCard có liên kết ảnh và tên. Bốn nút trạng thái và nút chọn sao đặt trên từng thẻ.
- Loading có role=status; lỗi có role=alert và nút retry; empty có đường đi tiếp.
- Bộ lọc có draft state và URL applied state; thay filter reset page.
- Kệ dùng nhiều nhãn boolean, điểm nullable; ghi chú có giới hạn 1.000 ký tự.
- Dialog native giữ focus và hỗ trợ Escape; trả focus khi đóng.
- Có skip link, focus-visible, nhãn form, aria-pressed và reduced-motion.
- Responsive: sidebar thành menu ở <=760px; thẻ một cột ở <=520px.
- Bản mẫu luôn có nhãn; nội dung người dùng không chứa công tắc QA.

## Artwork

Mười hai tên game và metadata hư cấu dùng cho kiểm thử được khai báo tại `frontend/src/mocks/catalog.ts`. Các hình minh họa tương ứng được tạo bằng `frontend/scripts/generate-art.mjs`. Nhóm có thể dùng các hình gốc này cho bản demo.

## Bàn giao cho phần frontend khác

Tái sử dụng Layout, GameCard, Loading, EmptyState, ErrorState, Modal, PageIntro
và lớp API. Hỏi luật RAG/quản trị cần thêm route và schema được nhóm review;
không dựng ứng dụng React thứ hai hoặc một cấu hình service worker riêng.
