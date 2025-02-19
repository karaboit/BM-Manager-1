import { supabase } from "../supabase/client";
import { User, UserCreate, UserUpdate } from "@/types/user";

export async function getUsers() {
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return users || [];
}

export async function updateUser(userId: string, updates: UserUpdate) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }

  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("profiles").delete().eq("id", userId);

  if (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function createUser(user: UserCreate) {
  try {
    // First check if user exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (existing) {
      throw new Error("A user with this email already exists");
    }

    // If house_id is provided, verify it exists
    if (user.house_id) {
      const { data: house } = await supabase
        .from("houses")
        .select("id")
        .eq("id", user.house_id)
        .single();

      if (!house) {
        throw new Error("Invalid house selected");
      }
    }

    // Get valid roles from the roles table
    const { data: validRoles, error: rolesError } = await supabase
      .from("roles")
      .select("name");

    if (rolesError) throw rolesError;

    if (!validRoles?.some((r) => r.name === user.role)) {
      throw new Error("Invalid role selected");
    }

    // Create the user with explicit id generation
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: crypto.randomUUID(),
        email: user.email.toLowerCase().trim(),
        full_name: user.full_name.trim(),
        role: user.role,
        house_id: user.house_id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // unique_violation
        throw new Error("A user with this email already exists");
      }
      if (error.code === "23514") {
        // check_violation
        throw new Error("Invalid role specified");
      }
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw error;
  }
}
