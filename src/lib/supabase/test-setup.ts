import { supabase } from "./client";

export async function testSetup() {
  try {
    // Create a test table
    const { error: createError } = await supabase.rpc("create_test_table", {
      table_name: "test_table",
    });

    if (createError) {
      console.error("Error creating test table:", createError);
      return false;
    }

    // Insert a test record
    const { error: insertError } = await supabase
      .from("test_table")
      .insert({ name: "test" });

    if (insertError) {
      console.error("Error inserting test record:", insertError);
      return false;
    }

    // Query the test record
    const { data, error: selectError } = await supabase
      .from("test_table")
      .select();

    if (selectError) {
      console.error("Error querying test table:", selectError);
      return false;
    }

    console.log("Test setup successful:", data);
    return true;
  } catch (error) {
    console.error("Test setup failed:", error);
    return false;
  }
}
