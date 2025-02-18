import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload } from "lucide-react";
import { useDashboardStore } from "@/lib/store";
import HouseOverview from "./RoomPanel/HouseOverview";
import RoomGrid from "./RoomPanel/RoomGrid";
import BedAllocationPanel from "./RoomPanel/BedAllocationPanel";
import BoarderImport from "./RoomPanel/BoarderImport";

const RoomPanel = () => {
  const [selectedHouse, setSelectedHouse] = useState<string>();
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const [isNewRoomOpen, setIsNewRoomOpen] = useState(false);
  const [isAssignBoarderOpen, setIsAssignBoarderOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<string>();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const { currentUser } = useDashboardStore();

  // Mock data - in real app would come from API
  const houses = [
    {
      id: "h1",
      name: "East Wing",
      totalBeds: 50,
      occupiedBeds: 35,
      maintenanceBeds: 2,
    },
    {
      id: "h2",
      name: "West Wing",
      totalBeds: 50,
      occupiedBeds: 40,
      maintenanceBeds: 1,
    },
  ];

  const rooms = [
    {
      id: "r1",
      houseId: "h1",
      number: "101",
      beds: [
        { id: "b1", label: "A", status: "available" },
        {
          id: "b2",
          label: "B",
          status: "occupied",
          boarder: { id: "st1", name: "John Smith" },
        },
      ],
    },
    {
      id: "r2",
      houseId: "h1",
      number: "102",
      beds: [
        { id: "b3", label: "A", status: "available" },
        { id: "b4", label: "B", status: "maintenance" },
      ],
    },
  ];

  // Access control based on roles
  const isSystemAdmin = currentUser?.role === "System Administrator";
  const isDirector = currentUser?.role === "Director";
  const isHouseMaster = currentUser?.role === "House Master";

  if (!isSystemAdmin && !isDirector && !isHouseMaster) {
    return (
      <div className="p-6 flex items-center justify-center text-muted-foreground">
        You do not have permission to access room management.
      </div>
    );
  }

  // Filter houses based on role
  const accessibleHouses = houses.filter((house) => {
    if (isSystemAdmin || isDirector) {
      return true; // Show all houses
    } else if (isHouseMaster) {
      return house.id === "h1"; // For demo, assuming House Master is assigned to East Wing
    }
    return false;
  });

  const selectedHouseData = houses.find((h) => h.id === selectedHouse);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <div className="flex gap-2">
          {(isSystemAdmin || isDirector) && (
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Boarders
                </Button>
              </DialogTrigger>
              <BoarderImport
                houses={accessibleHouses}
                onImport={(houseId, boarders) => {
                  console.log("Importing boarders:", { houseId, boarders });
                  setIsImportOpen(false);
                }}
              />
            </Dialog>
          )}
          {isSystemAdmin && (
            <Dialog open={isNewRoomOpen} onOpenChange={setIsNewRoomOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>House</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select house" />
                      </SelectTrigger>
                      <SelectContent>
                        {accessibleHouses.map((house) => (
                          <SelectItem key={house.id} value={house.id}>
                            {house.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Room Number</Label>
                    <Input placeholder="e.g. 101" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Capacity</Label>
                    <Input type="number" min="1" max="4" defaultValue="2" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewRoomOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewRoomOpen(false)}>
                    Create Room
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Houses Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Houses</h2>
          {accessibleHouses.map((house) => (
            <HouseOverview
              key={house.id}
              house={house}
              onSelect={setSelectedHouse}
              isSelected={selectedHouse === house.id}
            />
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Rooms</h2>
          {selectedHouse ? (
            <RoomGrid
              rooms={rooms.filter((r) => r.houseId === selectedHouse)}
              onBedClick={(roomId) => setSelectedRoom(roomId)}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Select a house to view rooms
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bed Allocation */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Bed Allocation</h2>
          {selectedRoom && selectedHouseData ? (
            <BedAllocationPanel
              house={selectedHouseData}
              room={rooms.find((r) => r.id === selectedRoom)!}
              onAssignBed={(bedId) => {
                setIsAssignBoarderOpen(true);
                setSelectedBed(bedId);
              }}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Select a room to manage bed allocations
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isAssignBoarderOpen} onOpenChange={setIsAssignBoarderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Boarder to Bed</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Boarder</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select boarder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b1">John Smith</SelectItem>
                  <SelectItem value="b2">Jane Doe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Input type="date" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAssignBoarderOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAssignBoarderOpen(false)}>
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomPanel;
