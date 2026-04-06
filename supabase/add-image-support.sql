-- Add image_url column to issues table if it doesn't exist
ALTER TABLE issues ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Fix post_comments table - rename content to comment if needed
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'post_comments' AND column_name = 'content'
  ) THEN
    ALTER TABLE post_comments RENAME COLUMN content TO comment;
  END IF;
END $$;

-- Create storage buckets for images (run these in Supabase Dashboard > Storage)
-- Bucket: community-images (public)
-- Bucket: issue-images (public)

-- Note: You need to create these buckets manually in Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create bucket "community-images" with public access
-- 3. Create bucket "issue-images" with public access
-- 4. Set policies to allow authenticated users to upload

-- Storage policies (apply after creating buckets):
-- For community-images bucket:
-- Policy: "Authenticated users can upload"
-- INSERT: auth.role() = 'authenticated'
-- 
-- Policy: "Anyone can view"
-- SELECT: true

-- For issue-images bucket:
-- Policy: "Authenticated users can upload"
-- INSERT: auth.role() = 'authenticated'
-- 
-- Policy: "Anyone can view"
-- SELECT: true
