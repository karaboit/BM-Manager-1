-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role_key TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, role_key, description) VALUES
('System Administrator', 'system_admin', 'Full system access'),
('Director', 'director', 'School management access'),
('House Master', 'house_master', 'House management access'),
('Deputy House Master', 'deputy_master', 'Assistant house management access'),
('Medical Staff', 'medical', 'Medical center access'),
('Kitchen Staff', 'kitchen', 'Kitchen management access'),
('Boarder Parent', 'parent', 'Parent access'),
('Boarder', 'boarder', 'Student access'),
('Support Staff', 'support_staff', 'Basic staff access')
ON CONFLICT (role_key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Roles are viewable by all users"
ON roles FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "User profiles are viewable by all users"
ON user_profiles FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only system administrators can modify roles"
ON roles
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role_id IN (
      SELECT id FROM roles WHERE role_key = 'system_admin'
    )
  )
);

CREATE POLICY "Users can modify their own profiles"
ON user_profiles
FOR ALL
TO PUBLIC
USING (id = auth.uid());

CREATE POLICY "System administrators can modify all profiles"
ON user_profiles
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role_id IN (
      SELECT id FROM roles WHERE role_key = 'system_admin'
    )
  )
);