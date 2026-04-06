-- Add display_name and display_flat columns to issues table
-- This allows showing different user names without creating real auth users
-- Perfect for prototypes and demos!

ALTER TABLE issues ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS display_flat TEXT;

-- Update existing issues with different display names
UPDATE issues SET 
  display_name = 'Purva Chavan',
  display_flat = 'B-303'
WHERE title = 'Water Pressure Low on 6th & 7th Floor';

UPDATE issues SET 
  display_name = 'Yash Bandwane',
  display_flat = 'A-401'
WHERE title = 'Parking Slot Encroachment';

UPDATE issues SET 
  display_name = 'Tanmay Kolekar',
  display_flat = 'B-201'
WHERE title = 'Gym Equipment Needs Repair';

UPDATE issues SET 
  display_name = 'Rahul Deshmukh',
  display_flat = 'A-501'
WHERE title = 'Street Light Not Working Near Gate';

UPDATE issues SET 
  display_name = 'Priya Sharma',
  display_flat = 'B-402'
WHERE title = 'Garbage Collection Timing Issue';

UPDATE issues SET 
  display_name = 'Amit Patel',
  display_flat = 'A-601'
WHERE title = 'Swimming Pool Cleaning Required';

UPDATE issues SET 
  display_name = 'Sneha Kulkarni',
  display_flat = 'B-504'
WHERE title = 'CCTV Camera Not Working in Basement';

UPDATE issues SET 
  display_name = 'Vikram Singh',
  display_flat = 'A-701'
WHERE title = 'Intercom System Down';

UPDATE issues SET 
  display_name = 'Purva Chavan',
  display_flat = 'B-303'
WHERE title = 'Noise from Construction Work';

UPDATE issues SET 
  display_name = 'Yash Bandwane',
  display_flat = 'A-401'
WHERE title = 'Staircase Lighting Not Working';

-- Keep Moksh for remaining issues
UPDATE issues SET 
  display_name = 'Moksh Sonar',
  display_flat = 'A-301'
WHERE display_name IS NULL;

SELECT 'Success! Issues now show different user names' AS message;
