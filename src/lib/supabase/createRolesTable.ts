import { supabase } from "./client";

export async function createRolesTable() {
  try {
    // Create roles table
    const { error: tableError } = await supabase
      .from("roles")
      .insert([
        { name: "System Administrator", description: "Full system access" },
        { name: "Director", description: "School management access" },
        { name: "House Master", description: "House management access" },
        {
          name: "Deputy House Master",
          description: "Assistant house management access",
        },
        { name: "Support Staff", description: "Basic staff access" },
        { name: "Prefect", description: "Student leader access" },
        { name: "Medical Staff", description: "Medical center access" },
        { name: "Kitchen Staff", description: "Kitchen management access" },
        { name: "Boarder Parent", description: "Parent access" },
        { name: "Boarder", description: "Student access" },
      ])
      .select();

    if (tableError) {
      // If error is that relation doesn't exist, create the table first
      if (tableError.code === "42P01") {
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql_string: `
            CREATE TABLE IF NOT EXISTS roles (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT UNIQUE NOT NULL,
              description TEXT,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            -- Enable RLS
            ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

            -- Create RLS policies
            CREATE POLICY "Roles are viewable by all users"
            ON roles FOR SELECT
            TO PUBLIC
            USING (true);

            CREATE POLICY "Only system administrators can modify roles"
            ON roles
            FOR ALL
            TO PUBLIC
            USING (
              EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'System Administrator'
              )
            );
          `,
        });

        if (createError) {
          console.error("Error creating roles table:", createError);
          return false;
        }

        // Try inserting the roles again
        const { error: insertError } = await supabase.from("roles").insert([
          { name: "System Administrator", description: "Full system access" },
          { name: "Director", description: "School management access" },
          { name: "House Master", description: "House management access" },
          {
            name: "Deputy House Master",
            description: "Assistant house management access",
          },
          { name: "Support Staff", description: "Basic staff access" },
          { name: "Prefect", description: "Student leader access" },
          { name: "Medical Staff", description: "Medical center access" },
          { name: "Kitchen Staff", description: "Kitchen management access" },
          { name: "Boarder Parent", description: "Parent access" },
          { name: "Boarder", description: "Student access" },
        ]);

        if (insertError) {
          console.error("Error inserting roles:", insertError);
          return false;
        }
      } else {
        console.error("Error creating roles:", tableError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error in createRolesTable:", error);
    return false;
  }
}
