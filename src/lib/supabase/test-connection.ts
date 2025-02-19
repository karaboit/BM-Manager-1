import { supabase } from "./client";

export async function testConnection() {
  try {
    const { data, error } = await supabase.from("profiles").select("count");

    if (error) {
      console.error("Supabase connection failed:", error);
      return false;
    }

    console.log("Supabase connection successful");
    return true;
  } catch (error) {
    console.error("Supabase connection failed:", error);
    return false;
  }
}
