import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCog } from "lucide-react";
import { useDashboardStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRoleDisplayName } from "@/lib/utils/roles";
import { useUsers } from "@/lib/hooks/useUsers";

export function UserSwitcher() {
  const { users } = useUsers();
  const { setCurrentUser } = useDashboardStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <UserCog className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="user-switcher-description">
        <DialogHeader>
          <DialogTitle>Switch User Role</DialogTitle>
          <p
            id="user-switcher-description"
            className="text-sm text-muted-foreground"
          >
            Select a user to switch roles for testing purposes.
          </p>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => {
                  setCurrentUser({
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                    role: user.role?.role_key || user.role,
                    status: user.status,
                  });
                }}
              >
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  />
                  <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {getRoleDisplayName(user.role?.role_key || "")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
