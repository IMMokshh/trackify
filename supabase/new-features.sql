-- Polls Table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  anonymous BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Poll Votes Table
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  option TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Marketplace Table
CREATE TABLE IF NOT EXISTS marketplace (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  category TEXT NOT NULL,
  contact TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile Pictures (add column to profiles table)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Enable RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Polls
CREATE POLICY "Anyone can view polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Users can create polls" ON polls FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own polls" ON polls FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own polls" ON polls FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for Poll Votes
CREATE POLICY "Anyone can view votes" ON poll_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change vote" ON poll_votes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Marketplace
CREATE POLICY "Anyone can view listings" ON marketplace FOR SELECT USING (true);
CREATE POLICY "Users can create listings" ON marketplace FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON marketplace FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON marketplace FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX idx_marketplace_created_at ON marketplace(created_at DESC);
CREATE INDEX idx_marketplace_category ON marketplace(category);

-- Storage Buckets (run these in Supabase Dashboard -> Storage)
-- Create bucket: marketplace-images (public)
-- Create bucket: profile-avatars (public)
