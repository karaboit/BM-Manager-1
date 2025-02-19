import { supabase } from "./client";

async function runAllTests() {
  console.log("Running all tests...");

  try {
    // Test 1: Check tables
    console.log("\n1. Checking tables...");
    const { data: houses } = await supabase.from("houses").select("*");
    const { data: profiles } = await supabase.from("profiles").select("*");

    console.log("Houses:", houses?.length || 0);
    console.log("Profiles:", profiles?.length || 0);

    // Test 2: Create test user
    console.log("\n2. Creating test user...");
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

    if (createError) throw createError;
    console.log("User created:", newUser);

    // Test 3: Update user
    console.log("\n3. Updating user...");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: "Updated Test User" })
      .eq("id", newUser.id);

    if (updateError) throw updateError;
    console.log("User updated successfully");

    // Test 4: Assign house
    if (houses && houses.length > 0) {
      console.log("\n4. Assigning house...");
      const { error: houseError } = await supabase
        .from("profiles")
        .update({ house_id: houses[0].id })
        .eq("id", newUser.id);

      if (houseError) throw houseError;
      console.log("House assigned successfully");
    }

    // Test 5: Delete test user
    console.log("\n5. Cleaning up...");
    const { error: deleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", newUser.id);

    if (deleteError) throw deleteError;
    console.log("Test user deleted successfully");

    return { success: true };
  } catch (error) {
    console.error("Test failed:", error);
    return { success: false, error };
  }
}

// Run all tests
runAllTests().then((result) => {
  console.log("\nTest results:", result);
});
