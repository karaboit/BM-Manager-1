import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bed, UserPlus } from "lucide-react";

interface BedAllocationPanelProps {
  house: {
    id: string;
    name: string;
  };
  room: {
    id: string;
    number: string;
    beds: Array<{
      id: string;
      label: string;
      status: "available" | "occupied" | "maintenance";
      boarder?: {
        id: string;
        name: string;
      };
    }>;
  };
  onAssignBed: (bedId: string) => void;
}

export default function BedAllocationPanel({
  house,
  room,
  onAssignBed,
}: BedAllocationPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            {house.name} - Room {room.number}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-15rem)]">
          <div className="grid grid-cols-2 gap-4">
            {room.beds.map((bed) => (
              <Card key={bed.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      <span className="font-medium">{bed.label}</span>
                    </div>
                    {bed.status === "available" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAssignBed(bed.id)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      bed.status === "available"
                        ? "bg-blue-100"
                        : bed.status === "occupied"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                    }`}
                  >
                    <p className="text-sm">
                      {bed.status === "available"
                        ? "Available"
                        : bed.status === "occupied"
                          ? bed.boarder?.name
                          : "Under Maintenance"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
