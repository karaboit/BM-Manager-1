import { supabase } from "./client";

export async function createTestTable() {
  try {
    const { data, error } = await supabase
      .from("test_table")
      .insert([{ name: "test" }]);

    if (error) {
      console.error("Error creating test table:", error);
      return false;
    }

    console.log("Test table created successfully");
    return true;
  } catch (error) {
    console.error("Error creating test table:", error);
    return false;
  }
}
