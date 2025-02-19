import { supabase } from "./client";

export async function testUserCreation() {
  const testUser = {
    email: "test@example.com",
    full_name: "Test User",
    role: "system_administrator",
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(testUser)
    .select()
    .single();

  console.log("Test user creation result:", { data, error });
  return { data, error };
}
