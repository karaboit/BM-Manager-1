import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewTable } from "@/components/ViewTable";

interface BoarderAllocation {
  boarderId: string;
  bedId: string;
  roomNumber: string;
  startDate: string;
}

interface BulkAllocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (allocations: BoarderAllocation[]) => Promise<void>;
  availableBeds: Array<{
    id: string;
    roomNumber: string;
    status: string;
  }>;
  unassignedBoarders: Array<{
    id: string;
    name: string;
  }>;
}

export function BulkAllocationDialog({
  isOpen,
  onClose,
  onSubmit,
  availableBeds,
  unassignedBoarders,
}: BulkAllocationDialogProps) {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allocations, setAllocations] = useState<BoarderAllocation[]>([]);

  const handleAutoAllocate = () => {
    // Simple allocation - match boarders to beds sequentially
    const newAllocations = unassignedBoarders
      .filter((_, index) => index < availableBeds.length)
      .map((boarder, index) => ({
        boarderId: boarder.id,
        bedId: availableBeds[index].id,
        roomNumber: availableBeds[index].roomNumber,
        startDate,
      }));

    setAllocations(newAllocations);
  };

  const handleSubmit = async () => {
    if (!allocations.length) return;

    try {
      setIsSubmitting(true);
      await onSubmit(allocations);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bulk Bed Allocation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <Button onClick={handleAutoAllocate}>
              Auto-Allocate Available Beds
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Available Beds</h3>
              <ScrollArea className="h-[300px] border rounded-md p-2">
                <div className="space-y-2">
                  {availableBeds.map((bed) => (
                    <div
                      key={bed.id}
                      className="p-2 border rounded flex justify-between items-center"
                    >
                      <span>Room {bed.roomNumber}</span>
                      <span className="text-sm text-muted-foreground">
                        {bed.status}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <h3 className="font-medium mb-2">Unassigned Boarders</h3>
              <ScrollArea className="h-[300px] border rounded-md p-2">
                <div className="space-y-2">
                  {unassignedBoarders.map((boarder) => (
                    <div
                      key={boarder.id}
                      className="p-2 border rounded flex justify-between items-center"
                    >
                      <span>{boarder.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {boarder.id}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {allocations.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Planned Allocations</h3>
              <ViewTable
                columns={[
                  { key: "boarderId", header: "Boarder ID" },
                  { key: "roomNumber", header: "Room" },
                  { key: "startDate", header: "Start Date" },
                ]}
                data={allocations}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !allocations.length}
            >
              {isSubmitting ? "Allocating..." : "Confirm Allocations"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
