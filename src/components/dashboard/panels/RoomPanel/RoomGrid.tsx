import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bed } from "lucide-react";

interface RoomGridProps {
  rooms: Array<{
    id: string;
    number: string;
    beds: Array<{
      id: string;
      status: "available" | "occupied" | "maintenance";
      boarder?: {
        name: string;
        id: string;
      };
    }>;
  }>;
  onBedClick: (roomId: string, bedId: string) => void;
}

export default function RoomGrid({ rooms, onBedClick }: RoomGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <Card key={room.id} className="relative">
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Room {room.number}</div>
            <div className="grid grid-cols-2 gap-2">
              {room.beds.map((bed) => (
                <button
                  key={bed.id}
                  onClick={() => onBedClick(room.id, bed.id)}
                  className={`p-2 rounded-lg flex flex-col items-center gap-1 ${bed.status === "available" ? "bg-blue-100 hover:bg-blue-200" : bed.status === "occupied" ? "bg-green-100" : "bg-yellow-100"}`}
                >
                  <Bed className="h-4 w-4" />
                  {bed.boarder && (
                    <span className="text-xs truncate w-full text-center">
                      {bed.boarder.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
