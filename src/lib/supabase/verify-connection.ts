import { supabase } from "./client";

export async function verifyConnection() {
  try {
    // Try to select from profiles table
    const { data, error } = await supabase.from("profiles").select("count");

    if (error) {
      console.error("Connection test failed:", error);
      return false;
    }

    console.log("Connection test successful:", data);
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
}
