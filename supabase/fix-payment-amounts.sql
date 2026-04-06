-- Fix unrealistic payment amounts
-- Run this in Supabase SQL Editor

-- Update payments to have realistic amounts (₹500 to ₹5000)
UPDATE payments
SET amount = CASE 
  WHEN title LIKE '%Maintenance%' THEN 2500
  WHEN title LIKE '%Water%' THEN 800
  WHEN title LIKE '%Electricity%' THEN 1500
  WHEN title LIKE '%Parking%' THEN 500
  WHEN title LIKE '%Amenity%' THEN 1000
  WHEN title LIKE '%Club%' THEN 3000
  ELSE 1500
END
WHERE amount::numeric > 10000 OR amount::numeric < 100;

-- Update society bills to have realistic amounts
UPDATE society_bills
SET amount = CASE 
  WHEN bill_type LIKE '%Electricity%' THEN 45000
  WHEN bill_type LIKE '%Water%' THEN 25000
  WHEN bill_type LIKE '%Security%' THEN 60000
  WHEN bill_type LIKE '%Maintenance%' THEN 35000
  WHEN bill_type LIKE '%Cleaning%' THEN 20000
  ELSE 30000
END
WHERE amount::numeric > 100000 OR amount::numeric < 1000;

-- Verify
SELECT title, amount FROM payments ORDER BY created_at DESC LIMIT 10;
SELECT bill_type, amount FROM society_bills ORDER BY created_at DESC LIMIT 10;
