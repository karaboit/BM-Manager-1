-- Check if profiles table exists and its structure
SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles');

-- Check current schema
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Test insert
INSERT INTO profiles (email, full_name, role)
VALUES ('test@example.com', 'Test User', 'boarder')
RETURNING *;

-- Test select
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;

-- Test update
UPDATE profiles 
SET full_name = 'Updated Test User'
WHERE email = 'test@example.com'
RETURNING *;

-- Test delete
DELETE FROM profiles WHERE email = 'test@example.com';