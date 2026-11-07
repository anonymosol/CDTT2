import { beforeEach, expect, it } from 'vitest';
import { guestStore } from '../storage/guest';
import { emptyRecord } from '../api/models';
beforeEach(async () => guestStore.clear());
it('commits guest state and reads it from a new database connection', async () => {
  await guestStore.save({ ...emptyRecord('dao-may'), owned: true, played: true, rating: 5 });
  expect(await guestStore.all()).toEqual([
    { ...emptyRecord('dao-may'), owned: true, played: true, rating: 5 },
  ]);
});
it('upserts instead of duplicating a game', async () => {
  await guestStore.save({ ...emptyRecord('dao-may'), wishlist: true });
  await guestStore.save({ ...emptyRecord('dao-may'), wishlist: false, played: true });
  expect(await guestStore.all()).toEqual([{ ...emptyRecord('dao-may'), played: true }]);
});
it('rejects invalid ratings without overwriting the saved record', async () => {
  await guestStore.save({ ...emptyRecord('dao-may'), rating: 3 });
  await expect(guestStore.save({ ...emptyRecord('dao-may'), rating: 8 })).rejects.toThrow();
  expect((await guestStore.all())[0].rating).toBe(3);
});
