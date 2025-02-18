import { StateCreator } from "zustand";

export interface UISlice {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  activePanel: "dashboard",
  setActivePanel: (panel) => set({ activePanel: panel }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
});
