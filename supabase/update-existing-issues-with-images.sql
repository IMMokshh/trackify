-- Update existing issues with images
-- Run this in Supabase SQL Editor

-- First, let's see what issues you have
-- SELECT id, title, category FROM issues ORDER BY created_at DESC;

-- Update issues based on category with relevant images
-- Replace the WHERE conditions to match your actual issue titles or IDs

-- For Security/CCTV related issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800'
WHERE category = 'Security' AND image_url IS NULL;

-- For Plumbing/Water issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
WHERE category = 'Plumbing' AND image_url IS NULL;

-- For Electrical issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800'
WHERE category = 'Electrical' AND image_url IS NULL;

-- For Maintenance issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'
WHERE category = 'Maintenance' AND image_url IS NULL;

-- For Amenities/Playground issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1560523159-6b681a1e1852?w=800'
WHERE category = 'Amenities' AND image_url IS NULL;

-- For Housekeeping/Garbage issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800'
WHERE category = 'Housekeeping' AND image_url IS NULL;

-- For Parking issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800'
WHERE category = 'Parking' AND image_url IS NULL;

-- For Noise issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?w=800'
WHERE category = 'Noise' AND image_url IS NULL;

-- For Other/General issues
UPDATE issues 
SET image_url = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
WHERE category = 'Other' AND image_url IS NULL;

-- Or update specific issues by ID (if you know the ID)
-- UPDATE issues SET image_url = 'https://images.unsplash.com/photo-XXXXX?w=800' WHERE id = 'your-issue-id-here';

-- Verify the updates
SELECT id, title, category, image_url FROM issues ORDER BY created_at DESC;
