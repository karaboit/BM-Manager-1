import { supabase } from "../supabase/client";
import { Attendance } from "../types";

export async function getAttendance(date: string, houseId?: string) {
  let query = supabase
    .from("attendance")
    .select("*, student:users(*), created_by:users(*)")
    .eq("date", date);

  if (houseId) {
    query = query.eq("student.house_id", houseId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function markAttendance(
  attendance: Omit<Attendance, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("attendance")
    .insert(attendance)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAttendance(
  attendanceId: string,
  updates: Partial<Attendance>,
) {
  const { data, error } = await supabase
    .from("attendance")
    .update(updates)
    .eq("id", attendanceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
