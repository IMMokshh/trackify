-- ============================================================
-- DUMMY COMMENTS SEED — Greenwood Heights CHS
-- Uses real user IDs from profiles table (no hardcoding)
-- Links comments to issues by title (safe lookup)
-- Run in Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  admin_id   UUID;
  moksh_id   UUID;
  issue_id   UUID;
BEGIN

  -- Fetch real user IDs from profiles
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin'    LIMIT 1;
  SELECT id INTO moksh_id FROM profiles WHERE role = 'resident' LIMIT 1;

  IF admin_id IS NULL OR moksh_id IS NULL THEN
    RAISE EXCEPTION 'Users not found. Make sure profiles table has admin and resident users.';
  END IF;

  -- ============================================================
  -- ISSUE: Basement Security Camera Not Functioning
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Basement Security Camera%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'This camera has been off for 2 days now. Anyone else noticed?', NOW() - INTERVAL '1 day 10 hours'),
    (issue_id, admin_id, 'Acknowledged. We have raised a request with the security vendor. Will update by tomorrow.', NOW() - INTERVAL '1 day 8 hours'),
    (issue_id, moksh_id, 'Please prioritize this — the basement feels unsafe at night without it.', NOW() - INTERVAL '20 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Yard Light Broken Near Children Play Area
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Yard Light Broken%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'Kids play here in the evening. This is a safety issue, please fix ASAP.', NOW() - INTERVAL '2 days 5 hours'),
    (issue_id, admin_id, 'Noted. Electrician has been informed and will visit tomorrow morning.', NOW() - INTERVAL '2 days 3 hours'),
    (issue_id, moksh_id, 'Still not fixed. It has been 2 days.', NOW() - INTERVAL '1 day 2 hours'),
    (issue_id, admin_id, 'Apologies for the delay. Part replacement is pending. Expected fix by end of day.', NOW() - INTERVAL '22 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Main Gate CCTV Camera Damaged
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Main Gate CCTV%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'The camera has been like this since yesterday. Who is responsible for this?', NOW() - INTERVAL '2 hours 30 minutes'),
    (issue_id, admin_id, 'We are aware. Security team is reviewing. Replacement camera is being arranged.', NOW() - INTERVAL '1 hour 45 minutes'),
    (issue_id, moksh_id, 'Please update us once it is fixed. This is the main entrance.', NOW() - INTERVAL '1 hour');
  END IF;

  -- ============================================================
  -- ISSUE: Elevator Doors Not Closing Properly
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Elevator Doors%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'Took 5 minutes just to get the lift to close today. Very frustrating.', NOW() - INTERVAL '5 hours'),
    (issue_id, admin_id, 'Lift technician has been called. Scheduled visit today between 2 PM and 5 PM.', NOW() - INTERVAL '4 hours'),
    (issue_id, moksh_id, 'My elderly mother uses this lift daily. Please fix it urgently.', NOW() - INTERVAL '3 hours'),
    (issue_id, admin_id, 'Technician is on site. Issue is being diagnosed. Will update shortly.', NOW() - INTERVAL '1 hour 30 minutes'),
    (issue_id, moksh_id, 'Thank you for the quick response.', NOW() - INTERVAL '1 hour');
  END IF;

  -- ============================================================
  -- ISSUE: Garbage Not Collected for 3 Days
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Garbage Not Collected%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'The smell is unbearable near the C-Wing entrance. Please escalate this.', NOW() - INTERVAL '23 hours'),
    (issue_id, admin_id, 'We have contacted the housekeeping agency. Collection will happen today by 6 PM.', NOW() - INTERVAL '20 hours'),
    (issue_id, moksh_id, 'Still not collected as of 7 PM. What is happening?', NOW() - INTERVAL '17 hours'),
    (issue_id, admin_id, 'Apologies. The agency had a staff shortage. Extra team dispatched now.', NOW() - INTERVAL '16 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Garden Severely Overgrown
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Garden Severely Overgrown%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'The pathway is almost blocked now. Raised this last week too.', NOW() - INTERVAL '4 days'),
    (issue_id, admin_id, 'Gardening team will be here this weekend for a full cleanup.', NOW() - INTERVAL '3 days 18 hours'),
    (issue_id, moksh_id, 'Okay, thank you. Please also trim the shrubs near the gate lights.', NOW() - INTERVAL '3 days');
  END IF;

  -- ============================================================
  -- ISSUE: Gym Treadmill and Cross-Trainer Out of Order
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Gym Treadmill%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'Both machines have been broken for almost a week. When will they be repaired?', NOW() - INTERVAL '3 days 12 hours'),
    (issue_id, admin_id, 'Repair vendor has been contacted. Spare parts are being sourced.', NOW() - INTERVAL '3 days 8 hours'),
    (issue_id, moksh_id, 'Can we get an estimated date? Many residents use these daily.', NOW() - INTERVAL '2 days 10 hours'),
    (issue_id, admin_id, 'Expected repair by end of this week. We will notify once done.', NOW() - INTERVAL '2 days 6 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Intercom Dead in Multiple B-Wing Flats
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Intercom Dead%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'Our intercom has been dead since the power fluctuation last week.', NOW() - INTERVAL '6 days'),
    (issue_id, admin_id, 'We are aware. The intercom panel on floors 3-5 needs a reset. Technician visiting tomorrow.', NOW() - INTERVAL '5 days 20 hours'),
    (issue_id, moksh_id, 'Still not working. The technician did not show up yesterday.', NOW() - INTERVAL '4 days 10 hours'),
    (issue_id, admin_id, 'Apologies for the missed visit. Rescheduled for today afternoon.', NOW() - INTERVAL '4 days 6 hours'),
    (issue_id, moksh_id, 'Finally working now. Thank you.', NOW() - INTERVAL '3 days');
  END IF;

  -- ============================================================
  -- ISSUE: Water Seeping Through Corridor Ceiling
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Water Seeping Through Corridor%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'The dripping gets worse every morning after the tank fills. Floor is slippery.', NOW() - INTERVAL '1 day 18 hours'),
    (issue_id, admin_id, 'Plumber has been assigned. Will inspect the overhead pipe connection today.', NOW() - INTERVAL '1 day 14 hours'),
    (issue_id, moksh_id, 'Please also check if it is affecting the flat above. The ceiling looks stained.', NOW() - INTERVAL '1 day 10 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Parking Slot Markings Completely Faded
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Parking Slot Markings%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'There was an argument yesterday because of this. Slot numbers are invisible.', NOW() - INTERVAL '9 days'),
    (issue_id, admin_id, 'Repainting has been scheduled for next Saturday morning.', NOW() - INTERVAL '8 days 16 hours'),
    (issue_id, moksh_id, 'Good. Please also repaint the visitor slots near the gate.', NOW() - INTERVAL '8 days'),
    (issue_id, admin_id, 'Noted. Visitor slots will be included in the repainting work.', NOW() - INTERVAL '7 days 18 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Playground Slide and Swing Set Damaged
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Playground Slide%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'My child got a small cut from the slide edge. This needs immediate attention.', NOW() - INTERVAL '2 days 20 hours'),
    (issue_id, admin_id, 'Very sorry to hear that. We have cordoned off the slide. Repair team visiting tomorrow.', NOW() - INTERVAL '2 days 16 hours'),
    (issue_id, moksh_id, 'Thank you for the quick action. Please also check the swing chain.', NOW() - INTERVAL '2 days 12 hours'),
    (issue_id, admin_id, 'Both the slide and swing will be repaired together. ETA 2 days.', NOW() - INTERVAL '2 days 8 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Swimming Pool Water Appears Green and Cloudy
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Swimming Pool Water Appears%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'The water looks really bad. I would not let my kids swim in this.', NOW() - INTERVAL '3 days 14 hours'),
    (issue_id, admin_id, 'Pool has been closed for treatment. Chemical dosing started today.', NOW() - INTERVAL '3 days 10 hours'),
    (issue_id, moksh_id, 'When will it reopen? We have a booking this weekend.', NOW() - INTERVAL '3 days 6 hours'),
    (issue_id, admin_id, 'Pool should be ready by Friday after water quality check. We will confirm.', NOW() - INTERVAL '3 days 2 hours'),
    (issue_id, moksh_id, 'Okay, please send a notice once it is cleared.', NOW() - INTERVAL '2 days 22 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Staircase Lights Not Working
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Staircase Lights Not Working%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'Completely dark from floor 6 to 9. Had to use phone torch last night.', NOW() - INTERVAL '22 hours'),
    (issue_id, admin_id, 'Electrician will check the circuit breaker for that section today.', NOW() - INTERVAL '20 hours'),
    (issue_id, moksh_id, 'Please fix before evening. Elderly residents use these stairs.', NOW() - INTERVAL '18 hours');
  END IF;

  -- ============================================================
  -- ISSUE: Very Low Water Pressure on Upper Floors
  -- ============================================================
  SELECT id INTO issue_id FROM issues WHERE title ILIKE '%Very Low Water Pressure%' LIMIT 1;
  IF issue_id IS NOT NULL THEN
    INSERT INTO issue_comments (issue_id, user_id, comment, created_at) VALUES
    (issue_id, moksh_id, 'Floor 12 here. Water barely trickles in the morning. This has been going on for 5 days.', NOW() - INTERVAL '4 days 8 hours'),
    (issue_id, admin_id, 'We are checking the riser valve and pump pressure. Will update by evening.', NOW() - INTERVAL '4 days 4 hours'),
    (issue_id, moksh_id, 'Any update? Still the same issue this morning.', NOW() - INTERVAL '3 days 8 hours'),
    (issue_id, admin_id, 'Plumber found a partially closed valve on floor 8. Being fixed now.', NOW() - INTERVAL '3 days 4 hours'),
    (issue_id, moksh_id, 'Pressure is slightly better now. Please monitor for a day or two.', NOW() - INTERVAL '2 days 10 hours');
  END IF;

  RAISE NOTICE 'Comments seeded successfully for all 14 issues.';

END $$;
