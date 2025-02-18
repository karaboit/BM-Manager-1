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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between items-center border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} {event.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.location}
                      </p>
                      {event.mealTimings && event.mealTimings.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {event.mealTimings.map((meal) => (
                            <span
                              key={meal}
                              className={`px-2 py-0.5 rounded-full text-xs ${event.packedMeals?.includes(meal) ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                            >
                              {meal.charAt(0).toUpperCase() + meal.slice(1)}
                              {event.packedMeals?.includes(meal) && " (Packed)"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Button
                        variant={event.registered ? "destructive" : "default"}
                        size="sm"
                        onClick={() => {
                          if (event.registered) {
                            const confirmed = window.confirm(
                              "Are you sure you want to cancel your registration?",
                            );
                            if (confirmed) {
                              handleEventCancellation(event.id);
                            }
                          } else {
                            if (
                              event.mealTimings &&
                              event.mealTimings.length > 0
                            ) {
                              const confirmed = window.confirm(
                                `This event conflicts with ${event.mealTimings.join(", ")}. Would you like packed meals for these times?`,
                              );
                              handleEventRegistration(event.id, confirmed);
                            } else {
                              handleEventRegistration(event.id);
                            }
                          }
                        }}
                      >
                        {event.registered ? "Cancel" : "Sign Up"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0"
                  >
                    <div
                      className={`p-2 rounded-full ${notification.type === "event" ? "bg-blue-100" : notification.type === "wellbeing" ? "bg-green-100" : "bg-yellow-100"}`}
                    >
                      {notification.type === "event" ? (
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                      ) : notification.type === "wellbeing" ? (
                        <Heart className="h-4 w-4 text-green-500" />
                      ) : (
                        <Bell className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BoarderDashboard;
