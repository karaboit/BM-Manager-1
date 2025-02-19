import { create } from "zustand";
import { createUserSlice, UserSlice } from "./store/slices/userSlice";
import { createChatSlice, ChatSlice } from "./store/slices/chatSlice";

interface DashboardStore extends UserSlice, ChatSlice {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  availablePanels: string[];
  setAvailablePanels: (panels: string[]) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...createUserSlice(set),
  ...createChatSlice(set),
  activePanel: "dashboard",
  setActivePanel: (panel) => set({ activePanel: panel }),
  availablePanels: [],
  setAvailablePanels: (panels) => set({ availablePanels: panels }),
}));
