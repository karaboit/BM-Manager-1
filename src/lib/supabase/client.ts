import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Test connection and initialize database
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("profiles").select("count");
    if (error) {
      if (error.code === "42P01") {
        // Table doesn't exist, create schema
        await createTables();
        return true;
      }
      throw error;
    }
    console.log("Supabase connection successful");
    return true;
  } catch (error) {
    console.error("Supabase connection failed:", error);
    return false;
  }
}
