import { getRoomState, joinRoomState, leaveRoomState, scheduleDisconnect, setRoomState } from '../services/room/roomManager.js';
import { loadQueue } from '../services/queue/queueManager.js';
import { getChatItems } from '../services/chat/chatStore.js';
import Room from '../models/Room.js';

export function registerRoomSocket(io, socket) {
  socket.on('room:join', async ({ roomId, displayName = '' } = {}) => {
    if (!/^[A-Z0-9]{6}$/.test(roomId || '')) return socket.emit('room:error', { reason: 'Invalid room ID' });
    try {
      const record = await Room.findOne({ roomId }).lean();
      if (!record) return socket.emit('room:error', { reason: 'Room not found. Create a room first.' });
      if (!getRoomState(roomId)) {
        setRoomState(roomId, {
          members: [],
          playback: null,
          hostId: String(record.hostId),
          permission: record.permission || 'everyone'
        });
      }
      await socket.join(roomId);
      const state = joinRoomState(roomId, String(socket.user.userId), String(displayName).slice(0, 40));
      const [queue] = await Promise.all([loadQueue(roomId)]);
      socket.emit('room:state', { ...state, queue, chat: getChatItems(roomId) });
      io.to(roomId).emit('room:members', state.members);
    } catch (error) {
      console.error('[socket] room join failed', error);
      socket.emit('room:error', { reason: 'Could not join this room. Please retry.' });
    }
  });

  socket.on('room:leave', ({ roomId } = {}) => {
    if (!roomId) return;
    socket.leave(roomId);
    leaveRoomState(roomId, String(socket.user.userId), io);
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) scheduleDisconnect(roomId, String(socket.user.userId), io);
    }
  });
}
