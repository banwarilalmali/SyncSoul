import { create } from 'zustand';
export const useChatStore = create((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] })
  // TODO: Clear on room end; do not persist chat to local storage.
}));
