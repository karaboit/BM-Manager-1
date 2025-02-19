import { supabase } from "./client";

export async function checkDatabase() {
  console.log("Checking database...");

  // Check if profiles table exists
  const { data: tableCheck, error: tableError } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  console.log("Table check result:", { tableCheck, tableError });

  // If table doesn't exist (error code 42P01) or there's another error, we'll know
  if (tableError) {
    if (tableError.code === "42P01") {
      console.log("Profiles table does not exist");
    } else {
      console.log("Error checking profiles table:", tableError);
    }
    return { exists: false, error: tableError };
  }

  return { exists: true, error: null };
}

// Run the check
checkDatabase().then((result) => {
  console.log("Database check complete:", result);
});
