import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboardStore } from "@/lib/store";
import { useMentoring } from "@/lib/hooks/useMentoring";

export function MentorGroupCard() {
  const { currentUser } = useDashboardStore();
  const { assignments, notes, createNote } = useMentoring(
    undefined,
    currentUser?.id,
  );
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    note_text: "",
    next_steps: "",
    follow_up_date: "",
  });

  const currentAssignment = assignments[0]; // Get the first active assignment
  const mentorId = currentAssignment?.mentor_id;

  const handleCreateNote = async () => {
    if (!mentorId || !newNote.note_text) return;

    try {
      await createNote({
        mentor_id: mentorId,
        boarder_id: currentUser?.id || "",
        note_text: newNote.note_text,
        next_steps: newNote.next_steps,
        follow_up_date: newNote.follow_up_date || undefined,
      });

      setIsNewNoteOpen(false);
      setNewNote({ note_text: "", next_steps: "", follow_up_date: "" });
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Mentor Group</CardTitle>
          <Button size="sm" onClick={() => setIsNewNoteOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No mentor notes yet
              </div>
            ) : (
              notes
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
                )
                .map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-muted-foreground">
                        {new Date(note.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm">{note.note_text}</p>
                    {note.next_steps && (
                      <p className="text-sm text-muted-foreground">
                        Next Steps: {note.next_steps}
                      </p>
                    )}
                    {note.follow_up_date && (
                      <p className="text-sm text-muted-foreground">
                        Follow-up:{" "}
                        {new Date(note.follow_up_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meeting Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter your note..."
                value={newNote.note_text}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, note_text: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Next steps..."
                value={newNote.next_steps}
                onChange={(e) =>
                  setNewNote((prev) => ({
                    ...prev,
                    next_steps: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                type="date"
                value={newNote.follow_up_date}
                onChange={(e) =>
                  setNewNote((prev) => ({
                    ...prev,
                    follow_up_date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewNoteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNote}>Save Note</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
