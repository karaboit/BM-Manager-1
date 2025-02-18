import React from "react";
import { useDashboardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Settings,
  ClipboardList,
  Wrench,
  Bell,
  LogOut,
  Activity,
  LayoutGrid,
  UtensilsCrossed,
  CheckSquare,
  CalendarDays,
  Shield,
  Heart,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  userName?: string;
  userRole?: string;
}

const Sidebar = ({
  activePage = "dashboard",
  onNavigate = () => {},
  userName = "Admin User",
  userRole = "System Administrator",
}: SidebarProps) => {
  const { availablePanels } = useDashboardStore();

  const allNavigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "users", label: "User Management", icon: Users },
    { id: "rooms", label: "Room Management", icon: LayoutGrid },
    { id: "medical", label: "Medical", icon: Activity },
    { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
    { id: "attendance", label: "Attendance", icon: CheckSquare },
    { id: "leave", label: "Leave Management", icon: CalendarDays },
    { id: "discipline", label: "Discipline", icon: Shield },
    { id: "wellbeing", label: "Wellbeing", icon: Heart },
    { id: "config", label: "System Config", icon: Settings },
    { id: "audit", label: "Audit Logs", icon: ClipboardList },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "announcements", label: "Announcements", icon: Bell },
  ];

  return (
    <div className="flex flex-col h-full w-[280px] bg-background border-r p-4">
      <div className="flex flex-col items-center mb-8 pt-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="User Avatar"
            className="w-12 h-12"
          />
        </div>
        <h3 className="font-semibold text-lg">{userName}</h3>
        <p className="text-sm text-muted-foreground">{userRole}</p>
      </div>

      <nav className="flex-1 space-y-2">
        <TooltipProvider>
          {allNavigationItems
            .filter((item) => availablePanels.includes(item.id as any))
            .map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activePage === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        activePage === item.id
                          ? "bg-secondary"
                          : "hover:bg-secondary/50",
                      )}
                      onClick={() => onNavigate(item.id)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
        </TooltipProvider>
      </nav>

      <div className="mt-auto pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
