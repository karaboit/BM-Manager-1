import { supabase } from "../supabase/client";
import { LeaveRequest } from "../types";

export async function getLeaveRequests(studentId?: string) {
  let query = supabase.from("leave_requests").select("*, student:users(*)");

  if (studentId) {
    query = query.eq("student_id", studentId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createLeaveRequest(
  request: Omit<LeaveRequest, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("leave_requests")
    .insert(request)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLeaveRequest(
  requestId: string,
  updates: Partial<LeaveRequest>,
) {
  const { data, error } = await supabase
    .from("leave_requests")
    .update(updates)
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
