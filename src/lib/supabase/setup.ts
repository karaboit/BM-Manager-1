import { supabase } from "./client";

import { createCoreTables } from "./createTables";
import { createBoardingTables } from "./createBoardingTables";

export async function setupDatabase() {
  try {
    // Create core tables
    const coreSuccess = await createCoreTables();
    if (!coreSuccess) {
      throw new Error("Failed to create core tables");
    }

    // Create boarding tables
    const boardingSuccess = await createBoardingTables();
    if (!boardingSuccess) {
      throw new Error("Failed to create boarding tables");
    }

    console.log("Database setup completed successfully");
    return true;
  } catch (error) {
    console.error("Error setting up database:", error);
    return false;
  }
}
