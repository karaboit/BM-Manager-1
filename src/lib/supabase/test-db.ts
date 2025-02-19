import { supabase } from "./client";

export async function testDatabaseSetup() {
  try {
    // Create a test table
    const { error: createError } = await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS test_table (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    });

    if (createError) {
      console.error("Error creating test table:", createError);
      return false;
    }

    // Insert a test record
    const { error: insertError } = await supabase
      .from("test_table")
      .insert({ name: "test record" });

    if (insertError) {
      console.error("Error inserting test record:", insertError);
      return false;
    }

    // Read the test record
    const { data, error: readError } = await supabase
      .from("test_table")
      .select();

    if (readError) {
      console.error("Error reading test record:", readError);
      return false;
    }

    console.log("Test database setup successful:", data);
    return true;
  } catch (error) {
    console.error("Test database setup failed:", error);
    return false;
  }
}
