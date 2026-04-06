-- ============================================================
-- SAFE REPLACEMENT — OPEN ISSUES WITH IMAGES
-- Greenwood Heights CHS
-- Step 1: Deletes old demo issues by title (safe — no TRUNCATE)
-- Step 2: Inserts corrected issues with proper image URLs
-- ============================================================

-- ============================================================
-- STEP 1: DELETE OLD DEMO ISSUES ONLY
-- Targets exact titles from previous demo inserts.
-- Any issue not in this list is untouched.
-- ============================================================

DELETE FROM issue_comments
WHERE issue_id IN (
  SELECT id FROM issues WHERE title IN (
    'Basement Camera Not Working',
    'Broken Light in Yard',
    'CCTV Not Working',
    'Elevator Malfunction',
    'Garbage Not Collected',
    'Overgrown Garden',
    'Broken Gym Equipment',
    'Intercom Not Working',
    'Corridor Leakage',
    'Faded Parking Lines',
    'Broken Playground',
    'Contaminated Pool',
    'Dark Staircase Lighting',
    'Low Water Pressure',
    -- Also catch the new-style titles in case they were inserted before
    'Basement Security Camera Not Functioning',
    'Yard Light Broken Near Children Play Area',
    'Main Gate CCTV Camera Damaged',
    'Elevator Doors Not Closing Properly — A Wing',
    'Garbage Not Collected for 3 Days — C Wing',
    'Garden Severely Overgrown — Main Entrance Pathway',
    'Gym Treadmill and Cross-Trainer Out of Order',
    'Intercom Dead in Multiple B-Wing Flats',
    'Water Seeping Through Corridor Ceiling — D Wing Floor 4',
    'Parking Slot Markings Completely Faded — B Wing Lot',
    'Playground Slide and Swing Set Damaged',
    'Swimming Pool Water Appears Green and Cloudy',
    'Staircase Lights Not Working — C Wing Floors 6 to 9',
    'Very Low Water Pressure on Upper Floors — A Wing'
  )
);

DELETE FROM issue_votes
WHERE issue_id IN (
  SELECT id FROM issues WHERE title IN (
    'Basement Camera Not Working',
    'Broken Light in Yard',
    'CCTV Not Working',
    'Elevator Malfunction',
    'Garbage Not Collected',
    'Overgrown Garden',
    'Broken Gym Equipment',
    'Intercom Not Working',
    'Corridor Leakage',
    'Faded Parking Lines',
    'Broken Playground',
    'Contaminated Pool',
    'Dark Staircase Lighting',
    'Low Water Pressure',
    'Basement Security Camera Not Functioning',
    'Yard Light Broken Near Children Play Area',
    'Main Gate CCTV Camera Damaged',
    'Elevator Doors Not Closing Properly — A Wing',
    'Garbage Not Collected for 3 Days — C Wing',
    'Garden Severely Overgrown — Main Entrance Pathway',
    'Gym Treadmill and Cross-Trainer Out of Order',
    'Intercom Dead in Multiple B-Wing Flats',
    'Water Seeping Through Corridor Ceiling — D Wing Floor 4',
    'Parking Slot Markings Completely Faded — B Wing Lot',
    'Playground Slide and Swing Set Damaged',
    'Swimming Pool Water Appears Green and Cloudy',
    'Staircase Lights Not Working — C Wing Floors 6 to 9',
    'Very Low Water Pressure on Upper Floors — A Wing'
  )
);

DELETE FROM issues WHERE title IN (
  'Basement Camera Not Working',
  'Broken Light in Yard',
  'CCTV Not Working',
  'Elevator Malfunction',
  'Garbage Not Collected',
  'Overgrown Garden',
  'Broken Gym Equipment',
  'Intercom Not Working',
  'Corridor Leakage',
  'Faded Parking Lines',
  'Broken Playground',
  'Contaminated Pool',
  'Dark Staircase Lighting',
  'Low Water Pressure',
  'Basement Security Camera Not Functioning',
  'Yard Light Broken Near Children Play Area',
  'Main Gate CCTV Camera Damaged',
  'Elevator Doors Not Closing Properly — A Wing',
  'Garbage Not Collected for 3 Days — C Wing',
  'Garden Severely Overgrown — Main Entrance Pathway',
  'Gym Treadmill and Cross-Trainer Out of Order',
  'Intercom Dead in Multiple B-Wing Flats',
  'Water Seeping Through Corridor Ceiling — D Wing Floor 4',
  'Parking Slot Markings Completely Faded — B Wing Lot',
  'Playground Slide and Swing Set Damaged',
  'Swimming Pool Water Appears Green and Cloudy',
  'Staircase Lights Not Working — C Wing Floors 6 to 9',
  'Very Low Water Pressure on Upper Floors — A Wing'
);

-- ============================================================
-- STEP 2: INSERT CORRECTED ISSUES WITH PROPER IMAGE URLs
-- All status = 'open', all have correct image_url
-- ============================================================

INSERT INTO issues (title, description, category, priority, status, image_url, created_at) VALUES

(
  'Basement Security Camera Not Functioning',
  'The surveillance camera installed in the B-Wing basement parking area has stopped recording. The indicator light is off and the feed shows a blank screen on the security monitor. Residents have reported feeling unsafe while accessing their vehicles at night. This needs urgent attention as the basement has had prior incidents of vehicle damage.',
  'Security', 'high', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/basement.jpg',
  NOW() - INTERVAL '1 day'
),

(
  'Yard Light Broken Near Children Play Area',
  'The overhead light fixture in the society yard near the children''s play area has a broken casing and the bulb is shattered. The area is completely dark after 7 PM making it unsafe for children and elderly residents who use the garden in the evening. The broken glass from the fixture is also a hazard on the ground below.',
  'Electrical', 'medium', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/broken light.jpg',
  NOW() - INTERVAL '2 days'
),

(
  'Main Gate CCTV Camera Damaged',
  'The CCTV camera mounted above the main entrance gate has a cracked lens and is tilted at the wrong angle due to physical damage. It is no longer covering the entry point effectively. Visitors are entering without being recorded. The security guard has confirmed the live feed from this camera is distorted and unusable.',
  'Security', 'high', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/cctv.jpg',
  NOW() - INTERVAL '3 hours'
),

(
  'Elevator Doors Not Closing Properly — A Wing',
  'The elevator in A-Wing is malfunctioning — the doors take 30 to 40 seconds to close and occasionally reopen without anyone pressing the button. The floor display panel is also flickering. Residents on higher floors are experiencing significant delays. Elderly residents and those with mobility issues are particularly affected.',
  'Maintenance', 'critical', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/elevator.jpg',
  NOW() - INTERVAL '6 hours'
),

(
  'Garbage Not Collected for 3 Days — C Wing',
  'The garbage bins outside C-Wing have not been emptied for the past 3 days. The bins are overflowing and waste is spilling onto the footpath. The smell is spreading to the nearby staircase entrance. Flies and stray animals have been spotted near the area. Residents with ground floor flats are most affected.',
  'Housekeeping', 'high', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/garbage.jpg',
  NOW() - INTERVAL '1 day'
),

(
  'Garden Severely Overgrown — Main Entrance Pathway',
  'The garden along the main entrance pathway has not been maintained for several weeks. Grass has grown over the footpath edges, shrubs are blocking the walkway, and dead branches are scattered across the garden bed. The overgrowth is also covering the pathway lights making the entrance area dim at night.',
  'Maintenance', 'low', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/garden.jpg',
  NOW() - INTERVAL '5 days'
),

(
  'Gym Treadmill and Cross-Trainer Out of Order',
  'Two major pieces of equipment in the society gym are currently non-functional. The treadmill belt has snapped and is bunched up at the rear, posing a tripping hazard. The cross-trainer has a broken pedal arm that wobbles dangerously during use. Both machines have handwritten "Out of Order" notes taped on them but no repair has been scheduled.',
  'Amenities', 'medium', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/gym.jpg',
  NOW() - INTERVAL '4 days'
),

(
  'Intercom Dead in Multiple B-Wing Flats',
  'The intercom system is not working in at least 6 flats on floors 3 to 5 of B-Wing. Residents cannot receive calls from the main gate when visitors arrive. The security guard has to manually call residents on their mobile phones. The issue started after a power fluctuation last week and has not been resolved since.',
  'Maintenance', 'medium', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/intercom.jpg',
  NOW() - INTERVAL '7 days'
),

(
  'Water Seeping Through Corridor Ceiling — D Wing Floor 4',
  'There is active water leakage from the ceiling of the 4th floor corridor in D-Wing. A damp patch approximately 3 feet wide has formed and water is dripping onto the floor below. The area has been marked with a wet floor sign but the root cause has not been investigated. The leakage worsens after the overhead tank is filled each morning.',
  'Plumbing', 'high', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/leakage.jpg',
  NOW() - INTERVAL '2 days'
),

(
  'Parking Slot Markings Completely Faded — B Wing Lot',
  'The painted slot numbers and boundary lines in the B-Wing parking lot have faded to the point of being invisible. This is causing daily disputes between residents over slot ownership. At least 3 complaints have been raised in the last week alone. The lack of clear markings is also causing vehicles to park at angles that block adjacent slots.',
  'Parking', 'medium', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/parkingslot.jpg',
  NOW() - INTERVAL '10 days'
),

(
  'Playground Slide and Swing Set Damaged',
  'The children''s playground equipment is in a dangerous state. The slide has a cracked side panel with a sharp exposed edge at child height. One of the swing chains is broken and the seat is hanging at an angle. A child reportedly got a minor cut last week from the slide. The equipment needs immediate inspection and repair before further injuries occur.',
  'Amenities', 'high', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/playground.jpg',
  NOW() - INTERVAL '3 days'
),

(
  'Swimming Pool Water Appears Green and Cloudy',
  'The society swimming pool water has turned visibly green and cloudy over the past 4 days. There is an unusual smell near the pool area. The pool maintenance log shows the last chemical treatment was over 10 days ago. Several residents who used the pool earlier this week have reported skin irritation. The pool should be closed and treated immediately.',
  'Amenities', 'critical', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/pool.jpg',
  NOW() - INTERVAL '4 days'
),

(
  'Staircase Lights Not Working — C Wing Floors 6 to 9',
  'All staircase lights between floors 6 and 9 in C-Wing are non-functional. Residents using the stairs during power cuts or for exercise are navigating in complete darkness. The issue appears to be a tripped circuit rather than individual bulb failures as all lights in that section went out simultaneously. This is a serious safety concern especially for elderly residents.',
  'Electrical', 'high', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/staircase.jpg',
  NOW() - INTERVAL '1 day'
),

(
  'Very Low Water Pressure on Upper Floors — A Wing',
  'Residents on floors 8 through 14 of A-Wing are experiencing critically low water pressure since the past 5 days. The flow is barely enough to fill a bucket in 10 minutes. Morning peak hours between 6 AM and 9 AM are the worst. The issue is suspected to be a partially closed valve or a blockage in the riser pipe. Multiple residents have submitted verbal complaints to the watchman.',
  'Plumbing', 'high', 'open',
  'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/waterpressure.webp',
  NOW() - INTERVAL '5 days'
);

