import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Users, MessageCircle, Calendar } from "lucide-react";
import { useDashboardStore } from "@/lib/store";
import { ViewTable } from "@/components/ViewTable";
import { useMentoring } from "@/lib/hooks/useMentoring";
import { AssignMentorDialog } from "./MentorPanel/AssignMentorDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MentorPanel = () => {
  const { currentUser } = useDashboardStore();
  const { assignments, notes, loading, createAssignment, createNote } =
    useMentoring(currentUser?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBoarder, setSelectedBoarder] = useState<string | null>(null);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isAssignMentorOpen, setIsAssignMentorOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    note_text: "",
    next_steps: "",
    follow_up_date: "",
  });

  const boarders = assignments
    .filter((a) => a.status === "active")
    .map((assignment) => ({
      id: assignment.boarder_id,
      name: "John Smith", // Replace with actual user data
      grade: "10",
      house: "East Wing",
      lastMeeting:
        notes
          .filter((n) => n.boarder_id === assignment.boarder_id)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )[0]?.created_at || assignment.created_at,
      status: "active",
    }));

  const recentNotes = notes
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 10);

  const handleCreateNote = async () => {
    if (!selectedBoarder || !newNote.note_text) return;

    try {
      await createNote({
        mentor_id: currentUser?.id || "",
        boarder_id: selectedBoarder,
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

  const handleAssignMentee = async (data: {
    boarderId: string;
    startDate: string;
    notes?: string;
  }) => {
    try {
      await createAssignment({
        mentor_id: currentUser?.id || "",
        boarder_id: data.boarderId,
        start_date: data.startDate,
        notes: data.notes,
        status: "active",
      });
    } catch (err) {
      console.error("Failed to assign mentee:", err);
      throw err;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAssignMentorOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Mentee
          </Button>
          <Button onClick={() => setIsNewNoteOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Meeting Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Total Mentees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{boarders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Follow-ups Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                notes.filter(
                  (n) =>
                    n.follow_up_date &&
                    new Date(n.follow_up_date) <= new Date(),
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Notes This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                notes.filter((n) => {
                  const noteDate = new Date(n.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return noteDate >= weekAgo;
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Mentees</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <ViewTable
                columns={[
                  {
                    key: "name",
                    header: "Name",
                    render: (value, row) => (
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.id}`}
                          />
                          <AvatarFallback>{value[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{value}</p>
                          <p className="text-sm text-muted-foreground">
                            Grade {row.grade}
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  { key: "house", header: "House" },
                  {
                    key: "lastMeeting",
                    header: "Last Meeting",
                    render: (value) => new Date(value).toLocaleDateString(),
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (value) => (
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          value === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {value
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    ),
                  },
                ]}
                data={boarders.filter(
                  (m) =>
                    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.house.toLowerCase().includes(searchTerm.toLowerCase()),
                )}
                onRowClick={(row) => setSelectedBoarder(row.id)}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {boarders.find((m) => m.id === note.boarder_id)
                            ?.name || "Unknown Boarder"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
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
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Meeting Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Note</Label>
              <Textarea
                value={newNote.note_text}
                onChange={(e) =>
                  setNewNote((prev) => ({
                    ...prev,
                    note_text: e.target.value,
                  }))
                }
                placeholder="Enter meeting notes..."
              />
            </div>
            <div className="space-y-2">
              <Label>Next Steps</Label>
              <Textarea
                value={newNote.next_steps}
                onChange={(e) =>
                  setNewNote((prev) => ({
                    ...prev,
                    next_steps: e.target.value,
                  }))
                }
                placeholder="Enter next steps..."
              />
            </div>
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
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

      <AssignMentorDialog
        isOpen={isAssignMentorOpen}
        onClose={() => setIsAssignMentorOpen(false)}
        onSubmit={handleAssignMentee}
      />
    </div>
  );
};

export default MentorPanel;
