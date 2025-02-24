-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role_key TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles if they don't exist
INSERT INTO roles (name, role_key, description)
VALUES
  ('System Administrator', 'system_administrator', 'Full system access'),
  ('Director', 'director', 'School management access'),
  ('House Master', 'house_master', 'House management access'),
  ('Deputy House Master', 'deputy_master', 'Assistant house management access'),
  ('Medical Staff', 'medical', 'Medical center access'),
  ('Kitchen Staff', 'kitchen', 'Kitchen management access'),
  ('Boarder Parent', 'parent', 'Parent access'),
  ('Boarder', 'boarder', 'Student access'),
  ('Support Staff', 'support_staff', 'Basic staff access')
ON CONFLICT (role_key) DO NOTHING;

-- Insert a test admin user if no users exist
INSERT INTO users (email, full_name, role_id)
SELECT 
  'admin@example.com',
  'Admin User',
  r.id
FROM roles r
WHERE r.role_key = 'system_administrator'
AND NOT EXISTS (SELECT 1 FROM users)
LIMIT 1;
