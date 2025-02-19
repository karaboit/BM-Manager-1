import { supabase } from "./client";

export async function checkSchema() {
  const { data, error } = await supabase.from("profiles").select("*").limit(1);

  console.log("Schema check result:", { data, error });
  return { data, error };
}
