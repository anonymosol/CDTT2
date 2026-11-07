import { beforeEach, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { GameCard } from '../components/ui';
import { emptyRecord } from '../api/models';

const context = vi.hoisted(() => ({
  records: [] as ReturnType<typeof emptyRecord>[],
  update: vi.fn(),
  notify: vi.fn(),
  sessionLoading: false,
  shelfLoading: false,
  notice: '',
}));
vi.mock('../store/AppProvider', () => ({ useApp: () => context }));
beforeEach(() => {
  context.records = [];
  context.update.mockReset();
  context.notify.mockReset();
});
it('handles optional metadata without presenting zero minutes', () => {
  render(
    <MemoryRouter>
      <GameCard game={{ id: 'unknown', name: 'Chưa đủ dữ liệu' }} />
    </MemoryRouter>,
  );
  expect(screen.getByText('Chưa rõ thời lượng')).toBeVisible();
  expect(screen.queryByText('0 phút')).not.toBeInTheDocument();
});
it('sends the right save action and announces a failure', async () => {
  context.update.mockRejectedValue(new Error('network'));
  render(
    <MemoryRouter>
      <GameCard game={{ id: 'x', name: 'Game X' }} />
    </MemoryRouter>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Muốn thử Game X' }));
  await waitFor(() => expect(context.update).toHaveBeenCalledWith('x', { wishlist: true }));
  await waitFor(() => expect(context.notify).toHaveBeenCalled());
  expect(screen.getByRole('button', { name: 'Muốn thử Game X' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});
it('removes an existing wishlist flag', async () => {
  context.records = [{ ...emptyRecord('x'), wishlist: true }];
  context.update.mockResolvedValue(undefined);
  render(
    <MemoryRouter>
      <GameCard game={{ id: 'x', name: 'Game X' }} />
    </MemoryRouter>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Bỏ muốn thử Game X' }));
  expect(context.update).toHaveBeenCalledWith('x', { wishlist: false });
});
