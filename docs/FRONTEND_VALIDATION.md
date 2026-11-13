# Kiểm chứng frontend ngày 13/11/2026

Các kết quả dưới đây được chạy trên máy Windows hiện tại, không phải kết quả CI
GitHub hoặc thử nghiệm người dùng. Dùng Node 24.22.1; dependency được khóa trong
frontend/package-lock.json. Kết quả kiểm tra CI của nhóm sẽ được ghi nhận khi có PR.

| Kiểm tra | Kết quả đã quan sát |
|---|---|
| Sinh kiểu OpenAPI | Thành công |
| TypeScript strict, noUnusedLocals, noUnusedParameters | Thành công trong build cuối |
| Vitest | 3 file, 15/15 test đạt |
| Playwright | 16/16 test đạt: 8 tình huống thuộc ba luồng × desktop/mobile Chromium |
| Kiểm tra layout | 6 route × 360/390/768/1440 px, không tràn ngang |
| Lỗi JavaScript trong kiểm tra trực quan | Không ghi nhận pageerror |
| Live production build | Thành công; manifest và service worker được tạo |
| Demo production build | Thành công; MSW hoạt động, có nhãn dữ liệu mẫu |
| Live PWA trong trình duyệt | Worker hoạt động sau điều hướng lại, offline shell mở được |
| Cache PWA | Không thấy request /api trong Cache Storage |
| Live khi backend không sẵn sàng | Báo lỗi; không tự thay bằng catalog mẫu |
| Git whitespace check | Thành công |

## Lệnh tái lập

Từ frontend:

```powershell
npm ci
npm run api:generate
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e -- --workers=2
npm run build
npm run build:demo -- --outDir dist-demo
```

Kiểm tra trực quan bổ sung cần dev server ở 5173:

```powershell
npm run dev
# terminal khác, cùng thư mục frontend
node scripts/visual-check.mjs
```

Kiểm tra production cần hai preview server ở hai terminal:

```powershell
npm run preview -- --port 4173
```

```powershell
npm run preview -- --outDir dist-demo --port 4174
```

Sau đó ở terminal thứ ba:

```powershell
node scripts/check-production.mjs
```

Không suy rộng các kết quả này thành bảo đảm cho Safari, điện thoại thật, mọi
môi trường hosting, backend thật hoặc độ chính xác LLM. Các test hiện dùng dữ liệu
hư cấu và MSW. Cần kiểm thử tích hợp sau khi backend và dữ liệu đã được nhóm duyệt.

## Những lỗi phát hiện trong quá trình kiểm tra

- Nhãn select gây tên truy cập dài: bổ sung accessible name cụ thể.
- Toggle bộ lọc chưa đóng được trên desktop: điều khiển hiển thị nhất quán.
- Phiên 401 còn giữ user state: xóa phiên cũ, cho đăng nhập lại và giữ draft.
- Sidebar mobile ngoài màn hình vẫn focus được: inert và quản lý focus/Escape/Tab.
- Font Georgia tách dấu một số chữ Việt: dùng Cambria và xem lại ảnh.
- Kỳ vọng test số fixture sai: kiểm lại toàn catalog rồi sửa test.
- PWA kiểm tra controller ngay lần đầu: đợi ready và điều hướng lại theo lifecycle.
- Selector test trùng hai nút đóng menu: giới hạn vào sidebar bằng role complementary.

Các lỗi đã được chỉnh và kiểm chứng lại. Không đổi dữ liệu hoặc bỏ test để che lỗi.

## Ranh giới bàn giao

Mục 5.4 của khung sườn giao Thành viên 3 phần thiết kế, khung/PWA, tìm và gợi ý game, kệ cá nhân, đăng nhập/đăng ký và gộp kệ khách. Thẻ game cung cấp bốn nút trạng thái và chọn sao. Ba nhóm Playwright tương ứng với khám phá, gợi ý và lưu game.

Các API của bản MSW lấy kiểu từ `frontend/openapi.discovery.yaml`, có tham chiếu schema Game của nhóm. Thành viên 1–2 cần duyệt những schema mới trước khi dùng với backend. Mười hai game mẫu phục vụ kiểm thử giao diện. Việc nhập game vào bộ dữ liệu nhóm và so sánh công cụ AI ở mục 7 được theo dõi theo các đầu việc riêng trong khung sườn.

Nhánh cục bộ là `feature/frontend-discovery`. Lượt kiểm tra merge mô phỏng với `origin/feature/frontend-learn-rules-admin` ghi nhận xung đột ở các tệp cấu hình ứng dụng, định tuyến, API client, MSW, README frontend và nhật ký AI. Hai thành viên cần thống nhất cách ghép các tệp này khi review PR.
