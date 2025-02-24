import { supabase } from "./client";

export async function checkDatabaseLinks() {
  console.log("Checking database links and relationships...");

  try {
    // 1. Check roles table and relationships
    console.log("\n1. Checking roles table...");
    const { data: roles, error: rolesError } = await supabase
      .from("roles")
      .select("id, name, role_key, description");

    if (rolesError) {
      console.error("Error checking roles:", rolesError);
    } else {
      console.log(`Found ${roles?.length || 0} roles`);
      console.log(
        "Role keys:",
        roles?.map((r) => r.role_key),
      );
    }

    // 2. Check users table and role relationships
    console.log("\n2. Checking users and role relationships...");
    const { data: users, error: usersError } = await supabase.from("users")
      .select(`
        id,
        email,
        full_name,
        role_id,
        role:roles(id, name, role_key, description)
      `);

    if (usersError) {
      console.error("Error checking users:", usersError);
    } else {
      console.log(`Found ${users?.length || 0} users`);
      const usersWithoutRoles = users?.filter((u) => !u.role_id);
      if (usersWithoutRoles?.length) {
        console.warn(
          `Warning: ${usersWithoutRoles.length} users without roles`,
        );
      }
    }

    // 3. Check role_mappings table
    console.log("\n3. Checking role mappings...");
    const { data: mappings, error: mappingsError } = await supabase
      .from("role_mappings")
      .select("*");

    if (mappingsError) {
      console.error("Error checking role mappings:", mappingsError);
    } else {
      console.log(`Found ${mappings?.length || 0} role mappings`);
    }

    // 4. Verify role keys match application constants
    console.log("\n4. Verifying role key consistency...");
    const expectedRoleKeys = [
      "system_administrator",
      "director",
      "house_master",
      "deputy_master",
      "medical",
      "kitchen",
      "parent",
      "boarder",
      "support_staff",
    ];

    const actualRoleKeys = roles?.map((r) => r.role_key) || [];
    const missingRoles = expectedRoleKeys.filter(
      (key) => !actualRoleKeys.includes(key),
    );
    const extraRoles = actualRoleKeys.filter(
      (key) => !expectedRoleKeys.includes(key),
    );

    if (missingRoles.length) {
      console.error("Missing roles in database:", missingRoles);
    }
    if (extraRoles.length) {
      console.warn("Extra roles in database:", extraRoles);
    }

    return {
      success: !rolesError && !usersError && !mappingsError,
      roles: roles || [],
      users: users || [],
      mappings: mappings || [],
      missingRoles,
      extraRoles,
    };
  } catch (error) {
    console.error("Error checking database links:", error);
    return {
      success: false,
      error,
    };
  }
}

// Export the check function
export { checkDatabaseLinks };
