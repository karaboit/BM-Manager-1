-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table first
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role_key TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create houses table
CREATE TABLE IF NOT EXISTS houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  capacity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number TEXT NOT NULL,
  house_id UUID REFERENCES houses(id),
  capacity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  last_cleaned TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  house_id UUID REFERENCES houses(id),
  room_id UUID REFERENCES rooms(id),
  status TEXT DEFAULT 'active',
  phone TEXT,
  address TEXT,
  emergency_contact TEXT,
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
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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

-- Create indexes
CREATE INDEX IF NOT EXISTS users_role_id_idx ON users(role_id);
CREATE INDEX IF NOT EXISTS users_house_id_idx ON users(house_id);
CREATE INDEX IF NOT EXISTS users_room_id_idx ON users(room_id);
CREATE INDEX IF NOT EXISTS rooms_house_id_idx ON rooms(house_id);