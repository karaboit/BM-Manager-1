import React from "react";
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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface BoarderDashboardProps {
  boarder?: {
    name: string;
    room: string;
    house: string;
  };
  schedule?: {
    time: string;
    activity: string;
  }[];
  announcements?: {
    id: string;
    title: string;
    message: string;
    date: string;
  }[];
  upcomingMeals?: {
    type: string;
    time: string;
    menu: string[];
  }[];
}

const BoarderDashboard = ({
  boarder = {
    name: "John Student",
    room: "Room 101",
    house: "East Wing",
  },
  schedule = [
    { time: "06:30", activity: "Wake-up Call" },
    { time: "07:00", activity: "Breakfast" },
    { time: "07:30", activity: "Room Inspection" },
    { time: "22:00", activity: "Lights Out" },
  ],
  announcements = [
    {
      id: "1",
      title: "Weekend Activities",
      message: "Sign up for weekend sports activities",
      date: "2024-03-22",
    },
  ],
  upcomingMeals = [
    {
      type: "Breakfast",
      time: "07:00 - 08:00",
      menu: ["Eggs & Toast", "Fresh Fruit", "Orange Juice"],
    },
    {
      type: "Lunch",
      time: "12:00 - 13:00",
      menu: ["Chicken Sandwich", "Garden Salad", "Apple"],
    },
  ],
}: BoarderDashboardProps) => {
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
        {/* Medication Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              Medication Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {[
                  {
                    time: "08:00",
                    medicine: "Allergy Medication",
                    taken: false,
                  },
                  { time: "13:00", medicine: "Vitamin C", taken: true },
                  {
                    time: "20:00",
                    medicine: "Allergy Medication",
                    taken: false,
                  },
                ].map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{med.medicine}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.time}
                      </p>
                    </div>
                    <Checkbox checked={med.taken} className="h-6 w-6" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <span className="font-medium">{item.time}</span>
                    <span className="text-muted-foreground">
                      {item.activity}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="border-b pb-4 last:border-0"
                  >
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {announcement.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {announcement.date}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Upcoming Meals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UtensilsCrossed className="mr-2 h-5 w-5" />
              Today's Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {upcomingMeals.map((meal, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{meal.type}</h3>
                      <span className="text-sm text-muted-foreground">
                        {meal.time}
                      </span>
                    </div>
                    <ul className="text-sm text-muted-foreground list-disc pl-4">
                      {meal.menu.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <CalendarDays className="h-6 w-6 mb-2" />
                Request Leave
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <Home className="h-6 w-6 mb-2" />
                View Room Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BoarderDashboard;
