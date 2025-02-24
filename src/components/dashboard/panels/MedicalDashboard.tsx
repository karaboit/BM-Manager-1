import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Users, Calendar, Clock, AlertTriangle } from "lucide-react";
import { useDashboardStore } from "@/lib/store";

const MedicalDashboard = () => {
  const { setActivePanel } = useDashboardStore();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medical Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">
              3 requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-500" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">2 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">
              Medication reminders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[
                  {
                    time: "10:30 AM",
                    action: "Medical checkup completed",
                    patient: "John Smith",
                    details: "Routine health assessment",
                  },
                  {
                    time: "9:15 AM",
                    action: "Medication administered",
                    patient: "Sarah Johnson",
                    details: "Daily prescription",
                  },
                  {
                    time: "8:45 AM",
                    action: "New appointment scheduled",
                    patient: "Mike Wilson",
                    details: "Follow-up consultation",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-2 rounded-lg hover:bg-accent"
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.patient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Clock className="inline-block mr-1 h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[
                  {
                    time: "11:00 AM",
                    patient: "Emma Brown",
                    type: "General Checkup",
                  },
                  {
                    time: "1:30 PM",
                    patient: "James Wilson",
                    type: "Follow-up",
                  },
                  {
                    time: "2:45 PM",
                    patient: "Lucy Smith",
                    type: "Vaccination",
                  },
                ].map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.time}
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

export default MedicalDashboard;
