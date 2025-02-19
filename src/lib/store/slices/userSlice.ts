import { StateCreator } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}

export interface UserState {
  currentUser: User | null;
  selectedChildId?: string;
}

export interface UserActions {
  setCurrentUser: (user: User | null) => void;
  setSelectedChildId: (id: string | undefined) => void;
}

export type UserSlice = UserState & UserActions;

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  currentUser: null,
  selectedChildId: undefined,
  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedChildId: (id) => set({ selectedChildId: id }),
});
