import { supabase } from "../client";
import {
  attendanceSchema,
  attendanceFilterSchema,
  AttendanceInput,
  AttendanceFilter,
} from "@/lib/validators/attendance";
import { handleDatabaseResponse } from "@/lib/utils/errorHandler";
import { AuthorizationError } from "@/lib/validators/errors";

export async function markAttendance(input: AttendanceInput) {
  // Validate input
  const validatedInput = attendanceSchema.parse(input);

  // Check authorization
  const user = await supabase.auth.getUser();
  if (!user.data.user?.id) {
    throw new AuthorizationError("User must be authenticated");
  }

  // Insert record
  const { data, error } = await supabase
    .from("attendance_records")
    .insert({
      boarder_id: validatedInput.boarderId,
      date: validatedInput.date,
      roll_call_type: validatedInput.rollCallType,
      status: validatedInput.status,
      reason: validatedInput.reason,
      marked_by: user.data.user.id,
    })
    .select()
    .single();

  return handleDatabaseResponse(data, error);
}

export async function getAttendanceByDate(date: string) {
  // Validate date format
  attendanceFilterSchema.shape.startDate.parse(date);

  const { data, error } = await supabase
    .from("attendance_records")
    .select(
      `
      *,
      boarder:boarder_id(id, full_name),
      marker:marked_by(id, full_name)
    `,
    )
    .eq("date", date);

  return handleDatabaseResponse(data, error);
}

export async function getBoarderAttendance(filters: AttendanceFilter) {
  // Validate filters
  const validatedFilters = attendanceFilterSchema.parse(filters);

  let query = supabase
    .from("attendance_records")
    .select("*")
    .gte("date", validatedFilters.startDate)
    .lte("date", validatedFilters.endDate);

  if (validatedFilters.boarderId) {
    query = query.eq("boarder_id", validatedFilters.boarderId);
  }

  if (validatedFilters.status) {
    query = query.eq("status", validatedFilters.status);
  }

  const { data, error } = await query;

  return handleDatabaseResponse(data, error);
}
