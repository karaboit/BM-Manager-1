import { supabase } from "./client";

export async function createTables() {
  try {
    // Create core tables
    const { error: coreError } = await supabase.rpc("exec_sql", {
      sql_string: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
