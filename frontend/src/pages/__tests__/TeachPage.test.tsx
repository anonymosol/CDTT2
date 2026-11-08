import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import TeachPage from '../TeachPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/games/:gameId/teach" element={<TeachPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('TeachPage — chế độ dạy luật', () => {
  it('dạy từng bước qua các mục bộ luật rồi vào phần kiểm tra', async () => {
    const user = userEvent.setup();
    renderAt('/games/ti-len/teach');
    expect(await screen.findByText('Mục tiêu')).toBeInTheDocument(); // bước 1 = mục 1
    expect(screen.getByText('Bước 1/7')).toBeInTheDocument();
    for (let i = 0; i < 6; i++) await user.click(screen.getByRole('button', { name: 'Tiếp →' }));
    await user.click(screen.getByRole('button', { name: 'Vào phần kiểm tra →' }));
    expect(
      await screen.findByText('Trong Tiến Lên, quân bài nào cao nhất?'),
    ).toBeInTheDocument();
  });

  it('quiz tự kiểm tra: xem đáp án kèm mục cần đọc lại', async () => {
    const user = userEvent.setup();
    renderAt('/games/ti-len/teach');
    await screen.findByText('Mục tiêu');
    for (let i = 0; i < 6; i++) await user.click(screen.getByRole('button', { name: 'Tiếp →' }));
    await user.click(screen.getByRole('button', { name: 'Vào phần kiểm tra →' }));
    const card = screen
      .getByText('Trong Tiến Lên, quân bài nào cao nhất?')
      .closest('div');
    await user.click(
      within(card as HTMLElement).getByRole('button', { name: 'Xem đáp án' }),
    );
    expect(await screen.findByText(/Quân 2 \(heo\) là quân cao nhất/)).toBeInTheDocument();
    expect(screen.getByText(/Mục 4\.1/)).toBeInTheDocument();
  });

  it('báo chưa có bộ luật khi game không có trong kho luật', async () => {
    renderAt('/games/backgammon/teach');
    expect(await screen.findByText('Chưa có bộ luật để dạy cho game này.')).toBeInTheDocument();
  });
});
