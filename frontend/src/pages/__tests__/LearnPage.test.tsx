import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LearnPage from '../LearnPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/games/:gameId/learn" element={<LearnPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LearnPage — trang học luật', () => {
  it('hiện tóm tắt 5 phút, checklist và bảng thuật ngữ của Tiến Lên', async () => {
    renderAt('/games/ti-len/learn');
    expect(await screen.findByText('Tiến Lên')).toBeInTheDocument();
    expect(screen.getByText('Mục tiêu')).toBeInTheDocument();
    expect(screen.getByText('Checklist bày bàn')).toBeInTheDocument();
    expect(await screen.findByText('Bảng thuật ngữ')).toBeInTheDocument();
    expect(screen.getByText('Heo')).toBeInTheDocument();
  });

  it('lọc checklist theo số người và báo thiếu khi không có ghi chú riêng', async () => {
    const user = userEvent.setup();
    renderAt('/games/domino/learn');
    await screen.findByText('Domino Chặn');
    await user.click(screen.getByRole('button', { name: '2 người' }));
    expect(
      await screen.findByText(/Chưa có ghi chú riêng cho số người này/),
    ).toBeInTheDocument();
  });

  it('báo chưa có bộ luật khi game không có trong kho luật', async () => {
    renderAt('/games/crazy-eights/learn');
    expect(await screen.findByText('Chưa có bộ luật cho game này.')).toBeInTheDocument();
  });
});
