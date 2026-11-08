import { z } from 'zod';
export const updateUserSchema = z.object({ displayName: z.string().min(2).max(40).optional(), bio: z.string().max(160).optional(), avatarUrl: z.string().url().optional() });
// TODO: Validate uploaded avatar metadata server-side.
