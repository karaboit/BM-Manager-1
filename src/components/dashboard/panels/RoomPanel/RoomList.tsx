import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Room, Bed } from "@/types";
import { Bed as BedIcon, Users, ArrowLeft, History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoomListProps {
  rooms: Room[];
  beds: Record<string, Bed[]>;
  onBack: () => void;
  onAssignBed: (bedId: string, roomId: string) => void;
  onViewHistory: (bedId: string) => void;
}

export function RoomList({
  rooms,
  beds,
  onBack,
  onAssignBed,
  onViewHistory,
}: RoomListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Rooms</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Room {room.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Capacity: {room.capacity}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {beds[room.id]?.filter((bed) => bed.student_id).length || 0}
                    /{room.capacity} occupied
                  </span>
                </div>
                <div className="grid gap-2">
                  {beds[room.id]?.map((bed) => (
                    <div key={bed.id} className="flex gap-2">
                      <Button
                        variant={bed.student_id ? "default" : "outline"}
                        className="flex-1 justify-start"
                        onClick={() => onAssignBed(bed.id, room.id)}
                      >
                        <BedIcon className="mr-2 h-4 w-4" />
                        {bed.student_id ? "Occupied" : "Available"}
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onViewHistory(bed.id)}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            View assignment history
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
