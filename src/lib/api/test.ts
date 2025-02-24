import { supabase } from "../supabase/client";

// Simple test function to verify database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase.from("houses").select("count");

    if (error) {
      console.error("Database connection test failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Database connection test failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Test function to create a house
export async function testCreateHouse(name: string, capacity: number) {
  try {
    const { data, error } = await supabase
      .from("houses")
      .insert({ name, capacity })
      .select()
      .single();

    if (error) {
      console.error("Failed to create house:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to create house:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
