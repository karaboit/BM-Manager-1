import { supabase } from "../supabase/client";

export async function checkProfilesSchema() {
  const { data, error } = await supabase.rpc("exec_sql", {
    sql_string: `
        SELECT 
          c.column_name, 
          c.data_type,
          c.column_default,
          c.is_nullable,
          con.conname as constraint_name,
          pg_get_constraintdef(con.oid) as constraint_def
        FROM 
          information_schema.columns c
        LEFT JOIN
          pg_constraint con ON con.conrelid = ('public.profiles'::regclass)::oid
          AND con.contype = 'c'
        WHERE 
          c.table_name = 'profiles'
        ORDER BY 
          c.ordinal_position;
      `,
  });

  if (error) {
    console.error("Error checking schema:", error);
    return null;
  }
  return data;
}
