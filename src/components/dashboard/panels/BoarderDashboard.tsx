import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  Clock,
  Home,
  Bell,
  UtensilsCrossed,
  Activity,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { LeaveRequestCard } from "./BoarderDashboard/LeaveRequestCard";
import { MentorGroupCard } from "./BoarderDashboard/MentorGroupCard";

interface BoarderDashboardProps {
  boarder?: {
    name: string;
    room: string;
    house: string;
  };
  isParentView?: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  registered: boolean;
  mealTimings?: string[];
  packedMeals?: string[];
}

const BoarderDashboard = ({
  boarder = {
    name: "John Student",
    room: "Room 101",
    house: "East Wing",
  },
  isParentView = false,
}: BoarderDashboardProps) => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Weekend Sports Tournament",
      date: "2024-03-25",
      time: "14:00",
      location: "Sports Field",
      registered: false,
      mealTimings: ["lunch", "dinner"],
      packedMeals: [],
    },
  ]);

  const [wellbeingScore, setWellbeingScore] = useState(85);
  const [attendanceRate, setAttendanceRate] = useState(95);
  const [disciplinaryPoints, setDisciplinaryPoints] = useState(2);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Event",
      message: "Weekend Sports Tournament registration is open",
      time: "5 minutes ago",
      type: "event",
    },
    {
      id: "2",
      title: "Wellbeing Check",
      message: "Please complete your daily wellbeing survey",
      time: "1 hour ago",
      type: "wellbeing",
    },
  ]);

  const handleEventRegistration = (
    eventId: string,
    withPackedMeals: boolean = false,
  ) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            registered: true,
            packedMeals: withPackedMeals ? event.mealTimings || [] : [],
          };
        }
        return event;
      }),
    );
  };

  const handleEventCancellation = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            registered: false,
            packedMeals: [],
          };
        }
        return event;
      }),
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {boarder.name}</h1>
          <p className="text-muted-foreground">
            {boarder.house} - {boarder.room}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pink-500" />
              Wellbeing Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{wellbeingScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Disciplinary Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{disciplinaryPoints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-purple-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeaveRequestCard />
        <MentorGroupCard />
      </div>
    </div>
  );
};

export default BoarderDashboard;
