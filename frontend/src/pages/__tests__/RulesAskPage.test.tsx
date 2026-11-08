import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import RulesAskPage from '../RulesAskPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/games/:gameId/rules" element={<RulesAskPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RulesAskPage — hỏi đáp luật', () => {
  it('trả lời có nội dung và chip trích dẫn theo mục', async () => {
    const user = userEvent.setup();
    renderAt('/games/ti-len/rules');
    await user.type(await screen.findByRole('textbox'), 'heo bị chặt bằng gì?');
    await user.click(screen.getByRole('button', { name: 'Hỏi' }));
    expect(await screen.findByText(/tứ quý/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Mục 4\.4/).length).toBeGreaterThan(0);
  });

  it('hiện trạng thái không tìm thay khi hỏi ngoài tài liệu', async () => {
    const user = userEvent.setup();
    renderAt('/games/ti-len/rules');
    await user.type(await screen.findByRole('textbox'), 'Catan?');
    await user.click(screen.getByRole('button', { name: 'Hỏi' }));
    expect(await screen.findByText('Không tìm thấy trong bộ luật này')).toBeInTheDocument();
  });

  it('nút Báo sai gửi feedback vào hàng đợi', async () => {
    const user = userEvent.setup();
    renderAt('/games/ti-len/rules');
    await user.type(await screen.findByRole('textbox'), 'làm sao để thắng?');
    await user.click(screen.getByRole('button', { name: 'Hỏi' }));
    await user.click(await screen.findByRole('button', { name: 'Báo sai' }));
    expect(await screen.findByText(/Đã ghi nhận báo sai/)).toBeInTheDocument();
    // Hàng đợi quản trị phải nhận được mục vừa gửi
    const queue = await fetch('/api/admin/feedback').then((r) => r.json());
    expect(queue).toHaveLength(1);
    expect(queue[0]).toMatchObject({ kind: 'wrong', gameId: 'ti-len' });
  });
});
