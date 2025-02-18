import { StateCreator } from "zustand";
import { User, UserRole } from "@/types";

export interface UserState {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  permissions: Set<string>;
}

export interface UserActions {
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  hasPermission: (permission: string) => boolean;
  logout: () => void;
}

export type UserSlice = UserState & UserActions;

const getRolePermissions = (role: UserRole): Set<string> => {
  const basePermissions = new Set(["view_profile", "update_profile"]);

  switch (role) {
    case "System Administrator":
      return new Set([
        ...basePermissions,
        "manage_users",
        "manage_roles",
        "manage_system",
        "view_audit_logs",
        "manage_houses",
        "manage_medical",
        "manage_kitchen",
        "manage_attendance",
        "manage_discipline",
      ]);
    case "Director":
      return new Set([
        ...basePermissions,
        "manage_users",
        "view_audit_logs",
        "manage_houses",
        "view_medical",
        "manage_kitchen",
        "manage_attendance",
        "manage_discipline",
      ]);
    case "House Master":
      return new Set([
        ...basePermissions,
        "manage_house",
        "view_medical",
        "manage_attendance",
        "manage_discipline",
      ]);
    case "Medical Staff":
      return new Set([
        ...basePermissions,
        "manage_medical",
        "view_boarder_records",
      ]);
    default:
      return basePermissions;
  }
};

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  currentUser: null,
  users: [],
  isLoading: false,
  error: null,
  permissions: new Set(),

  setCurrentUser: (user) =>
    set({
      currentUser: user,
      permissions: user ? getRolePermissions(user.role) : new Set(),
    }),

  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
      currentUser: state.currentUser?.id === user.id ? user : state.currentUser,
    })),

  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  hasPermission: (permission) => {
    const { permissions } = get();
    return permissions.has(permission);
  },

  logout: () =>
    set({
      currentUser: null,
      permissions: new Set(),
    }),
});
