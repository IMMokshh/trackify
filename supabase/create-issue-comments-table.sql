-- Create issue_comments table for storing comments on issues
CREATE TABLE IF NOT EXISTS issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_issue_comments_issue_id ON issue_comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_comments_user_id ON issue_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_issue_comments_created_at ON issue_comments(created_at);

-- Enable RLS
ALTER TABLE issue_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (drop if exists first)
DROP POLICY IF EXISTS "Anyone can view comments" ON issue_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON issue_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON issue_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON issue_comments;

CREATE POLICY "Anyone can view comments" ON issue_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON issue_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON issue_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON issue_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Add comment count to issues (optional, for performance)
ALTER TABLE issues ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Function to update comment count
CREATE OR REPLACE FUNCTION update_issue_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE issues SET comment_count = comment_count + 1 WHERE id = NEW.issue_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE issues SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.issue_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update comment count
DROP TRIGGER IF EXISTS trigger_update_issue_comment_count ON issue_comments;
CREATE TRIGGER trigger_update_issue_comment_count
AFTER INSERT OR DELETE ON issue_comments
FOR EACH ROW EXECUTE FUNCTION update_issue_comment_count();
