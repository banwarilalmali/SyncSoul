import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { generalLimiter } from './middleware/rateLimit.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roomRoutes from './routes/rooms.js';
import musicRoutes from './routes/music.js';
import uploadRoutes from './routes/upload.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(generalLimiter);
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'syncmusic-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/upload', uploadRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
// TODO: Add request IDs, structured logging and production security headers review.
