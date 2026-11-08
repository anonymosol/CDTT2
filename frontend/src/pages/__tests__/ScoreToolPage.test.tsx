import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ScoreToolPage from '../ScoreToolPage';

describe('ScoreToolPage — tính điểm và đếm lượt', () => {
  it('thêm người chơi, cộng/trừ điểm', async () => {
    const user = userEvent.setup();
    render(<ScoreToolPage />);
    await user.type(await screen.findByRole('textbox', { name: 'Tên người chơi mới' }), 'Lan');
    await user.click(screen.getByRole('button', { name: 'Thêm' }));
    await user.type(screen.getByRole('textbox', { name: 'Tên người chơi mới' }), 'Minh');
    await user.click(screen.getByRole('button', { name: 'Thêm' }));
    await user.click(screen.getByRole('button', { name: 'Cộng 1 điểm cho Lan' }));
    expect(screen.getByLabelText('Điểm của Lan')).toHaveTextContent('1');
    await user.click(screen.getByRole('button', { name: 'Trừ 5 điểm cho Minh' }));
    expect(screen.getByLabelText('Điểm của Minh')).toHaveTextContent('-5');
  });

  it('tên trùng được thêm hậu tố số thứ tự', async () => {
    const user = userEvent.setup();
    render(<ScoreToolPage />);
    const input = await screen.findByRole('textbox', { name: 'Tên người chơi mới' });
    await user.type(input, 'Lan');
    await user.click(screen.getByRole('button', { name: 'Thêm' }));
    await user.type(input, 'Lan');
    await user.click(screen.getByRole('button', { name: 'Thêm' }));
    expect(screen.getByText('Lan (2)')).toBeInTheDocument();
    expect(within(screen.getByRole('list')).getAllByText('Lan')).toHaveLength(1);
  });

  it('hết lượt chuyển người và đếm vòng khi quay lại người đầu', async () => {
    const user = userEvent.setup();
    render(<ScoreToolPage />);
    for (const name of ['Lan', 'Minh']) {
      await user.type(await screen.findByRole('textbox', { name: 'Tên người chơi mới' }), name);
      await user.click(screen.getByRole('button', { name: 'Thêm' }));
    }
    expect(screen.getByLabelText(/Đến lượt: Lan/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hết lượt →' }));
    expect(screen.getByLabelText(/Đến lượt: Minh/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hết lượt →' }));
    expect(screen.getByLabelText(/Đến lượt: Lan, vòng 2/)).toBeInTheDocument();
  });
});
