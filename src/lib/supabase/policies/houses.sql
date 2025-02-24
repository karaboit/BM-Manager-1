-- Enable RLS on houses table
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view houses
CREATE POLICY "Houses are viewable by all authenticated users"
ON houses FOR SELECT
TO authenticated
USING (true);

-- Allow system administrators and directors to manage houses
CREATE POLICY "System administrators and directors can manage houses"
ON houses FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM users
    WHERE role_id IN (
      SELECT id FROM roles
      WHERE role_key IN ('system_administrator', 'director')
    )
  )
);