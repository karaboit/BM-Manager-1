import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Home,
  Search,
  MoreVertical,
  Pencil,
  Users,
  Trash,
  Eye,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRooms } from "@/lib/hooks/useRooms";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CreateHouseDialog } from "./RoomPanel/CreateHouseDialog";
import { CreateRoomDialog } from "./RoomPanel/CreateRoomDialog";
import { RoomList } from "./RoomPanel/RoomList";
import { BedAllocationDialog } from "./RoomPanel/BedAllocationDialog";
import { BedHistoryDialog } from "./RoomPanel/BedHistoryDialog";
import { BulkAllocationDialog } from "./RoomPanel/BulkAllocationDialog";
import { assignBedToStudent, getBedAssignmentHistory } from "@/lib/mock/rooms";
import { House } from "@/types/room";

interface BedSelection {
  id: string;
  roomNumber: string;
}

const RoomPanel = () => {
  const { toast } = useToast();
  const {
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
    refreshHouses,
  } = useRooms();

  const [isHouseDialogOpen, setIsHouseDialogOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBed, setSelectedBed] = useState<BedSelection | null>(null);
  const [viewingBedHistory, setViewingBedHistory] =
    useState<BedSelection | null>(null);
  const [isBulkAllocationOpen, setIsBulkAllocationOpen] = useState(false);

  // Filter houses based on search term
  const filteredHouses = houses.filter((house) =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteHouse = async (houseId: string) => {
    if (!confirm("Are you sure you want to delete this house?")) return;

    try {
      await deleteHouse(houseId);
      toast({
        title: "Success",
        description: "House deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete house",
        variant: "destructive",
      });
    }
  };

  if (loading && !selectedHouse) {
    return (
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Room Management</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add House
          </Button>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (selectedHouse) {
    const house = houses.find((h) => h.id === selectedHouse);
    if (!house) return null;

    return (
      <Card className="p-6">
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedHouse(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{house.name}</h1>
              <p className="text-sm text-muted-foreground">
                {rooms.length} rooms • Capacity: {house.capacity}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search rooms..." className="pl-8" />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsBulkAllocationOpen(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Bulk Allocate
              </Button>
            </div>
            <Button onClick={() => setIsCreateRoomOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </div>
        </div>

        <RoomList
          rooms={rooms}
          beds={beds}
          onBack={() => setSelectedHouse(null)}
          onAssignBed={(bedId, roomId) => {
            const room = rooms.find((r) => r.id === roomId);
            if (room) {
              setSelectedBed({ id: bedId, roomNumber: room.name });
            }
          }}
          onViewHistory={(bedId) => {
            const room = rooms.find((r) => {
              return beds[r.id]?.some((b) => b.id === bedId);
            });
            if (room) {
              setViewingBedHistory({ id: bedId, roomNumber: room.name });
            }
          }}
        />

        <BedAllocationDialog
          isOpen={!!selectedBed}
          onClose={() => setSelectedBed(null)}
          bedId={selectedBed?.id || ""}
          roomNumber={selectedBed?.roomNumber || ""}
          onSubmit={async ({ boarderId, startDate, notes }) => {
            try {
              await assignBedToStudent(
                selectedBed!.id,
                boarderId,
                startDate,
                notes,
              );
              toast({
                title: "Success",
                description: "Bed assigned successfully",
              });
              setSelectedBed(null);
            } catch (err) {
              toast({
                title: "Error",
                description:
                  err instanceof Error ? err.message : "Failed to assign bed",
                variant: "destructive",
              });
            }
          }}
        />

        <BedHistoryDialog
          isOpen={!!viewingBedHistory}
          onClose={() => setViewingBedHistory(null)}
          assignments={
            viewingBedHistory
              ? getBedAssignmentHistory(viewingBedHistory.id)
              : []
          }
          roomNumber={viewingBedHistory?.roomNumber || ""}
        />

        <BulkAllocationDialog
          isOpen={isBulkAllocationOpen}
          onClose={() => setIsBulkAllocationOpen(false)}
          availableBeds={Object.values(beds)
            .flat()
            .filter((bed) => bed.status === "available")
            .map((bed) => ({
              id: bed.id,
              roomNumber: rooms.find((r) => r.id === bed.room_id)?.name || "",
              status: bed.status,
            }))}
          unassignedBoarders={[
            { id: "B001", name: "John Smith" },
            { id: "B002", name: "Jane Doe" },
            { id: "B003", name: "Bob Wilson" },
          ]}
          onSubmit={async (allocations) => {
            try {
              await Promise.all(
                allocations.map((allocation) =>
                  assignBedToStudent(
                    allocation.bedId,
                    allocation.boarderId,
                    allocation.startDate,
                  ),
                ),
              );

              toast({
                title: "Success",
                description: `Successfully allocated ${allocations.length} beds`,
              });
              setIsBulkAllocationOpen(false);
            } catch (err) {
              toast({
                title: "Error",
                description:
                  err instanceof Error
                    ? err.message
                    : "Failed to allocate beds",
                variant: "destructive",
              });
            }
          }}
        />

        <CreateRoomDialog
          isOpen={isCreateRoomOpen}
          onClose={() => setIsCreateRoomOpen(false)}
          onSubmit={async (data) => {
            try {
              await createRoom(selectedHouse, {
                name: data.room_number,
                capacity: data.capacity,
              });
              toast({
                title: "Success",
                description: "Room created successfully",
              });
              setIsCreateRoomOpen(false);
            } catch (err) {
              toast({
                title: "Error",
                description:
                  err instanceof Error ? err.message : "Failed to create room",
                variant: "destructive",
              });
            }
          }}
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search houses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={() => setIsHouseDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add House
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error: {error.message}</p>
          <Button onClick={refreshHouses}>Retry</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHouses.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                {searchTerm ? (
                  <p>No houses found matching "{searchTerm}"</p>
                ) : (
                  <>
                    <Home className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                    <p>No houses found. Click "Add House" to create one.</p>
                  </>
                )}
              </div>
            ) : (
              filteredHouses.map((house) => (
                <Card key={house.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{house.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingHouse(house);
                              setIsHouseDialogOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit House
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedHouse(house.id)}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Manage Rooms
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteHouse(house.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete House
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Capacity</p>
                        <p className="font-medium">
                          {house.capacity || "Not set"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${house.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {house.status || "Active"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedHouse(house.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Rooms
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedHouse(house.id);
                          setIsCreateRoomOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Room
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      <CreateHouseDialog
        isOpen={isHouseDialogOpen}
        onClose={() => {
          setIsHouseDialogOpen(false);
          setEditingHouse(null);
        }}
        initialData={editingHouse}
        onSubmit={async (data) => {
          try {
            if (editingHouse) {
              await updateHouse(editingHouse.id, data);
              toast({
                title: "Success",
                description: "House updated successfully",
              });
            } else {
              await createHouse(data);
              toast({
                title: "Success",
                description: "House created successfully",
              });
            }
            setIsHouseDialogOpen(false);
            setEditingHouse(null);
          } catch (err) {
            toast({
              title: "Error",
              description:
                err instanceof Error ? err.message : "Failed to save house",
              variant: "destructive",
            });
          }
        }}
      />
    </Card>
  );
};

export default RoomPanel;
