import { supabase } from "../supabase/client";
import { House, Room, Bed } from "@/types";

export async function getHouses() {
  try {
    // First verify the connection
    const { data: testData, error: testError } = await supabase
      .from("houses")
      .select("count");

    if (testError) {
      console.error("Connection test failed:", testError);
      throw new Error("Failed to connect to database");
    }

    // Now fetch the actual data
    const { data, error } = await supabase.from("houses").select(`
        *,
        rooms:rooms(count)
      `);

    if (error) {
      console.error("Error fetching houses:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch houses:", err);
    throw err;
  }
}

export async function createHouse(
  house: Omit<House, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("houses")
    .insert(house)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRooms(houseId: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      *,
      beds:beds(count)
    `,
    )
    .eq("house_id", houseId);

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
  return data;
}

export async function createRoom(
  room: Omit<Room, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("rooms")
    .insert(room)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBeds(roomId: string) {
  const { data, error } = await supabase
    .from("beds")
    .select(
      `
      *,
      boarder:users(*)
    `,
    )
    .eq("room_id", roomId);

  if (error) {
    console.error("Error fetching beds:", error);
    return [];
  }
  return data;
}

export async function createBed(
  bed: Omit<Bed, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("beds")
    .insert(bed)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignBed(bedId: string, boarderId: string | null) {
  const { data, error } = await supabase
    .from("beds")
    .update({ boarder_id: boarderId })
    .eq("id", bedId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
