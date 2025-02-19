import { supabase } from "./client";

export async function checkProfilesTable() {
  // First check if the table exists
  const { data: tableExists, error: tableError } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  console.log("Table check:", { exists: !!tableExists, error: tableError });

  // If table doesn't exist, tableError will have code '42P01'
  if (tableError && tableError.code === "42P01") {
    return { exists: false, error: null };
  }

  if (tableError) {
    return { exists: false, error: tableError };
  }

  // Now check the table structure
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

  console.log("Column check:", { columns, error: columnsError });

  return {
    exists: true,
    columns,
    error: columnsError,
  };
}
