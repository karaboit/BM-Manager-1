import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Calendar, Users } from "lucide-react";
import { useDashboardStore } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "upcoming" | "ongoing" | "completed";
  participants: string[];
  mealTimings?: string[];
}

const defaultEvents: Event[] = [
  {
    id: "1",
    title: "Weekend Sports Tournament",
    description: "Inter-house sports competition",
    date: "2024-03-25",
    time: "14:00",
    location: "Sports Field",
    maxParticipants: 50,
    currentParticipants: 30,
    status: "upcoming",
    participants: ["B001", "B002"],
    mealTimings: ["lunch", "dinner"],
  },
];

const EventsPanel = () => {
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const { currentUser } = useDashboardStore();
  const [events, setEvents] = useState(defaultEvents);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: 0,
    mealTimings: [] as string[],
  });

  const canCreateEvents = [
    "Director",
    "House Master",
    "Deputy House Master",
  ].includes(currentUser?.role || "");

  const handleCreateEvent = () => {
    const event = {
      id: (events.length + 1).toString(),
      ...newEvent,
      currentParticipants: 0,
      status: "upcoming" as const,
      participants: [],
    };
    setEvents([...events, event]);
    setIsNewEventOpen(false);
    alert("Event created successfully");
  };

  const handleAddMealTiming = (value: string) => {
    if (value === "none" || newEvent.mealTimings.includes(value)) return;
    setNewEvent((prev) => ({
      ...prev,
      mealTimings: [...prev.mealTimings, value],
    }));
  };

  const handleRemoveMealTiming = (timing: string) => {
    setNewEvent((prev) => ({
      ...prev,
      mealTimings: prev.mealTimings.filter((t) => t !== timing),
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events Management</h1>
        {canCreateEvents && (
          <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Event Title</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Input
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Maximum Participants</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newEvent.maxParticipants}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        maxParticipants: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Meal Conflicts</Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {newEvent.mealTimings.map((meal) => (
                        <div
                          key={meal}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}
                          <button
                            onClick={() => handleRemoveMealTiming(meal)}
                            className="hover:text-destructive"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Select value="none" onValueChange={handleAddMealTiming}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add meal conflicts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          Add meal conflict...
                        </SelectItem>
                        {!newEvent.mealTimings.includes("breakfast") && (
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                        )}
                        {!newEvent.mealTimings.includes("lunch") && (
                          <SelectItem value="lunch">Lunch</SelectItem>
                        )}
                        {!newEvent.mealTimings.includes("dinner") && (
                          <SelectItem value="dinner">Dinner</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsNewEventOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  disabled={
                    !newEvent.title ||
                    !newEvent.date ||
                    !newEvent.time ||
                    !newEvent.location ||
                    !newEvent.maxParticipants
                  }
                >
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {events.filter((event) => event.status === "upcoming").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-500" />
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {events.reduce(
                (acc, event) => acc + event.currentParticipants,
                0,
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Meal Conflicts</TableHead>
                <TableHead>Status</TableHead>
                {canCreateEvents && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    {event.currentParticipants} / {event.maxParticipants}
                  </TableCell>
                  <TableCell>
                    {event.mealTimings?.map((meal, index) => (
                      <span
                        key={meal}
                        className="inline-block px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 mr-1"
                      >
                        {meal.charAt(0).toUpperCase() + meal.slice(1)}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        event.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : event.status === "ongoing"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </span>
                  </TableCell>
                  {canCreateEvents && (
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPanel;
