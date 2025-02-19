import { supabase } from "./client";

export async function setupProfilesTable() {
  // Create the profiles table
  const { error: createError } = await supabase.rpc("exec_sql", {
    sql_string: `
      -- Enable UUID extension if not enabled
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create profiles table if it doesn't exist
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        role TEXT NOT NULL CHECK (role IN ('system_administrator', 'director', 'house_master', 'deputy_house_master', 'support_staff', 'prefect', 'medical_staff', 'kitchen_staff', 'boarder_parent', 'boarder')),
        house_id UUID REFERENCES houses(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Insert test data if table is empty
      INSERT INTO profiles (email, full_name, role)
      SELECT 
        'admin@example.com',
        'Admin User',
        'system_administrator'
      WHERE NOT EXISTS (SELECT 1 FROM profiles);

      INSERT INTO profiles (email, full_name, role)
      SELECT 
        'director@example.com',
        'Director Smith',
        'director'
      WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'director@example.com');

      INSERT INTO profiles (email, full_name, role)
      SELECT 
        'medical@example.com',
        'Dr. Wilson',
        'medical_staff'
      WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'medical@example.com');
    `,
  });

  if (createError) {
    console.error("Error setting up profiles table:", createError);
    return false;
  }

  return true;
}
