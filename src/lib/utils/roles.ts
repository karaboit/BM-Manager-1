export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  system_administrator: "System Administrator",
  director: "Director",
  house_master: "House Master",
  deputy_master: "Deputy House Master",
  medical: "Medical Staff",
  kitchen: "Kitchen Staff",
  parent: "Boarder Parent",
  boarder: "Boarder",
  support_staff: "Support Staff",
};

export const DEFAULT_USERS = [
  {
    id: "1",
    full_name: "Admin User",
    email: "admin@example.com",
    role: {
      id: "1",
      name: "System Administrator",
      role_key: "system_administrator",
    },
    status: "active",
  },
  {
    id: "2",
    full_name: "Director Smith",
    email: "director@example.com",
    role: { id: "2", name: "Director", role_key: "director" },
    status: "active",
  },
  {
    id: "3",
    full_name: "Mr. James Brown",
    email: "james@example.com",
    role: { id: "3", name: "House Master", role_key: "house_master" },
    status: "active",
  },
  {
    id: "4",
    full_name: "Ms. Jane Wilson",
    email: "jane@example.com",
    role: { id: "4", name: "Deputy House Master", role_key: "deputy_master" },
    status: "active",
  },
  {
    id: "5",
    full_name: "Support Staff",
    email: "support@example.com",
    role: { id: "5", name: "Support Staff", role_key: "support_staff" },
    status: "active",
  },
  {
    id: "6",
    full_name: "Head Prefect",
    email: "prefect@example.com",
    role: { id: "6", name: "Prefect", role_key: "prefect" },
    status: "active",
  },
  {
    id: "7",
    full_name: "Dr. Sarah Wilson",
    email: "sarah@example.com",
    role: { id: "7", name: "Medical Staff", role_key: "medical" },
    status: "active",
  },
  {
    id: "8",
    full_name: "Chef Johnson",
    email: "chef@example.com",
    role: { id: "8", name: "Kitchen Staff", role_key: "kitchen" },
    status: "active",
  },
  {
    id: "9",
    full_name: "Mrs. Smith",
    email: "parent@example.com",
    role: { id: "9", name: "Boarder Parent", role_key: "parent" },
    status: "active",
  },
  {
    id: "10",
    full_name: "John Smith",
    email: "john@example.com",
    role: { id: "10", name: "Boarder", role_key: "boarder" },
    status: "active",
  },
  {
    id: "11",
    full_name: "Dr. Emily Johnson",
    email: "emily@example.com",
    role: { id: "7", name: "Medical Staff", role_key: "medical" },
    status: "active",
  },
];

export function getRoleDisplayName(roleKey: string): string {
  if (!roleKey) return "Unknown";
  return ROLE_DISPLAY_NAMES[roleKey] || roleKey;
}
