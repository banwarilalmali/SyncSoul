import { canControlRoom, getRoomState, setRoomState } from '../services/room/roomManager.js';

function safeTrack(track) {
  if (!track || typeof track !== 'object' || typeof track.sourceId !== 'string' || typeof track.title !== 'string') return null;
  const source = ['audius', 'jamendo', 'youtube', 'upload'].includes(track.source) ? track.source : 'audius';
  let streamUrl = '';
  try {
    const parsed = new URL(String(track.streamUrl || ''));
    if (parsed.protocol === 'https:' && (parsed.hostname === 'api.audius.co' || parsed.hostname.endsWith('.audius.co'))) streamUrl = parsed.toString();
  } catch {}
  return {
    source,
    sourceId: track.sourceId.slice(0, 200),
    title: track.title.slice(0, 160),
    artist: String(track.artist || '').slice(0, 120),
    duration: Math.max(0, Number(track.duration) || 0),
    artworkUrl: String(track.artworkUrl || '').slice(0, 1000),
    streamUrl: streamUrl.slice(0, 2000)
  };
}

export function registerMusicSocket(io, socket) {
  for (const event of ['music:play', 'music:pause']) {
    socket.on(event, payload => {
      const { roomId } = payload || {};
      if (!roomId || !canControlRoom(roomId, String(socket.user.userId))) return;
      const room = getRoomState(roomId);
      const track = safeTrack(payload.track) || room.playback?.track || null;
      const playback = {
        track,
        isPlaying: event === 'music:play',
        position: Math.max(0, Number(payload.position) || 0),
        updatedAt: Date.now()
      };
      setRoomState(roomId, { ...room, playback });
      io.to(roomId).emit('music:state', playback);
    });
  }

  socket.on('music:seek', payload => {
    const { roomId } = payload || {};
    if (!roomId || !canControlRoom(roomId, String(socket.user.userId))) return;
    const room = getRoomState(roomId);
    const playback = {
      ...(room.playback || {}),
      track: safeTrack(payload.track) || room.playback?.track || null,
      position: Math.max(0, Number(payload.position) || 0),
      updatedAt: Date.now()
    };
    setRoomState(roomId, { ...room, playback });
    io.to(roomId).emit('music:state', playback);
  });
}
