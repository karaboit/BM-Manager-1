import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserManagementPanelProps {
  users?: User[];
  onCreateUser?: (user: Omit<User, "id">) => void;
  onUpdateUser?: (user: User) => void;
  onDeleteUser?: (id: string) => void;
}

const defaultUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Staff",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "Boarder",
    status: "Inactive",
  },
];

const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  users = defaultUsers,
  onCreateUser = (user) => {
    console.log("Creating user:", user);
    // Here you would typically make an API call to create the user
  },
  onUpdateUser = () => {},
  onDeleteUser = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
        <div className="flex justify-between items-center mt-4">
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
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    onValueChange={(value) => {
                      const roleInput = document.createElement("input");
                      roleInput.id = "role";
                      roleInput.value = value;
                      document.body.appendChild(roleInput);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="System Administrator">
                        System Administrator
                      </SelectItem>
                      <SelectItem value="Director">Director</SelectItem>
                      <SelectItem value="House Master">House Master</SelectItem>
                      <SelectItem value="Deputy House Master">
                        Deputy House Master
                      </SelectItem>
                      <SelectItem value="Support Staff">
                        Support Staff
                      </SelectItem>
                      <SelectItem value="Prefect">Prefect</SelectItem>
                      <SelectItem value="Medical Staff">
                        Medical Staff
                      </SelectItem>
                      <SelectItem value="Kitchen Staff">
                        Kitchen Staff
                      </SelectItem>
                      <SelectItem value="Boarder Parent">
                        Boarder Parent
                      </SelectItem>
                      <SelectItem value="Boarder">Boarder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => {
                      const statusInput = document.createElement("input");
                      statusInput.id = "status";
                      statusInput.value = value;
                      document.body.appendChild(statusInput);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter address" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Get form values
                    const name = (
                      document.getElementById("name") as HTMLInputElement
                    )?.value;
                    const email = (
                      document.getElementById("email") as HTMLInputElement
                    )?.value;
                    const roleSelect = document.getElementById(
                      "role",
                    ) as HTMLSelectElement;
                    const statusSelect = document.getElementById(
                      "status",
                    ) as HTMLSelectElement;
                    const role = roleSelect?.value;
                    const status = statusSelect?.value;
                    const phone = (
                      document.getElementById("phone") as HTMLInputElement
                    )?.value;
                    const address = (
                      document.getElementById("address") as HTMLTextAreaElement
                    )?.value;
                    const notes = (
                      document.getElementById("notes") as HTMLTextAreaElement
                    )?.value;

                    // Validate required fields and collect missing fields
                    const missingFields = [];
                    if (!name) missingFields.push("Full Name");
                    if (!email) missingFields.push("Email");
                    if (!role) missingFields.push("Role");
                    if (!status) missingFields.push("Status");

                    if (missingFields.length > 0) {
                      alert(
                        `Please fill in the following required fields:\n- ${missingFields.join("\n- ")}`,
                      );
                      return;
                    }

                    // Generate verification token
                    const verificationToken = Math.random()
                      .toString(36)
                      .substring(2, 15);

                    // Create new user with pending status
                    const newUser = {
                      id: (users.length + 1).toString(),
                      name,
                      email,
                      role,
                      status: "Pending Verification",
                      phone,
                      address,
                      notes,
                      verificationToken,
                    };

                    // Add user to list
                    users.push(newUser);

                    // Simulate sending verification email
                    console.log(
                      `Verification email sent to ${email} with token: ${verificationToken}`,
                    );
                    alert(
                      `A verification email has been sent to ${email}. The user must verify their email to set their password and activate their account.`,
                    );

                    // Close dialog and show confirmation
                    setIsCreateDialogOpen(false);
                    alert("User created successfully!");
                  }}
                >
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "Pending Verification"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input id="edit-name" defaultValue={user.name} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              defaultValue={user.email}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                              defaultValue={user.role}
                              onValueChange={(value) => {
                                const roleInput =
                                  document.createElement("input");
                                roleInput.id = "edit-role";
                                roleInput.value = value;
                                document.body.appendChild(roleInput);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="System Administrator">
                                  System Administrator
                                </SelectItem>
                                <SelectItem value="Director">
                                  Director
                                </SelectItem>
                                <SelectItem value="House Master">
                                  House Master
                                </SelectItem>
                                <SelectItem value="Deputy House Master">
                                  Deputy House Master
                                </SelectItem>
                                <SelectItem value="Support Staff">
                                  Support Staff
                                </SelectItem>
                                <SelectItem value="Prefect">Prefect</SelectItem>
                                <SelectItem value="Medical Staff">
                                  Medical Staff
                                </SelectItem>
                                <SelectItem value="Kitchen Staff">
                                  Kitchen Staff
                                </SelectItem>
                                <SelectItem value="Boarder Parent">
                                  Boarder Parent
                                </SelectItem>
                                <SelectItem value="Boarder">Boarder</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                              defaultValue={user.status}
                              onValueChange={(value) => {
                                const statusInput =
                                  document.createElement("input");
                                statusInput.id = "edit-status";
                                statusInput.value = value;
                                document.body.appendChild(statusInput);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-phone">Phone Number</Label>
                            <Input
                              id="edit-phone"
                              type="tel"
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-address">Address</Label>
                            <Textarea
                              id="edit-address"
                              placeholder="Enter address"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-notes">Additional Notes</Label>
                            <Textarea
                              id="edit-notes"
                              placeholder="Any additional information"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedUser(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              const name = (
                                document.getElementById(
                                  "edit-name",
                                ) as HTMLInputElement
                              )?.value;
                              const email = (
                                document.getElementById(
                                  "edit-email",
                                ) as HTMLInputElement
                              )?.value;
                              const role = (
                                document.getElementById(
                                  "edit-role",
                                ) as HTMLInputElement
                              )?.value;
                              const status = (
                                document.getElementById(
                                  "edit-status",
                                ) as HTMLInputElement
                              )?.value;
                              const phone = (
                                document.getElementById(
                                  "edit-phone",
                                ) as HTMLInputElement
                              )?.value;
                              const address = (
                                document.getElementById(
                                  "edit-address",
                                ) as HTMLTextAreaElement
                              )?.value;
                              const notes = (
                                document.getElementById(
                                  "edit-notes",
                                ) as HTMLTextAreaElement
                              )?.value;

                              if (!name || !email || !role || !status) {
                                alert("Please fill in all required fields");
                                return;
                              }

                              // Update user in the list
                              const updatedUser = {
                                ...user,
                                name,
                                email,
                                role,
                                status,
                              };
                              const userIndex = users.findIndex(
                                (u) => u.id === user.id,
                              );
                              if (userIndex !== -1) {
                                users[userIndex] = updatedUser;
                              }

                              setSelectedUser(null);
                              alert("User updated successfully!");
                            }}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this user? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagementPanel;
