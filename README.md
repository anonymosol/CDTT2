# Boardgame Advisor

Website gợi ý boardgame và hướng dẫn luật chơi, tích hợp LLM. Đồ án môn học thực hiện với sự hỗ trợ của AI agent (GitHub Copilot và các công cụ AI miễn phí).

> **Trạng thái:** đang phát triển. Các lệnh và cấu trúc thư mục bên dưới là thiết kế dự kiến, hãy chỉnh lại cho khớp với repo khi code đã ổn định.

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ](#công-nghệ)
- [Kiến trúc và cách thiết kế phần AI](#kiến-trúc-và-cách-thiết-kế-phần-ai)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [API](#api)
- [Đánh giá chất lượng AI](#đánh-giá-chất-lượng-ai)
- [Dữ liệu và bản quyền](#dữ-liệu-và-bản-quyền)
- [Quy trình làm việc nhóm](#quy-trình-làm-việc-nhóm)
- [Sử dụng AI agent trong dự án](#sử-dụng-ai-agent-trong-dự-án)
- [Thành viên](#thành-viên)
- [Hướng phát triển](#hướng-phát-triển)

## Giới thiệu

Người chơi boardgame thường gặp hai vấn đề: không biết tối nay nên chơi game nào, và hay tranh cãi về luật khi đang chơi. Dự án giải quyết cả hai:

1. **Gợi ý game:** nhập một câu như "4 người, khoảng 1 tiếng, có người mới, thích hợp tác", hệ thống gợi ý vài game phù hợp kèm lý do.
2. **Hướng dẫn và hỏi đáp luật:** học luật nhanh, xem cách bày bàn theo số người chơi, và hỏi luật bằng câu tự nhiên. Mọi câu trả lời đều **trích dẫn trang** trong tài liệu luật; nếu tài liệu không có thông tin thì hệ thống nói rõ là không tìm thấy thay vì đoán.

Người dùng có thể dùng ngay mà không cần đăng nhập. Nếu đăng nhập, lịch sử game đã chơi được lưu lại để gợi ý hợp gu hơn.

## Tính năng

**Gợi ý game**
- Bộ lọc theo số người, thời lượng, độ tuổi, độ khó, thể loại.
- Gợi ý bằng chat ngôn ngữ tự nhiên, có giải thích lý do.
- Loại trừ game đã chơi, đã sở hữu hoặc không thích; ưu tiên theo sở thích tích lũy từ lịch sử.

**Học và hỏi đáp luật**
- Tóm tắt "học luật trong 5 phút" và checklist bày bàn theo số người.
- Hỏi đáp luật bằng RAG, có trích dẫn trang và đoạn gốc.
- Nút "Báo sai" để quản trị viên duyệt và bổ sung errata.

**Tài khoản (tùy chọn)**
- Đăng nhập bằng email hoặc Google.
- Đánh dấu game: đã chơi, đang sở hữu, muốn thử, không thích; chấm sao, ghi chú.
- Khách có thể đánh dấu trước, dữ liệu được gộp vào tài khoản khi đăng nhập.
- Hỏi đáp về lịch sử ("Tháng trước mình chơi game nào?") qua function calling.
- Xuất và xóa toàn bộ dữ liệu cá nhân.

**Quản trị**
- Nhập game, tải tài liệu luật, duyệt báo sai, xem thống kê câu hỏi.

## Công nghệ

| Lớp | Công nghệ |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS, PWA |
| Backend | Node.js, Express, TypeScript, Zod |
| Cơ sở dữ liệu | PostgreSQL + pgvector |
| AI | LLM gọi qua API từ backend, embedding, tìm kiếm lai (từ khóa + vector) |
| Kiểm thử | Vitest, Playwright |
| Hạ tầng | Docker Compose (môi trường cục bộ), GitHub Actions (CI) |

## Kiến trúc và cách thiết kế phần AI

```
Trình duyệt (PWA)
      │
      ▼
 Backend (Express) ── Postgres + pgvector
      │
      ▼
   LLM API
```

Nguyên tắc xuyên suốt: **LLM không tự nghĩ ra dữ liệu**. Code luôn quyết định LLM được phép nhìn thấy và chọn gì.

**Luồng gợi ý game**
1. LLM chuyển câu của người dùng thành JSON điều kiện theo schema cố định.
2. SQL lọc cứng theo số người, thời gian, độ khó.
3. Loại game đã chơi hoặc không thích, xếp hạng bằng vector theo hồ sơ sở thích.
4. LLM chỉ được chọn tối đa 5 game **trong danh sách ứng viên** và viết lý do.
5. Code kiểm tra lại: game được nhắc phải thuộc danh sách; game được dẫn làm lý do phải có thật trong lịch sử người dùng.

**Luồng hỏi đáp luật (RAG)**
1. Tài liệu luật được chia theo mục và trang, tạo embedding, lưu kèm metadata.
2. Câu hỏi → tìm khoảng 5 đoạn gần nhất (từ khóa + vector).
3. LLM chỉ được trả lời dựa trên các đoạn này, bắt buộc trích dẫn trang; không đủ thông tin thì trả về `found: false`.
4. FAQ và errata do quản trị viên duyệt được ưu tiên hơn sách luật gốc.

**Hỏi đáp lịch sử**
- Chỉ qua các hàm cố định (`get_played_games`, `get_top_rated`, `get_last_played`...).
- `user_id` lấy từ phiên đăng nhập ở backend, không bao giờ do client hay LLM truyền vào.
- LLM không sinh SQL.

## Cài đặt và chạy

### Yêu cầu

- Node.js 20 trở lên
- Docker và Docker Compose
- API key của một nhà cung cấp LLM (có thể dùng gói miễn phí để phát triển)

### Các bước

```bash
# 1. Lấy mã nguồn
git clone https://github.com/<ten-nguoi-dung>/boardgame-advisor.git
cd boardgame-advisor

# 2. Tạo file môi trường
cp .env.example .env
# Mở .env và điền các giá trị (xem bảng bên dưới)

# 3. Chạy cơ sở dữ liệu
docker compose up -d db

# 4. Backend
cd backend
npm install
npm run migrate      # tạo bảng
npm run seed         # nạp dữ liệu game mẫu
npm run dev          # http://localhost:3000

# 5. Frontend (mở terminal khác)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Biến môi trường

| Biến | Ý nghĩa |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL |
| `SESSION_SECRET` | Chuỗi bí mật để ký phiên đăng nhập |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Đăng nhập Google (tùy chọn) |
| `LLM_API_KEY` | Khóa API của LLM, **chỉ đặt ở backend** |
| `LLM_MODEL` | Tên model dùng cho gợi ý và hỏi đáp |
| `EMBEDDING_MODEL` | Tên model tạo embedding |
| `FRONTEND_ORIGIN` | Địa chỉ frontend để cấu hình CORS |

> **Bảo mật:** không commit file `.env`. Khóa API không được xuất hiện trong mã frontend hay trong lịch sử Git.

### Kiểm thử

```bash
cd backend && npm test          # test backend
cd frontend && npm test         # test frontend
npm run eval                    # chạy bộ đánh giá AI (ở thư mục gốc)
```

## Cấu trúc thư mục

```
boardgame-advisor/
├── AGENTS.md                  # luật chung cho các AI agent
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/          # chỉ dẫn theo đường dẫn
│   ├── prompts/               # prompt mẫu dùng lại
│   └── workflows/ci.yml
├── docs/
│   ├── SPEC.md                # đặc tả tính năng
│   ├── openapi.yaml           # hợp đồng API
│   ├── AI_LOG.md              # nhật ký dùng AI
│   ├── EVAL.md                # phương pháp và kết quả đánh giá
│   └── report/
├── backend/
│   └── src/{routes,controllers,services,repositories,middleware,ai,db}/
├── frontend/
│   └── src/{pages,components,api,store,hooks,pwa}/
├── eval/                      # bộ câu hỏi, persona, script đánh giá
└── data/                      # metadata game và tài liệu luật được phép dùng
```

## API

Hợp đồng đầy đủ nằm trong [`docs/openapi.yaml`](docs/openapi.yaml). Các nhóm chính:

| Nhóm | Endpoint tiêu biểu |
|---|---|
| Tài khoản | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me` |
| Kho game | `GET /api/games`, `GET /api/games/:id`, `GET /api/games/:id/learn` |
| Dữ liệu cá nhân | `GET /api/me/games`, `PUT /api/me/games/:gameId`, `POST /api/me/merge-guest` |
| AI | `POST /api/recommend`, `POST /api/rules/ask`, `POST /api/chat/history` |
| Phản hồi và quản trị | `POST /api/feedback`, `GET /api/admin/feedback`, `POST /api/admin/games` |

Mọi thay đổi API đi qua pull request sửa `docs/openapi.yaml`.

## Đánh giá chất lượng AI

Bộ đánh giá nằm trong thư mục `eval/` và chạy lại được bằng một lệnh.

| Chỉ số | Ý nghĩa |
|---|---|
| Tỷ lệ trả lời luật đúng | Chất lượng tổng thể của hỏi đáp |
| Tỷ lệ trích dẫn đúng trang | Chống bịa nguồn |
| Tỷ lệ bịa khi tài liệu không có thông tin | Chỉ số an toàn quan trọng nhất |
| Hit@5 theo persona | Gợi ý có đưa game phù hợp vào top 5 không |
| Gợi ý trùng game đã chơi hoặc không thích | Phải bằng 0 |
| Gợi ý vi phạm điều kiện (số người, thời gian) | Phải gần 0 |

Các thí nghiệm so sánh: có RAG và không RAG, các kích thước đoạn chia khác nhau, các công cụ và model AI khác nhau. Kết quả được ghi trong [`docs/EVAL.md`](docs/EVAL.md).

## Dữ liệu và bản quyền

Sách luật của nhiều game thương mại có bản quyền, vì vậy repo này **không** chứa nguyên văn luật của game thương mại. Nguồn dữ liệu được dùng:

- Game dân gian hoặc phổ biến công cộng (cờ vua, cờ caro, Tiến lên, Phỏm, Xì dách...).
- Game do nhóm tự thiết kế.
- Game có giấy phép mở.
- Game thương mại: chỉ lưu thông tin dạng dữ kiện (số người, thời lượng, độ khó, thể loại).

Nguồn và giấy phép của từng bộ dữ liệu được ghi trong [`data/LICENSES.md`](data/LICENSES.md).

## Quy trình làm việc nhóm

- Nhánh `main` được bảo vệ; mỗi việc làm trên một nhánh `feature/ten-viec`.
- Pull request cần ít nhất một người review trước khi merge.
- Commit theo quy ước: `feat`, `fix`, `docs`, `test`, `chore`.
- Pull request có mã do AI sinh ra gắn nhãn `ai-assisted` và dẫn tới dòng tương ứng trong `docs/AI_LOG.md`.
- Mọi thay đổi API đi qua `docs/openapi.yaml`.

## Sử dụng AI agent trong dự án

Dự án thực hiện theo đề tài **"Sử dụng AI agent hỗ trợ xây dựng ứng dụng"**:

- Agent chính: GitHub Copilot (agent mode trong VS Code, Copilot CLI). Công cụ bổ trợ: Cline hoặc OpenCode kết hợp model miễn phí, cùng chat của Claude, ChatGPT, Gemini.
- Quy tắc cho agent nằm ở `AGENTS.md` và `.github/copilot-instructions.md`.
- Mọi lần dùng AI cho tính năng quan trọng được ghi trong `docs/AI_LOG.md`: prompt, kết quả, lỗi AI mắc phải, cách phát hiện và sửa, thời gian so với tự làm.
- Code do AI sinh ra luôn qua test và được một thành viên khác review trước khi merge.

## Thành viên

| Thành viên | Vai trò |
|---|---|
| _Họ tên 1_ | Backend Core, trưởng nhóm kỹ thuật |
| _Họ tên 2_ | Backend AI, đánh giá chất lượng |
| _Họ tên 3_ | Frontend khám phá, thiết kế |
| _Họ tên 4_ | Frontend học luật và quản trị, dữ liệu |

Giảng viên hướng dẫn: _điền tên_ — Môn học: _điền tên môn_ — Học kỳ: _điền học kỳ_

## Hướng phát triển

- Lọc cộng tác khi có đủ dữ liệu người dùng.
- Chế độ nhóm: kết hợp sở thích của nhiều người chơi cùng bàn.
- Nhật ký ván chơi chi tiết (ngày, số người, thời lượng thực tế).
- Nhận diện bàn chơi bằng ảnh để hỗ trợ tính điểm.
- Ứng dụng di động gốc.
