import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn('[database] MONGODB_URI is not configured; running in scaffold mode.');
    return false;
  }
  await mongoose.connect(env.mongoUri);
  console.log('[database] MongoDB connected');
  return true;
}
// TODO: Add connection retry/backoff and graceful shutdown.
