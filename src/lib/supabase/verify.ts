import { supabase } from "./client";

export async function verifySupabaseSetup() {
  console.log("Starting Supabase verification...");
  console.log("Using URL:", "https://zgfpkvnrzskqnvibhihq.supabase.co");

  try {
    // Test 1: Basic Connection
    console.log("\n1. Testing connection...");
    const { data: connectionTest, error: connectionError } = await supabase
      .from("profiles")
      .select("count");

    if (connectionError) {
      console.error("Connection failed:", connectionError);
      return false;
    }
    console.log("Connection successful");

    // Test 2: Check Existing Tables
    console.log("\n2. Checking existing tables...");
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");

    if (tablesError) {
      console.error("Error checking tables:", tablesError);
      return false;
    }
    console.log(
      "Existing tables:",
      tables?.map((t) => t.table_name).join(", "),
    );

    return true;
  } catch (error) {
    console.error("Verification failed:", error);
    return false;
  }
}

// Run verification if this file is executed directly
if (require.main === module) {
  verifySupabaseSetup().then((success) => {
    console.log("\nVerification " + (success ? "successful" : "failed"));
    process.exit(success ? 0 : 1);
  });
}
