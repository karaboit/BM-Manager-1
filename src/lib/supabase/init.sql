-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create houses table first (since profiles references it)
CREATE TABLE IF NOT EXISTS houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('system_administrator', 'director', 'house_master', 'deputy_house_master', 'support_staff', 'prefect', 'medical_staff', 'kitchen_staff', 'boarder_parent', 'boarder')),
    house_id UUID REFERENCES houses(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial houses
INSERT INTO houses (name) VALUES
    ('East Wing'),
    ('West Wing'),
    ('North Wing')
ON CONFLICT (name) DO NOTHING;

-- Insert initial admin user
INSERT INTO profiles (email, full_name, role)
VALUES ('admin@example.com', 'Admin User', 'system_administrator')
ON CONFLICT (email) DO NOTHING;
