import { supabase } from "./client";

async function testUserManagement() {
  console.log("Testing user management functionality...");

  try {
    // Test 1: Create a test user
    const testUser = {
      email: `test${Date.now()}@example.com`,
      full_name: "Test User",
      role: "system_administrator",
    };

    console.log("Creating test user:", testUser);
    const { data: createdUser, error: createError } = await supabase
      .from("profiles")
      .insert(testUser)
      .select()
      .single();

    if (createError) throw createError;
    console.log("Created user:", createdUser);

    // Test 2: Update the user
    const update = { full_name: "Updated Test User" };
    console.log("Updating user:", update);
    const { data: updatedUser, error: updateError } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", createdUser.id)
      .select()
      .single();

    if (updateError) throw updateError;
    console.log("Updated user:", updatedUser);

    // Test 3: Assign user to a house
    const { data: houses } = await supabase.from("houses").select("*").limit(1);

    if (houses && houses.length > 0) {
      const houseUpdate = { house_id: houses[0].id };
      console.log("Assigning user to house:", houseUpdate);
      const { data: houseAssignedUser, error: houseError } = await supabase
        .from("profiles")
        .update(houseUpdate)
        .eq("id", createdUser.id)
        .select()
        .single();

      if (houseError) throw houseError;
      console.log("User assigned to house:", houseAssignedUser);
    }

    // Test 4: Delete the user
    console.log("Deleting test user...");
    const { error: deleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", createdUser.id);

    if (deleteError) throw deleteError;
    console.log("User deleted successfully");

    return {
      createSuccess: true,
      updateSuccess: true,
      houseAssignSuccess: true,
      deleteSuccess: true,
    };
  } catch (error) {
    console.error("Error during user management test:", error);
    return {
      error,
      createSuccess: false,
      updateSuccess: false,
      houseAssignSuccess: false,
      deleteSuccess: false,
    };
  }
}

// Run the test
testUserManagement().then((results) => {
  console.log("User management test results:", results);
});
