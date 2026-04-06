-- Update existing profiles with correct data
UPDATE profiles 
SET full_name = 'Purva Chavan', flat_number = 'B-201', email = 'purva@fake.com'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE profiles 
SET full_name = 'Yash Bandwane', flat_number = 'C-105', email = 'yash@fake.com'
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE profiles 
SET full_name = 'Tanmay Kolekar', flat_number = 'A-402', email = 'tanmay@fake.com'
WHERE id = '44444444-4444-4444-4444-444444444444';

-- Verify the updates
SELECT id, full_name, flat_number FROM profiles ORDER BY created_at;
