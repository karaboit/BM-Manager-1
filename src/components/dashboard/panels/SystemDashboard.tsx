import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Home,
  Activity,
  Settings,
  Bell,
  Shield,
  Database,
  Server,
  Cpu,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  UserCog,
  Building2,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/lib/hooks/useUsers";
import { useRooms } from "@/lib/hooks/useRooms";

const SystemDashboard = () => {
  const navigate = useNavigate();
  const { users } = useUsers();
  const { houses } = useRooms();

  const systemStats = [
    {
      title: "Total Users",
      value: users.length,
      change: "+2 this week",
      icon: Users,
      color: "text-blue-500",
      link: "/users",
    },
    {
      title: "Active Houses",
      value: houses.length,
      change: "All operational",
      icon: Building2,
      color: "text-green-500",
      link: "/houses",
    },
    {
      title: "System Health",
      value: "98%",
      change: "All systems normal",
      icon: Activity,
      color: "text-emerald-500",
      link: "/health",
    },
    {
      title: "Active Sessions",
      value: "24",
      change: "12 staff, 12 students",
      icon: UserCog,
      color: "text-violet-500",
      link: "/sessions",
    },
  ];

  const moduleStatus = [
    {
      name: "User Management",
      status: "Operational",
      icon: Users,
      color: "text-green-500",
      lastIncident: "No recent incidents",
    },
    {
      name: "Room Management",
      status: "Operational",
      icon: LayoutGrid,
      color: "text-green-500",
      lastIncident: "No recent incidents",
    },
    {
      name: "Attendance System",
      status: "Operational",
      icon: CheckCircle2,
      color: "text-green-500",
      lastIncident: "No recent incidents",
    },
    {
      name: "Leave Management",
      status: "Warning",
      icon: FileText,
      color: "text-yellow-500",
      lastIncident: "High request volume",
    },
  ];

  const recentActivities = [
    {
      type: "security",
      message: "New user account created",
      time: "5 minutes ago",
      icon: Shield,
      user: "Admin",
    },
    {
      type: "system",
      message: "System backup completed",
      time: "1 hour ago",
      icon: Database,
      user: "System",
    },
    {
      type: "alert",
      message: "High server load detected",
      time: "2 hours ago",
      icon: AlertTriangle,
      user: "System",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Overview</h1>
        <Button onClick={() => navigate("/config")}>
          <Settings className="mr-2 h-4 w-4" />
          System Settings
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat, index) => (
          <Card
            key={index}
            className="hover:bg-accent/50 cursor-pointer transition-colors"
            onClick={() => stat.link && navigate(stat.link)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Module Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleStatus.map((module, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-accent/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full bg-background ${module.color}`}
                    >
                      <module.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{module.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {module.lastIncident}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded-full bg-background
                    ${module.status === "Operational" ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {module.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent/50"
                  >
                    <div
                      className={`p-2 rounded-full
                      ${
                        activity.type === "security"
                          ? "bg-blue-100 text-blue-800"
                          : activity.type === "system"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </div>
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
