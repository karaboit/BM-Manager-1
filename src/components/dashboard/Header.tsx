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
import {
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  UserCog,
} from "lucide-react";
import { useDashboardStore } from "@/lib/store";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";

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
  userName,
  userEmail,
  userAvatar,
  notifications = [],

  onLogout = () => {},
  onSettingsClick = () => {},
}: HeaderProps) => {
  return (
    <header className="w-full h-16 px-4 md:px-6 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex-1" />

      <div className="flex items-center gap-2 md:gap-4">
        <KeyboardShortcuts />

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
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{userName}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
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
            <DropdownMenuLabel>Switch User</DropdownMenuLabel>
            {[
              {
                id: "1",
                name: "Admin User",
                email: "admin@example.com",
                role: "System Administrator",
                status: "Active",
              },
              {
                id: "2",
                name: "Director Smith",
                email: "director@example.com",
                role: "Director",
                status: "Active",
              },
              {
                id: "3",
                name: "Dr. Wilson",
                email: "medical@example.com",
                role: "Medical Staff",
                status: "Active",
              },
              {
                id: "4",
                name: "Chef Johnson",
                email: "kitchen@example.com",
                role: "Kitchen Staff",
                status: "Active",
              },
              {
                id: "5",
                name: "Mr. Brown",
                email: "housemaster@example.com",
                role: "House Master",
                status: "Active",
              },
              {
                id: "6",
                name: "John Student",
                email: "student@example.com",
                role: "Boarder",
                status: "Active",
              },
              {
                id: "7",
                name: "Mrs. Smith",
                email: "parent@example.com",
                role: "Boarder Parent",
                status: "Active",
              },
            ].map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => {
                  const store = useDashboardStore.getState();
                  store.setCurrentUser(user);

                  // Set available panels based on role
                  const rolePanels = {
                    "System Administrator": [
                      "dashboard",
                      "users",
                      "rooms",
                      "medical",
                      "kitchen",
                      "attendance",
                      "leave",
                      "discipline",
                      "wellbeing",
                      "events",
                      "config",
                      "audit",
                      "maintenance",
                      "messaging",
                    ],
                    Director: [
                      "dashboard",
                      "users",
                      "rooms",
                      "medical",
                      "kitchen",
                      "attendance",
                      "leave",
                      "discipline",
                      "wellbeing",
                      "events",
                      "maintenance",
                      "messaging",
                    ],
                    "Medical Staff": ["dashboard", "medical", "messaging"],
                    "Kitchen Staff": ["dashboard", "kitchen", "messaging"],
                    "House Master": [
                      "dashboard",
                      "rooms",
                      "attendance",
                      "leave",
                      "discipline",
                      "wellbeing",
                      "messaging",
                    ],
                    Boarder: [
                      "dashboard",
                      "medical",
                      "leave",
                      "wellbeing",
                      "messaging",
                    ],
                    "Boarder Parent": [
                      "dashboard",
                      "medical",
                      "leave",
                      "wellbeing",
                      "messaging",
                    ],
                  };

                  store.setAvailablePanels(rolePanels[user.role] || []);
                }}
              >
                <UserCog className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
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
