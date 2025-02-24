import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { MentorAssignment, MentorNote } from "@/types/mentor";

export function useMentoring(mentorId?: string, boarderId?: string) {
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [notes, setNotes] = useState<MentorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (mentorId || boarderId) {
      fetchAssignments();
    }
  }, [mentorId, boarderId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      let query = supabase.from("mentor_assignments").select("*");

      if (mentorId) {
        query = query.eq("mentor_id", mentorId);
      }
      if (boarderId) {
        query = query.eq("boarder_id", boarderId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAssignments(data || []);

      // Fetch notes for these assignments
      if (data?.length) {
        const { data: notesData, error: notesError } = await supabase
          .from("mentor_notes")
          .select("*")
          .in(
            "mentor_id",
            data.map((a) => a.mentor_id),
          )
          .in(
            "boarder_id",
            data.map((a) => a.boarder_id),
          );

        if (notesError) throw notesError;
        setNotes(notesData || []);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (
    data: Omit<MentorAssignment, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const { data: newAssignment, error } = await supabase
        .from("mentor_assignments")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      setAssignments((prev) => [...prev, newAssignment]);
      return newAssignment;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const createNote = async (
    data: Omit<MentorNote, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const { data: newNote, error } = await supabase
        .from("mentor_notes")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      setNotes((prev) => [...prev, newNote]);
      return newNote;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    assignments,
    notes,
    loading,
    error,
    createAssignment,
    createNote,
    refreshData: fetchAssignments,
  };
}
