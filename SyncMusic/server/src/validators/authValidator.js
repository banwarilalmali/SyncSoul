import { z } from 'zod';
export const signupSchema = z.object({ displayName: z.string().min(2).max(40), email: z.string().email(), password: z.string().min(8).max(128) });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const forgotPasswordSchema = z.object({ email: z.string().email() });
export const resetPasswordSchema = z.object({ token: z.string().min(20), password: z.string().min(8).max(128) });
// TODO: Add verification schemas.
