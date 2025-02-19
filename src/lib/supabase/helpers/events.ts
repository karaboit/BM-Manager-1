import { supabase } from "../client";

export async function createEvent({
  title,
  description,
  startDate,
  endDate,
  location,
  maxParticipants,
}: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
}) {
  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      location,
      max_participants: maxParticipants,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function registerForEvent(
  eventId: string,
  boarderId: string,
  packedMeals?: string[],
) {
  const { data, error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: eventId,
      boarder_id: boarderId,
      packed_meals: packedMeals,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEvents(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  let query = supabase.from("events").select(`
      *,
      creator:created_by(id, full_name),
      registrations:event_registrations(boarder_id, status, packed_meals)
    `);

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

export async function getEventRegistrations(eventId: string) {
  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      *,
      boarder:boarder_id(id, full_name)
    `,
    )
    .eq("event_id", eventId);

  if (error) throw error;
  return data;
}
