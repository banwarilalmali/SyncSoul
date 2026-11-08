import { create } from 'zustand';
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
  // TODO: Restore session from the server; never persist JWT in browser storage.
}));
