import { supabase } from "../supabase/client";
import { User } from "../types";

export async function getUsers() {
  try {
    // First verify the connection
    const { data: testData, error: testError } = await supabase
      .from("roles")
      .select("*");

    if (testError) {
      console.error("Connection test failed:", testError);
      throw new Error("Failed to connect to database");
    }

    // Now fetch the actual data
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        full_name,
        role_id,
        status,
        created_at,
        role:roles(id, name, role_key, description)
      `,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch users:", err);
    throw err;
  }
}

export async function createUser(
  user: Omit<User, "id" | "created_at" | "updated_at">
) {
  try {
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("role_key", user.role_key)
      .single();

    if (roleError) {
      throw roleError;
    }

    if (!roleData?.id) {
      throw new Error(`Role not found for key: ${user.role_key}`);
    }

    const userId = crypto.randomUUID();
    const { data, error } = await supabase
      .from("users")
      .insert({
        id: userId,
        email: user.email,
        full_name: user.full_name,
        role_id: roleData.id,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`*, role:roles(*)`)
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Failed to create user:", err);
    throw err;
  }
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) throw error;
}
