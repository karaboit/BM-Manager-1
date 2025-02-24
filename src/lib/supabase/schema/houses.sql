-- Enable RLS
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view houses
CREATE POLICY "Houses are viewable by authenticated users"
ON houses FOR SELECT
USING (true);

-- Allow system administrators and directors to manage houses
CREATE POLICY "System administrators and directors can manage houses"
ON houses FOR INSERT
USING (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role_id IN (
        SELECT id FROM roles
        WHERE role_key IN ('system_administrator', 'director')
      )
    )
  )
);

CREATE POLICY "System administrators and directors can update houses"
ON houses FOR UPDATE
USING (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role_id IN (
        SELECT id FROM roles
        WHERE role_key IN ('system_administrator', 'director')
      )
    )
  )
);

CREATE POLICY "System administrators and directors can delete houses"
ON houses FOR DELETE
USING (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role_id IN (
        SELECT id FROM roles
        WHERE role_key IN ('system_administrator', 'director')
      )
    )
  )
);