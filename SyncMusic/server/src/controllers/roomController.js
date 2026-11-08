import Room from '../models/Room.js';
import { generateRoomId } from '../utils/generateRoomId.js';
import { setRoomState } from '../services/room/roomManager.js';

export async function createRoom(req, res, next) {
  try {
    const room = await Room.create({ roomId: generateRoomId(), name: req.body.name, permission: req.body.permission, hostId: req.user.userId });
    setRoomState(room.roomId, { members: [], playback: null, hostId: String(req.user.userId), permission: room.permission });
    res.status(201).json({ room });
  } catch (error) { next(error); }
}
export async function getRoom(req, res, next) {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ room });
  } catch (error) { next(error); }
}
export async function joinRoom(req, res, next) {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    return res.json({ roomId: room.roomId, joined: true, room: { name: room.name, permission: room.permission } });
  } catch (error) { next(error); }
}
