import React from "react";
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
import { Plus, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { DisciplinaryRecord } from "@/types";

interface DisciplinePanelProps {
  records?: DisciplinaryRecord[];
}

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

import { useDashboardStore } from "@/lib/store";

const canManageDiscipline = (role?: string) => {
  return ["House Master", "Deputy House Master", "Prefect"].includes(
    role || "",
  );
};

const DisciplinePanel = ({
  records = defaultRecords,
}: DisciplinePanelProps) => {
  const { currentUser } = useDashboardStore();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Discipline Management</h1>
        {canManageDiscipline(currentUser?.role) && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        )}
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
              {records.filter((record) => record.status === "Pending").length}
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
              {records.filter((record) => record.status === "Approved").length}
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
              {records.filter((record) => record.status === "Completed").length}
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
              {records.map((record) => (
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
