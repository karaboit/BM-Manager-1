-- Step 1: Check if profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
);

-- Step 2: Check table structure
SELECT 
    column_name, 
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Step 3: Check if uuid-ossp extension is enabled
SELECT EXISTS (
    SELECT FROM pg_extension WHERE extname = 'uuid-ossp'
);