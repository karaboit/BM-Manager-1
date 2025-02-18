import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { validateBoarderImport } from "@/lib/validators/boarder";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BoarderImportProps {
  houses: Array<{ id: string; name: string }>;
  onImport: (houseId: string, boarders: any[]) => void;
}

export default function BoarderImport({
  houses,
  onImport,
}: BoarderImportProps) {
  const [selectedHouse, setSelectedHouse] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setErrors([]);
      const text = await file.text();
      const rows = text.split("\n");
      const headers = rows[0].split(",").map((h) => h.trim());

      const requiredHeaders = [
        "student_id",
        "first_name",
        "last_name",
        "grade",
        "date_of_birth",
        "gender",
        "parent1_name",
        "parent1_relation",
        "parent1_email",
        "parent1_phone",
        "emergency_contact_name",
        "emergency_contact_relation",
        "emergency_contact_phone",
      ];

      const missingHeaders = requiredHeaders.filter(
        (h) => !headers.includes(h),
      );
      if (missingHeaders.length > 0) {
        setErrors([`Missing required columns: ${missingHeaders.join(", ")}`]);
        return;
      }

      const boarders = [];
      const validationErrors = [];

      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue;

        const values = rows[i].split(",");
        const boarder = headers.reduce(
          (acc, header, index) => {
            acc[header.trim()] = values[index]?.trim() || "";
            return acc;
          },
          {} as Record<string, string>,
        );

        const validation = validateBoarderImport(boarder);
        if (!validation.success && validation.errors) {
          validationErrors.push(
            `Row ${i + 1}: ${validation.errors.join(", ")}`,
          );
        } else {
          boarders.push(boarder);
        }
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setPreview([]);
      } else {
        setPreview(boarders);
        setErrors([]);
      }
    }
  };

  const handleImport = () => {
    if (selectedHouse && preview.length > 0) {
      onImport(selectedHouse, preview);
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Import Boarder List</DialogTitle>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label>Select House</Label>
          <Select value={selectedHouse} onValueChange={setSelectedHouse}>
            <SelectTrigger>
              <SelectValue placeholder="Select a house" />
            </SelectTrigger>
            <SelectContent>
              {houses.map((house) => (
                <SelectItem key={house.id} value={house.id}>
                  {house.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Upload File</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-2 text-center">
                <span className="text-sm text-muted-foreground">
                  Click to upload CSV file
                </span>
                <a
                  href="data:text/csv;charset=utf-8,student_id,first_name,last_name,grade,date_of_birth,gender,email,medical_conditions,dietary_requirements,parent1_name,parent1_relation,parent1_email,parent1_phone,parent2_name,parent2_relation,parent2_email,parent2_phone,emergency_contact_name,emergency_contact_relation,emergency_contact_phone"
                  download="boarder_import_template.csv"
                  className="text-xs text-primary hover:underline block"
                >
                  Download Template
                </a>
              </div>
            </label>
          </div>
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {preview.length > 0 && (
          <div className="grid gap-2">
            <Label>Preview ({preview.length} boarders)</Label>
            <ScrollArea className="h-[200px] border rounded-lg p-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">ID</th>
                    <th className="text-left">Name</th>
                    <th className="text-left">Grade</th>
                    <th className="text-left">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((boarder, index) => (
                    <tr key={index}>
                      <td>{boarder.student_id}</td>
                      <td>{`${boarder.first_name} ${boarder.last_name}`}</td>
                      <td>{boarder.grade}</td>
                      <td>{boarder.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedHouse || preview.length === 0}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import {preview.length} Boarders
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
