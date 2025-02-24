import { supabase } from "../supabase/client";

// Medical Records
export async function getMedicalRecord(boarderId: string) {
  const { data, error } = await supabase
    .from("medical_records")
    .select("*")
    .eq("boarder_id", boarderId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateMedicalRecord(boarderId: string, updates: any) {
  const { data, error } = await supabase
    .from("medical_records")
    .upsert({
      boarder_id: boarderId,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Clinic Visits
export async function getClinicVisits(boarderId: string) {
  const { data, error } = await supabase
    .from("clinic_visits")
    .select("*, staff:users(full_name)")
    .eq("boarder_id", boarderId)
    .order("visit_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createClinicVisit(visit: any) {
  const { data, error } = await supabase
    .from("clinic_visits")
    .insert(visit)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Medications
export async function getMedicationSchedules(boarderId: string) {
  const { data, error } = await supabase
    .from("medication_schedules")
    .select("*")
    .eq("boarder_id", boarderId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createMedicationSchedule(schedule: any) {
  const { data, error } = await supabase
    .from("medication_schedules")
    .insert(schedule)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMedicationLogs(scheduleId: string) {
  const { data, error } = await supabase
    .from("medication_logs")
    .select("*, administered_by:users(full_name)")
    .eq("schedule_id", scheduleId)
    .order("administered_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Immunizations
export async function getImmunizations(boarderId: string) {
  const { data, error } = await supabase
    .from("immunizations")
    .select("*, administered_by:users(full_name)")
    .eq("boarder_id", boarderId)
    .order("administered_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createImmunization(immunization: any) {
  const { data, error } = await supabase
    .from("immunizations")
    .insert(immunization)
    .select()
    .single();

  if (error) throw error;
  return data;
}
