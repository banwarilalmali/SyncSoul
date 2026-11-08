import { socket } from '../socket/socket.js';
export function useSocket() { return socket; } // TODO: Add lifecycle-safe socket connection.