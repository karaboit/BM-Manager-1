import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateMentorGroupDialog } from "./MentorPanel/CreateMentorGroupDialog";
import { useMentorGroups } from "@/lib/hooks/useMentorGroups";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUsers } from "@/lib/hooks/useUsers";
import { getRoleDisplayName } from "@/lib/utils/roles";
import { useDashboardStore } from "@/lib/store";

const UserManagementPanel = () => {
  const { toast } = useToast();
  const { users } = useUsers();
  const { currentUser } = useDashboardStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMentorGroupDialogOpen, setIsMentorGroupDialogOpen] = useState(false);
  const { createGroup } = useMentorGroups();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          {currentUser?.role?.role_key === "system_administrator" && (
            <Button
              variant="outline"
              onClick={() => setIsMentorGroupDialogOpen(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Create Mentor Group
            </Button>
          )}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <CreateMentorGroupDialog
        isOpen={isMentorGroupDialogOpen}
        onClose={() => setIsMentorGroupDialogOpen(false)}
        availableLeaders={users
          .filter(
            (u) =>
              u.role?.role_key === "house_master" ||
              u.role?.role_key === "deputy_master",
          )
          .map((u) => ({
            id: u.id,
            name: u.full_name,
            role: getRoleDisplayName(u.role?.role_key || ""),
          }))}
        availableBoarders={users
          .filter((u) => u.role?.role_key === "boarder")
          .map((u) => ({
            id: u.id,
            name: u.full_name,
          }))}
        onSubmit={async (data) => {
          try {
            await createGroup(data);
            toast({
              title: "Success",
              description: "Mentor group created successfully",
            });
            setIsMentorGroupDialogOpen(false);
          } catch (err) {
            toast({
              title: "Error",
              description:
                err instanceof Error
                  ? err.message
                  : "Failed to create mentor group",
              variant: "destructive",
            });
          }
        }}
      />
    </Card>
  );
};

export default UserManagementPanel;
