-- First, create a backup of the profiles table
CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- Drop the existing profiles table
DROP TABLE IF EXISTS profiles CASCADE;

-- Recreate the profiles table with proper role reference
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL REFERENCES roles(name),
  house_id UUID REFERENCES houses(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Profiles are viewable by authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile or system administrators can update any profile"
ON profiles FOR UPDATE
TO authenticated
USING (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'System Administrator'
    AND p.id != id
  )
);

CREATE POLICY "Only system administrators can delete profiles"
ON profiles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'System Administrator'
    AND p.id != id
  )
);

-- Restore data from backup
INSERT INTO profiles (id, email, full_name, role, house_id, created_at, updated_at)
SELECT id, email, full_name, role, house_id, created_at, updated_at
FROM profiles_backup;

-- Drop the backup table
DROP TABLE profiles_backup;