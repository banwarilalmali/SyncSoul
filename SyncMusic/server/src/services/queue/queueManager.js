import Queue from '../../models/Queue.js';

const queues = new Map();
const pendingSaves = new Map();
const SAVE_DEBOUNCE_MS = 700;

export function getQueue(roomId) {
  return queues.get(roomId) ?? [];
}

export async function loadQueue(roomId) {
  if (queues.has(roomId)) return queues.get(roomId);
  try {
    const saved = await Queue.findOne({ roomId }).lean();
    const items = Array.isArray(saved?.items) ? saved.items.map(item => ({
      source: item.source || 'audius',
      sourceId: String(item.sourceId || ''),
      title: item.title || 'Untitled track',
      artist: item.artist || '',
      duration: Number(item.duration) || 0,
      artworkUrl: item.artworkUrl || '',
      streamUrl: item.streamUrl || '',
      addedBy: item.addedBy || ''
    })) : [];
    queues.set(roomId, items);
    return items;
  } catch (error) {
    console.error('[queue] hydration failed', error);
    return [];
  }
}

export function setQueue(roomId, items) {
  queues.set(roomId, items);
  const previous = pendingSaves.get(roomId);
  if (previous) clearTimeout(previous);
  const timer = setTimeout(async () => {
    try {
      await Queue.findOneAndUpdate(
        { roomId },
        { $set: { items }, $inc: { revision: 1 } },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('[queue] persistence failed', error);
    } finally {
      pendingSaves.delete(roomId);
    }
  }, SAVE_DEBOUNCE_MS);
  pendingSaves.set(roomId, timer);
  return items;
}

export async function deletePersistedQueue(roomId) {
  try { await Queue.deleteOne({ roomId }); }
  catch (error) { console.error('[queue] cleanup failed', error); }
}

export function clearHotQueue(roomId) {
  queues.delete(roomId);
  const timer = pendingSaves.get(roomId);
  if (timer) clearTimeout(timer);
  pendingSaves.delete(roomId);
}
