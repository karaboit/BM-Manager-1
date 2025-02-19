-- Drop existing tables if they exist
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Create roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create role_permissions table
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Roles are viewable by authenticated users"
ON roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only system administrators can modify roles"
ON roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'System Administrator'
  )
);

CREATE POLICY "Permissions are viewable by authenticated users"
ON permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only system administrators can modify permissions"
ON permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'System Administrator'
  )
);

CREATE POLICY "Role permissions are viewable by authenticated users"
ON role_permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only system administrators can modify role permissions"
ON role_permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'System Administrator'
  )
);

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
('manage_users', 'Can create, update, and delete users'),
('manage_roles', 'Can create, update, and delete roles'),
('manage_houses', 'Can create, update, and delete houses'),
('manage_rooms', 'Can create, update, and delete rooms'),
('manage_beds', 'Can create, update, and delete beds'),
('manage_medical', 'Can access and manage medical records'),
('manage_kitchen', 'Can access and manage kitchen operations'),
('manage_attendance', 'Can manage attendance records'),
('manage_discipline', 'Can manage disciplinary records'),
('manage_leave', 'Can manage leave requests'),
('manage_events', 'Can create and manage events'),
('manage_maintenance', 'Can manage maintenance requests'),
('view_reports', 'Can view system reports'),
('manage_system', 'Can manage system settings')
ON CONFLICT (name) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('System Administrator', 'Full system access'),
('Director', 'School management access'),
('House Master', 'House management access'),
('Deputy House Master', 'Assistant house management access'),
('Support Staff', 'Basic staff access'),
('Prefect', 'Boarder leader access'),
('Medical Staff', 'Medical center access'),
('Kitchen Staff', 'Kitchen management access'),
('Boarder Parent', 'Parent access'),
('Boarder', 'Boarder access')
ON CONFLICT (name) DO NOTHING;