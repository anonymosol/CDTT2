import { z } from 'zod';
import type { components } from './schema';

export type Game = components['schemas']['Game'];
export type UserGame = components['schemas']['UserGame'];
export type User = components['schemas']['User'];
export type Recommendations = components['schemas']['Recommendations'];
export type ShelfFlag = 'played' | 'owned' | 'wishlist' | 'disliked';
export const shelfLabels: Record<ShelfFlag, string> = {
  played: 'Đã chơi',
  owned: 'Đang sở hữu',
  wishlist: 'Muốn thử',
  disliked: 'Không thích',
};
export const gameSchema = z.object({
  id: z.string(),
  name: z.string(),
  minPlayers: z.number().int().positive().optional(),
  maxPlayers: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  weight: z.number().min(1).max(5).optional(),
  minAge: z.number().int().nonnegative().optional(),
  genres: z.array(z.string()).optional(),
  mechanics: z.array(z.string()).optional(),
  description: z.string().optional(),
  tagline: z.string().optional(),
  imageUrl: z.string().optional(),
  color: z.string().optional(),
});
export const userSchema = z.object({ id: z.string(), name: z.string(), email: z.email() });
export const userGameSchema = z.object({
  gameId: z.string(),
  played: z.boolean(),
  owned: z.boolean(),
  wishlist: z.boolean(),
  disliked: z.boolean(),
  rating: z.number().int().min(1).max(5).nullable(),
  notes: z.string().max(1000),
});
export const credentialsSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  email: z.email().max(254),
  password: z.string().min(8).max(128),
});
export const recommendationRequestSchema = z.object({
  query: z.string().trim().min(3).max(1000),
  excludedIds: z.array(z.string()).max(200).optional(),
});
export const recommendationSchema = z.object({
  items: z.array(z.object({ game: gameSchema, reason: z.string() })).max(5),
  mode: z.enum(['demo', 'live']),
  interpretation: z.string(),
});
export const emptyRecord = (gameId: string): UserGame => ({
  gameId,
  played: false,
  owned: false,
  wishlist: false,
  disliked: false,
  rating: null,
  notes: '',
});
export const isActiveRecord = (record: UserGame) =>
  record.played ||
  record.owned ||
  record.wishlist ||
  record.disliked ||
  record.rating !== null ||
  !!record.notes;
export const isDemo = import.meta.env.VITE_API_MODE
  ? import.meta.env.VITE_API_MODE === 'demo'
  : import.meta.env.DEV || import.meta.env.MODE === 'demo';
