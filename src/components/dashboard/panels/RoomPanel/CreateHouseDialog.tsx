import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus } from "lucide-react";

import { House } from "@/types/room";

interface CreateHouseDialogProps {
  initialData?: House | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
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
  }) => Promise<void>;
}

export function CreateHouseDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateHouseDialogProps) {
  const [currentTab, setCurrentTab] = useState("house");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // House Details
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(initialData?.capacity || 0);

  // Initialize form when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCapacity(initialData.capacity);
    }
  }, [initialData]);

  // House Master Details
  const [houseMaster, setHouseMaster] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Room Configuration
  const [rooms, setRooms] = useState<
    Array<{ number: string; capacity: number }>
  >([{ number: "101", capacity: 2 }]);

  const addRoom = () => {
    const lastRoom = rooms[rooms.length - 1];
    const nextRoomNumber = String(parseInt(lastRoom.number) + 1).padStart(
      3,
      "0",
    );
    setRooms([...rooms, { number: nextRoomNumber, capacity: 2 }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const updateRoom = (
    index: number,
    field: "number" | "capacity",
    value: string | number,
  ) => {
    setRooms(
      rooms.map((room, i) =>
        i === index ? { ...room, [field]: value } : room,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit({
        name,
        capacity,
        houseMaster,
        rooms,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = {
    house: name.trim() !== "" && capacity > 0,
    houseMaster:
      houseMaster.name.trim() !== "" &&
      houseMaster.email.trim() !== "" &&
      houseMaster.phone.trim() !== "",
    rooms: rooms.length > 0 && rooms.every((r) => r.number && r.capacity > 0),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit House" : "Create New House"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="house">House Details</TabsTrigger>
            <TabsTrigger value="houseMaster">House Master</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="house" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">House Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter house name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter house description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Total Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setCurrentTab("houseMaster")}
                  disabled={!canProceed.house}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="houseMaster" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="masterName">House Master Name</Label>
                <Input
                  id="masterName"
                  value={houseMaster.name}
                  onChange={(e) =>
                    setHouseMaster({ ...houseMaster, name: e.target.value })
                  }
                  placeholder="Enter house master's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="masterEmail">Email</Label>
                <Input
                  id="masterEmail"
                  type="email"
                  value={houseMaster.email}
                  onChange={(e) =>
                    setHouseMaster({ ...houseMaster, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="masterPhone">Phone</Label>
                <Input
                  id="masterPhone"
                  type="tel"
                  value={houseMaster.phone}
                  onChange={(e) =>
                    setHouseMaster({ ...houseMaster, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab("house")}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentTab("rooms")}
                  disabled={!canProceed.houseMaster}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="rooms" className="mt-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {rooms.map((room, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Room Number</Label>
                        <Input
                          value={room.number}
                          onChange={(e) =>
                            updateRoom(index, "number", e.target.value)
                          }
                          placeholder="Room number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Capacity</Label>
                        <Input
                          type="number"
                          min={1}
                          value={room.capacity}
                          onChange={(e) =>
                            updateRoom(
                              index,
                              "capacity",
                              parseInt(e.target.value),
                            )
                          }
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRoom(index)}
                        disabled={rooms.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 space-y-4 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addRoom}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Button>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentTab("houseMaster")}
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !canProceed.house ||
                      !canProceed.houseMaster ||
                      !canProceed.rooms
                    }
                  >
                    {isSubmitting
                      ? initialData
                        ? "Updating..."
                        : "Creating..."
                      : initialData
                        ? "Update House"
                        : "Create House"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
