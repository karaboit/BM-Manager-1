import { create } from "zustand";
import { createUISlice, UISlice } from "./slices/uiSlice";
import { createUserSlice, UserSlice } from "./slices/userSlice";
import { createSessionSlice, SessionSlice } from "./slices/sessionSlice";
import { persist } from "./middleware";

type StoreState = UISlice & UserSlice & SessionSlice;

export const useStore = create<StoreState>()(
  persist({
    name: "app-store",
    storage: localStorage,
    version: 1,
    whitelist: ["currentUser", "settings", "preferences"],
  })((set, get) => ({
    ...createUISlice(set),
    ...createUserSlice(set, get),
    ...createSessionSlice(set),
  })),
);
