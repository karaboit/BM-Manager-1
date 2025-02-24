import { supabase } from "../supabase/client";

// Get all houses
export async function getHouses() {
  const { data, error } = await supabase.from("houses").select("*");

  if (error) throw error;
  return data || [];
}

// Create a new house
export async function createHouse({
  name,
  capacity,
}: {
  name: string;
  capacity: number;
}) {
  const { data, error } = await supabase
    .from("houses")
    .insert({ name, capacity })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a house
export async function updateHouse(
  id: string,
  { name, capacity }: { name?: string; capacity?: number },
) {
  const { data, error } = await supabase
    .from("houses")
    .update({ name, capacity })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a house
export async function deleteHouse(id: string) {
  const { error } = await supabase.from("houses").delete().eq("id", id);

  if (error) throw error;
}
