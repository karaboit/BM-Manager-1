import { supabase } from "./client";

async function testDatabaseSetup() {
  console.log("Starting database setup test...");

  try {
    // Step 1: Enable uuid-ossp extension
    const { error: extError } = await supabase.rpc("exec_sql", {
      sql_string: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    });

    if (extError) {
      console.error("Error enabling uuid-ossp:", extError);
      return false;
    }

    // Step 2: Create profiles table
    const { error: tableError } = await supabase.rpc("exec_sql", {
      sql_string: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL CHECK (role IN ('system_administrator', 'director', 'house_master', 'deputy_house_master', 'support_staff', 'prefect', 'medical_staff', 'kitchen_staff', 'boarder_parent', 'boarder')),
          house_id UUID REFERENCES houses(id),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `,
    });

    if (tableError) {
      console.error("Error creating profiles table:", tableError);
      return false;
    }

    // Step 3: Test user creation
    const testUser = {
      email: "test" + Date.now() + "@example.com",
      full_name: "Test User",
      role: "system_administrator",
    };

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .insert(testUser)
      .select()
      .single();

    console.log("Test user creation result:", { userData, userError });

    return !userError;
  } catch (error) {
    console.error("Error in database setup:", error);
    return false;
  }
}

// Run the test
testDatabaseSetup().then((success) => {
  console.log("Database setup test complete:", success ? "SUCCESS" : "FAILED");
});
