import { create } from 'zustand';
export const usePlayerStore = create((set) => ({
  currentTrack: null, queue: [], version: 0, isPlaying: false,
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setQueue: (queue) => set({ queue }),
  setVersion: (version) => set({ version }),
  setPlaying: (isPlaying) => set({ isPlaying })
  // TODO: Add shuffle, repeat and source adapter selection.
}));
