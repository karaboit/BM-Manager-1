import { supabase } from "../client";

export async function createLeaveRequest(
  boarderId: string,
  startDate: string,
  endDate: string,
  type: string,
  reason: string,
) {
  const { data, error } = await supabase
    .from("leave_requests")
    .insert({
      boarder_id: boarderId,
      start_date: startDate,
      end_date: endDate,
      type,
      reason,
      status: "Pending Parent",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function approveLeaveRequest(requestId: string, role: string) {
  const status =
    role === "Boarder Parent" ? "Pending House Master" : "Approved";
  const updateField =
    role === "Boarder Parent"
      ? "parent_approval_date"
      : "house_master_approval_date";

  const { data, error } = await supabase
    .from("leave_requests")
    .update({
      status,
      [updateField]: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLeaveRequests(filters?: {
  boarderId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  let query = supabase.from("leave_requests").select(`
      *,
      boarder:boarder_id(id, full_name)
    `);

  if (filters?.boarderId) {
    query = query.eq("boarder_id", filters.boarderId);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.startDate) {
    query = query.gte("start_date", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("end_date", filters.endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
