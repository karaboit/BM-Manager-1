import { supabase } from "./client";

async function testDatabase() {
  console.log("Testing database setup...");

  try {
    // Test 1: Check if houses table exists and has data
    const { data: houses, error: housesError } = await supabase
      .from("houses")
      .select("*");

    console.log("Houses check:", { houses, error: housesError });

    // Test 2: Check if profiles table exists and has data
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");

    console.log("Profiles check:", { profiles, error: profilesError });

    // Test 3: Try to create a new user
    const testUser = {
      email: `test${Date.now()}@example.com`,
      full_name: "Test User",
      role: "system_administrator",
    };

    const { data: newUser, error: createError } = await supabase
      .from("profiles")
      .insert(testUser)
      .select()
      .single();

    console.log("User creation test:", { newUser, error: createError });

    return {
      housesOk: !housesError && houses?.length > 0,
      profilesOk: !profilesError && profiles?.length > 0,
      userCreateOk: !createError && newUser?.id,
    };
  } catch (error) {
    console.error("Error during tests:", error);
    return {
      housesOk: false,
      profilesOk: false,
      userCreateOk: false,
      error,
    };
  }
}

// Run the tests
testDatabase().then((results) => {
  console.log("Database test results:", results);
});
