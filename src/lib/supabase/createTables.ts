import { supabase } from "./client";

export async function createTables() {
  try {
    // Create core tables
    const { error: coreError } = await supabase.rpc("exec_sql", {
      sql_string: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Create permissions table
        CREATE TABLE IF NOT EXISTS permissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Create role_permissions table
        CREATE TABLE IF NOT EXISTS role_permissions (
          role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
          permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (role_id, permission_id)
        );

        -- Create profiles table
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL CHECK (role IN ('System Administrator', 'Director', 'House Master', 'Deputy House Master', 'Support Staff', 'Prefect', 'Medical Staff', 'Kitchen Staff', 'Boarder Parent', 'Boarder')),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Create houses table
        CREATE TABLE IF NOT EXISTS houses (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Create rooms table
        CREATE TABLE IF NOT EXISTS rooms (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          house_id UUID REFERENCES houses(id),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Create beds table
        CREATE TABLE IF NOT EXISTS beds (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          room_id UUID REFERENCES rooms(id),
          student_id UUID REFERENCES profiles(id),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Permissions are viewable by all users"
        ON permissions FOR SELECT
        TO PUBLIC
        USING (true);

        CREATE POLICY "Only system administrators can modify permissions"
        ON permissions
        FOR ALL
        TO PUBLIC
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'System Administrator'
          )
        );

        CREATE POLICY "Role permissions are viewable by all users"
        ON role_permissions FOR SELECT
        TO PUBLIC
        USING (true);

        CREATE POLICY "Only system administrators can modify role permissions"
        ON role_permissions
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

    if (coreError) {
      console.error("Error creating core tables:", coreError);
      return false;
    }

    console.log("Core tables created successfully");
    return true;
  } catch (error) {
    console.error("Error creating tables:", error);
    return false;
  }
}
