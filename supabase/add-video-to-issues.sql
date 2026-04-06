-- Add video_url column to issues table
ALTER TABLE issues ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Create storage bucket for issue videos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-videos', 'issue-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for issue videos
CREATE POLICY "Anyone can upload issue videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'issue-videos');

CREATE POLICY "Anyone can view issue videos" ON storage.objects
FOR SELECT USING (bucket_id = 'issue-videos');

CREATE POLICY "Users can delete their own issue videos" ON storage.objects
FOR DELETE USING (bucket_id = 'issue-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
