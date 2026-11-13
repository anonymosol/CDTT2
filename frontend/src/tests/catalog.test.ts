import { describe, expect, it } from 'vitest';
import { filterGames, games, mergeRecords, sampleRecommendations } from '../mocks/catalog';
import { emptyRecord } from '../api/models';

describe('Catalog and recommendation fixtures', () => {
  it('filters inclusive player/time bounds across the whole catalog', () => {
    const filtered = filterGames(
      games,
      new URLSearchParams('players=4&time=30&genre=H%E1%BB%A3p+t%C3%A1c'),
    );
    expect(filtered.map((game) => game.id)).toEqual(['dao-may']);
    expect(
      filtered.every(
        (game) => game.minPlayers! <= 4 && game.maxPlayers! >= 4 && game.duration! <= 30,
      ),
    ).toBe(true);
  });
  it('does not treat missing metadata as matching a hard constraint', () => {
    expect(
      filterGames([{ id: 'missing', name: 'Missing' }], new URLSearchParams('players=4')),
    ).toEqual([]);
    expect(
      filterGames([{ id: 'missing', name: 'Missing' }], new URLSearchParams('time=30')),
    ).toEqual([]);
  });
  it('supports Vietnamese accent-insensitive search', () => {
    expect(filterGames(games, new URLSearchParams('q=dao+may'))[0]?.id).toBe('dao-may');
  });
  it('never recommends excluded or out-of-catalog games', () => {
    const result = sampleRecommendations('4 người, 45 phút, thích hợp tác', ['dao-may']);
    expect(result.mode).toBe('demo');
    expect(result.items.length).toBeGreaterThan(0);
    expect(
      result.items.every(
        ({ game }) =>
          games.some((known) => known.id === game.id) &&
          game.id !== 'dao-may' &&
          game.duration! <= 45 &&
          game.maxPlayers! >= 4,
      ),
    ).toBe(true);
  });
  it('returns no candidates rather than relaxing impossible constraints', () => {
    expect(sampleRecommendations('20 người, 5 phút', []).items).toEqual([]);
  });
  it('converts hours into minutes', () => {
    expect(sampleRecommendations('4 người, 1 tiếng', []).interpretation).toContain('60 phút');
  });
});
describe('Idempotent shelf merge policy', () => {
  it('combines flags and preserves existing account rating/notes', () => {
    const account = [{ ...emptyRecord('dao-may'), played: true, rating: 4, notes: 'Account note' }];
    const guest = [{ ...emptyRecord('dao-may'), wishlist: true, rating: 2, notes: 'Guest note' }];
    const result = mergeRecords(account, guest);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      played: true,
      wishlist: true,
      rating: 4,
      notes: 'Account note',
    });
    expect(mergeRecords(result, guest)).toEqual(result);
  });
  it('fills only absent rating and notes', () => {
    expect(
      mergeRecords([emptyRecord('x')], [{ ...emptyRecord('x'), rating: 5, notes: 'Guest' }])[0],
    ).toMatchObject({ rating: 5, notes: 'Guest' });
  });
});
