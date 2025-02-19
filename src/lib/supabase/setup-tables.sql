-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create houses table first
CREATE TABLE IF NOT EXISTS houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 3: Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('system_administrator', 'director', 'house_master', 'deputy_house_master', 'support_staff', 'prefect', 'medical_staff', 'kitchen_staff', 'boarder_parent', 'boarder')),
    house_id UUID REFERENCES houses(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 4: Insert test data
INSERT INTO houses (name) VALUES ('East Wing')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (email, full_name, role)
VALUES ('admin@example.com', 'Admin User', 'system_administrator')
ON CONFLICT (email) DO NOTHING;