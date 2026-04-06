-- ============================================
-- SIMPLE DATA INSERT
-- Run this AFTER you're logged in to the app
-- ============================================

-- First, let's see what users we have
SELECT id, email, full_name, role FROM profiles;

-- ============================================
-- Now insert data for the FIRST user we find
-- ============================================

DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the first user (YOU!)
  SELECT id INTO user_id FROM profiles LIMIT 1;
  
  IF user_id IS NULL THEN
    RAISE NOTICE '❌ No users found! Please register at http://localhost:3000 first';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Found user: %', user_id;
  RAISE NOTICE '📊 Inserting data...';
  
  -- ============================================
  -- PAYMENTS (₹800 - ₹15,000)
  -- ============================================
  
  INSERT INTO payments (user_id, title, description, amount, due_date, status) VALUES
  (user_id, 'Monthly Maintenance - March 2026', 'Regular monthly maintenance charges', 5000.00, '2026-03-05', 'pending'),
  (user_id, 'Water Bill - March 2026', 'Monthly water charges', 800.00, '2026-03-10', 'pending'),
  (user_id, 'Parking Fee - Q1 2026', 'Quarterly parking charges', 3000.00, '2026-03-31', 'pending'),
  (user_id, 'Clubhouse Booking Fee', 'Birthday party booking', 2500.00, '2026-03-18', 'pending'),
  (user_id, 'Annual Maintenance - 2026', 'Annual maintenance contribution', 15000.00, '2026-04-01', 'pending');
  
  INSERT INTO payments (user_id, title, description, amount, due_date, status, paid_date) VALUES
  (user_id, 'Monthly Maintenance - February 2026', 'Regular monthly maintenance charges', 5000.00, '2026-02-05', 'paid', '2026-02-03'),
  (user_id, 'Monthly Maintenance - January 2026', 'Regular monthly maintenance charges', 5000.00, '2026-01-05', 'paid', '2026-01-04');
  
  RAISE NOTICE '✅ Added 7 payments';
  
  -- ============================================
  -- ISSUES
  -- ============================================
  
  INSERT INTO issues (title, description, category, priority, status, created_by, vote_count) VALUES
  ('Broken Lift in Tower A', 'The lift has been out of order for 3 days', 'Maintenance', 'high', 'open', user_id, 12),
  ('Street Light Not Working', 'Street light near gate 2 not working', 'Electrical', 'medium', 'in_progress', user_id, 8),
  ('Water Leakage in Parking', 'Water leaking from pipe in basement', 'Plumbing', 'high', 'open', user_id, 15),
  ('Garbage Collection Delay', 'Garbage not collected regularly', 'Housekeeping', 'medium', 'open', user_id, 6),
  ('Swimming Pool Maintenance', 'Pool needs cleaning', 'Amenities', 'low', 'resolved', user_id, 4),
  ('Security Gate Issue', 'Main gate sensor not working', 'Security', 'high', 'in_progress', user_id, 10),
  ('Garden Needs Maintenance', 'Garden plants need care', 'Landscaping', 'low', 'open', user_id, 3),
  ('Gym Equipment Broken', 'Treadmill not working', 'Amenities', 'medium', 'open', user_id, 7);
  
  RAISE NOTICE '✅ Added 8 issues';
  
  -- ============================================
  -- VISITORS
  -- ============================================
  
  INSERT INTO visitors (name, phone, purpose, flat_number, host_id, check_in_time, check_out_time, qr_code) VALUES
  ('Rajesh Kumar', '9876543210', 'Plumber - Kitchen repair', 'A-101', user_id, '2026-02-18 10:00:00', '2026-02-18 12:30:00', 'QR_VIS_001'),
  ('Priya Sharma', '9876543211', 'Friend visiting', 'A-101', user_id, '2026-02-17 18:00:00', '2026-02-17 22:00:00', 'QR_VIS_002'),
  ('Amazon Delivery', '9876543212', 'Package delivery', 'A-101', user_id, '2026-02-18 14:00:00', '2026-02-18 14:15:00', 'QR_VIS_003'),
  ('Swiggy Delivery', '9876543213', 'Food delivery', 'A-101', user_id, '2026-02-18 20:00:00', '2026-02-18 20:10:00', 'QR_VIS_004'),
  ('Dr. Mehta', '9876543214', 'Medical checkup', 'A-101', user_id, '2026-02-16 11:00:00', '2026-02-16 11:45:00', 'QR_VIS_005'),
  ('Electrician', '9876543215', 'AC repair', 'A-101', user_id, '2026-02-15 15:00:00', '2026-02-15 17:00:00', 'QR_VIS_006'),
  ('Amit Patel', '9876543216', 'Relative visiting', 'A-101', user_id, '2026-02-14 10:00:00', '2026-02-14 16:00:00', 'QR_VIS_007'),
  ('Carpenter', '9876543217', 'Furniture repair', 'A-101', user_id, '2026-02-13 09:00:00', '2026-02-13 13:00:00', 'QR_VIS_008');
  
  RAISE NOTICE '✅ Added 8 visitors';
  
  -- ============================================
  -- AMENITIES
  -- ============================================
  
  INSERT INTO amenities (name, description, capacity, price_per_hour, is_active) VALUES
  ('Clubhouse', 'Main community hall with AC', 100, 500, true),
  ('Swimming Pool', 'Olympic size pool', 50, 200, true),
  ('Gym & Fitness Center', 'Fully equipped gym', 30, 100, true),
  ('Tennis Court', 'Professional tennis court', 4, 150, true),
  ('Kids Play Area', 'Safe play area for children', 20, 0, true),
  ('Party Hall', 'Private party hall', 80, 800, true),
  ('Badminton Court', 'Indoor badminton court', 4, 100, true),
  ('Yoga Room', 'Peaceful yoga room', 25, 50, true),
  ('Conference Room', 'Meeting room with projector', 15, 200, true),
  ('Rooftop Garden', 'Beautiful rooftop garden', 40, 300, true);
  
  RAISE NOTICE '✅ Added 10 amenities';
  
  -- ============================================
  -- DOCUMENTS
  -- ============================================
  
  INSERT INTO documents (title, description, file_url, file_type, file_size, category, uploaded_by, is_public, is_important) VALUES
  ('Society Bylaws 2026', 'Updated society rules', 'https://example.com/bylaws.pdf', 'application/pdf', 245678, 'Legal', user_id, true, true),
  ('Maintenance Guidelines', 'Payment guidelines', 'https://example.com/maintenance.pdf', 'application/pdf', 156789, 'Finance', user_id, true, true),
  ('Emergency Contacts', 'Emergency numbers', 'https://example.com/emergency.pdf', 'application/pdf', 89456, 'Important', user_id, true, true),
  ('Parking Rules', 'Parking rules', 'https://example.com/parking.pdf', 'application/pdf', 123456, 'Rules', user_id, true, true),
  ('Annual Report 2025', 'Financial report', 'https://example.com/report.pdf', 'application/pdf', 567890, 'Finance', user_id, true, false),
  ('AGM Minutes', 'Meeting minutes', 'https://example.com/agm.pdf', 'application/pdf', 234567, 'Meeting', user_id, true, false),
  ('Amenity Booking Rules', 'Booking rules', 'https://example.com/amenity-rules.pdf', 'application/pdf', 98765, 'Rules', user_id, true, true),
  ('Waste Management', 'Waste guidelines', 'https://example.com/waste.pdf', 'application/pdf', 145678, 'Environment', user_id, true, false),
  ('Security Protocol', 'Security procedures', 'https://example.com/security.pdf', 'application/pdf', 187654, 'Security', user_id, true, true),
  ('Pet Policy', 'Pet guidelines', 'https://example.com/pets.pdf', 'application/pdf', 112345, 'Rules', user_id, true, false),
  ('Renovation Guidelines', 'Renovation rules', 'https://example.com/renovation.pdf', 'application/pdf', 198765, 'Rules', user_id, true, false),
  ('Fire Safety', 'Fire safety plan', 'https://example.com/fire.pdf', 'application/pdf', 134567, 'Safety', user_id, true, true);
  
  RAISE NOTICE '✅ Added 12 documents';
  
  -- ============================================
  -- SOCIETY BILLS
  -- ============================================
  
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes) VALUES
  ('Electricity', 'State Electricity Board', 'EB-2026-MAR', 45000.00, '2026-03-10', 'pending', 'Monthly electricity'),
  ('Water Supply', 'Municipal Corporation', 'WB-2026-MAR', 12000.00, '2026-03-15', 'pending', 'Monthly water'),
  ('Security Services', 'SecureGuard', 'SEC-2026-MAR', 85000.00, '2026-03-05', 'paid', 'Security salaries'),
  ('Housekeeping', 'CleanPro', 'CLN-2026-MAR', 28000.00, '2026-03-08', 'pending', 'Maintenance'),
  ('Internet', 'FiberNet', 'INT-2026-MAR', 8000.00, '2026-03-12', 'pending', 'WiFi charges'),
  ('Lift Maintenance', 'Otis Elevator', 'LIFT-2026-Q1', 35000.00, '2026-03-20', 'pending', 'Quarterly maintenance'),
  ('Pest Control', 'PestAway', 'PEST-2026-MAR', 6500.00, '2026-03-18', 'pending', 'Monthly pest control'),
  ('Generator Fuel', 'Bharat Petroleum', 'FUEL-2026-MAR', 15000.00, '2026-03-07', 'paid', 'Diesel'),
  ('Property Tax', 'Municipal Corporation', 'TAX-2026-Q1', 125000.00, '2026-03-31', 'pending', 'Quarterly tax'),
  ('Insurance', 'HDFC ERGO', 'INS-2026-001', 95000.00, '2026-03-25', 'pending', 'Insurance premium'),
  ('Plumbing', 'AquaFix', 'PLB-2026-001', 18500.00, '2026-03-14', 'pending', 'Emergency repairs'),
  ('Painting', 'ColorCraft', 'PAINT-2026-001', 125000.00, '2026-03-30', 'pending', 'Exterior painting');
  
  RAISE NOTICE '✅ Added 12 society bills';
  
  -- ============================================
  -- SOCIETY EVENTS
  -- ============================================
  
  INSERT INTO society_events (title, description, event_date, event_time, location, created_by) VALUES
  ('Holi Celebration 2026', 'Annual Holi festival', '2026-03-25', '10:00:00', 'Clubhouse', user_id),
  ('Independence Day', 'Flag hoisting ceremony', '2026-08-15', '08:00:00', 'Main Gate', user_id),
  ('Diwali Mela', 'Grand Diwali fair', '2026-11-01', '17:00:00', 'Community Ground', user_id),
  ('New Year Party 2027', 'New Year celebration', '2026-12-31', '20:00:00', 'Clubhouse', user_id),
  ('Health Checkup Camp', 'Free health checkup', '2026-09-15', '09:00:00', 'Clubhouse', user_id),
  ('Ganesh Chaturthi', 'Community celebration', '2026-09-07', '18:00:00', 'Temple Area', user_id),
  ('Annual General Meeting', 'Society AGM', '2026-04-20', '19:00:00', 'Clubhouse', user_id),
  ('Blood Donation Camp', 'Blood donation', '2026-06-14', '10:00:00', 'Clubhouse', user_id),
  ('Children Day', 'Fun activities for kids', '2026-11-14', '16:00:00', 'Kids Play Area', user_id),
  ('Yoga Workshop', 'Free yoga workshop', '2026-05-21', '06:00:00', 'Yoga Room', user_id);
  
  RAISE NOTICE '✅ Added 10 events';
  
  -- ============================================
  -- CHAT MESSAGES
  -- ============================================
  
  INSERT INTO chat_messages (user_id, message, is_announcement, created_at) VALUES
  (user_id, '🎉 Welcome to Society Hub!', true, '2026-02-10 09:00:00'),
  (user_id, '📢 Water supply interrupted tomorrow 10 AM - 2 PM', true, '2026-02-15 18:00:00'),
  (user_id, 'Thanks for the update!', false, '2026-02-15 18:15:00'),
  (user_id, '🎊 Holi celebration on March 25th!', true, '2026-02-16 10:00:00'),
  (user_id, 'Excited for Holi!', false, '2026-02-16 10:30:00'),
  (user_id, '🚗 Park in designated slots only', true, '2026-02-17 08:00:00'),
  (user_id, 'Is the gym open on weekends?', false, '2026-02-17 19:00:00'),
  (user_id, 'Yes, gym open 6 AM to 10 PM daily', false, '2026-02-17 19:15:00'),
  (user_id, 'Great! Thank you.', false, '2026-02-17 19:20:00'),
  (user_id, '🔧 Lift maintenance Saturday', true, '2026-02-18 09:00:00');
  
  RAISE NOTICE '✅ Added 10 chat messages';
  
  -- ============================================
  -- NOTIFICATIONS
  -- ============================================
  
  INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
  (user_id, 'Payment Due', 'Maintenance payment of ₹5,000 due on March 5', 'payment', false),
  (user_id, 'New Event', 'Holi celebration on March 25', 'event', false),
  (user_id, 'Issue Update', 'Your issue is being worked on', 'issue', true),
  (user_id, 'Welcome', 'Welcome to Society Hub!', 'general', true);
  
  RAISE NOTICE '✅ Added 4 notifications';
  
  -- ============================================
  -- SUCCESS!
  -- ============================================
  
  RAISE NOTICE '';
  RAISE NOTICE '🎉 🎉 🎉 ALL DATA LOADED! 🎉 🎉 🎉';
  RAISE NOTICE '';
  RAISE NOTICE '✅ 7 Payments (₹800 - ₹15,000)';
  RAISE NOTICE '✅ 8 Issues';
  RAISE NOTICE '✅ 8 Visitors';
  RAISE NOTICE '✅ 10 Amenities';
  RAISE NOTICE '✅ 12 Documents';
  RAISE NOTICE '✅ 12 Society Bills';
  RAISE NOTICE '✅ 10 Events';
  RAISE NOTICE '✅ 10 Chat Messages';
  RAISE NOTICE '✅ 4 Notifications';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Refresh your browser to see the data!';
  RAISE NOTICE '';
  
END $$;
