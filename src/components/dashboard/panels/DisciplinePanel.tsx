import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { DisciplinaryRecord } from "@/types";
import { useDashboardStore } from "@/lib/store";

const DISCIPLINARY_ISSUES = {
  Minor: [
    "Late return from outing",
    "Dress code violation",
    "Noise violation",
    "Room untidiness",
    "Missing study hall",
    "Using phone during study hours",
    "Late to class",
    "Improper uniform",
  ],
  Major: [
    "Bullying",
    "Fighting",
    "Property damage",
    "Substance possession",
    "Unauthorized absence",
    "Repeated minor violations",
    "Academic dishonesty",
    "Theft",
  ],
};

const CORRECTIVE_MEASURES = {
  Minor: [
    "Verbal warning",
    "Written warning",
    "Extra study hours",
    "Early bedtime",
    "Weekend detention",
    "Loss of privileges",
    "Community service",
  ],
  Major: [
    "Parent conference",
    "Behavioral contract",
    "Suspension from activities",
    "In-house suspension",
    "Disciplinary probation",
    "Referral to counseling",
    "Board review",
  ],
};

const defaultRecords: DisciplinaryRecord[] = [
  {
    id: "1",
    boarderId: "B001",
    date: "2024-03-21",
    offense: "Late return from outing",
    category: "Minor",
    punishment: "Extra study hour",
    status: "Pending",
    reportedBy: "John Smith",
  },
  {
    id: "2",
    boarderId: "B002",
    date: "2024-03-20",
    offense: "Unauthorized absence",
    category: "Major",
    punishment: "Weekend detention",
    status: "Approved",
    reportedBy: "Jane Doe",
    approvedBy: "House Master",
  },
];

const DisciplinePanel = () => {
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const { currentUser } = useDashboardStore();
  const [newRecord, setNewRecord] = useState<{
    boarderId: string;
    category: "Minor" | "Major";
    offense: string;
    punishment: string;
    notes?: string;
  }>({ boarderId: "", category: "Minor", offense: "", punishment: "" });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Discipline Management</h1>
        <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Disciplinary Record</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Boarder</Label>
                <Select
                  value={newRecord.boarderId}
                  onValueChange={(value) =>
                    setNewRecord((prev) => ({ ...prev, boarderId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select boarder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B001">John Smith (Room 101)</SelectItem>
                    <SelectItem value="B002">Jane Doe (Room 102)</SelectItem>
                    <SelectItem value="B003">Bob Wilson (Room 103)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={newRecord.category}
                  onValueChange={(value: "Minor" | "Major") =>
                    setNewRecord((prev) => ({
                      ...prev,
                      category: value,
                      offense: "",
                      punishment: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Issue</Label>
                <Select
                  value={newRecord.offense}
                  onValueChange={(value) =>
                    setNewRecord((prev) => ({ ...prev, offense: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISCIPLINARY_ISSUES[newRecord.category].map((issue) => (
                      <SelectItem key={issue} value={issue}>
                        {issue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Corrective Measure</Label>
                <Select
                  value={newRecord.punishment}
                  onValueChange={(value) =>
                    setNewRecord((prev) => ({ ...prev, punishment: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select measure" />
                  </SelectTrigger>
                  <SelectContent>
                    {CORRECTIVE_MEASURES[newRecord.category].map((measure) => (
                      <SelectItem key={measure} value={measure}>
                        {measure}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Any additional details or context..."
                  value={newRecord.notes}
                  onChange={(e) =>
                    setNewRecord((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsNewRecordOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Add the record to the list
                  const record = {
                    id: (defaultRecords.length + 1).toString(),
                    boarderId: newRecord.boarderId,
                    date: new Date().toISOString().split("T")[0],
                    offense: newRecord.offense,
                    category: newRecord.category,
                    punishment: newRecord.punishment,
                    status: "Pending",
                    reportedBy: currentUser?.name || "Unknown",
                  };
                  defaultRecords.push(record);

                  // Close dialog and show toast
                  setIsNewRecordOpen(false);
                  alert("Disciplinary record created successfully");
                }}
                disabled={
                  !newRecord.boarderId ||
                  !newRecord.offense ||
                  !newRecord.punishment
                }
              >
                Create Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                defaultRecords.filter((record) => record.status === "Pending")
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-blue-500" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                defaultRecords.filter((record) => record.status === "Approved")
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                defaultRecords.filter((record) => record.status === "Completed")
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disciplinary Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Boarder ID</TableHead>
                <TableHead>Offense</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Punishment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {defaultRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.boarderId}</TableCell>
                  <TableCell>{record.offense}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        record.category === "Major"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.category}
                    </span>
                  </TableCell>
                  <TableCell>{record.punishment || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        record.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : record.status === "Approved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>{record.reportedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisciplinePanel;
