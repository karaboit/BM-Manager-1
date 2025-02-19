import { supabase } from "./client";

async function testRoleValidation() {
  console.log("Testing role validation...");

  const validRoles = [
    "system_administrator",
    "director",
    "house_master",
    "deputy_house_master",
    "support_staff",
    "prefect",
    "medical_staff",
    "kitchen_staff",
    "boarder_parent",
    "boarder",
  ] as const;

  const testCases = [
    // Valid cases
    ...validRoles.map((role) => ({
      email: `test_${role}@example.com`,
      full_name: `Test ${role}`,
      role: role,
    })),
    // Invalid case
    {
      email: "test_invalid@example.com",
      full_name: "Test Invalid",
      role: "invalid_role",
    },
  ];

  for (const testCase of testCases) {
    console.log(`\nTesting role: ${testCase.role}`);
    const { data, error } = await supabase
      .from("profiles")
      .insert(testCase)
      .select()
      .single();

    console.log("Result:", {
      success: !!data,
      error: error?.message,
    });
  }
}

// Run the test
testRoleValidation().then(() => {
  console.log("\nRole validation tests complete");
});
