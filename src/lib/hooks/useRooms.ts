import { useState, useEffect } from "react";
import { House, Room, Bed } from "@/types/room";

// Mock data
const mockHouses: House[] = [
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

const mockRooms: Record<string, Room[]> = {
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
  ],
};

const mockBeds: Record<string, Bed[]> = {
  "101": [
    {
      id: "bed1",
      room_id: "101",
      status: "available",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignments: [],
    },
  ],
};

export function useRooms() {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Record<string, Bed[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    if (selectedHouse) {
      fetchRooms(selectedHouse);
    }
  }, [selectedHouse]);

  async function fetchHouses() {
    try {
      setLoading(true);
      setHouses(mockHouses);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRooms(houseId: string) {
    try {
      setLoading(true);
      const rooms = mockRooms[houseId] || [];
      setRooms(rooms);

      // Fetch beds for each room
      const bedData: Record<string, Bed[]> = {};
      for (const room of rooms) {
        bedData[room.id] = mockBeds[room.id] || [];
      }
      setBeds(bedData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function createHouse(data: {
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
  }) {
    try {
      const newHouse: House = {
        id: crypto.randomUUID(),
        name: data.name,
        capacity: data.capacity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
      };
      setHouses((prev) => [...prev, newHouse]);
      return newHouse;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  async function updateHouse(
    id: string,
    data: {
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
    },
  ) {
    try {
      setHouses((prev) =>
        prev.map((house) =>
          house.id === id
            ? {
                ...house,
                name: data.name,
                capacity: data.capacity,
                updated_at: new Date().toISOString(),
              }
            : house,
        ),
      );

      return houses.find((h) => h.id === id)!;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  async function deleteHouse(id: string) {
    try {
      setHouses((prev) => prev.filter((house) => house.id !== id));
      if (selectedHouse === id) {
        setSelectedHouse(null);
        setRooms([]);
        setBeds({});
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  async function createRoom(
    houseId: string,
    { name, capacity }: { name: string; capacity: number },
  ) {
    try {
      const newRoom: Room = {
        id: crypto.randomUUID(),
        name,
        house_id: houseId,
        capacity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "available",
      };

      if (!mockRooms[houseId]) {
        mockRooms[houseId] = [];
      }
      mockRooms[houseId].push(newRoom);

      if (selectedHouse === houseId) {
        setRooms((prev) => [...prev, newRoom]);
      }
      return newRoom;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  return {
    houses,
    rooms,
    beds,
    loading,
    error,
    selectedHouse,
    setSelectedHouse,
    createHouse,
    updateHouse,
    deleteHouse,
    createRoom,
    refreshHouses: fetchHouses,
    refreshRooms: fetchRooms,
  };
}
