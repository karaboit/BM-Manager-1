import { StateCreator } from "zustand";

export interface SessionSlice {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  lastActivity: number;
  updateLastActivity: () => void;
}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  isAuthenticated: false,
  lastActivity: Date.now(),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  updateLastActivity: () => set({ lastActivity: Date.now() }),
});
