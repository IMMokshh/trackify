-- ============================================================
-- PAYMENTS SEED — All 3 users with realistic paid + unpaid data
-- Run in Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_purva  UUID;
  v_tanmay UUID;
  v_yash   UUID;
BEGIN
  SELECT id INTO v_purva  FROM profiles WHERE email = 'sonarmoksh07@gmail.com'       LIMIT 1;
  SELECT id INTO v_tanmay FROM profiles WHERE email = 'tanmaykolekar98098@gmail.com' LIMIT 1;
  SELECT id INTO v_yash   FROM profiles WHERE email = 'yashwardhanjain04@gmail.com'  LIMIT 1;

  -- ── PURVA CHAVAN (B-303) ──────────────────────────────────
  IF v_purva IS NOT NULL THEN
    DELETE FROM payments WHERE user_id = v_purva;
    INSERT INTO payments (user_id, title, description, amount, status, due_date, paid_date, payment_method) VALUES
    -- Paid history
    (v_purva, 'Monthly Maintenance — October 2025',  'Maintenance charges Oct 2025',  2500, 'paid', '2025-10-10', '2025-10-07', 'Razorpay'),
    (v_purva, 'Monthly Maintenance — November 2025', 'Maintenance charges Nov 2025',  2500, 'paid', '2025-11-10', '2025-11-08', 'UPI'),
    (v_purva, 'Monthly Maintenance — December 2025', 'Maintenance charges Dec 2025',  2500, 'paid', '2025-12-10', '2025-12-06', 'Razorpay'),
    (v_purva, 'Monthly Maintenance — January 2026',  'Maintenance charges Jan 2026',  2500, 'paid', '2026-01-10', '2026-01-09', 'Razorpay'),
    (v_purva, 'Monthly Maintenance — February 2026', 'Maintenance charges Feb 2026',  2500, 'paid', '2026-02-10', '2026-02-08', 'UPI'),
    (v_purva, 'Parking Charges — Q1 2026',           'Quarterly parking charges',     1500, 'paid', '2026-01-05', '2026-01-04', 'UPI'),
    (v_purva, 'Clubhouse Booking — 20 Feb 2026',     'Clubhouse booking',              500, 'paid', '2026-02-20', '2026-02-19', 'Razorpay'),
    (v_purva, 'Swimming Pool — January 2026',        'Pool usage charges',             800, 'paid', '2026-01-20', '2026-01-18', 'UPI'),
    -- Unpaid bills
    (v_purva, 'Monthly Maintenance — March 2026',    'Maintenance charges Mar 2026',  2500, 'overdue', '2026-03-10', NULL, NULL),
    (v_purva, 'Monthly Maintenance — April 2026',    'Maintenance charges Apr 2026',  2500, 'pending', '2026-04-10', NULL, NULL),
    (v_purva, 'Parking Charges — Q2 2026',           'Quarterly parking charges',     1500, 'pending', '2026-04-05', NULL, NULL),
    (v_purva, 'Electricity Charges — March 2026',    'Common area electricity share',  850, 'overdue', '2026-03-25', NULL, NULL),
    (v_purva, 'Water Charges — March 2026',          'Monthly water charges',          300, 'overdue', '2026-03-25', NULL, NULL),
    (v_purva, 'Security Charges — April 2026',       'Monthly security charges',       400, 'pending', '2026-04-30', NULL, NULL),
    (v_purva, 'CCTV Maintenance — Annual 2026',      'Annual CCTV maintenance',       1200, 'pending', '2026-04-15', NULL, NULL),
    (v_purva, 'Garden Maintenance — Q1 2026',        'Quarterly garden upkeep',        250, 'overdue', '2026-03-31', NULL, NULL),
    (v_purva, 'Lift Maintenance — Q1 2026',          'Quarterly lift charges',         600, 'overdue', '2026-03-31', NULL, NULL),
    (v_purva, 'Swimming Pool — April 2026',          'Pool usage charges',             800, 'pending', '2026-04-20', NULL, NULL);
  END IF;

  -- ── TANMAY KOLEKAR (C-704) ────────────────────────────────
  IF v_tanmay IS NOT NULL THEN
    DELETE FROM payments WHERE user_id = v_tanmay;
    INSERT INTO payments (user_id, title, description, amount, status, due_date, paid_date, payment_method) VALUES
    -- Paid history
    (v_tanmay, 'Monthly Maintenance — October 2025',  'Maintenance charges Oct 2025',  2500, 'paid', '2025-10-10', '2025-10-09', 'UPI'),
    (v_tanmay, 'Monthly Maintenance — November 2025', 'Maintenance charges Nov 2025',  2500, 'paid', '2025-11-10', '2025-11-06', 'Razorpay'),
    (v_tanmay, 'Monthly Maintenance — December 2025', 'Maintenance charges Dec 2025',  2500, 'paid', '2025-12-10', '2025-12-08', 'UPI'),
    (v_tanmay, 'Monthly Maintenance — January 2026',  'Maintenance charges Jan 2026',  2500, 'paid', '2026-01-10', '2026-01-07', 'Razorpay'),
    (v_tanmay, 'Parking Charges — Q1 2026',           'Quarterly parking charges',     1500, 'paid', '2026-01-05', '2026-01-03', 'UPI'),
    (v_tanmay, 'Badminton Court — Feb 2026',          'Court booking charges',          100, 'paid', '2026-02-15', '2026-02-14', 'UPI'),
    -- Unpaid bills
    (v_tanmay, 'Monthly Maintenance — February 2026', 'Maintenance charges Feb 2026',  2500, 'overdue', '2026-02-10', NULL, NULL),
    (v_tanmay, 'Monthly Maintenance — March 2026',    'Maintenance charges Mar 2026',  2500, 'overdue', '2026-03-10', NULL, NULL),
    (v_tanmay, 'Monthly Maintenance — April 2026',    'Maintenance charges Apr 2026',  2500, 'pending', '2026-04-10', NULL, NULL),
    (v_tanmay, 'Parking Charges — Q2 2026',           'Quarterly parking charges',     1500, 'pending', '2026-04-05', NULL, NULL),
    (v_tanmay, 'Electricity Charges — March 2026',    'Common area electricity share',  850, 'overdue', '2026-03-25', NULL, NULL),
    (v_tanmay, 'Water Charges — March 2026',          'Monthly water charges',          300, 'overdue', '2026-03-25', NULL, NULL),
    (v_tanmay, 'Lift Maintenance — Q1 2026',          'Quarterly lift charges',         600, 'overdue', '2026-03-31', NULL, NULL),
    (v_tanmay, 'Security Charges — April 2026',       'Monthly security charges',       400, 'pending', '2026-04-30', NULL, NULL),
    (v_tanmay, 'CCTV Maintenance — Annual 2026',      'Annual CCTV maintenance',       1200, 'pending', '2026-04-15', NULL, NULL),
    (v_tanmay, 'Swimming Pool — April 2026',          'Pool usage charges',             800, 'pending', '2026-04-20', NULL, NULL);
  END IF;

  -- ── YASH BANDAWANE (A-302) ────────────────────────────────
  IF v_yash IS NOT NULL THEN
    DELETE FROM payments WHERE user_id = v_yash;
    INSERT INTO payments (user_id, title, description, amount, status, due_date, paid_date, payment_method) VALUES
    -- Paid history
    (v_yash, 'Monthly Maintenance — October 2025',  'Maintenance charges Oct 2025',  2500, 'paid', '2025-10-10', '2025-10-08', 'Razorpay'),
    (v_yash, 'Monthly Maintenance — November 2025', 'Maintenance charges Nov 2025',  2500, 'paid', '2025-11-10', '2025-11-09', 'UPI'),
    (v_yash, 'Monthly Maintenance — December 2025', 'Maintenance charges Dec 2025',  2500, 'paid', '2025-12-10', '2025-12-07', 'Razorpay'),
    (v_yash, 'Monthly Maintenance — January 2026',  'Maintenance charges Jan 2026',  2500, 'paid', '2026-01-10', '2026-01-08', 'UPI'),
    (v_yash, 'Monthly Maintenance — February 2026', 'Maintenance charges Feb 2026',  2500, 'paid', '2026-02-10', '2026-02-09', 'Razorpay'),
    (v_yash, 'Monthly Maintenance — March 2026',    'Maintenance charges Mar 2026',  2500, 'paid', '2026-03-10', '2026-03-08', 'UPI'),
    (v_yash, 'Parking Charges — Q1 2026',           'Quarterly parking charges',     1500, 'paid', '2026-01-05', '2026-01-04', 'Razorpay'),
    (v_yash, 'Conference Room — March 2026',        'Conference room booking',        200, 'paid', '2026-03-20', '2026-03-19', 'UPI'),
    -- Unpaid bills
    (v_yash, 'Monthly Maintenance — April 2026',    'Maintenance charges Apr 2026',  2500, 'pending', '2026-04-10', NULL, NULL),
    (v_yash, 'Parking Charges — Q2 2026',           'Quarterly parking charges',     1500, 'pending', '2026-04-05', NULL, NULL),
    (v_yash, 'Electricity Charges — March 2026',    'Common area electricity share',  850, 'pending', '2026-03-25', NULL, NULL),
    (v_yash, 'Water Charges — March 2026',          'Monthly water charges',          300, 'pending', '2026-03-25', NULL, NULL),
    (v_yash, 'Lift Maintenance — Q1 2026',          'Quarterly lift charges',         600, 'pending', '2026-03-31', NULL, NULL),
    (v_yash, 'Security Charges — April 2026',       'Monthly security charges',       400, 'pending', '2026-04-30', NULL, NULL),
    (v_yash, 'CCTV Maintenance — Annual 2026',      'Annual CCTV maintenance',       1200, 'pending', '2026-04-15', NULL, NULL),
    (v_yash, 'Garden Maintenance — Q1 2026',        'Quarterly garden upkeep',        250, 'pending', '2026-03-31', NULL, NULL),
    (v_yash, 'Swimming Pool — April 2026',          'Pool usage charges',             800, 'pending', '2026-04-20', NULL, NULL),
    (v_yash, 'Fire Safety Inspection — 2026',       'Annual fire safety charges',     500, 'pending', '2026-04-15', NULL, NULL);
  END IF;

  RAISE NOTICE 'Payments seeded for Purva, Tanmay and Yash';
END $$;
