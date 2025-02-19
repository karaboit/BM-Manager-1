import { supabase } from "./client";

export async function runDiagnostic() {
  console.log("Starting Supabase diagnostic...");

  try {
    // Test 1: Basic Connection
    console.log("\n1. Testing basic connection...");
    const { data: connectionTest, error: connectionError } = await supabase
      .from("profiles")
      .select("count");
    console.log(
      "Connection test result:",
      connectionError ? "Failed" : "Success",
    );
    if (connectionError) console.error("Connection error:", connectionError);

    // Test 2: Check Existing Tables
    console.log("\n2. Checking existing tables...");
    const { data: tables, error: tablesError } = await supabase.rpc(
      "exec_sql",
      {
        sql_string: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name;
        `,
      },
    );
    console.log("Existing tables:", tables);
    if (tablesError) console.error("Tables error:", tablesError);

    // Test 3: Check RLS Policies
    console.log("\n3. Checking RLS policies...");
    const { data: policies, error: policiesError } = await supabase.rpc(
      "exec_sql",
      {
        sql_string: `
          SELECT tablename, policyname, permissive, roles, cmd
          FROM pg_policies
          WHERE schemaname = 'public'
          ORDER BY tablename, policyname;
        `,
      },
    );
    console.log("RLS policies:", policies);
    if (policiesError) console.error("Policies error:", policiesError);

    // Test 4: Verify Permissions
    console.log("\n4. Verifying permissions...");
    const { data: permissions, error: permissionsError } = await supabase.rpc(
      "exec_sql",
      {
        sql_string: `
          SELECT grantee, table_name, privilege_type
          FROM information_schema.role_table_grants
          WHERE table_schema = 'public'
          ORDER BY table_name, privilege_type;
        `,
      },
    );
    console.log("Permissions:", permissions);
    if (permissionsError) console.error("Permissions error:", permissionsError);

    return {
      connection: !connectionError,
      tables: tables || [],
      policies: policies || [],
      permissions: permissions || [],
      errors: {
        connection: connectionError,
        tables: tablesError,
        policies: policiesError,
        permissions: permissionsError,
      },
    };
  } catch (error) {
    console.error("Diagnostic failed:", error);
    return {
      connection: false,
      tables: [],
      policies: [],
      permissions: [],
      errors: { diagnostic: error },
    };
  }
}

// Run diagnostic if this file is executed directly
if (require.main === module) {
  runDiagnostic().then((results) => {
    console.log("\nDiagnostic Results:", JSON.stringify(results, null, 2));
  });
}
