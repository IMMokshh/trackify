-- Add sample issues with images for demo
-- Replace the image URLs with your actual image URLs

-- Get the user ID (replace with your actual user ID from profiles table)
-- Run this first to get your user ID: SELECT id FROM profiles WHERE email = 'moksh@societyhub.com';

-- Sample Issue 1: Broken CCTV Camera
INSERT INTO issues (
  title,
  description,
  category,
  priority,
  status,
  created_by,
  image_url,
  created_at
) VALUES (
  'Broken CCTV Camera at Main Gate',
  'The CCTV camera at the main entrance is not working. It has been damaged and needs immediate replacement for security purposes.',
  'Security',
  'high',
  'open',
  'e39ac55b-9a41-4da3-abde-1eb0b03c57d7', -- Replace with your user ID
  'https://your-image-url.com/broken-cctv.jpg', -- Replace with actual image URL
  NOW() - INTERVAL '2 days'
);

-- Sample Issue 2: Water Leakage
INSERT INTO issues (
  title,
  description,
  category,
  priority,
  status,
  created_by,
  image_url,
  created_at
) VALUES (
  'Water Leakage in Basement Parking',
  'There is severe water leakage in the basement parking area near pillar B-12. Water is accumulating and causing damage to vehicles.',
  'Plumbing',
  'critical',
  'in_progress',
  'e39ac55b-9a41-4da3-abde-1eb0b03c57d7', -- Replace with your user ID
  'https://your-image-url.com/water-leak.jpg', -- Replace with actual image URL
  NOW() - INTERVAL '1 day'
);

-- Sample Issue 3: Broken Lift
INSERT INTO issues (
  title,
  description,
  category,
  priority,
  status,
  created_by,
  image_url,
  created_at
) VALUES (
  'Lift Not Working in Building A',
  'The lift in Building A has stopped working since yesterday. Residents are facing difficulty, especially elderly people.',
  'Maintenance',
  'high',
  'open',
  'e39ac55b-9a41-4da3-abde-1eb0b03c57d7', -- Replace with your user ID
  'https://your-image-url.com/broken-lift.jpg', -- Replace with actual image URL
  NOW() - INTERVAL '12 hours'
);

-- Sample Issue 4: Damaged Street Light
INSERT INTO issues (
  title,
  description,
  category,
  priority,
  status,
  created_by,
  image_url,
  created_at
) VALUES (
  'Street Light Not Working Near Gate 2',
  'The street light near Gate 2 is not working, making the area dark and unsafe during night time.',
  'Electrical',
  'medium',
  'open',
  'e39ac55b-9a41-4da3-abde-1eb0b03c57d7', -- Replace with your user ID
  'https://your-image-url.com/street-light.jpg', -- Replace with actual image URL
  NOW() - INTERVAL '6 hours'
);

-- To use this:
-- 1. Upload your images to a hosting service (Imgur, Google Drive public link, etc.)
-- 2. Replace the image URLs above with your actual URLs
-- 3. Replace the user ID with your actual user ID
-- 4. Run this SQL in Supabase SQL Editor
