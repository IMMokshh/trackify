-- Reset and re-insert realistic payment data
-- Run this in Supabase SQL Editor

-- Step 1: Delete all existing payments
DELETE FROM payments;

-- Step 2: Insert fresh realistic payments for the logged in user
-- Replace the user_id with your actual user ID from profiles table
-- Run this first to get your user ID:
-- SELECT id, full_name, flat_number FROM profiles;

INSERT INTO payments (user_id, title, description, amount, status, due_date, created_at)
SELECT 
  id,
  'Maintenance Charges - March 2026',
  'Monthly maintenance fee for common area upkeep, security, and housekeeping',
  2500,
  'pending',
  '2026-03-31',
  NOW()
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, created_at)
SELECT 
  id,
  'Water Charges - March 2026',
  'Monthly water usage charges for your flat',
  850,
  'pending',
  '2026-03-31',
  NOW()
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, created_at)
SELECT 
  id,
  'Parking Charges - March 2026',
  'Monthly parking slot charges for vehicle B-12',
  500,
  'pending',
  '2026-03-31',
  NOW()
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, created_at)
SELECT 
  id,
  'Gym Membership - March 2026',
  'Monthly gym and fitness center access charges',
  1200,
  'pending',
  '2026-03-31',
  NOW()
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, created_at)
SELECT 
  id,
  'Clubhouse Booking - March 2026',
  'Clubhouse booking charges for family function on 20th March',
  3000,
  'pending',
  '2026-03-20',
  NOW()
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, paid_date, created_at)
SELECT 
  id,
  'Maintenance Charges - February 2026',
  'Monthly maintenance fee for common area upkeep, security, and housekeeping',
  2500,
  'paid',
  '2026-02-28',
  '2026-02-15',
  NOW() - INTERVAL '30 days'
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, paid_date, created_at)
SELECT 
  id,
  'Water Charges - February 2026',
  'Monthly water usage charges for your flat',
  780,
  'paid',
  '2026-02-28',
  '2026-02-15',
  NOW() - INTERVAL '30 days'
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, paid_date, created_at)
SELECT 
  id,
  'Parking Charges - February 2026',
  'Monthly parking slot charges for vehicle B-12',
  500,
  'paid',
  '2026-02-28',
  '2026-02-10',
  NOW() - INTERVAL '30 days'
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, created_at)
SELECT 
  id,
  'Maintenance Charges - January 2026',
  'Monthly maintenance fee for common area upkeep, security, and housekeeping',
  2500,
  'overdue',
  '2026-01-31',
  NOW() - INTERVAL '60 days'
FROM profiles WHERE full_name = 'Moksh Sonar';

INSERT INTO payments (user_id, title, description, amount, status, due_date, created_at)
SELECT 
  id,
  'Special Levy - Society Renovation',
  'One-time special levy for society entrance gate renovation and CCTV upgrade',
  5000,
  'pending',
  '2026-04-15',
  NOW()
FROM profiles WHERE full_name = 'Moksh Sonar';

-- Verify
SELECT title, amount, status, due_date FROM payments ORDER BY created_at DESC;
