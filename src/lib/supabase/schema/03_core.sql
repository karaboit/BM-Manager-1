-- Create houses table
CREATE TABLE IF NOT EXISTS houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  house_id UUID REFERENCES houses(id),
  floor INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create beds table
CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  room_id UUID REFERENCES rooms(id),
  boarder_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Houses are viewable by all users"
ON houses FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only authorized staff can modify houses"
ON houses
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master')
  )
);

CREATE POLICY "Rooms are viewable by all users"
ON rooms FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only authorized staff can modify rooms"
ON rooms
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master')
  )
);

CREATE POLICY "Beds are viewable by all users"
ON beds FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only authorized staff can modify beds"
ON beds
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master')
  )
);