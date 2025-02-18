import { create } from "zustand";
import { User, UserRole } from "@/types";
import { RoomAllocation } from "@/types/room";

type ActivePanel =
  | "dashboard"
  | "users"
  | "config"
  | "audit"
  | "maintenance"
  | "announcements"
  | "medical"
  | "rooms"
  | "kitchen"
  | "attendance"
  | "leave"
  | "discipline"
  | "wellbeing"
  | "events";

interface AttendanceRecord {
  status: "Present" | "Late" | "Absent" | "Unmarked";
  reason?: string;
}

interface DashboardState {
  activePanel: ActivePanel;
  currentUser: User | null;
  setActivePanel: (panel: ActivePanel) => void;
  setCurrentUser: (user: User) => void;
  availablePanels: ActivePanel[];
  attendanceRecords: Record<string, Record<string, AttendanceRecord>>;
  setAttendanceRecords: (
    records: Record<string, Record<string, AttendanceRecord>>,
  ) => void;
  mealPlans: Record<string, any>;
  setMealPlans: (plans: Record<string, any>) => void;
  roomAllocation: RoomAllocation | null;
  setRoomAllocation: (allocation: RoomAllocation) => void;
  importedBoarders: Record<string, BoarderImport[]>;
  selectedChildId: string;
  setSelectedChildId: (childId: string) => void;
  setImportedBoarders: (houseId: string, boarders: BoarderImport[]) => void;
}

const getRoleBasedPanels = (role: UserRole): ActivePanel[] => {
  const boarderPanels = [
    "dashboard",
    "leave",
    "medical",
    "announcements",
    "wellbeing",
  ];

  switch (role) {
    case "System Administrator":
      return [
        "dashboard",
        "users",
        "config",
        "audit",
        "maintenance",
        "announcements",
        "rooms",
      ];
    case "Director":
      return [
        "dashboard",
        "users",
        "config",
        "audit",
        "maintenance",
        "announcements",
        "medical",
        "rooms",
        "attendance",
        "leave",
        "events",
      ];
    case "Medical Staff":
      return ["medical", "announcements", "wellbeing"];
    case "Kitchen Staff":
      return ["dashboard", "kitchen", "announcements"];
    case "House Master":
      return [
        "dashboard",
        "rooms",
        "attendance",
        "leave",
        "discipline",
        "announcements",
        "maintenance",
        "medical",
        "wellbeing",
        "events",
      ];
    case "Boarder":
      return boarderPanels;
    case "Boarder Parent":
      return ["dashboard", "leave", "medical", "wellbeing", "announcements"];
    case "Support Staff":
      return ["announcements"];
    case "Prefect":
      // Prefects are boarders with additional responsibilities
      return [...boarderPanels, "attendance", "discipline"];
    case "Deputy House Master":
      return [
        "dashboard",
        "rooms",
        "attendance",
        "leave",
        "discipline",
        "announcements",
        "medical",
        "wellbeing",
      ];
    default:
      return ["dashboard"];
  }
};

export const useDashboardStore = create<DashboardState>((set) => ({
  activePanel: "dashboard",
  currentUser: null,
  availablePanels: [],
  attendanceRecords: {},
  mealPlans: {},
  roomAllocation: null,
  importedBoarders: {},
  selectedChildId: "",
  setActivePanel: (panel) => set({ activePanel: panel }),
  setCurrentUser: (user) =>
    set({
      currentUser: user,
      availablePanels: getRoleBasedPanels(user.role),
      activePanel: getRoleBasedPanels(user.role)[0],
    }),
  setAttendanceRecords: (records) => set({ attendanceRecords: records }),
  setMealPlans: (plans) => set({ mealPlans: plans }),
  setRoomAllocation: (allocation) => set({ roomAllocation: allocation }),
  setSelectedChildId: (childId) => set({ selectedChildId: childId }),
  setImportedBoarders: (houseId, boarders) =>
    set((state) => ({
      importedBoarders: {
        ...state.importedBoarders,
        [houseId]: boarders,
      },
    })),
}));
