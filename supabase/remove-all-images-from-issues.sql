-- Remove all images from existing issues
-- Run this in Supabase SQL Editor to clear all image_url fields

-- This will set all image_url fields to NULL (remove all images)
UPDATE issues 
SET image_url = NULL, video_url = NULL;

-- Verify the changes
SELECT id, title, category, image_url, video_url FROM issues ORDER BY created_at DESC;
