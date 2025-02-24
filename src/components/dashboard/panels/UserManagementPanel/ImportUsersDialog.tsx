import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCreate } from "@/types/user";

interface ImportUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (users: UserCreate[]) => Promise<void>;
}

export function ImportUsersDialog({
  isOpen,
  onClose,
  onImport,
}: ImportUsersDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        setError("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
      setError(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsSubmitting(true);
      setError(undefined);

      const text = await file.text();
      const rows = text.split("\n").filter((row) => row.trim());
      const headers = rows[0].split(",");

      // Validate headers
      const requiredHeaders = ["email", "full_name", "role_key"];
      const optionalHeaders = ["phone", "emergency_contact", "status"];
      const allHeaders = [...requiredHeaders, ...optionalHeaders];
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header),
      );

      if (missingHeaders.length > 0) {
        throw new Error(
          `Missing required columns: ${missingHeaders.join(", ")}`,
        );
      }

      // Parse users
      const users: UserCreate[] = rows.slice(1).map((row) => {
        const values = row.split(",");
        const user: Record<string, string> = {};
        headers.forEach((header, index) => {
          user[header.trim()] = values[index]?.trim() || "";
        });
        return user as UserCreate;
      });

      await onImport(users);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import users");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">CSV File</Label>
            <Input
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with the following columns:
              <br />
              Required: email, full_name, role_key
              <br />
              Optional: phone, emergency_contact, status
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!file || isSubmitting}>
              {isSubmitting ? "Importing..." : "Import Users"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
