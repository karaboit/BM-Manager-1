import { supabase } from "./client";

export async function testConnection() {
  try {
    console.log("Testing Supabase connection...");
    console.log("URL:", supabase.getUrl());

    const { data, error } = await supabase.from("houses").select("count");

    if (error) {
      console.error("Connection test failed:", error);
      return false;
    }

    console.log("Connection successful:", data);
    return true;
  } catch (err) {
    console.error("Connection test failed:", err);
    return false;
  }
}
