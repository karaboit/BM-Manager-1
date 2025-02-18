import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { useDashboardStore } from "@/lib/store";

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notifications?: Array<{
    id: string;
    message: string;
    time: string;
  }>;
  onLogout?: () => void;
  onSettingsClick?: () => void;
}

const Header = ({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  notifications = [
    {
      id: "1",
      message: "System update scheduled",
      time: "5 minutes ago",
    },
    {
      id: "2",
      message: "New user registered",
      time: "1 hour ago",
    },
  ],
  onLogout = () => {},
  onSettingsClick = () => {},
}: HeaderProps) => {
  return (
    <header className="w-full h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex-1" />

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start py-2"
              >
                <span className="text-sm">{notification.message}</span>
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{userName}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "1",
                    name: "Admin",
                    email: "admin@example.com",
                    role: "System Administrator",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to System Administrator
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "2",
                    name: "Director",
                    email: "director@example.com",
                    role: "Director",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to Director
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "3",
                    name: "House Master",
                    email: "housemaster@example.com",
                    role: "House Master",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to House Master
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "4",
                    name: "Deputy Master",
                    email: "deputy@example.com",
                    role: "Deputy House Master",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to Deputy House Master
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "5",
                    name: "Support",
                    email: "support@example.com",
                    role: "Support Staff",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to Support Staff
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "6",
                    name: "Prefect",
                    email: "prefect@example.com",
                    role: "Prefect",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to Prefect
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "7",
                    name: "Medical Staff",
                    email: "medical@example.com",
                    role: "Medical Staff",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to Medical Staff
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "8",
                    name: "Kitchen Staff",
                    email: "kitchen@example.com",
                    role: "Kitchen Staff",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to Kitchen Staff
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "9",
                    name: "Parent",
                    email: "parent@example.com",
                    role: "Boarder Parent",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to Boarder Parent
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  const user: User = {
                    id: "10",
                    name: "Student",
                    email: "student@example.com",
                    role: "Boarder",
                    status: "Active",
                  };
                  useDashboardStore.getState().setCurrentUser(user);
                }}
              >
                Switch to Boarder
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex flex-col">
              <span>{userName}</span>
              <span className="text-xs text-gray-500">{userEmail}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
