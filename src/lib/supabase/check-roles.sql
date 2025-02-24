-- Check current roles
SELECT * FROM roles ORDER BY name;

-- Check current user_profiles
SELECT 
  up.*,
  r.name as role_name,
  r.role_key
FROM user_profiles up
LEFT JOIN roles r ON up.role_id = r.id
ORDER BY up.created_at;

-- Check current users
SELECT 
  u.*,
  r.name as role_name,
  r.role_key,
  h.name as house_name,
  rm.room_number
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN houses h ON u.house_id = h.id
LEFT JOIN rooms rm ON u.room_id = rm.id
ORDER BY u.created_at;