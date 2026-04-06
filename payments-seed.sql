-- PAYMENTS SEED — Greenwood Heights CHS
-- ~55 paid, ~10 pending/overdue
-- Maintenance fee: Rs. 2500/month per flat

INSERT INTO payments (title, amount, status, due_date, paid_date, payment_method, user_id) 
SELECT 
  'Monthly Maintenance — ' || to_char(due_month, 'Mon YYYY'),
  2500,
  'paid',
  due_month + INTERVAL '10 days',
  due_month + INTERVAL '7 days',
  'Razorpay',
  (SELECT id FROM profiles LIMIT 1)
FROM generate_series('2025-10-01'::date, '2026-03-01'::date, '1 month'::interval) AS due_month;

-- Additional paid payments from different flats
INSERT INTO payments (title, amount, status, due_date, paid_date, payment_method) VALUES
('Monthly Maintenance — Oct 2025', 2500, 'paid', '2025-10-10', '2025-10-08', 'UPI'),
('Monthly Maintenance — Nov 2025', 2500, 'paid', '2025-11-10', '2025-11-09', 'Razorpay'),
('Monthly Maintenance — Dec 2025', 2500, 'paid', '2025-12-10', '2025-12-07', 'UPI'),
('Monthly Maintenance — Jan 2026', 2500, 'paid', '2026-01-10', '2026-01-10', 'Razorpay'),
('Monthly Maintenance — Feb 2026', 2500, 'paid', '2026-02-10', '2026-02-08', 'UPI'),
('Monthly Maintenance — Mar 2026', 2500, 'paid', '2026-03-10', '2026-03-09', 'Razorpay'),
('Parking Charges — Q1 2026', 1500, 'paid', '2026-01-05', '2026-01-04', 'UPI'),
('Parking Charges — Q2 2026', 1500, 'paid', '2026-04-05', '2026-04-03', 'Razorpay'),
('Clubhouse Booking — 15 Mar 2026', 500, 'paid', '2026-03-15', '2026-03-14', 'Razorpay'),
('Clubhouse Booking — 22 Mar 2026', 500, 'paid', '2026-03-22', '2026-03-21', 'UPI'),
('Event Hall Booking — 5 Apr 2026', 800, 'paid', '2026-04-05', '2026-04-04', 'Razorpay'),
('Swimming Pool Booking — 10 Apr 2026', 800, 'paid', '2026-04-10', '2026-04-09', 'UPI'),
('Monthly Maintenance — Apr 2026', 2500, 'paid', '2026-04-10', '2026-04-08', 'Razorpay'),
('Monthly Maintenance — Apr 2026', 2500, 'paid', '2026-04-10', '2026-04-09', 'UPI'),
('Monthly Maintenance — Apr 2026', 2500, 'paid', '2026-04-10', '2026-04-07', 'Razorpay'),
('Monthly Maintenance — Apr 2026', 2500, 'paid', '2026-04-10', '2026-04-10', 'UPI'),
('Monthly Maintenance — Apr 2026', 2500, 'paid', '2026-04-10', '2026-04-06', 'Razorpay'),
('Monthly Maintenance — Mar 2026', 2500, 'paid', '2026-03-10', '2026-03-08', 'UPI'),
('Monthly Maintenance — Mar 2026', 2500, 'paid', '2026-03-10', '2026-03-09', 'Razorpay'),
('Monthly Maintenance — Mar 2026', 2500, 'paid', '2026-03-10', '2026-03-07', 'UPI'),
('Monthly Maintenance — Feb 2026', 2500, 'paid', '2026-02-10', '2026-02-09', 'Razorpay'),
('Monthly Maintenance — Feb 2026', 2500, 'paid', '2026-02-10', '2026-02-08', 'UPI'),
('Monthly Maintenance — Jan 2026', 2500, 'paid', '2026-01-10', '2026-01-09', 'Razorpay'),
('Monthly Maintenance — Jan 2026', 2500, 'paid', '2026-01-10', '2026-01-08', 'UPI'),
('Monthly Maintenance — Dec 2025', 2500, 'paid', '2025-12-10', '2025-12-09', 'Razorpay'),
('Monthly Maintenance — Nov 2025', 2500, 'paid', '2025-11-10', '2025-11-08', 'UPI'),
('Monthly Maintenance — Oct 2025', 2500, 'paid', '2025-10-10', '2025-10-09', 'Razorpay'),
('Badminton Court Booking', 100, 'paid', '2026-03-20', '2026-03-19', 'UPI'),
('Conference Room Booking', 200, 'paid', '2026-03-25', '2026-03-24', 'Razorpay'),
('Terrace Banquet Booking', 400, 'paid', '2026-04-01', '2026-03-31', 'UPI'),

-- PENDING PAYMENTS (~10)
('Monthly Maintenance — Apr 2026', 2500, 'pending', '2026-04-10', NULL, NULL),
('Monthly Maintenance — Apr 2026', 2500, 'pending', '2026-04-10', NULL, NULL),
('Monthly Maintenance — Apr 2026', 2500, 'pending', '2026-04-10', NULL, NULL),
('Monthly Maintenance — Apr 2026', 2500, 'pending', '2026-04-10', NULL, NULL),
('Monthly Maintenance — Apr 2026', 2500, 'pending', '2026-04-10', NULL, NULL),
('Parking Charges — Q2 2026', 1500, 'pending', '2026-04-05', NULL, NULL),
('Clubhouse Booking — 20 Apr 2026', 500, 'pending', '2026-04-20', NULL, NULL),

-- OVERDUE PAYMENTS
('Monthly Maintenance — Mar 2026', 2500, 'overdue', '2026-03-10', NULL, NULL),
('Monthly Maintenance — Feb 2026', 2500, 'overdue', '2026-02-10', NULL, NULL),
('Monthly Maintenance — Jan 2026', 2500, 'overdue', '2026-01-10', NULL, NULL);
