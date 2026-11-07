import { Link } from 'react-router';
import { BookOpen, Compass, Heart, Sparkles } from 'lucide-react';
import { PageIntro } from '../components/ui';
import { isDemo } from '../api/models';
export function About() {
  return (
    <div className="content-page reading-page">
      <PageIntro eyebrow="MỘT VÁN CHƠI, NHIỀU KẾT NỐI" title="Về Boardgame Advisor">
        <p>Một góc nhỏ giúp bạn tìm game hợp gu và dành thêm thời gian cho những người cùng bàn.</p>
      </PageIntro>
      <section className="reading-card">
        <h2>{isDemo ? 'Bạn đang ở bản trải nghiệm' : 'Bạn đang kết nối dịch vụ thật'}</h2>
        <p>
          {isDemo
            ? 'Game trong bộ sưu tập là các ý tưởng hư cấu do dự án tự biên soạn để thử giao diện. Tên, số người, thời lượng và minh họa phục vụ kiểm thử; không phải thông tin về game thương mại.'
            : 'Nội dung và tính năng phụ thuộc dữ liệu đã được nhóm kiểm tra và dịch vụ backend đang kết nối.'}
        </p>
        <p>
          {isDemo
            ? 'Gợi ý được tạo bằng quy tắc lọc mẫu, chưa gọi LLM. Tài khoản chỉ mô phỏng luồng giao diện, không xác thực mật khẩu và không lưu mật khẩu. Đăng nhập Google cần tích hợp dịch vụ thật.'
            : 'Khi dịch vụ chưa sẵn sàng, ứng dụng sẽ báo lỗi rõ ràng thay vì tự thay bằng câu trả lời mẫu.'}
        </p>
      </section>
      <section className="reading-card">
        <h2>Kệ game và dữ liệu của bạn</h2>
        <p>
          Kệ khách lưu trên trình duyệt hiện tại. Sau đăng nhập, bạn có thể chọn gộp dữ liệu vào tài
          khoản. Các nhãn được kết hợp; điểm và ghi chú đã có trong tài khoản được ưu tiên.
        </p>
        <p>
          {isDemo
            ? 'Trong bản trải nghiệm, tài khoản và kệ mô phỏng lưu trong phiên của tab. Đóng phiên sẽ không đảm bảo giữ dữ liệu tài khoản mẫu.'
            : 'Bạn có thể xuất dữ liệu hoặc yêu cầu xóa tài khoản ở trang tài khoản.'}
        </p>
      </section>
      <section className="reading-card">
        <h2>Bắt đầu từ một điều bạn thích</h2>
        <div className="about-links">
          <Link to="/games">
            <Compass size={20} />
            Khám phá bộ sưu tập
          </Link>
          <Link to="/recommend">
            <Sparkles size={20} />
            Tìm gợi ý
          </Link>
          <Link to="/library">
            <BookOpen size={20} />
            Ghé kệ của tôi
          </Link>
          <Link to="/onboarding">
            <Heart size={20} />
            Làm quen sở thích
          </Link>
        </div>
      </section>
    </div>
  );
}
