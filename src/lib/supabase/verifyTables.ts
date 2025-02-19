import { supabase } from "./client";

export async function verifyTables() {
  try {
    // Check core tables
    const coreTables = ["profiles", "houses", "rooms", "beds"];

    // Check medical tables
    const medicalTables = [
      "medical_records",
      "clinic_visits",
      "medication_schedules",
      "medication_logs",
      "immunizations",
      "wellbeing_surveys",
    ];

    // Check kitchen tables
    const kitchenTables = [
      "menu_templates",
      "meal_plans",
      "dietary_requirements",
      "packed_meals",
    ];

    const allTables = [...coreTables, ...medicalTables, ...kitchenTables];

    for (const table of allTables) {
      const { error } = await supabase.from(table).select("count");
      if (error) {
        console.error(`Table ${table} not found or error:`, error);
        return false;
      }
      console.log(`Table ${table} exists`);
    }

    console.log("All tables verified successfully");
    return true;
  } catch (error) {
    console.error("Error verifying tables:", error);
    return false;
  }
}
