// In-memory ephemeral chat only. Do not add database imports or persistence here.
const roomChats = new Map();
export function addChatItem(roomId, item) {
  const items = roomChats.get(roomId) ?? [];
  items.push(item);
  roomChats.set(roomId, items.slice(-200));
  return item;
}
export function getChatItems(roomId) { return roomChats.get(roomId) ?? []; }
export function clearChat(roomId) { roomChats.delete(roomId); }
// TODO: Clear chat when the last room member leaves or the room session expires.
