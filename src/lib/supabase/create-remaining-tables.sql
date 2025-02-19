-- Create permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create role_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- Create events table if it doesn't exist
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

-- Create event_registrations table if it doesn't exist
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

-- Create chats table if it doesn't exist
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  allowed_roles TEXT[] DEFAULT '{}'
);

-- Create chat_participants table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_participants (
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (chat_id, user_id)
);

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  reply_to UUID REFERENCES messages(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Permissions are viewable by all users"
ON permissions FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only system administrators can modify permissions"
ON permissions
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'System Administrator'
  )
);

CREATE POLICY "Role permissions are viewable by all users"
ON role_permissions FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Only system administrators can modify role permissions"
ON role_permissions
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'System Administrator'
  )
);

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

CREATE POLICY "Users can view chats they are part of"
ON chats FOR SELECT
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM chat_participants
    WHERE chat_participants.chat_id = chats.id
    AND chat_participants.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = ANY(chats.allowed_roles)
  )
);

CREATE POLICY "Users can create group chats if authorized"
ON chats
FOR INSERT
TO PUBLIC
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master', 'Deputy House Master')
  )
);

CREATE POLICY "Chat participants can view their participation"
ON chat_participants FOR SELECT
TO PUBLIC
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master')
  )
);

CREATE POLICY "Users can manage their own chat participation"
ON chat_participants
FOR ALL
TO PUBLIC
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master')
  )
);

CREATE POLICY "Users can view messages in their chats"
ON messages FOR SELECT
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM chat_participants
    WHERE chat_participants.chat_id = messages.chat_id
    AND chat_participants.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = ANY(chats.allowed_roles)
    )
  )
);

CREATE POLICY "Users can send messages to their chats"
ON messages
FOR INSERT
TO PUBLIC
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_participants
    WHERE chat_participants.chat_id = messages.chat_id
    AND chat_participants.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = ANY(chats.allowed_roles)
    )
  )
);