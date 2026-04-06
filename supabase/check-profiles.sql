-- Check what profiles exist in your database
SELECT id, full_name, flat_number, email 
FROM profiles 
ORDER BY created_at 
LIMIT 10;
