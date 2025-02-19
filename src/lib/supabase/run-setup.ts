import { supabase } from "./client";
import fs from "fs";
import path from "path";

async function runDatabaseSetup() {
  try {
    // Read and execute the SQL setup
    const sql = fs.readFileSync(
      path.join(__dirname, "setup-tables.sql"),
      "utf8",
    );

    const { error } = await supabase.rpc("exec_sql", {
      sql_string: sql,
    });

    if (error) {
      console.error("Error in database setup:", error);
      return false;
    }

    // Test the setup by creating a user
    const testUser = {
      email: "test" + Date.now() + "@example.com",
      full_name: "Test User",
      role: "system_administrator",
    };

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .insert(testUser)
      .select()
      .single();

    if (userError) {
      console.error("Error creating test user:", userError);
      return false;
    }

    console.log("Test user created successfully:", userData);
    return true;
  } catch (error) {
    console.error("Error running setup:", error);
    return false;
  }
}

// Run the setup
runDatabaseSetup().then((success) => {
  console.log("Database setup:", success ? "SUCCESS" : "FAILED");
});
