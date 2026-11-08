import { z } from 'zod';
export const musicSearchSchema = z.object({
  query: z.string().trim().min(1).max(120),
  source: z.enum(['audius', 'jamendo', 'youtube', 'audio-a', 'audio-b', 'video']).default('audius'),
  page: z.coerce.number().int().min(1).max(50).default(1)
});
