-- First ensure the table exists with correct structure
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL,
  house_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS but allow all operations for now
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all operations for profiles" ON profiles;
CREATE POLICY "Enable all operations for profiles" ON profiles FOR ALL USING (true);

-- Insert test users
INSERT INTO profiles (email, full_name, role)
VALUES 
  ('admin@example.com', 'Admin User', 'system_administrator'),
  ('director@example.com', 'Director Smith', 'director'),
  ('medical@example.com', 'Dr. Wilson', 'medical_staff'),
  ('housemaster@example.com', 'Mr. Brown', 'house_master'),
  ('kitchen@example.com', 'Chef Johnson', 'kitchen_staff'),
  ('parent@example.com', 'Mrs. Smith', 'boarder_parent'),
  ('student@example.com', 'John Student', 'boarder'),
  ('prefect@example.com', 'Head Prefect', 'prefect')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;
