import { api } from './api.js';
export const createRoom = (payload) => api.post('/rooms', payload);
export const getRoom = (roomId) => api.get(`/rooms/${roomId}`);
export const joinRoom = (roomId) => api.post(`/rooms/${roomId}/join`);
// TODO: Add room permission and lifecycle actions.
