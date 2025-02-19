import { supabase } from "./client";
import fs from "fs";
import path from "path";

export async function setupDatabase() {
  try {
    // Read the schema SQL
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

    // Execute the schema SQL
    const { error } = await supabase.rpc("exec_sql", {
      sql_string: schema,
    });

    if (error) {
      console.error("Error setting up database:", error);
      return false;
    }

    console.log("Database setup completed successfully");
    return true;
  } catch (error) {
    console.error("Error in database setup:", error);
    return false;
  }
}

// Run the setup
setupDatabase().then((success) => {
  console.log("Database setup:", success ? "SUCCESS" : "FAILED");
});
