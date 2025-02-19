import { supabase } from "./client";

async function testSetup() {
  console.log("Starting database tests...");

  // 1. First check if profiles table exists
  const { data: tableCheck, error: tableError } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  console.log("1. Table existence check:", {
    exists: !tableError?.code,
    error: tableError,
  });

  // 2. If table exists, check its structure
  if (!tableError) {
    const { data: columns, error: columnsError } = await supabase.rpc(
      "exec_sql",
      {
        sql_string: `
          SELECT 
            column_name, 
            data_type,
            column_default,
            is_nullable
          FROM 
            information_schema.columns 
          WHERE 
            table_name = 'profiles'
          ORDER BY 
            ordinal_position;
        `,
      },
    );

    console.log("2. Column structure:", { columns, error: columnsError });
  }

  // 3. Try to create a test user
  const testUser = {
    email: "test" + Date.now() + "@example.com",
    full_name: "Test User",
    role: "system_administrator",
  };

  const { data: createData, error: createError } = await supabase
    .from("profiles")
    .insert(testUser)
    .select()
    .single();

  console.log("3. Test user creation:", {
    success: !!createData,
    data: createData,
    error: createError,
  });

  return {
    tableExists: !tableError?.code,
    tableError,
    createSuccess: !!createData,
    createError,
  };
}

// Run the test
testSetup().then((result) => {
  console.log("Test setup complete:", result);
});
