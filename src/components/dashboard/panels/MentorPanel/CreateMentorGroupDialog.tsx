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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreateMentorGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    leaderId: string;
    boarderIds: string[];
  }) => Promise<void>;
  availableLeaders: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  availableBoarders: Array<{
    id: string;
    name: string;
  }>;
}

export function CreateMentorGroupDialog({
  isOpen,
  onClose,
  onSubmit,
  availableLeaders,
  availableBoarders,
}: CreateMentorGroupDialogProps) {
  const [name, setName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [selectedBoarders, setSelectedBoarders] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !leaderId || selectedBoarders.length === 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name,
        leaderId,
        boarderIds: selectedBoarders,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleBoarder = (boarderId: string) => {
    setSelectedBoarders((prev) =>
      prev.includes(boarderId)
        ? prev.filter((id) => id !== boarderId)
        : [...prev, boarderId],
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Mentor Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Group Leader</Label>
              <Select value={leaderId} onValueChange={setLeaderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a leader" />
                </SelectTrigger>
                <SelectContent>
                  {availableLeaders.map((leader) => (
                    <SelectItem key={leader.id} value={leader.id}>
                      {leader.name} - {leader.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Boarders</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="space-y-2">
                  {availableBoarders.map((boarder) => (
                    <div
                      key={boarder.id}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent ${
                        selectedBoarders.includes(boarder.id) ? "bg-accent" : ""
                      }`}
                      onClick={() => toggleBoarder(boarder.id)}
                    >
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${boarder.id}`}
                        />
                        <AvatarFallback>{boarder.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{boarder.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
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
              disabled={
                isSubmitting ||
                !name ||
                !leaderId ||
                selectedBoarders.length === 0
              }
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
