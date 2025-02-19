import { checkProfilesTable } from "./check-table";

export async function testProfiles() {
  console.log("Starting profiles table check...");
  const result = await checkProfilesTable();
  console.log("Profile table check result:", result);
  return result;
}

// Run the test
testProfiles();
