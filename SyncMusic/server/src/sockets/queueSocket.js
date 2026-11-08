import { canControlRoom } from '../services/room/roomManager.js';
import { getQueue, setQueue } from '../services/queue/queueManager.js';

export function registerQueueSocket(io, socket) {
  const update = (payload = {}) => {
    const { roomId, items } = payload;
    if (!roomId || !canControlRoom(roomId, String(socket.user.userId))) return;
    if (!Array.isArray(items) || items.length > 100) return;
    const safe = items.filter(item => item && typeof item.title === 'string' && typeof item.sourceId === 'string')
      .slice(0, 100).map(item => {
        let streamUrl = '';
        try {
          const parsed = new URL(String(item.streamUrl || ''));
          if (parsed.protocol === 'https:' && (parsed.hostname === 'api.audius.co' || parsed.hostname.endsWith('.audius.co'))) streamUrl = parsed.toString();
        } catch {}
        return ({
        source: ['audius', 'jamendo', 'youtube', 'upload'].includes(item.source) ? item.source : 'audius',
        sourceId: item.sourceId.slice(0, 200),
        title: item.title.slice(0, 160),
        artist: String(item.artist || '').slice(0, 120),
        duration: Math.max(0, Number(item.duration) || 0),
        artworkUrl: String(item.artworkUrl || '').slice(0, 1000),
        streamUrl: streamUrl.slice(0, 2000),
        addedBy: String(socket.user.publicId || '').slice(0, 40)
      }); });
    setQueue(roomId, safe);
    io.to(roomId).emit('queue:update', { items: getQueue(roomId) });
  };
  for (const event of ['queue:add', 'queue:remove', 'queue:reorder', 'queue:update']) socket.on(event, update);
}
