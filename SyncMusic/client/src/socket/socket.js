import { io } from 'socket.io-client';

// TODO: Server authenticates the httpOnly cookie during the handshake.
export const socket = io(import.meta.env.VITE_API_BASE || '/', {
  path: import.meta.env.VITE_SOCKET_PATH || '/socket.io',
  autoConnect: false,
  withCredentials: true
});
