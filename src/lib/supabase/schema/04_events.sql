-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  max_participants INTEGER,
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id),
  boarder_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'Registered' CHECK (status IN ('Registered', 'Cancelled', 'Attended')),
  packed_meals TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, boarder_id)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Events are viewable by all users"
ON events FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only authorized staff can modify events"
ON events
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master', 'Deputy House Master')
  )
);

CREATE POLICY "Event registrations are viewable by all users"
ON event_registrations FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Users can manage their own event registrations"
ON event_registrations
FOR ALL
TO PUBLIC
USING (
  auth.uid() = boarder_id OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master', 'Deputy House Master')
  )
);