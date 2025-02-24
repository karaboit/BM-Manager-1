import { StateCreator } from "zustand";
import { User } from "@/types/user";

export interface UserState {
  currentUser: User | null;
  selectedChildId?: string;
}

export interface UserActions {
  setCurrentUser: (user: User | null) => void;
  setSelectedChildId: (id: string | undefined) => void;
}

export type UserSlice = UserState & UserActions;

export const createUserSlice: StateCreator<
  UserSlice & {
    availablePanels: string[];
    setAvailablePanels: (panels: string[]) => void;
  }
> = (set) => ({
  currentUser: null,
  selectedChildId: undefined,
  setCurrentUser: (user) => {
    set({ currentUser: user, activePanel: "dashboard" });
    // When changing user, also update available panels based on role
    if (user) {
      const rolePanels = {
        system_administrator: [
          "dashboard",
          "users",
          "rooms",
          "kitchen",
          "attendance",
          "leave",
          "discipline",
          "wellbeing",
          "events",
          "config",
          "audit",
          "maintenance",
          "messaging",
          "mentor",
        ],
        director: [
          "dashboard",
          "users",
          "rooms",
          "kitchen",
          "attendance",
          "leave",
          "discipline",
          "wellbeing",
          "events",
          "maintenance",
          "messaging",
        ],
        house_master: [
          "dashboard",
          "rooms",
          "attendance",
          "leave",
          "discipline",
          "wellbeing",
          "messaging",
        ],
        deputy_master: [
          "dashboard",
          "rooms",
          "attendance",
          "leave",
          "discipline",
          "wellbeing",
          "messaging",
        ],
        medical: ["dashboard", "medical", "messaging", "wellbeing"],
        kitchen: ["dashboard", "kitchen", "messaging"],
        parent: ["dashboard", "leave", "wellbeing", "messaging"],
        boarder: ["dashboard", "leave", "wellbeing", "messaging"],
      };

      // Get the role key, handling both string and object formats
      const roleKey =
        typeof user.role === "object" ? user.role.role_key : user.role;
      console.log("Setting panels for role:", roleKey);
      set({ availablePanels: rolePanels[roleKey] || [] });
    }
  },
  setSelectedChildId: (id) => set({ selectedChildId: id }),
});
