-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Roles are viewable by all users"
ON roles FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only system administrators can modify roles"
ON roles
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'System Administrator'
  )
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('System Administrator', 'Full system access'),
('Director', 'School management access'),
('House Master', 'House management access'),
('Deputy House Master', 'Assistant house management access'),
('Support Staff', 'Basic staff access'),
('Prefect', 'Student leader access'),
('Medical Staff', 'Medical center access'),
('Kitchen Staff', 'Kitchen management access'),
('Boarder Parent', 'Parent access'),
('Boarder', 'Student access')
ON CONFLICT (name) DO NOTHING;