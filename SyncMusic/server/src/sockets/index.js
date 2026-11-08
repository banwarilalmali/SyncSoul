import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { env } from '../config/env.js';
import { registerRoomSocket } from './roomSocket.js';
import { registerMusicSocket } from './musicSocket.js';
import { registerQueueSocket } from './queueSocket.js';
import { registerSyncSocket } from './syncSocket.js';
import { registerChatSocket } from './chatSocket.js';

export function attachSockets(httpServer) {
  const io = new Server(httpServer, { cors: { origin: env.clientOrigins, credentials: true } });
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token = cookies.access_token;
      if (!token) return next(new Error('Authentication required'));
      socket.user = jwt.verify(token, env.jwtSecret);
      return next();
    } catch { return next(new Error('Invalid socket session')); }
  });
  io.on('connection', (socket) => {
    registerRoomSocket(io, socket);
    registerMusicSocket(io, socket);
    registerQueueSocket(io, socket);
    registerSyncSocket(io, socket);
    registerChatSocket(io, socket);
  });
  return io;
}
// TODO: Enforce membership and permission checks inside every room-scoped handler.
