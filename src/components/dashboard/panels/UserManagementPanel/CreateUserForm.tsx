import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types/user";
import { getRoleDisplayName } from "@/lib/utils/roles";

interface CreateUserFormProps {
  onSubmit: (data: {
    full_name: string;
    email: string;
    role_key: UserRole;
    password?: string;
    phone?: string;
    address?: string;
    emergency_contact?: string;
    date_of_birth?: string;
    gender?: string;
    status?: string;
  }) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<{
    full_name: string;
    email: string;
    role_key: UserRole;
    phone: string;
    address: string;
    emergency_contact: string;
    date_of_birth: string;
    gender: string;
    status: string;
  }>;
  mode?: "create" | "edit";
}

const AVAILABLE_ROLES: UserRole[] = [
  "system_admin",
  "director",
  "house_master",
  "deputy_master",
  "medical",
  "kitchen",
  "parent",
  "boarder",
  "support_staff",
];

export function CreateUserForm({
  onSubmit,
  onCancel,
  initialData,
  mode = "create",
}: CreateUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const role = formData.get("role") as UserRole;
      const password = formData.get("password") as string;

      // Validate required fields
      if (!name?.trim() || !email?.trim() || !role) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password if provided
      if (password && password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      await onSubmit({
        full_name: name.trim(),
        email: email.trim(),
        role_key: role,
        password: password || undefined,
        phone: (formData.get("phone") as string)?.trim(),
        address: (formData.get("address") as string)?.trim(),
        emergency_contact: (
          formData.get("emergency_contact") as string
        )?.trim(),
        date_of_birth: (formData.get("date_of_birth") as string)?.trim(),
        gender: (formData.get("gender") as string)?.trim(),
        status: (formData.get("status") as string) || "active",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter full name"
            required
            minLength={2}
            maxLength={100}
            defaultValue={initialData?.full_name}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            required
            defaultValue={initialData?.email}
            disabled={mode === "edit"}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select name="role" required defaultValue={initialData?.role_key}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {getRoleDisplayName(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mode === "create" && (
          <div className="col-span-2 space-y-2">
            <Label htmlFor="password">
              Password <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              If not provided, a temporary password will be generated
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            defaultValue={initialData?.phone}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            defaultValue={initialData?.date_of_birth}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select name="gender" defaultValue={initialData?.gender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={initialData?.status || "active"}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            placeholder="Enter address"
            defaultValue={initialData?.address}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="emergency_contact">Emergency Contact</Label>
          <Input
            id="emergency_contact"
            name="emergency_contact"
            placeholder="Name - Relationship - Phone"
            defaultValue={initialData?.emergency_contact}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
              ? "Create User"
              : "Update User"}
        </Button>
      </div>
    </form>
  );
}
