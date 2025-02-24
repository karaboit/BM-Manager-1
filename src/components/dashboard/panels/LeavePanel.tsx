import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, CalendarDays, Clock } from "lucide-react";
import { CreateLeaveDialog } from "./LeavePanel/CreateLeaveDialog";
import { Leave } from "@/types";

interface LeavePanelProps {
  leaveRequests?: Leave[];
}

const defaultLeaveRequests: Leave[] = [
  {
    id: "1",
    boarder_id: "B001",
    type: "weekend",
    start_date: "2024-03-15",
    end_date: "2024-03-17",
    reason: "Family gathering",
    status: "pending_parent",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    boarder_id: "B002",
    type: "medical",
    start_date: "2024-03-20",
    end_date: "2024-03-22",
    reason: "Dental appointment",
    status: "approved",
    parent_approval_date: new Date().toISOString(),
    house_master_approval_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const LeavePanel = () => {
  const { currentUser, selectedChildId } = useDashboardStore();
  const [requests, setRequests] = useState(defaultLeaveRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleApprove = (leaveId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === leaveId) {
          if (currentUser?.role === "parent") {
            return {
              ...request,
              status: "pending_house_master",
              parent_approval_date: new Date().toISOString(),
            };
          } else if (currentUser?.role === "house_master") {
            return {
              ...request,
              status: "approved",
              house_master_approval_date: new Date().toISOString(),
            };
          }
        }
        return request;
      }),
    );
  };

  const handleReject = (leaveId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === leaveId ? { ...request, status: "rejected" } : request,
      ),
    );
  };

  const filteredRequests =
    currentUser?.role === "parent" && selectedChildId
      ? requests.filter((request) => request.boarder_id === selectedChildId)
      : requests;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          {currentUser?.role === "parent" && (
            <p className="text-muted-foreground">
              {selectedChildId === "B001"
                ? "John Smith"
                : selectedChildId === "B002"
                  ? "Jane Smith"
                  : selectedChildId === "B003"
                    ? "Bob Smith"
                    : "Select a child"}
            </p>
          )}
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Leave Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                filteredRequests.filter((request) =>
                  request.status.startsWith("pending"),
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-green-500" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                filteredRequests.filter(
                  (request) => request.status === "approved",
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-red-500" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                filteredRequests.filter(
                  (request) => request.status === "rejected",
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Boarder ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.boarder_id}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.start_date}</TableCell>
                  <TableCell>{request.end_date}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </TableCell>
                  <TableCell>
                    {((currentUser?.role === "parent" &&
                      request.status === "pending_parent") ||
                      (currentUser?.role === "house_master" &&
                        request.status === "pending_house_master")) && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-100 hover:bg-green-200"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-100 hover:bg-red-200"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateLeaveDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (data) => {
          const newRequest = {
            id: crypto.randomUUID(),
            boarder_id: selectedChildId || currentUser?.id,
            type: data.type,
            start_date: data.startDate,
            end_date: data.endDate,
            reason: data.reason,
            status:
              currentUser?.role === "boarder"
                ? "pending_parent"
                : "pending_house_master",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setRequests((prev) => [...prev, newRequest]);
        }}
      />
    </div>
  );
};

export default LeavePanel;
