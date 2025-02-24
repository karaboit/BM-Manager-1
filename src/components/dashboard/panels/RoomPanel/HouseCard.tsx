import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Home, Users } from "lucide-react";
import { House } from "@/types";

interface HouseCardProps {
  house: House;
  onAddRoom: () => void;
  onViewRooms: () => void;
  totalRooms: number;
  occupiedRooms: number;
}

export function HouseCard({
  house,
  onAddRoom,
  onViewRooms,
  totalRooms,
  occupiedRooms,
}: HouseCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{house.name}</CardTitle>
        <Home className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalRooms} Rooms</div>
        <p className="text-xs text-muted-foreground">
          {occupiedRooms} rooms occupied
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onAddRoom}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onViewRooms}
          >
            <Users className="mr-2 h-4 w-4" />
            View Rooms
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
