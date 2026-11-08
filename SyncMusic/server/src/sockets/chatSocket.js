import { addChatItem } from '../services/chat/chatStore.js';
import { getRoomState } from '../services/room/roomManager.js';

export function registerChatSocket(io, socket) {
  socket.on('chat:send', ({ roomId, text } = {}) => {
    const room = getRoomState(roomId);
    const member = room?.members.find(item => item.userId === String(socket.user.userId));
    if (!member || typeof text !== 'string' || !text.trim() || text.length > 1000) return;
    const item = addChatItem(roomId, {
      id: crypto.randomUUID(),
      senderId: String(socket.user.userId),
      displayName: member.displayName || 'Listener',
      text: text.trim(),
      createdAt: Date.now()
    });
    io.to(roomId).emit('chat:new', item);
  });

  socket.on('chat:typing', ({ roomId, typing } = {}) => {
    const room = getRoomState(roomId);
    const member = room?.members.find(item => item.userId === String(socket.user.userId));
    if (!member) return;
    socket.to(roomId).emit('chat:typing', { userId: member.userId, displayName: member.displayName, typing: Boolean(typing) });
  });
}
