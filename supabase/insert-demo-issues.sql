-- Demo Issues with Images for Society Hub
-- Run this SQL in Supabase SQL Editor to populate demo issues

-- Insert demo issues with realistic data and images from Unsplash
INSERT INTO issues (
  title,
  description,
  category,
  priority,
  status,
  created_by,
  image_url,
  vote_count,
  display_name,
  display_flat
) VALUES
(
  'Broken CCTV Camera in Parking Area',
  'The CCTV camera near parking slot B-15 has been non-functional for the past week. This is a security concern as the area is not being monitored.',
  'Security',
  'high',
  'open',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
  5,
  'Purva Chavan',
  'A-101'
),
(
  'Water Leakage in Common Corridor',
  'There is continuous water leakage from the ceiling in the 3rd floor corridor. The floor is always wet and slippery, creating a safety hazard.',
  'Plumbing',
  'critical',
  'in_progress',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
  12,
  'Yash Bandwane',
  'B-205'
),
(
  'Broken Street Light Near Gate 2',
  'The street light near Gate 2 has been broken for 3 days. The area becomes very dark at night making it unsafe for residents.',
  'Electrical',
  'high',
  'open',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
  8,
  'Tanmay Kolekar',
  'C-302'
),
(
  'Elevator Not Working in Building A',
  'The elevator in Building A has been out of service since yesterday. Senior citizens and families with children are facing difficulty.',
  'Maintenance',
  'critical',
  'in_progress',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  15,
  'Moksh Sonar',
  'A-405'
),
(
  'Damaged Playground Equipment',
  'The swing set in the children''s playground is broken and poses a safety risk. One of the chains is completely detached.',
  'Amenities',
  'medium',
  'open',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1560523159-6b681a1e1852?w=800',
  6,
  'Purva Chavan',
  'A-101'
),
(
  'Garbage Not Collected for 2 Days',
  'The garbage bins near Building B are overflowing. Collection has not happened for the past 2 days and it''s creating hygiene issues.',
  'Housekeeping',
  'high',
  'open',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800',
  9,
  'Yash Bandwane',
  'B-205'
),
(
  'Gym Equipment Needs Maintenance',
  'The treadmill in the gym is making unusual noises and the speed control is not working properly. Needs urgent servicing.',
  'Amenities',
  'medium',
  'resolved',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  4,
  'Tanmay Kolekar',
  'C-302'
),
(
  'Parking Slot Marking Faded',
  'The parking slot markings in the basement are completely faded. It''s difficult to identify individual slots causing parking disputes.',
  'Parking',
  'low',
  'open',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
  3,
  'Moksh Sonar',
  'A-405'
),
(
  'Swimming Pool Water Quality Issue',
  'The swimming pool water appears cloudy and has an unusual smell. The chlorine levels might need adjustment.',
  'Amenities',
  'medium',
  'in_progress',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800',
  7,
  'Purva Chavan',
  'A-101'
),
(
  'Main Gate Intercom Not Working',
  'The intercom system at the main gate is not functioning. Guards are unable to call residents for visitor verification.',
  'Security',
  'high',
  'open',
  (SELECT id FROM profiles LIMIT 1),
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
  10,
  'Yash Bandwane',
  'B-205'
);

-- Note: This SQL uses Unsplash images which are free to use
-- The images are relevant to each issue type
-- Make sure the profiles table has at least one user before running this
