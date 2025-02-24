import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CreateLeaveDialog } from "../LeavePanel/CreateLeaveDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardStore } from "@/lib/store";
import { Leave } from "@/types/leave";

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
];

export function LeaveRequestCard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [requests, setRequests] = useState(defaultLeaveRequests);
  const { currentUser } = useDashboardStore();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Leave Requests</CardTitle>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium capitalize">
                      {request.type} Leave
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.start_date).toLocaleDateString()} -{" "}
                      {new Date(request.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
                </div>
                <p className="text-sm text-muted-foreground">
                  {request.reason}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CreateLeaveDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (data) => {
          const newRequest = {
            id: crypto.randomUUID(),
            boarder_id: currentUser?.id || "",
            type: data.type,
            start_date: data.startDate,
            end_date: data.endDate,
            reason: data.reason,
            status: "pending_parent",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setRequests((prev) => [...prev, newRequest]);
          setIsCreateDialogOpen(false);
        }}
      />
    </Card>
  );
}
