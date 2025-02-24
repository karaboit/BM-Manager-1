export type UserRole =
  | "system_administrator"
  | "director"
  | "house_master"
  | "deputy_master"
  | "medical"
  | "kitchen"
  | "parent"
  | "boarder"
  | "support_staff";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  role?: {
    id: string;
    name: string;
    role_key: UserRole;
    description?: string;
  };
}

export interface UserCreate {
  email: string;
  full_name: string;
  role_key: UserRole;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  role_key?: UserRole;
}
