import { supabase } from "../supabase/client";

// Get bed assignments for a bed
export async function getBedAssignments(bedId: string) {
  const { data, error } = await supabase
    .from("bed_assignments")
    .select(
      `
      *,
      boarder:users(*)
    `,
    )
    .eq("bed_id", bedId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

// Create a new bed assignment
export async function createBedAssignment({
  bedId,
  boarderId,
  startDate,
  notes,
}: {
  bedId: string;
  boarderId: string;
  startDate: string;
  notes?: string;
}) {
  // First, end any active assignment for this bed
  const { error: updateError } = await supabase
    .from("bed_assignments")
    .update({
      end_date: new Date().toISOString(),
      status: "ended",
    })
    .eq("bed_id", bedId)
    .eq("status", "active");

  if (updateError) throw updateError;

  // Also end any active assignment for this boarder
  const { error: boarderUpdateError } = await supabase
    .from("bed_assignments")
    .update({
      end_date: new Date().toISOString(),
      status: "ended",
    })
    .eq("boarder_id", boarderId)
    .eq("status", "active");

  if (boarderUpdateError) throw boarderUpdateError;

  // Create new assignment
  const { data, error } = await supabase
    .from("bed_assignments")
    .insert({
      bed_id: bedId,
      boarder_id: boarderId,
      start_date: startDate,
      status: "active",
      notes,
    })
    .select()
    .single();

  if (error) throw error;

  // Update bed status
  const { error: bedError } = await supabase
    .from("beds")
    .update({
      status: "occupied",
      boarder_id: boarderId,
    })
    .eq("id", bedId);

  if (bedError) throw bedError;

  return data;
}

// End a bed assignment
export async function endBedAssignment(assignmentId: string) {
  const { data, error } = await supabase
    .from("bed_assignments")
    .update({
      end_date: new Date().toISOString(),
      status: "ended",
    })
    .eq("id", assignmentId)
    .select()
    .single();

  if (error) throw error;

  // Update bed status
  const { error: bedError } = await supabase
    .from("beds")
    .update({
      status: "available",
      boarder_id: null,
    })
    .eq("id", data.bed_id);

  if (bedError) throw bedError;

  return data;
}
