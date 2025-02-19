export type UserRole = string;

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  house_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  full_name: string;
  role: UserRole;
  house_id?: string | null;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  role?: UserRole;
  house_id?: string | null;
}
