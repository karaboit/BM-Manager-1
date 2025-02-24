import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Initialize Supabase client with additional options
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
});

// Export test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("count");
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
    return false;
  }
};
