import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Plus, FileText, Wrench, ClipboardCheck, Upload } from "lucide-react";
import { MaintenanceRequest, Quotation } from "@/types";
import { useDashboardStore } from "@/lib/store";

interface MaintenancePanelProps {
  requests?: MaintenanceRequest[];
  quotations?: Record<string, Quotation[]>;
}

const defaultRequests: MaintenanceRequest[] = [
  {
    request_id: "1",
    title: "Broken Window",
    description: "Window in Room 101 needs repair",
    status: "Reported",
    created_by: "John Doe",
    created_at: "2024-03-21T10:00:00Z",
    updated_at: "2024-03-21T10:00:00Z",
    house_id: "east_wing",
  },
  {
    request_id: "2",
    title: "Leaking Faucet",
    description: "Bathroom faucet in Room 203 is leaking",
    status: "Quoting",
    created_by: "Jane Smith",
    created_at: "2024-03-20T14:30:00Z",
    updated_at: "2024-03-20T15:00:00Z",
    house_id: "west_wing",
  },
];

const defaultQuotations: Record<string, Quotation[]> = {
  "2": [
    {
      quotation_id: "q1",
      request_id: "2",
      vendor_name: "Plumbing Co",
      cost_estimate: 150,
      proposed_timeline: "2 days",
      status: "Submitted",
      created_at: "2024-03-20T16:00:00Z",
      updated_at: "2024-03-20T16:00:00Z",
    },
  ],
};

const MaintenancePanel = ({
  requests = defaultRequests,
  quotations = defaultQuotations,
}: MaintenancePanelProps) => {
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const { currentUser } = useDashboardStore();

  const canApproveQuotes = [
    "Director",
    "House Master",
    "Deputy House Master",
  ].includes(currentUser?.role || "");

  const handleRequestQuotes = (request: MaintenanceRequest) => {
    // In a real app, this would send requests to vendors
    console.log("Requesting quotes for:", request);
  };

  const handleApproveQuote = (
    request: MaintenanceRequest,
    quote: Quotation,
  ) => {
    // In a real app, this would approve the quote and update the request status
    console.log("Approving quote:", quote, "for request:", request);
  };

  const handleMarkComplete = (request: MaintenanceRequest) => {
    // In a real app, this would mark the request as complete
    console.log("Marking request as complete:", request);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <Dialog
          open={isNewRequestDialogOpen}
          onOpenChange={setIsNewRequestDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Maintenance Request</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the maintenance issue"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photos">Photos (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsNewRequestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsNewRequestDialogOpen(false)}>
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-yellow-500" />
              New Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {requests.filter((r) => r.status === "Reported").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5 text-blue-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                requests.filter((r) =>
                  [
                    "Quoting",
                    "Quotes Available",
                    "Approved",
                    "In Progress",
                  ].includes(r.status),
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                requests.filter((r) =>
                  ["Completed", "Closed"].includes(r.status),
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>House</TableHead>
                <TableHead>Quotes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.request_id}>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        request.status === "Completed" ||
                        request.status === "Closed"
                          ? "bg-green-100 text-green-800"
                          : request.status === "Reported"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>{request.created_by}</TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.house_id}</TableCell>
                  <TableCell>
                    {quotations[request.request_id]?.length || 0} quote(s)
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {request.status === "Reported" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestQuotes(request)}
                        >
                          Request Quotes
                        </Button>
                      )}
                      {request.status === "Quotes Available" &&
                        canApproveQuotes && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsQuoteDialogOpen(true);
                            }}
                          >
                            Review Quotes
                          </Button>
                        )}
                      {request.status === "In Progress" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkComplete(request)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
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

export default MaintenancePanel;
