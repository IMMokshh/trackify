-- Update member details for Purva Chavan and Moksh Sonar
-- Changes:
-- 1. Purva Chavan: 2 members → 4 members, 0 pets → 2 pets, Treasurer → Chairwoman
-- 2. Moksh Sonar: 3 members (no change), 0 pets → 2 pets

-- Update Purva Chavan
UPDATE society_members
SET 
  family_members = 4,
  badge = 'Chairwoman',
  has_pets = true,
  pets_count = 2
WHERE 
  full_name = 'Purva Chavan' 
  AND flat_number = 'B-303';

-- Update Moksh Sonar
UPDATE society_members
SET 
  has_pets = true,
  pets_count = 2
WHERE 
  full_name = 'Moksh Sonar' 
  AND flat_number = 'A-301';

-- Verify both updates
SELECT 
  full_name,
  flat_number,
  badge,
  family_members,
  has_pets,
  pets_count,
  has_parking,
  parking_slot
FROM society_members
WHERE 
  (full_name = 'Purva Chavan' AND flat_number = 'B-303')
  OR (full_name = 'Moksh Sonar' AND flat_number = 'A-301')
ORDER BY full_name;
