-- Notices table for announcements
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  pinned BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Everyone can read notices
CREATE POLICY "Anyone can view notices"
  ON notices FOR SELECT
  USING (true);

-- Only authenticated users can create
CREATE POLICY "Authenticated users can create notices"
  ON notices FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own notices
CREATE POLICY "Users can update own notices"
  ON notices FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own notices
CREATE POLICY "Users can delete own notices"
  ON notices FOR DELETE
  USING (auth.uid() = created_by);
