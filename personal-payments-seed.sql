-- PERSONAL PAYMENTS SEED — Resident View
-- Replace 'resident@example.com' with actual resident email before running
-- Or run once per resident using their actual user_id from profiles table

-- ============================================================
-- HOW TO USE:
-- 1. Go to Supabase > Table Editor > profiles
-- 2. Copy the 'id' (UUID) of the resident you want to seed
-- 3. Replace the DO $$ block user_id with that UUID
-- ============================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user_id for the main demo resident (Moksh Sonar, A-301)
  SELECT id INTO v_user_id FROM profiles WHERE flat_number = 'A-301' LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User not found. Skipping payment seed.';
    RETURN;
  END IF;

  -- Delete existing payments for this user to avoid duplicates
  DELETE FROM payments WHERE user_id = v_user_id;

  -- Insert paid payments (last 6 months)
  INSERT INTO payments (user_id, title, amount, status, due_date, paid_date, payment_method) VALUES
  (v_user_id, 'Monthly Maintenance — October 2025', 2500, 'paid', '2025-10-10', '2025-10-08', 'Razorpay'),
  (v_user_id, 'Monthly Maintenance — November 2025', 2500, 'paid', '2025-11-10', '2025-11-07', 'UPI'),
  (v_user_id, 'Monthly Maintenance — December 2025', 2500, 'paid', '2025-12-10', '2025-12-09', 'Razorpay'),
  (v_user_id, 'Monthly Maintenance — January 2026', 2500, 'paid', '2026-01-10', '2026-01-08', 'Razorpay'),
  (v_user_id, 'Monthly Maintenance — February 2026', 2500, 'paid', '2026-02-10', '2026-02-09', 'UPI'),
  (v_user_id, 'Monthly Maintenance — March 2026', 2500, 'paid', '2026-03-10', '2026-03-07', 'Razorpay'),
  (v_user_id, 'Parking Charges — Q1 2026', 1500, 'paid', '2026-01-05', '2026-01-04', 'UPI'),
  (v_user_id, 'Clubhouse Booking — 15 Mar 2026', 500, 'paid', '2026-03-15', '2026-03-14', 'Razorpay'),
  (v_user_id, 'Badminton Court Booking — 20 Mar 2026', 100, 'paid', '2026-03-20', '2026-03-19', 'UPI'),
  (v_user_id, 'Conference Room Booking — 25 Mar 2026', 200, 'paid', '2026-03-25', '2026-03-24', 'Razorpay'),

  -- Pending (current month)
  (v_user_id, 'Monthly Maintenance — April 2026', 2500, 'pending', '2026-04-10', NULL, NULL),
  (v_user_id, 'Parking Charges — Q2 2026', 1500, 'pending', '2026-04-05', NULL, NULL),

  -- 10 UNPAID BILLS (various categories)
  (v_user_id, 'Electricity Charges — March 2026', 850, 'pending', '2026-03-25', NULL, NULL),
  (v_user_id, 'Water Charges — March 2026', 300, 'pending', '2026-03-25', NULL, NULL),
  (v_user_id, 'Lift Maintenance — Q1 2026', 600, 'pending', '2026-03-31', NULL, NULL),
  (v_user_id, 'Security Charges — March 2026', 400, 'pending', '2026-03-31', NULL, NULL),
  (v_user_id, 'Garbage Collection — March 2026', 150, 'pending', '2026-03-31', NULL, NULL),
  (v_user_id, 'Garden Maintenance — Q1 2026', 250, 'pending', '2026-03-31', NULL, NULL),
  (v_user_id, 'CCTV Maintenance — Annual 2026', 1200, 'pending', '2026-04-15', NULL, NULL),
  (v_user_id, 'Fire Safety Inspection — Annual 2026', 500, 'pending', '2026-04-15', NULL, NULL),
  (v_user_id, 'Clubhouse Booking — 10 Apr 2026', 500, 'pending', '2026-04-10', NULL, NULL),
  (v_user_id, 'Swimming Pool Charges — April 2026', 800, 'pending', '2026-04-20', NULL, NULL);

  RAISE NOTICE 'Payments seeded for user: %', v_user_id;
END $$;

-- ============================================================
-- STATS SUMMARY (what the payments page will show):
-- Total Amount:  Rs. 21,300
-- Paid:          Rs. 17,300
-- Pending:       Rs. 4,000
-- Overdue:       Rs. 0
-- ============================================================
