import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AssignMentorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    boarderId: string;
    startDate: string;
    notes?: string;
  }) => Promise<void>;
}

export function AssignMentorDialog({
  isOpen,
  onClose,
  onSubmit,
}: AssignMentorDialogProps) {
  const [boarderId, setBoarderId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boarderId || !startDate) return;

    try {
      setIsSubmitting(true);
      await onSubmit({ boarderId, startDate, notes });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign New Mentee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="boarder">Select Boarder</Label>
            <Select value={boarderId} onValueChange={setBoarderId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a boarder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B001">John Smith</SelectItem>
                <SelectItem value="B002">Jane Doe</SelectItem>
                <SelectItem value="B003">Bob Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !boarderId || !startDate}
            >
              {isSubmitting ? "Assigning..." : "Assign Mentee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
