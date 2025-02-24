import { House, Room, Bed, BedAssignment } from "@/types/room";

// Mock data for houses
export const mockHouses: House[] = [
  {
    id: "1",
    name: "East Wing",
    capacity: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "active",
  },
  {
    id: "2",
    name: "West Wing",
    capacity: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "active",
  },
];

// Mock data for rooms
export const mockRooms: Record<string, Room[]> = {
  "1": [
    {
      id: "101",
      name: "101",
      house_id: "1",
      capacity: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "occupied",
    },
    {
      id: "102",
      name: "102",
      house_id: "1",
      capacity: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "available",
    },
  ],
  "2": [
    {
      id: "201",
      name: "201",
      house_id: "2",
      capacity: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "maintenance",
    },
  ],
};

// Mock data for beds
export const mockBeds: Record<string, Bed[]> = {
  "101": [
    {
      id: "bed1",
      room_id: "101",
      status: "available",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignments: [],
    },
    {
      id: "bed2",
      room_id: "101",
      status: "occupied",
      student_id: "B001",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignments: [
        {
          id: "assign1",
          bed_id: "bed2",
          student_id: "B001",
          start_date: "2024-01-01",
          end_date: null,
          status: "active",
          notes: "Initial assignment",
          created_at: new Date().toISOString(),
        },
      ],
    },
  ],
  "102": [
    {
      id: "bed3",
      room_id: "102",
      status: "available",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignments: [],
    },
  ],
};

// Mock functions
export function getMockRooms(houseId: string): Room[] {
  return mockRooms[houseId] || [];
}

export function getMockBeds(roomId: string): Bed[] {
  return mockBeds[roomId] || [];
}

export function addMockHouse(data: {
  name: string;
  capacity: number;
  houseMaster: {
    name: string;
    email: string;
    phone: string;
  };
  rooms: Array<{
    number: string;
    capacity: number;
  }>;
}): House {
  const newHouse: House = {
    id: crypto.randomUUID(),
    name: data.name,
    capacity: data.capacity,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "active",
  };
  mockHouses.push(newHouse);
  mockRooms[newHouse.id] = [];

  // Create rooms for the house
  if (data.rooms && Array.isArray(data.rooms)) {
    data.rooms.forEach((roomData) => {
      const room = addMockRoom({
        name: roomData.number,
        house_id: newHouse.id,
        capacity: roomData.capacity,
      });

      // Create beds for the room
      mockBeds[room.id] = Array.from({ length: roomData.capacity }, () => ({
        id: crypto.randomUUID(),
        room_id: room.id,
        status: "available",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assignments: [],
      }));
    });
  }

  return newHouse;
}

export function addMockRoom(room: Partial<Room>): Room {
  const newRoom: Room = {
    id: crypto.randomUUID(),
    name: room.name || "",
    house_id: room.house_id || "",
    capacity: room.capacity || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: room.status || "available",
  };
  if (!mockRooms[room.house_id!]) {
    mockRooms[room.house_id!] = [];
  }
  mockRooms[room.house_id!].push(newRoom);

  // Create beds for the room based on capacity
  mockBeds[newRoom.id] = Array.from({ length: room.capacity || 0 }, () => ({
    id: crypto.randomUUID(),
    room_id: newRoom.id,
    status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignments: [],
  }));

  return newRoom;
}

export function updateMockHouse(id: string, updates: Partial<House>): House {
  const index = mockHouses.findIndex((h) => h.id === id);
  if (index === -1) throw new Error("House not found");

  mockHouses[index] = {
    ...mockHouses[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return mockHouses[index];
}

export function deleteMockHouse(id: string): void {
  const index = mockHouses.findIndex((h) => h.id === id);
  if (index === -1) throw new Error("House not found");

  // Delete all rooms and beds in this house
  delete mockRooms[id];
  mockHouses.splice(index, 1);
}

export function assignBedToStudent(
  bedId: string,
  studentId: string,
  startDate: string,
  notes?: string,
): BedAssignment {
  // Find the bed
  let foundBed: Bed | undefined;
  let roomId: string | undefined;

  for (const [rid, beds] of Object.entries(mockBeds)) {
    const bed = beds.find((b) => b.id === bedId);
    if (bed) {
      foundBed = bed;
      roomId = rid;
      break;
    }
  }

  if (!foundBed || !roomId) throw new Error("Bed not found");

  // If bed is already occupied, end the current assignment
  if (foundBed.status === "occupied" && foundBed.student_id) {
    const currentAssignment = foundBed.assignments.find(
      (a) => a.status === "active",
    );
    if (currentAssignment) {
      currentAssignment.status = "ended";
      currentAssignment.end_date = new Date().toISOString();
    }
  }

  // Create new assignment
  const newAssignment: BedAssignment = {
    id: crypto.randomUUID(),
    bed_id: bedId,
    student_id: studentId,
    start_date: startDate,
    end_date: null,
    status: "active",
    notes,
    created_at: new Date().toISOString(),
  };

  foundBed.assignments.push(newAssignment);
  foundBed.status = "occupied";
  foundBed.student_id = studentId;
  foundBed.updated_at = new Date().toISOString();

  return newAssignment;
}

export function getBedAssignmentHistory(bedId: string): BedAssignment[] {
  // Find the bed
  for (const beds of Object.values(mockBeds)) {
    const bed = beds.find((b) => b.id === bedId);
    if (bed) {
      return bed.assignments;
    }
  }
  return [];
}
