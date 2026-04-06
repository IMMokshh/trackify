-- Pending payments for sonarmoksh@gmail.com (admin account)
DO $$
DECLARE v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM profiles WHERE email = 'sonarmoksh@gmail.com' LIMIT 1;
  IF v_user_id IS NULL THEN RAISE NOTICE 'User not found'; RETURN; END IF;

  -- Remove existing pending/overdue to avoid duplicates
  DELETE FROM payments WHERE user_id = v_user_id AND status IN ('pending', 'overdue');

  INSERT INTO payments (user_id, title, description, amount, status, due_date, paid_date, payment_method) VALUES
  (v_user_id, 'Monthly Maintenance — April 2026',    'Maintenance charges Apr 2026',  2500, 'pending', '2026-04-10', NULL, NULL),
  (v_user_id, 'Monthly Maintenance — March 2026',    'Maintenance charges Mar 2026',  2500, 'overdue', '2026-03-10', NULL, NULL),
  (v_user_id, 'Parking Charges — Q2 2026',           'Quarterly parking charges',     1500, 'pending', '2026-04-05', NULL, NULL),
  (v_user_id, 'Electricity Charges — March 2026',    'Common area electricity share',  850, 'overdue', '2026-03-25', NULL, NULL),
  (v_user_id, 'Water Charges — March 2026',          'Monthly water charges',          300, 'overdue', '2026-03-25', NULL, NULL),
  (v_user_id, 'Lift Maintenance — Q1 2026',          'Quarterly lift charges',         600, 'overdue', '2026-03-31', NULL, NULL),
  (v_user_id, 'Security Charges — April 2026',       'Monthly security charges',       400, 'pending', '2026-04-30', NULL, NULL),
  (v_user_id, 'CCTV Maintenance — Annual 2026',      'Annual CCTV maintenance',       1200, 'pending', '2026-04-15', NULL, NULL),
  (v_user_id, 'Garden Maintenance — Q1 2026',        'Quarterly garden upkeep',        250, 'overdue', '2026-03-31', NULL, NULL),
  (v_user_id, 'Swimming Pool — April 2026',          'Pool usage charges',             800, 'pending', '2026-04-20', NULL, NULL);

  RAISE NOTICE 'Pending payments added for admin';
END $$;
