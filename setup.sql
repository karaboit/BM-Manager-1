-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
      'System Administrator',
      'Director',
      'House Master',
      'Deputy House Master',
      'Support Staff',
      'Prefect',
      'Medical Staff',
      'Kitchen Staff',
      'Boarder Parent',
      'Boarder'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('Active', 'Inactive', 'Pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE house_status AS ENUM ('Active', 'Maintenance', 'Inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE room_status AS ENUM ('Available', 'Occupied', 'Maintenance');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE bed_status AS ENUM ('Available', 'Occupied', 'Maintenance');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create core tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  role user_role NOT NULL,
  status user_status DEFAULT 'Active',
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create boarding module tables
CREATE TABLE IF NOT EXISTS public.houses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  capacity int NOT NULL,
  house_master_id uuid REFERENCES profiles(id),
  deputy_master_id uuid REFERENCES profiles(id),
  status house_status DEFAULT 'Active',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id uuid REFERENCES houses(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  capacity int NOT NULL,
  status room_status DEFAULT 'Available',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(house_id, room_number)
);

CREATE TABLE IF NOT EXISTS public.beds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  bed_number text NOT NULL,
  status bed_status DEFAULT 'Available',
  current_boarder_id uuid REFERENCES profiles(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(room_id, bed_number)
);

-- Create messaging tables
CREATE TABLE IF NOT EXISTS public.chats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text CHECK (type IN ('direct', 'group')),
  name text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_participants (
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count int DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  reply_to uuid REFERENCES messages(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE auth_id = auth.uid()
      AND role IN ('System Administrator', 'Director')
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER set_timestamp_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp_houses
  BEFORE UPDATE ON houses
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp_rooms
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp_beds
  BEFORE UPDATE ON beds
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp_chats
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert test data
INSERT INTO profiles (full_name, role, status, email, phone)
SELECT
  'Admin User',
  'System Administrator'::user_role,
  'Active'::user_status,
  'admin@example.com',
  '+1234567890'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'admin@example.com'
);

INSERT INTO profiles (full_name, role, status, email, phone)
SELECT
  'Director Smith',
  'Director'::user_role,
  'Active'::user_status,
  'director@example.com',
  '+1234567891'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'director@example.com'
);

INSERT INTO profiles (full_name, role, status, email, phone)
SELECT
  'Mr. James Brown',
  'House Master'::user_role,
  'Active'::user_status,
  'james@example.com',
  '+1234567892'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'james@example.com'
);

INSERT INTO profiles (full_name, role, status, email, phone)
SELECT
  'Ms. Jane Wilson',
  'Deputy House Master'::user_role,
  'Active'::user_status,
  'jane@example.com',
  '+1234567893'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'jane@example.com'
);

INSERT INTO profiles (full_name, role, status, email, phone)
SELECT
  'Dr. Sarah Wilson',
  'Medical Staff'::user_role,
  'Active'::user_status,
  'sarah@example.com',
  '+1234567894'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'sarah@example.com'
);

INSERT INTO profiles (full_name, role, status, email, phone)
SELECT
  'Chef Johnson',
  'Kitchen Staff'::user_role,
  'Active'::user_status,
  'chef@example.com',
  '+1234567895'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'chef@example.com'
);