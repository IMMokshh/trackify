-- ============================================================
-- DEMO PAYMENTS SEED — 12 realistic payments for admin account
-- Run in Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get your admin user ID (Moksh Sonar / A-301)
  SELECT id INTO v_user_id FROM profiles WHERE email = 'sonarmoksh@gmail.com' LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User not found. Check email.';
    RETURN;
  END IF;

  -- Clear existing pending payments to avoid duplicates
  DELETE FROM payments WHERE user_id = v_user_id AND status = 'pending';

  -- ── 6 PAID payments (history) ─────────────────────────────
  INSERT INTO payments (user_id, title, description, amount, status, due_date, paid_date, payment_method) VALUES
  (v_user_id, 'Monthly Maintenance — October 2025',  'Society maintenance charges for Oct 2025',  2500, 'paid', '2025-10-10', '2025-10-08', 'Razorpay'),
  (v_user_id, 'Monthly Maintenance — November 2025', 'Society maintenance charges for Nov 2025',  2500, 'paid', '2025-11-10', '2025-11-07', 'UPI'),
  (v_user_id, 'Monthly Maintenance — December 2025', 'Society maintenance charges for Dec 2025',  2500, 'paid', '2025-12-10', '2025-12-09', 'Razorpay'),
  (v_user_id, 'Monthly Maintenance — January 2026',  'Society maintenance charges for Jan 2026',  2500, 'paid', '2026-01-10', '2026-01-08', 'Razorpay'),
  (v_user_id, 'Parking Charges — Q1 2026',           'Quarterly parking slot charges',            1500, 'paid', '2026-01-05', '2026-01-04', 'UPI'),
  (v_user_id, 'Clubhouse Booking — 15 Mar 2026',     'Clubhouse booking for family function',      500, 'paid', '2026-03-15', '2026-03-14', 'Razorpay'),

  -- ── 10 UNPAID bills ───────────────────────────────────────
  (v_user_id, 'Monthly Maintenance — April 2026',    'Society maintenance charges for Apr 2026',  2500, 'pending', '2026-04-10', NULL, NULL),
  (v_user_id, 'Monthly Maintenance — March 2026',    'Society maintenance charges for Mar 2026',  2500, 'pending', '2026-03-10', NULL, NULL),
  (v_user_id, 'Monthly Maintenance — February 2026', 'Society maintenance charges for Feb 2026',  2500, 'overdue', '2026-02-10', NULL, NULL),
  (v_user_id, 'Parking Charges — Q2 2026',           'Quarterly parking slot charges',            1500, 'pending', '2026-04-05', NULL, NULL),
  (v_user_id, 'Electricity Charges — March 2026',    'Common area electricity bill share',         850, 'pending', '2026-03-25', NULL, NULL),
  (v_user_id, 'Water Charges — March 2026',          'Monthly water usage charges',                300, 'pending', '2026-03-25', NULL, NULL),
  (v_user_id, 'Lift Maintenance — Q1 2026',          'Quarterly lift maintenance charges',         600, 'pending', '2026-03-31', NULL, NULL),
  (v_user_id, 'Security Charges — March 2026',       'Monthly security staff charges',             400, 'pending', '2026-03-31', NULL, NULL),
  (v_user_id, 'CCTV Maintenance — Annual 2026',      'Annual CCTV system maintenance',            1200, 'pending', '2026-04-15', NULL, NULL),
  (v_user_id, 'Swimming Pool Charges — April 2026',  'Monthly swimming pool usage fee',            800, 'pending', '2026-04-20', NULL, NULL);

  RAISE NOTICE 'Demo payments seeded for user: %', v_user_id;
END $$;
