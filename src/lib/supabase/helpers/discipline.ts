import { supabase } from "../client";

export async function createDisciplineRecord(
  boarderId: string,
  offense: string,
  category: "Minor" | "Major",
  date: string,
  punishment?: string,
) {
  const { data, error } = await supabase
    .from("discipline_records")
    .insert({
      boarder_id: boarderId,
      offense,
      category,
      date,
      punishment,
      reported_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function approveDisciplineRecord(recordId: string) {
  const { data, error } = await supabase
    .from("discipline_records")
    .update({
      status: "Approved",
      approved_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .eq("id", recordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeDisciplineRecord(recordId: string) {
  const { data, error } = await supabase
    .from("discipline_records")
    .update({
      status: "Completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", recordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDisciplineRecords(filters?: {
  boarderId?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  let query = supabase.from("discipline_records").select(`
      *,
      boarder:boarder_id(id, full_name),
      reporter:reported_by(id, full_name),
      approver:approved_by(id, full_name)
    `);

  if (filters?.boarderId) {
    query = query.eq("boarder_id", filters.boarderId);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.startDate) {
    query = query.gte("date", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("date", filters.endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
