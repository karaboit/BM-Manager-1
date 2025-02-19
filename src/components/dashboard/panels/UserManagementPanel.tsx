import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Search, Shield } from "lucide-react";
import { useUsers } from "@/lib/hooks/useUsers";
import { useRoles } from "@/lib/hooks/useRoles";
import { User, UserRole } from "@/types/user";
import { Role } from "@/types/role";
import { useHouses } from "@/lib/hooks/useHouses";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const UserManagementPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const {
    roles,
    permissions,
    loading: rolesLoading,
    error: rolesError,
    createRole,
    updateRole,
    deleteRole,
    assignPermission,
    removePermission,
  } = useRoles();
  const { houses } = useHouses();
  const { users, loading, error, updateUser, deleteUser, createUser } =
    useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole>();

  const filteredUsers =
    users?.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          User & Role Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();

                        const formData = new FormData(e.currentTarget);
                        const name = formData.get("name") as string;
                        const email = formData.get("email") as string;

                        if (
                          !name?.trim() ||
                          !email?.trim() ||
                          !selectedUserRole
                        ) {
                          alert("Please fill in all required fields");
                          return;
                        }

                        // Validate email format
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(email)) {
                          alert("Please enter a valid email address");
                          return;
                        }

                        try {
                          console.log("Submitting role:", selectedUserRole);
                          await createUser({
                            full_name: name.trim(),
                            email: email.trim(),
                            role: selectedUserRole,
                          });

                          setSelectedUserRole(undefined);
                          setIsCreateDialogOpen(false);
                          alert("User created successfully!");
                        } catch (error: any) {
                          console.error("Error creating user:", error);
                          alert(error?.message || "Error creating user");
                        }
                      }}
                      className="grid gap-4 py-4"
                    >
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={selectedUserRole}
                          onValueChange={(value) =>
                            setSelectedUserRole(value as UserRole)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSelectedUserRole(undefined);
                            setIsCreateDialogOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create User</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.house_id || ""}
                          onValueChange={async (value) => {
                            try {
                              await updateUser(user.id, {
                                house_id: value || null,
                              });
                            } catch (error) {
                              console.error("Error updating house:", error);
                              alert(
                                "Error updating house: " +
                                  (error as Error).message,
                              );
                            }
                          }}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select house" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No House</SelectItem>
                            {houses?.map((house) => (
                              <SelectItem key={house.id} value={house.id}>
                                {house.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this user?",
                                )
                              ) {
                                try {
                                  await deleteUser(user.id);
                                  alert("User deleted successfully!");
                                } catch (error) {
                                  alert(
                                    "Error deleting user: " +
                                      (error as Error).message,
                                  );
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Role Management</h2>
                <Dialog open={isNewRoleOpen} onOpenChange={setIsNewRoleOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          await createRole(newRole);
                          setNewRole({ name: "", description: "" });
                          setIsNewRoleOpen(false);
                          alert("Role created successfully!");
                        } catch (error: any) {
                          alert(error?.message || "Error creating role");
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input
                          id="name"
                          value={newRole.name}
                          onChange={(e) =>
                            setNewRole({ ...newRole, name: e.target.value })
                          }
                          placeholder="Enter role name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newRole.description}
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter role description"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsNewRoleOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create Role</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        {new Date(role.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Shield className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Manage Role Permissions
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Role Permissions</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {permissions.map((permission) => (
                                      <div
                                        key={permission.id}
                                        className="flex items-center space-x-2"
                                      >
                                        <input
                                          type="checkbox"
                                          id={permission.id}
                                          checked={role.role_permissions?.some(
                                            (rp) =>
                                              rp.permission_id ===
                                              permission.id,
                                          )}
                                          onChange={async (e) => {
                                            try {
                                              if (e.target.checked) {
                                                await assignPermission(
                                                  role.id,
                                                  permission.id,
                                                );
                                              } else {
                                                await removePermission(
                                                  role.id,
                                                  permission.id,
                                                );
                                              }
                                            } catch (error: any) {
                                              alert(
                                                error?.message ||
                                                  "Error updating permissions",
                                              );
                                            }
                                          }}
                                        />
                                        <Label
                                          htmlFor={permission.id}
                                          className="text-sm"
                                        >
                                          {permission.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRole(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this role?",
                                )
                              ) {
                                try {
                                  await deleteRole(role.id);
                                  alert("Role deleted successfully!");
                                } catch (error: any) {
                                  alert(
                                    error?.message || "Error deleting role",
                                  );
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserManagementPanel;
