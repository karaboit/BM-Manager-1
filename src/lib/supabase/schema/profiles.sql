-- Drop existing profiles table if it exists
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with proper constraints
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL,
    house_id UUID REFERENCES houses(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_role CHECK (role IN (
        'system_administrator',
        'director',
        'house_master',
        'deputy_house_master',
        'support_staff',
        'prefect',
        'medical_staff',
        'kitchen_staff',
        'boarder_parent',
        'boarder'
    ))
);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Enable RLS but allow all operations for development
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for development"
    ON profiles FOR ALL
    USING (true)
    WITH CHECK (true);
