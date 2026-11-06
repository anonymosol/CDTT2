import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import AdminPage from '../AdminPage';

describe('AdminPage — trang quản trị', () => {
  it('thống kê câu hỏi hiển thị số câu bộ đánh giá theo game', async () => {
    render(<AdminPage />);
    await userEvent.setup().click(screen.getByRole('tab', { name: 'Thống kê câu hỏi' }));
    expect(await screen.findByText('Tiến Lên')).toBeInTheDocument();
    const row = screen.getByText('Tiến Lên').closest('tr');
    expect(row).toHaveTextContent('7'); // 7 câu cho ti-len trong questions.json
  });

  it('nhập game mới qua form và hiện xác nhận với id slug', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    await user.type(await screen.findByLabelText('Tên game *'), 'Cờ Cá Ngựa Pro');
    await user.click(screen.getByRole('button', { name: 'Thêm game' }));
    expect(await screen.findByText(/id: co-ca-ngua-pro/)).toBeInTheDocument();
  });

  it('hàng đợi nhận feedback gửi từ trang hỏi đáp và xử lý được', async () => {
    const user = userEvent.setup();
    // Tạo feedback trước qua API mock
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'wrong', gameId: 'ti-len', question: 'Câu hỏi thử', section: '4.4' }),
    });
    render(<AdminPage />);
    await user.click(screen.getByRole('tab', { name: 'Hàng đợi báo sai' }));
    expect(await screen.findByText('“Câu hỏi thử”')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Đã xử lý' }));
    expect(await screen.findByText('resolved')).toBeInTheDocument();
  });
});
