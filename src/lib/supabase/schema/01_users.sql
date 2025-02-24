-- Create roles table first
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role_key TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users are viewable by authenticated users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users are editable by admins"
ON users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role_id IN (
      SELECT id FROM roles WHERE role_key = 'system_admin'
    )
  )
);
