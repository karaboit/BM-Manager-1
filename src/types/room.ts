export interface BoardingHouse {
  house_id: string;
  house_name: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  room_id: string;
  house_id: string;
  room_number: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface Bed {
  bed_id: string;
  room_id: string;
  bed_label: string;
  status: "available" | "occupied" | "maintenance";
  created_at: string;
  updated_at: string;
}

export interface BedAssignment {
  assignment_id: string;
  bed_id: string;
  boarder_id: string;
  start_date: string;
  end_date?: string;
  status: "active" | "ended";
  created_at: string;
  updated_at: string;
}

export interface RoomAllocation {
  house: BoardingHouse;
  rooms: Room[];
  beds: Bed[];
  assignments: BedAssignment[];
}
