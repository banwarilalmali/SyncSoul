import { z } from 'zod';
export const createRoomSchema = z.object({ name: z.string().min(1).max(60), permission: z.enum(['everyone', 'host-only']).default('everyone') });
export const roomIdSchema = z.object({ roomId: z.string().regex(/^[A-Z0-9]{6}$/) });
// TODO: Add optional private-room access validation.
