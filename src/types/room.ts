export interface House {
  id: string;
  name: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface Room {
  id: string;
  name: string;
  house_id: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface Bed {
  id: string;
  room_id: string;
  student_id?: string;
  status: "available" | "occupied" | "maintenance";
  created_at: string;
  updated_at: string;
  assignments: BedAssignment[];
}

export interface BedAssignment {
  id: string;
  bed_id: string;
  student_id: string;
  start_date: string;
  end_date: string | null;
  status: "active" | "ended";
  notes?: string;
  created_at: string;
}
