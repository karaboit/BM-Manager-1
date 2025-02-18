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
import { Leave } from "@/types";

interface LeavePanelProps {
  leaveRequests?: Leave[];
}

const defaultLeaveRequests: Leave[] = [
  {
    id: "1",
    boarderId: "B001",
    startDate: "2024-03-22",
    endDate: "2024-03-24",
    reason: "Family event",
    type: "Family",
    status: "Pending Parent",
  },
  {
    id: "2",
    boarderId: "B002",
    startDate: "2024-03-25",
    endDate: "2024-03-26",
    reason: "Medical appointment",
    type: "Medical",
    status: "Approved",
  },
  {
    id: "3",
    boarderId: "B003",
    startDate: "2024-03-27",
    endDate: "2024-03-28",
    reason: "Personal matter",
    type: "Personal",
    status: "Pending House Master",
  },
];

const LeavePanel = () => {
  const { currentUser, selectedChildId } = useDashboardStore();
  const [requests, setRequests] = useState(defaultLeaveRequests);

  const handleApprove = (leaveId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === leaveId) {
          if (currentUser?.role === "Boarder Parent") {
            return {
              ...request,
              status: "Pending House Master",
              approvedByParent: true,
              parentApprovalDate: new Date().toISOString(),
            };
          } else if (currentUser?.role === "House Master") {
            return {
              ...request,
              status: "Approved",
              approvedByHouseMaster: true,
              houseMasterApprovalDate: new Date().toISOString(),
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
        request.id === leaveId ? { ...request, status: "Rejected" } : request,
      ),
    );
  };

  const filteredRequests =
    currentUser?.role === "Boarder Parent" && selectedChildId
      ? requests.filter((request) => request.boarderId === selectedChildId)
      : requests;
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          {currentUser?.role === "Boarder Parent" && (
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
        <Button>
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
                  request.status.startsWith("Pending"),
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
                  (request) => request.status === "Approved",
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
                  (request) => request.status === "Rejected",
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
                  <TableCell>{request.boarderId}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        request.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {((currentUser?.role === "Boarder Parent" &&
                      request.status === "Pending Parent") ||
                      (currentUser?.role === "House Master" &&
                        request.status === "Pending House Master")) && (
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
    </div>
  );
};

export default LeavePanel;
