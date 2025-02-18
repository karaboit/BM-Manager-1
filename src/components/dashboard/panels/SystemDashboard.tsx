import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Home,
  Settings,
  AlertTriangle,
  Activity,
  Shield,
  FileText,
  Bell,
} from "lucide-react";

const SystemDashboard = () => {
  const systemStats = {
    totalUsers: 250,
    activeUsers: 235,
    totalBoarders: 150,
    occupancyRate: 95,
    pendingApprovals: 5,
    systemAlerts: 2,
    maintenanceRequests: 3,
    announcements: 4,
  };

  const recentActivities = [
    {
      id: "1",
      type: "user",
      action: "New user registration",
      time: "5 minutes ago",
    },
    {
      id: "2",
      type: "system",
      action: "System backup completed",
      time: "1 hour ago",
    },
    {
      id: "3",
      type: "security",
      action: "Failed login attempt",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-sm text-muted-foreground">
              {systemStats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-5 w-5 text-green-500" />
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {systemStats.occupancyRate}%
            </div>
            <p className="text-sm text-muted-foreground">
              {systemStats.totalBoarders} boarders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{systemStats.systemAlerts}</div>
            <p className="text-sm text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-purple-500" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {systemStats.pendingApprovals}
            </div>
            <p className="text-sm text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                Manage Users
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Settings className="h-6 w-6" />
                System Settings
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Shield className="h-6 w-6" />
                Security
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Bell className="h-6 w-6" />
                Announcements
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "user"
                          ? "bg-blue-100"
                          : activity.type === "system"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {activity.type === "user" ? (
                        <Users className="h-4 w-4 text-blue-500" />
                      ) : activity.type === "system" ? (
                        <Settings className="h-4 w-4 text-green-500" />
                      ) : (
                        <Shield className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
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

export default SystemDashboard;
