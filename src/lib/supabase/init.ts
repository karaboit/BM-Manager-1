import { supabase } from "./client";

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Enable extensions
    await supabase.rpc("create_extensions");

    // Create enums
    await supabase.rpc("create_enums");

    // Create tables
    await supabase.rpc("create_tables");

    // Create RLS policies
    await supabase.rpc("create_policies");

    // Insert seed data
    await supabase.rpc("insert_seed_data");

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
