import { create } from 'zustand';
export const useRoomStore = create((set) => ({
  room: null, members: [],
  setRoom: (room) => set({ room }),
  setMembers: (members) => set({ members })
  // TODO: Handle reconnecting state and host changes.
}));
