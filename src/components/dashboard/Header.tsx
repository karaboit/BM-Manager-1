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
                <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
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
