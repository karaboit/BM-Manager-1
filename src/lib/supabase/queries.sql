-- Check roles table
SELECT * FROM roles;

-- Check user_profiles table
SELECT * FROM user_profiles;

-- Check users table with role and house relationships
SELECT 
  u.*,
  r.name as role_name,
  h.name as house_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN houses h ON u.house_id = h.id;

-- Check table constraints
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('roles', 'users', 'user_profiles');
