-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table first
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role_key TEXT UNIQUE NOT NULL,
  description TEXT,
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
('Support Staff', 'support_staff', 'Basic staff access');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create test user
INSERT INTO users (email, full_name, role_id, status)
SELECT 
  'admin@example.com',
  'Admin User',
  roles.id,
  'active'
FROM roles 
WHERE role_key = 'system_admin';