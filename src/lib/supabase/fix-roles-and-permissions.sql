-- First backup existing roles
CREATE TABLE IF NOT EXISTS roles_backup AS SELECT * FROM roles;

-- Create a mapping table for the roles we want to keep
CREATE TEMP TABLE role_mapping AS
SELECT DISTINCT ON (CASE
    WHEN role_key IN ('medical_staff', 'medical') THEN 'medical'
    WHEN role_key IN ('kitchen_staff', 'kitchen') THEN 'kitchen'
    WHEN role_key IN ('boarder_parent', 'parent') THEN 'parent'
    ELSE role_key
END)
    id,
    CASE
        WHEN role_key IN ('medical_staff', 'medical') THEN 'medical'
        WHEN role_key IN ('kitchen_staff', 'kitchen') THEN 'kitchen'
        WHEN role_key IN ('boarder_parent', 'parent') THEN 'parent'
        ELSE role_key
    END as new_role_key,
    CASE
        WHEN role_key IN ('medical_staff', 'medical') THEN 'Medical Staff'
        WHEN role_key IN ('kitchen_staff', 'kitchen') THEN 'Kitchen Staff'
        WHEN role_key IN ('boarder_parent', 'parent') THEN 'Boarder Parent'
        WHEN role_key = 'system_admin' THEN 'System Administrator'
        WHEN role_key = 'director' THEN 'Director'
        WHEN role_key = 'house_master' THEN 'House Master'
        WHEN role_key = 'deputy_master' THEN 'Deputy House Master'
        WHEN role_key = 'boarder' THEN 'Boarder'
        WHEN role_key = 'support_staff' THEN 'Support Staff'
        ELSE name
    END as new_name,
    CASE
        WHEN role_key IN ('medical_staff', 'medical') THEN 'Medical center access'
        WHEN role_key IN ('kitchen_staff', 'kitchen') THEN 'Kitchen management access'
        WHEN role_key IN ('boarder_parent', 'parent') THEN 'Parent access'
        WHEN role_key = 'system_admin' THEN 'Full system access'
        WHEN role_key = 'director' THEN 'School management access'
        WHEN role_key = 'house_master' THEN 'House management access'
        WHEN role_key = 'deputy_master' THEN 'Assistant house management access'
        WHEN role_key = 'boarder' THEN 'Student access'
        WHEN role_key = 'support_staff' THEN 'Support staff access'
        ELSE description
    END as new_description
FROM roles
ORDER BY 
    CASE
        WHEN role_key IN ('medical_staff', 'medical') THEN 'medical'
        WHEN role_key IN ('kitchen_staff', 'kitchen') THEN 'kitchen'
        WHEN role_key IN ('boarder_parent', 'parent') THEN 'parent'
        ELSE role_key
    END,
    created_at;

-- Update user references to point to the canonical role IDs
UPDATE users
SET role_id = rm.id
FROM roles r
JOIN role_mapping rm ON 
    CASE
        WHEN r.role_key IN ('medical_staff', 'medical') THEN 'medical'
        WHEN r.role_key IN ('kitchen_staff', 'kitchen') THEN 'kitchen'
        WHEN r.role_key IN ('boarder_parent', 'parent') THEN 'parent'
        ELSE r.role_key
    END = rm.new_role_key
WHERE users.role_id = r.id AND r.id != rm.id;

-- Same for user_profiles
UPDATE user_profiles
SET role_id = rm.id
FROM roles r
JOIN role_mapping rm ON 
    CASE
        WHEN r.role_key IN ('medical_staff', 'medical') THEN 'medical'
        WHEN r.role_key IN ('kitchen_staff', 'kitchen') THEN 'kitchen'
        WHEN r.role_key IN ('boarder_parent', 'parent') THEN 'parent'
        ELSE r.role_key
    END = rm.new_role_key
WHERE user_profiles.role_id = r.id AND r.id != rm.id;

-- Delete roles that aren't in our mapping and aren't referenced
DELETE FROM roles r
WHERE NOT EXISTS (
    SELECT 1 FROM role_mapping rm WHERE r.id = rm.id
) AND NOT EXISTS (
    SELECT 1 FROM users WHERE role_id = r.id
    UNION ALL
    SELECT 1 FROM user_profiles WHERE role_id = r.id
);

-- Update remaining roles with new values
UPDATE roles r
SET 
    role_key = rm.new_role_key,
    name = rm.new_name,
    description = rm.new_description
FROM role_mapping rm
WHERE r.id = rm.id;

-- Drop temporary tables
DROP TABLE role_mapping;

-- Verify the results
SELECT id, name, role_key, description 
FROM roles 
ORDER BY name;