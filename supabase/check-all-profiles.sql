-- Check all profiles to see if they were created
SELECT id, full_name, flat_number, email 
FROM profiles 
ORDER BY created_at;
