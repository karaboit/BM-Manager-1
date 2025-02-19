-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);

-- Houses policies
CREATE POLICY "Houses are viewable by authenticated users"
ON houses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Houses can be managed by admins and directors"
ON houses FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director')
  )
);

-- Rooms policies
CREATE POLICY "Rooms are viewable by authenticated users"
ON rooms FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Rooms can be managed by house staff"
ON rooms FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master', 'Deputy House Master')
  )
);

-- Beds policies
CREATE POLICY "Beds are viewable by authenticated users"
ON beds FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Beds can be managed by house staff"
ON beds FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Director', 'House Master', 'Deputy House Master')
  )
);

-- Chats policies
CREATE POLICY "Users can view their chats"
ON chats FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_participants
    WHERE chat_participants.chat_id = id
    AND chat_participants.user_id = (
      SELECT id FROM profiles WHERE auth_id = auth.uid()
    )
  )
  OR
  type = 'group'
);

CREATE POLICY "Users can create chats"
ON chats FOR INSERT
TO authenticated
WITH CHECK (true);

-- Chat participants policies
CREATE POLICY "Users can view chat participants"
ON chat_participants FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_participants cp
    WHERE cp.chat_id = chat_id
    AND cp.user_id = (
      SELECT id FROM profiles WHERE auth_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can join chats"
ON chat_participants FOR INSERT
TO authenticated
WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view messages in their chats"
ON messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_participants
    WHERE chat_participants.chat_id = chat_id
    AND chat_participants.user_id = (
      SELECT id FROM profiles WHERE auth_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can send messages to their chats"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_participants
    WHERE chat_participants.chat_id = chat_id
    AND chat_participants.user_id = (
      SELECT id FROM profiles WHERE auth_id = auth.uid()
    )
  )
);