import { clearChat } from '../chat/chatStore.js';
import { clearHotQueue, deletePersistedQueue } from '../queue/queueManager.js';
import Room from '../../models/Room.js';

const rooms = new Map();
const disconnectTimers = new Map();
const DISCONNECT_GRACE_MS = 45_000;

export function getRoomState(roomId) { return rooms.get(roomId) ?? null; }
export function canControlRoom(roomId, userId) {
  const state = rooms.get(roomId);
  if (!state || !state.members.some((member) => member.userId === userId)) return false;
  return state.permission !== 'host-only' || state.hostId === userId;
}
export function setRoomState(roomId, state) { rooms.set(roomId, state); return state; }

export function joinRoomState(roomId, userId, displayName = '') {
  const key = `${roomId}:${userId}`;
  const timer = disconnectTimers.get(key);
  if (timer) clearTimeout(timer);
  disconnectTimers.delete(key);

  const state = rooms.get(roomId) ?? { members: [], playback: null, hostId: userId, permission: 'everyone' };
  if (!state.members.some((member) => member.userId === userId)) {
    state.members.push({ userId, displayName, connected: true });
  }
  state.members = state.members.map((member) => member.userId === userId ? { ...member, connected: true } : member);
  rooms.set(roomId, state);
  return state;
}

function removeMember(roomId, userId, io) {
  const state = rooms.get(roomId);
  if (!state) return;
  state.members = state.members.filter((member) => member.userId !== userId);
  if (state.members.length === 0) {
    rooms.delete(roomId);
    clearChat(roomId);
    clearHotQueue(roomId);
    void deletePersistedQueue(roomId);
    void Room.deleteOne({ roomId }).catch((error) => console.error('[room] cleanup failed', error));
    return;
  }
  if (state.hostId === userId) {
    state.hostId = state.members[0].userId;
    io?.to(roomId).emit('room:host-changed', { hostId: state.hostId });
  }
  rooms.set(roomId, state);
  io?.to(roomId).emit('room:members', state.members);
}

export function leaveRoomState(roomId, userId, io) {
  const timerKey = `${roomId}:${userId}`;
  const timer = disconnectTimers.get(timerKey);
  if (timer) clearTimeout(timer);
  disconnectTimers.delete(timerKey);
  removeMember(roomId, userId, io);
}

export function scheduleDisconnect(roomId, userId, io) {
  const timerKey = `${roomId}:${userId}`;
  const existing = disconnectTimers.get(timerKey);
  if (existing) clearTimeout(existing);
  const timer = setTimeout(() => {
    disconnectTimers.delete(timerKey);
    removeMember(roomId, userId, io);
  }, DISCONNECT_GRACE_MS);
  disconnectTimers.set(timerKey, timer);
}

export function deleteRoomState(roomId) {
  clearChat(roomId);
  clearHotQueue(roomId);
  void deletePersistedQueue(roomId);
  void Room.deleteOne({ roomId }).catch((error) => console.error('[room] cleanup failed', error));
  return rooms.delete(roomId);
}
export function getDisconnectGraceMs() { return DISCONNECT_GRACE_MS; }
// TODO: Load persisted room metadata and queue when a room is rehydrated.
