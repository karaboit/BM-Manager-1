export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  role_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  roles?: {
    id: string;
    name: string;
    role_key: string;
    description?: string;
  };
}

export type UserRole = string;

export interface House {
  id: string;
  name: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  house_id: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface Bed {
  id: string;
  room_id: string;
  student_id?: string;
  status: "available" | "occupied" | "maintenance";
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  student_id: string;
  condition: string;
  notes: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface LeaveRequest {
  id: string;
  student_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: "present" | "absent" | "late";
  notes?: string;
  created_at: string;
  created_by: string;
}
