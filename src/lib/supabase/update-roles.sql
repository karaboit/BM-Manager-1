-- First, let's drop the existing roles if they conflict
DELETE FROM roles WHERE name IN (
  'System Administrator',
  'Director',
  'House Master',
  'Deputy House Master',
  'Medical Staff',
  'Kitchen Staff',
  'Boarder Parent',
  'Boarder'
);

-- Now insert roles with proper role_keys
INSERT INTO roles (name, role_key, description) VALUES
('System Administrator', 'system_admin', 'Full system access'),
('Director', 'director', 'School management access'),
('House Master', 'house_master', 'House management access'),
('Deputy House Master', 'deputy_master', 'Assistant house management access'),
('Medical Staff', 'medical', 'Medical center access'),
('Kitchen Staff', 'kitchen', 'Kitchen management access'),
('Boarder Parent', 'parent', 'Parent access'),
('Boarder', 'boarder', 'Student access');

-- Verify the insertion
SELECT * FROM roles ORDER BY created_at;