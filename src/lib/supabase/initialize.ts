import { supabase } from "./client";
import fs from "fs";
import path from "path";

export async function initializeDatabase() {
  try {
    // Read and execute the initialization SQL
    const sql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");

    const { error } = await supabase.rpc("exec_sql", {
      sql_string: sql,
    });

    if (error) {
      console.error("Error initializing database:", error);
      return false;
    }

    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Error in database initialization:", error);
    return false;
  }
}

// Run the initialization
initializeDatabase().then((success) => {
  console.log("Database initialization:", success ? "SUCCESS" : "FAILED");
});
