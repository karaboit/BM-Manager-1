import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BedAssignment {
  id: string;
  bed_id: string;
  student_id: string;
  start_date: string;
  end_date: string | null;
  status: "active" | "ended";
  notes?: string;
  created_at: string;
}

interface BedHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: BedAssignment[];
  roomNumber: string;
}

export function BedHistoryDialog({
  isOpen,
  onClose,
  assignments,
  roomNumber,
}: BedHistoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bed Assignment History - Room {roomNumber}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.student_id}</TableCell>
                <TableCell>
                  {new Date(assignment.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {assignment.end_date
                    ? new Date(assignment.end_date).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      assignment.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {assignment.status.charAt(0).toUpperCase() +
                      assignment.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{assignment.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
