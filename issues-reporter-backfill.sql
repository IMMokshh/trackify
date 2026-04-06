-- ============================================================
-- REPORTER NAME BACKFILL
-- Assigns display_name + display_flat to issues that were
-- inserted via SQL (no created_by / profiles join).
-- Run ONCE in Supabase SQL Editor.
-- ============================================================

-- Ensure columns exist
ALTER TABLE issues ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS display_flat TEXT;

-- Assign realistic reporter names to image-based open issues
UPDATE issues SET display_name = 'Rahul Deshmukh',  display_flat = 'A-501' WHERE title = 'Basement Security Camera Not Functioning'         AND display_name IS NULL;
UPDATE issues SET display_name = 'Priya Sharma',    display_flat = 'B-402' WHERE title = 'Yard Light Broken Near Children Play Area'         AND display_name IS NULL;
UPDATE issues SET display_name = 'Vikram Singh',    display_flat = 'A-701' WHERE title = 'Main Gate CCTV Camera Damaged'                     AND display_name IS NULL;
UPDATE issues SET display_name = 'Amit Patel',      display_flat = 'A-601' WHERE title = 'Elevator Doors Not Closing Properly — A Wing'      AND display_name IS NULL;
UPDATE issues SET display_name = 'Sneha Kulkarni',  display_flat = 'B-504' WHERE title = 'Garbage Not Collected for 3 Days — C Wing'         AND display_name IS NULL;
UPDATE issues SET display_name = 'Tanmay Kolekar',  display_flat = 'B-201' WHERE title = 'Garden Severely Overgrown — Main Entrance Pathway' AND display_name IS NULL;
UPDATE issues SET display_name = 'Yash Bandwane',   display_flat = 'A-401' WHERE title = 'Gym Treadmill and Cross-Trainer Out of Order'      AND display_name IS NULL;
UPDATE issues SET display_name = 'Purva Chavan',    display_flat = 'B-303' WHERE title = 'Intercom Dead in Multiple B-Wing Flats'            AND display_name IS NULL;
UPDATE issues SET display_name = 'Rahul Deshmukh',  display_flat = 'A-501' WHERE title = 'Water Seeping Through Corridor Ceiling — D Wing Floor 4' AND display_name IS NULL;
UPDATE issues SET display_name = 'Amit Patel',      display_flat = 'A-601' WHERE title = 'Parking Slot Markings Completely Faded — B Wing Lot'    AND display_name IS NULL;
UPDATE issues SET display_name = 'Priya Sharma',    display_flat = 'B-402' WHERE title = 'Playground Slide and Swing Set Damaged'           AND display_name IS NULL;
UPDATE issues SET display_name = 'Vikram Singh',    display_flat = 'A-701' WHERE title = 'Swimming Pool Water Appears Green and Cloudy'      AND display_name IS NULL;
UPDATE issues SET display_name = 'Sneha Kulkarni',  display_flat = 'B-504' WHERE title = 'Staircase Lights Not Working — C Wing Floors 6 to 9'   AND display_name IS NULL;
UPDATE issues SET display_name = 'Tanmay Kolekar',  display_flat = 'B-201' WHERE title = 'Very Low Water Pressure on Upper Floors — A Wing'  AND display_name IS NULL;

-- Assign a default name to any remaining issues still missing display_name
-- (resolved/historical issues inserted via SQL)
UPDATE issues
SET
  display_name = 'Society Member',
  display_flat = 'Greenwood Heights'
WHERE display_name IS NULL
  AND created_by IS NULL;

-- Verify
SELECT title, status, display_name, display_flat
FROM issues
WHERE display_name IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;
