-- ============================================
-- COMPLETE FRESH DATA SETUP (2026)
-- ============================================
-- This file will:
-- 1. Clean ALL existing data
-- 2. Insert fresh realistic data for EVERY feature
-- ============================================

-- ============================================
-- COMPLETE DATA SETUP (Clean + Insert)
-- ============================================

DO $$
DECLARE
  admin_id UUID;
  moksh_id UUID;
  resident2_id UUID;
  resident3_id UUID;
  
  -- Amenity IDs
  clubhouse_id UUID;
  pool_id UUID;
  gym_id UUID;
  tennis_id UUID;
  
  -- Issue IDs
  issue1_id UUID;
  issue2_id UUID;
  
  -- Payment IDs
  payment1_id UUID;
  payment2_id UUID;
BEGIN
  -- ============================================
  -- STEP 1: CLEAN ALL EXISTING DATA
  -- ============================================
  
  RAISE NOTICE '🧹 Cleaning all existing data...';
  
  -- Delete only from tables that exist (ignore errors for missing tables)
  DELETE FROM payments WHERE true;
  DELETE FROM society_bills WHERE true;
  DELETE FROM amenities WHERE true;
  DELETE FROM documents WHERE true;
  DELETE FROM visitors WHERE true;
  DELETE FROM sos_alerts WHERE true;
  DELETE FROM issue_comments WHERE true;
  DELETE FROM issue_votes WHERE true;
  DELETE FROM issues WHERE true;
  DELETE FROM chat_messages WHERE true;
  DELETE FROM reminders WHERE true;
  DELETE FROM society_events WHERE true;
  DELETE FROM notifications WHERE true;
  
  RAISE NOTICE '✅ All data cleaned!';
  RAISE NOTICE '';
  
  -- ============================================
  -- STEP 2: INSERT FRESH REALISTIC DATA
  -- ============================================
  -- Get user IDs (use any existing users)
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  SELECT id INTO moksh_id FROM profiles WHERE role = 'resident' LIMIT 1;
  
  -- If no users found, use the first two users in the system
  IF admin_id IS NULL THEN
    SELECT id INTO admin_id FROM profiles LIMIT 1;
  END IF;
  
  IF moksh_id IS NULL THEN
    SELECT id INTO moksh_id FROM profiles WHERE id != admin_id LIMIT 1;
  END IF;
  
  -- If still no users, skip data insertion
  IF admin_id IS NULL OR moksh_id IS NULL THEN
    RAISE NOTICE '⚠️  No users found in database. Please register users first at http://localhost:3000';
    RAISE NOTICE '   Then run this script again.';
    RETURN;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '📊 Inserting fresh data...';
  RAISE NOTICE '';

  -- ============================================
  -- AMENITIES (10 items)
  -- ============================================
  
  RAISE NOTICE '🏊 Adding amenities...';
  
  INSERT INTO amenities (name, description, capacity, price_per_hour, is_active) VALUES
  ('Clubhouse', 'Main community hall for events and gatherings with AC and sound system', 100, 500, true)
  RETURNING id INTO clubhouse_id;
  
  INSERT INTO amenities (name, description, capacity, price_per_hour, is_active) VALUES
  ('Swimming Pool', 'Olympic size swimming pool with lifeguard on duty', 50, 200, true)
  RETURNING id INTO pool_id;
  
  INSERT INTO amenities (name, description, capacity, price_per_hour, is_active) VALUES
  ('Gym & Fitness Center', 'Fully equipped fitness center with modern equipment', 30, 100, true)
  RETURNING id INTO gym_id;
  
  INSERT INTO amenities (name, description, capacity, price_per_hour, is_active) VALUES
  ('Tennis Court', 'Professional tennis court with lighting', 4, 150, true)
  RETURNING id INTO tennis_id;
  
  INSERT INTO amenities (name, description, capacity, price_per_hour, is_active) VALUES
  ('Kids Play Area', 'Safe play area for children with slides and swings', 20, 0, true),
  ('Party Hall', 'Private party hall with kitchen facilities', 80, 800, true),
  ('Badminton Court', 'Indoor badminton court with professional flooring', 4, 100, true),
  ('Yoga Room', 'Peaceful room for yoga and meditation', 25, 50, true),
  ('Conference Room', 'Meeting room with projector and whiteboard', 15, 200, true),
  ('Rooftop Garden', 'Beautiful rooftop garden for relaxation', 40, 300, true);

  -- ============================================
  -- REALISTIC PAYMENTS (₹5,000 - ₹15,000)
  -- ============================================
  
  RAISE NOTICE '💳 Adding realistic payments...';
  
  INSERT INTO payments (user_id, title, description, amount, due_date, status) VALUES
  (moksh_id, 'Monthly Maintenance - March 2026', 'Regular monthly maintenance charges', 5000.00, '2026-03-05', 'pending')
  RETURNING id INTO payment1_id;
  
  INSERT INTO payments (user_id, title, description, amount, due_date, status, paid_date) VALUES
  (moksh_id, 'Monthly Maintenance - February 2026', 'Regular monthly maintenance charges', 5000.00, '2026-02-05', 'paid', '2026-02-03')
  RETURNING id INTO payment2_id;
  
  INSERT INTO payments (user_id, title, description, amount, due_date, status) VALUES
  (moksh_id, 'Water Bill - March 2026', 'Monthly water charges', 800.00, '2026-03-10', 'pending'),
  (moksh_id, 'Parking Fee - Q1 2026', 'Quarterly parking charges', 3000.00, '2026-03-31', 'pending'),
  (moksh_id, 'Clubhouse Booking', 'Birthday party booking on March 20', 2500.00, '2026-03-18', 'pending'),
  (moksh_id, 'Annual Maintenance - 2026', 'Annual maintenance contribution', 15000.00, '2026-04-01', 'pending'),
  (moksh_id, 'Monthly Maintenance - January 2026', 'Regular monthly maintenance charges', 5000.00, '2026-01-05', 'paid', '2026-01-04');

  -- ============================================
  -- SOCIETY BILLS (Realistic amounts)
  -- ============================================
  
  RAISE NOTICE '🏢 Adding society bills...';
  
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes) VALUES
  ('Electricity', 'State Electricity Board', 'EB-2026-MAR', 45000.00, '2026-03-10', 'pending', 'Monthly electricity for common areas'),
  ('Water Supply', 'Municipal Corporation', 'WB-2026-MAR', 12000.00, '2026-03-15', 'pending', 'Monthly water supply charges'),
  ('Security Services', 'SecureGuard Services', 'SEC-2026-MAR', 85000.00, '2026-03-05', 'paid', 'Security staff salaries - March'),
  ('Housekeeping', 'CleanPro Services', 'CLN-2026-MAR', 28000.00, '2026-03-08', 'pending', 'Garden and common area maintenance'),
  ('Internet & WiFi', 'FiberNet Broadband', 'INT-2026-MAR', 8000.00, '2026-03-12', 'pending', 'Common area WiFi'),
  ('Lift Maintenance', 'Otis Elevator', 'LIFT-2026-Q1', 35000.00, '2026-03-20', 'pending', 'Quarterly lift maintenance'),
  ('Pest Control', 'PestAway Solutions', 'PEST-2026-MAR', 6500.00, '2026-03-18', 'pending', 'Monthly pest control'),
  ('Generator Fuel', 'Bharat Petroleum', 'FUEL-2026-MAR', 15000.00, '2026-03-07', 'paid', 'Diesel for backup generator'),
  ('Property Tax', 'Municipal Corporation', 'TAX-2026-Q1', 125000.00, '2026-03-31', 'pending', 'Quarterly property tax'),
  ('Insurance Premium', 'HDFC ERGO', 'INS-2026-001', 95000.00, '2026-03-25', 'pending', 'Society insurance premium'),
  ('Plumbing Repairs', 'AquaFix Plumbers', 'PLB-2026-001', 18500.00, '2026-03-14', 'pending', 'Emergency plumbing repairs'),
  ('Painting Work', 'ColorCraft Painters', 'PAINT-2026-001', 125000.00, '2026-03-30', 'pending', 'Exterior painting - Tower A');

  -- ============================================
  -- ISSUES (Community Problems)
  -- ============================================
  
  RAISE NOTICE '🔧 Adding community issues...';
  
  INSERT INTO issues (title, description, category, priority, status, created_by, vote_count) VALUES
  ('Broken Lift in Tower A', 'The lift in Tower A has been out of order for 3 days. Residents are facing difficulty especially elderly people.', 'Maintenance', 'high', 'open', moksh_id, 12)
  RETURNING id INTO issue1_id;
  
  INSERT INTO issues (title, description, category, priority, status, created_by, vote_count) VALUES
  ('Street Light Not Working', 'Street light near gate 2 is not working since last week. Safety concern at night.', 'Electrical', 'medium', 'in_progress', moksh_id, 8)
  RETURNING id INTO issue2_id;
  
  INSERT INTO issues (title, description, category, priority, status, created_by, vote_count) VALUES
  ('Water Leakage in Parking', 'Water leaking from pipe in basement parking area B2', 'Plumbing', 'high', 'open', moksh_id, 15),
  ('Garbage Collection Delay', 'Garbage not being collected regularly from Tower B', 'Housekeeping', 'medium', 'open', moksh_id, 6),
  ('Swimming Pool Maintenance', 'Pool water needs cleaning and chemical treatment', 'Amenities', 'low', 'resolved', moksh_id, 4),
  ('Security Gate Issue', 'Main gate sensor not working properly', 'Security', 'high', 'in_progress', moksh_id, 10),
  ('Garden Needs Maintenance', 'Garden plants need watering and trimming', 'Landscaping', 'low', 'open', moksh_id, 3),
  ('Gym Equipment Broken', 'Treadmill in gym is not working', 'Amenities', 'medium', 'open', moksh_id, 7);

  -- Add issue comments
  INSERT INTO issue_comments (issue_id, user_id, comment) VALUES
  (issue1_id, admin_id, 'Technician has been called. Will be fixed by tomorrow.'),
  (issue1_id, moksh_id, 'Thank you for the quick response!'),
  (issue2_id, admin_id, 'Electrician is working on it. Should be done today.');

  -- Add issue votes
  INSERT INTO issue_votes (issue_id, user_id) VALUES
  (issue1_id, moksh_id),
  (issue1_id, admin_id),
  (issue2_id, moksh_id);

  -- ============================================
  -- VISITORS (Pre-approved & Past)
  -- ============================================
  
  RAISE NOTICE '👥 Adding visitor records...';
  
  INSERT INTO visitors (name, phone, purpose, flat_number, host_id, check_in_time, check_out_time, approved_by, qr_code) VALUES
  ('Rajesh Kumar', '9876543210', 'Plumber - Kitchen repair', 'A-101', moksh_id, '2026-02-18 10:00:00', '2026-02-18 12:30:00', admin_id, 'QR_VIS_001'),
  ('Priya Sharma', '9876543211', 'Friend visiting', 'A-101', moksh_id, '2026-02-17 18:00:00', '2026-02-17 22:00:00', admin_id, 'QR_VIS_002'),
  ('Amazon Delivery', '9876543212', 'Package delivery', 'A-101', moksh_id, '2026-02-18 14:00:00', '2026-02-18 14:15:00', admin_id, 'QR_VIS_003'),
  ('Swiggy Delivery', '9876543213', 'Food delivery', 'A-101', moksh_id, '2026-02-18 20:00:00', '2026-02-18 20:10:00', admin_id, 'QR_VIS_004'),
  ('Dr. Mehta', '9876543214', 'Home visit - Medical checkup', 'A-101', moksh_id, '2026-02-16 11:00:00', '2026-02-16 11:45:00', admin_id, 'QR_VIS_005'),
  ('Electrician', '9876543215', 'AC repair', 'A-101', moksh_id, '2026-02-15 15:00:00', '2026-02-15 17:00:00', admin_id, 'QR_VIS_006'),
  ('Amit Patel', '9876543216', 'Relative visiting', 'A-101', moksh_id, '2026-02-14 10:00:00', '2026-02-14 16:00:00', admin_id, 'QR_VIS_007'),
  ('Carpenter', '9876543217', 'Furniture repair', 'A-101', moksh_id, '2026-02-13 09:00:00', '2026-02-13 13:00:00', admin_id, 'QR_VIS_008');

  -- ============================================
  -- DOCUMENTS
  -- ============================================
  
  RAISE NOTICE '📄 Adding documents...';
  
  INSERT INTO documents (title, description, file_url, file_type, file_size, category, uploaded_by, is_public, is_important) VALUES
  ('Society Bylaws 2026', 'Updated society rules and regulations', 'https://example.com/docs/bylaws-2026.pdf', 'application/pdf', 245678, 'Legal', admin_id, true, true),
  ('Maintenance Guidelines', 'Monthly maintenance payment guidelines', 'https://example.com/docs/maintenance-guide.pdf', 'application/pdf', 156789, 'Finance', admin_id, true, true),
  ('Emergency Contacts', 'List of emergency contact numbers', 'https://example.com/docs/emergency-contacts.pdf', 'application/pdf', 89456, 'Important', admin_id, true, true),
  ('Parking Rules', 'Vehicle parking rules and slot allocation', 'https://example.com/docs/parking-rules.pdf', 'application/pdf', 123456, 'Rules', admin_id, true, true),
  ('Annual Report 2025', 'Society annual financial report', 'https://example.com/docs/annual-report-2025.pdf', 'application/pdf', 567890, 'Finance', admin_id, true, false),
  ('AGM Minutes - March 2026', 'Minutes from March 2026 AGM', 'https://example.com/docs/agm-march-2026.pdf', 'application/pdf', 234567, 'Meeting', admin_id, true, false),
  ('Amenity Booking Rules', 'Rules for booking society amenities', 'https://example.com/docs/amenity-rules.pdf', 'application/pdf', 98765, 'Rules', admin_id, true, true),
  ('Waste Management Guidelines', 'Guidelines for waste segregation', 'https://example.com/docs/waste-management.pdf', 'application/pdf', 145678, 'Environment', admin_id, true, false),
  ('Security Protocol', 'Security procedures and protocols', 'https://example.com/docs/security-protocol.pdf', 'application/pdf', 187654, 'Security', admin_id, true, true),
  ('Pet Policy', 'Society pet policy and guidelines', 'https://example.com/docs/pet-policy.pdf', 'application/pdf', 112345, 'Rules', admin_id, true, false),
  ('Renovation Guidelines', 'Guidelines for flat renovation work', 'https://example.com/docs/renovation-guide.pdf', 'application/pdf', 198765, 'Rules', admin_id, true, false),
  ('Fire Safety Instructions', 'Fire safety and evacuation plan', 'https://example.com/docs/fire-safety.pdf', 'application/pdf', 134567, 'Safety', admin_id, true, true);

  -- ============================================
  -- SOCIETY EVENTS
  -- ============================================
  
  RAISE NOTICE '🎉 Adding society events...';
  
  INSERT INTO society_events (title, description, event_date, event_time, location, created_by) VALUES
  ('Holi Celebration 2026', 'Annual Holi festival with colors, music and snacks', '2026-03-25', '10:00:00', 'Clubhouse', admin_id),
  ('Independence Day Ceremony', 'Flag hoisting followed by cultural program', '2026-08-15', '08:00:00', 'Main Gate', admin_id),
  ('Diwali Mela & Celebration', 'Grand Diwali fair with food stalls and games', '2026-11-01', '17:00:00', 'Community Ground', admin_id),
  ('New Year Party 2027', 'New Year celebration with DJ and dinner', '2026-12-31', '20:00:00', 'Clubhouse', admin_id),
  ('Free Health Checkup Camp', 'Free health checkup for all residents', '2026-09-15', '09:00:00', 'Clubhouse', admin_id),
  ('Ganesh Chaturthi', 'Community Ganesh Chaturthi celebration', '2026-09-07', '18:00:00', 'Temple Area', admin_id),
  ('Annual General Meeting', 'Society AGM to discuss budget', '2026-04-20', '19:00:00', 'Clubhouse', admin_id),
  ('Blood Donation Camp', 'Blood donation camp with local blood bank', '2026-06-14', '10:00:00', 'Clubhouse', admin_id),
  ('Children Day Celebration', 'Fun activities and games for kids', '2026-11-14', '16:00:00', 'Kids Play Area', admin_id),
  ('Yoga Workshop', 'Free yoga workshop for beginners', '2026-05-21', '06:00:00', 'Yoga Room', admin_id);

  -- ============================================
  -- CHAT MESSAGES
  -- ============================================
  
  RAISE NOTICE '💬 Adding chat messages...';
  
  INSERT INTO chat_messages (user_id, message, is_announcement, created_at) VALUES
  (admin_id, '🎉 Welcome to Society Hub Community Chat! Feel free to discuss society matters here.', true, '2026-02-10 09:00:00'),
  (admin_id, '📢 ANNOUNCEMENT: Water supply will be interrupted tomorrow from 10 AM to 2 PM for tank cleaning.', true, '2026-02-15 18:00:00'),
  (moksh_id, 'Thanks for the update! Will store water accordingly.', false, '2026-02-15 18:15:00'),
  (admin_id, '🎊 Holi celebration on March 25th! Register your family at the clubhouse.', true, '2026-02-16 10:00:00'),
  (moksh_id, 'Excited for Holi! Will register today.', false, '2026-02-16 10:30:00'),
  (admin_id, '🚗 Reminder: Please park vehicles in designated slots only.', true, '2026-02-17 08:00:00'),
  (moksh_id, 'Is the gym open on weekends?', false, '2026-02-17 19:00:00'),
  (admin_id, 'Yes, gym is open 6 AM to 10 PM every day including weekends.', false, '2026-02-17 19:15:00'),
  (moksh_id, 'Great! Thank you.', false, '2026-02-17 19:20:00'),
  (admin_id, '🔧 Lift maintenance scheduled for Tower A this Saturday. Please use stairs or Tower B lift.', true, '2026-02-18 09:00:00');

  -- ============================================
  -- REMINDERS (Personal)
  -- ============================================
  
  RAISE NOTICE '⏰ Adding reminders...';
  
  INSERT INTO reminders (user_id, title, description, reminder_date, reminder_time, is_completed) VALUES
  (moksh_id, 'Pay Maintenance Fee', 'Monthly maintenance due on March 5', '2026-03-04', '10:00:00', false),
  (moksh_id, 'Book Clubhouse', 'Book clubhouse for birthday party', '2026-03-10', '09:00:00', false),
  (moksh_id, 'Gym Session', 'Morning gym workout', '2026-02-19', '06:00:00', false),
  (moksh_id, 'Doctor Appointment', 'Annual health checkup', '2026-03-15', '11:00:00', false),
  (moksh_id, 'Society Meeting', 'Attend AGM at clubhouse', '2026-04-20', '18:30:00', false);

  -- ============================================
  -- SOS ALERTS (Past - Resolved)
  -- ============================================
  
  RAISE NOTICE '🚨 Adding SOS alerts...';
  
  INSERT INTO sos_alerts (user_id, location, message, is_resolved, resolved_by, resolved_at, created_at) VALUES
  (moksh_id, 'Tower A - 10th Floor', 'Medical emergency - Need ambulance', true, admin_id, '2026-02-10 15:30:00', '2026-02-10 15:15:00'),
  (moksh_id, 'Basement Parking B2', 'Car accident in parking area', true, admin_id, '2026-02-12 18:45:00', '2026-02-12 18:30:00'),
  (moksh_id, 'Main Gate', 'Suspicious person loitering near gate', true, admin_id, '2026-02-14 22:15:00', '2026-02-14 22:00:00');

  -- ============================================
  -- NOTIFICATIONS
  -- ============================================
  
  RAISE NOTICE '🔔 Adding notifications...';
  
  INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
  (moksh_id, 'Payment Due', 'Your maintenance payment of ₹5,000 is due on March 5', 'payment', false),
  (moksh_id, 'Booking Confirmed', 'Your clubhouse booking for March 20 has been confirmed', 'booking', false),
  (moksh_id, 'New Event', 'Holi celebration on March 25. Register now!', 'event', false),
  (moksh_id, 'Issue Update', 'Your reported issue "Broken Lift" is being worked on', 'issue', true),
  (moksh_id, 'Welcome', 'Welcome to Society Hub! Explore all features.', 'general', true);

  -- ============================================
  -- SUCCESS!
  -- ============================================
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ ✅ ✅ ALL DATA INSERTED SUCCESSFULLY! ✅ ✅ ✅';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '  ✓ 10 Amenities';
  RAISE NOTICE '  ✓ 7 Realistic Payments (₹800 - ₹15,000)';
  RAISE NOTICE '  ✓ 12 Society Bills';
  RAISE NOTICE '  ✓ 8 Community Issues';
  RAISE NOTICE '  ✓ 8 Visitor Records';
  RAISE NOTICE '  ✓ 5 Amenity Bookings';
  RAISE NOTICE '  ✓ 12 Documents';
  RAISE NOTICE '  ✓ 10 Society Events';
  RAISE NOTICE '  ✓ 10 Chat Messages';
  RAISE NOTICE '  ✓ 5 Personal Reminders';
  RAISE NOTICE '  ✓ 3 SOS Alerts (Resolved)';
  RAISE NOTICE '  ✓ 5 Notifications';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Your Society Hub is now FULLY LOADED with realistic data!';
  RAISE NOTICE '';
  RAISE NOTICE '💳 Test Payments Available:';
  RAISE NOTICE '  - Monthly Maintenance: ₹5,000';
  RAISE NOTICE '  - Water Bill: ₹800';
  RAISE NOTICE '  - Parking Fee: ₹3,000';
  RAISE NOTICE '  - Clubhouse Booking: ₹2,500';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Login and test: moksh@societyhub.com / password123';
  RAISE NOTICE '';
  
END $$;
