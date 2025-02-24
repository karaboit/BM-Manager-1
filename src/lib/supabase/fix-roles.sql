-- First, let's backup existing roles
CREATE TABLE IF NOT EXISTS roles_backup AS SELECT * FROM roles;

-- Now update the roles table with proper keys
UPDATE roles
SET role_key = CASE name
    WHEN 'System Administrator' THEN 'system_admin'
    WHEN 'Director' THEN 'director'
    WHEN 'House Master' THEN 'house_master'
    WHEN 'Deputy House Master' THEN 'deputy_master'
    WHEN 'Medical Staff' THEN 'medical'
    WHEN 'Kitchen Staff' THEN 'kitchen'
    WHEN 'Boarder Parent' THEN 'parent'
    WHEN 'Boarder' THEN 'boarder'
    ELSE lower(regexp_replace(name, '[^a-zA-Z0-9]+', '_'))
END
WHERE true;

-- Insert any missing roles
INSERT INTO roles (name, role_key, description)
SELECT d.name, d.role_key, d.description
FROM (VALUES
    ('System Administrator', 'system_admin', 'Full system access'),
    ('Director', 'director', 'School management access'),
    ('House Master', 'house_master', 'House management access'),
    ('Deputy House Master', 'deputy_master', 'Assistant house management access'),
    ('Medical Staff', 'medical', 'Medical center access'),
    ('Kitchen Staff', 'kitchen', 'Kitchen management access'),
    ('Boarder Parent', 'parent', 'Parent access'),
    ('Boarder', 'boarder', 'Student access')
) AS d(name, role_key, description)
WHERE NOT EXISTS (
    SELECT 1 FROM roles r WHERE r.role_key = d.role_key
);