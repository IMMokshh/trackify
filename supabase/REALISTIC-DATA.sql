-- ============================================
-- REALISTIC SOCIETY DATA
-- 7-Story Building | 2 Wings (A & B) | 4 Flats per Floor
-- Total: 56 Flats (7 floors × 2 wings × 4 flats)
-- ============================================

-- STEP 1: Clean existing data and load realistic data
-- ============================================
DO $$
DECLARE
  current_user_id UUID;
  current_user_flat TEXT;
BEGIN
  -- Clean existing data
  DELETE FROM payment_transactions;
  DELETE FROM issue_votes;
  DELETE FROM amenity_bookings;
  DELETE FROM chat_messages;
  DELETE FROM notifications;
  DELETE FROM reminders;
  DELETE FROM society_bills;
  DELETE FROM society_events;
  DELETE FROM documents;
  DELETE FROM visitors;
  DELETE FROM payments;
  DELETE FROM issues;
  
  RAISE NOTICE '✅ Cleaned old data';
  -- Get the logged-in user (moksh@societyhub.com)
  SELECT id INTO current_user_id FROM profiles WHERE email = 'moksh@societyhub.com' LIMIT 1;
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION '❌ User not found! Please login first at http://localhost:3000';
  END IF;
  
  -- Update user's flat number to A-101
  UPDATE profiles SET flat_number = 'A-101' WHERE id = current_user_id;
  
  SELECT flat_number INTO current_user_flat FROM profiles WHERE id = current_user_id;
  
  RAISE NOTICE '✅ Current User: % (Flat: %)', current_user_id, current_user_flat;
  
  -- ============================================
  -- PAYMENTS - Realistic Monthly Charges
  -- ============================================
  
  -- Pending Payments
  INSERT INTO payments (user_id, title, description, amount, due_date, status) VALUES
  (current_user_id, 'Monthly Maintenance - March 2026', 'Regular society maintenance charges', 4500.00, '2026-03-05', 'pending'),
  (current_user_id, 'Water Charges - March 2026', 'Monthly water bill based on usage', 850.00, '2026-03-10', 'pending'),
  (current_user_id, 'Electricity Common Area - March 2026', 'Common area electricity charges', 320.00, '2026-03-08', 'pending'),
  (current_user_id, 'Parking Charges - Q1 2026', 'Quarterly covered parking fee', 2500.00, '2026-03-31', 'pending'),
  (current_user_id, 'Sinking Fund - March 2026', 'Building repair and maintenance fund', 1200.00, '2026-03-15', 'pending');
  
  -- Paid Payments (History)
  INSERT INTO payments (user_id, title, description, amount, due_date, status, paid_date) VALUES
  (current_user_id, 'Monthly Maintenance - February 2026', 'Regular society maintenance charges', 4500.00, '2026-02-05', 'paid', '2026-02-03'),
  (current_user_id, 'Water Charges - February 2026', 'Monthly water bill', 820.00, '2026-02-10', 'paid', '2026-02-08'),
  (current_user_id, 'Monthly Maintenance - January 2026', 'Regular society maintenance charges', 4500.00, '2026-01-05', 'paid', '2026-01-04'),
  (current_user_id, 'Water Charges - January 2026', 'Monthly water bill', 790.00, '2026-01-10', 'paid', '2026-01-09');
  
  RAISE NOTICE '✅ Added 9 realistic payments';
  
  -- ============================================
  -- ISSUES - Real Society Problems
  -- ============================================
  
  INSERT INTO issues (title, description, category, priority, status, created_by, vote_count) VALUES
  ('Lift Not Working in Wing A', 'The lift in Wing A has been stuck on 5th floor since morning. Residents are facing difficulty.', 'Maintenance', 'high', 'open', current_user_id, 15),
  ('Water Pressure Low on 6th & 7th Floor', 'Water pressure is very low during morning hours on top floors', 'Plumbing', 'high', 'in_progress', current_user_id, 12),
  ('Parking Slot Encroachment', 'Someone is parking in my designated slot A-101-P1', 'Parking', 'medium', 'open', current_user_id, 8),
  ('Gym Equipment Needs Repair', 'Treadmill in gym is making noise and belt is loose', 'Amenities', 'medium', 'open', current_user_id, 6),
  ('Street Light Not Working Near Gate', 'The street light near main gate is not working since 3 days', 'Electrical', 'medium', 'in_progress', current_user_id, 10),
  ('Garbage Collection Timing Issue', 'Garbage collection happens too early at 6 AM, causing disturbance', 'Housekeeping', 'low', 'open', current_user_id, 4),
  ('Swimming Pool Cleaning Required', 'Pool water looks dirty and needs immediate cleaning', 'Amenities', 'medium', 'resolved', current_user_id, 3),
  ('CCTV Camera Not Working in Basement', 'Security camera in basement parking is not functioning', 'Security', 'high', 'open', current_user_id, 14);
  
  RAISE NOTICE '✅ Added 8 realistic issues';
  
  -- ============================================
  -- VISITORS - Real Visitor Entries
  -- ============================================
  
  INSERT INTO visitors (name, phone, purpose, flat_number, host_id, check_in_time, check_out_time, qr_code) VALUES
  ('Rajesh Kumar', '9876543210', 'Plumber - Kitchen sink repair', 'A-101', current_user_id, '2026-02-18 10:30:00', '2026-02-18 12:00:00', 'QR_VIS_001'),
  ('Priya Sharma', '9876543211', 'Friend visiting', 'A-101', current_user_id, '2026-02-17 18:00:00', '2026-02-17 22:30:00', 'QR_VIS_002'),
  ('Amazon Delivery', '9876543212', 'Package delivery', 'A-101', current_user_id, '2026-02-18 15:30:00', '2026-02-18 15:35:00', 'QR_VIS_003'),
  ('Swiggy Delivery', '9876543213', 'Food delivery', 'A-101', current_user_id, '2026-02-18 20:15:00', '2026-02-18 20:20:00', 'QR_VIS_004'),
  ('Dr. Mehta', '9876543214', 'Home visit - Medical checkup', 'A-101', current_user_id, '2026-02-16 11:00:00', '2026-02-16 11:45:00', 'QR_VIS_005'),
  ('Ravi Electrician', '9876543215', 'AC servicing', 'A-101', current_user_id, '2026-02-15 15:00:00', '2026-02-15 17:30:00', 'QR_VIS_006'),
  ('Amit Patel (Brother)', '9876543216', 'Family visit', 'A-101', current_user_id, '2026-02-14 10:00:00', '2026-02-14 18:00:00', 'QR_VIS_007'),
  ('Meena Maid', '9876543217', 'Housekeeping', 'A-101', current_user_id, '2026-02-18 08:00:00', '2026-02-18 10:00:00', 'QR_VIS_008');
  
  RAISE NOTICE '✅ Added 8 realistic visitors';
  
  -- ============================================
  -- AMENITIES - Society Facilities
  -- ============================================
  
  INSERT INTO amenities (name, description, capacity, price_per_hour, is_active) VALUES
  ('Clubhouse', 'Main community hall with AC and sound system', 100, 800, true),
  ('Swimming Pool', 'Olympic size swimming pool with changing rooms', 50, 0, true),
  ('Gym & Fitness Center', 'Fully equipped gym with modern equipment', 30, 0, true),
  ('Indoor Badminton Court', 'Air-conditioned badminton court', 4, 200, true),
  ('Kids Play Area', 'Safe outdoor play area for children', 20, 0, true),
  ('Party Hall', 'Private party hall with kitchen', 80, 1200, true),
  ('Terrace Garden', 'Rooftop garden with seating area', 40, 500, true),
  ('Conference Room', 'Meeting room with projector and WiFi', 15, 300, true),
  ('Yoga & Meditation Room', 'Peaceful room for yoga and meditation', 25, 0, true),
  ('Guest Parking', 'Visitor parking slots', 10, 50, true);
  
  RAISE NOTICE '✅ Added 10 amenities';
  
  -- ============================================
  -- DOCUMENTS - Society Documents
  -- ============================================
  
  INSERT INTO documents (title, description, file_url, file_type, file_size, category, uploaded_by, is_public, is_important) VALUES
  ('Society Bylaws 2026', 'Updated society rules and regulations', 'https://example.com/bylaws-2026.pdf', 'application/pdf', 245678, 'Legal', current_user_id, true, true),
  ('Maintenance Payment Guidelines', 'How to pay maintenance charges', 'https://example.com/payment-guide.pdf', 'application/pdf', 156789, 'Finance', current_user_id, true, true),
  ('Emergency Contact Numbers', 'Important emergency contacts', 'https://example.com/emergency.pdf', 'application/pdf', 89456, 'Important', current_user_id, true, true),
  ('Parking Allocation List', 'Parking slot allocation for all flats', 'https://example.com/parking.pdf', 'application/pdf', 123456, 'Parking', current_user_id, true, true),
  ('Annual Budget 2026', 'Society annual budget and expenses', 'https://example.com/budget-2026.pdf', 'application/pdf', 567890, 'Finance', current_user_id, true, false),
  ('AGM Minutes - Jan 2026', 'Annual General Meeting minutes', 'https://example.com/agm-jan-2026.pdf', 'application/pdf', 234567, 'Meeting', current_user_id, true, false),
  ('Amenity Booking Rules', 'Rules for booking society amenities', 'https://example.com/amenity-rules.pdf', 'application/pdf', 98765, 'Rules', current_user_id, true, true),
  ('Waste Segregation Guidelines', 'How to segregate wet and dry waste', 'https://example.com/waste-guide.pdf', 'application/pdf', 145678, 'Environment', current_user_id, true, false),
  ('Security Protocol', 'Security procedures and visitor policy', 'https://example.com/security.pdf', 'application/pdf', 187654, 'Security', current_user_id, true, true),
  ('Pet Policy', 'Guidelines for pet owners', 'https://example.com/pet-policy.pdf', 'application/pdf', 112345, 'Rules', current_user_id, true, false),
  ('Renovation Guidelines', 'Rules for flat renovation work', 'https://example.com/renovation.pdf', 'application/pdf', 198765, 'Rules', current_user_id, true, false),
  ('Fire Safety Plan', 'Emergency evacuation and fire safety', 'https://example.com/fire-safety.pdf', 'application/pdf', 134567, 'Safety', current_user_id, true, true);
  
  RAISE NOTICE '✅ Added 12 documents';
  
  -- ============================================
  -- SOCIETY BILLS - Realistic Monthly Expenses
  -- ============================================
  
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes) VALUES
  ('Electricity', 'MSEB - Common Area', 'EB-MAR-2026', 18500.00, '2026-03-10', 'pending', 'Common area electricity'),
  ('Water Supply', 'Municipal Corporation', 'WB-MAR-2026', 8500.00, '2026-03-15', 'pending', 'Society water charges'),
  ('Security Services', 'SecureGuard Pvt Ltd', 'SEC-MAR-2026', 65000.00, '2026-03-05', 'paid', '8 security guards salary'),
  ('Housekeeping', 'CleanPro Services', 'CLN-MAR-2026', 22000.00, '2026-03-08', 'pending', 'Cleaning staff salary'),
  ('Internet & WiFi', 'Airtel Fiber', 'INT-MAR-2026', 5500.00, '2026-03-12', 'pending', 'Common area WiFi'),
  ('Lift Maintenance', 'Otis Elevator Co', 'LIFT-Q1-2026', 28000.00, '2026-03-20', 'pending', 'Quarterly AMC - 2 lifts'),
  ('Pest Control', 'PestAway Services', 'PEST-MAR-2026', 4500.00, '2026-03-18', 'pending', 'Monthly pest control'),
  ('Generator Fuel', 'Bharat Petroleum', 'FUEL-MAR-2026', 12000.00, '2026-03-07', 'paid', 'Diesel for backup generator'),
  ('Gardening', 'Green Thumb Services', 'GRDN-MAR-2026', 8000.00, '2026-03-14', 'pending', 'Garden maintenance'),
  ('Swimming Pool Maintenance', 'AquaCare', 'POOL-MAR-2026', 6500.00, '2026-03-16', 'pending', 'Pool cleaning and chemicals'),
  ('Gym Equipment AMC', 'FitPro Services', 'GYM-Q1-2026', 15000.00, '2026-03-25', 'pending', 'Quarterly gym maintenance'),
  ('Insurance Premium', 'HDFC ERGO', 'INS-Q1-2026', 45000.00, '2026-03-30', 'pending', 'Building insurance quarterly');
  
  RAISE NOTICE '✅ Added 12 society bills';
  
  -- ============================================
  -- SOCIETY EVENTS - Upcoming Events
  -- ============================================
  
  INSERT INTO society_events (title, description, event_date, event_time, location, created_by) VALUES
  ('Holi Celebration 2026', 'Annual Holi festival with colors and music', '2026-03-25', '10:00:00', 'Society Garden', current_user_id),
  ('Yoga Workshop', 'Free yoga session by certified instructor', '2026-03-15', '06:30:00', 'Yoga Room', current_user_id),
  ('Kids Drawing Competition', 'Art competition for children aged 5-12', '2026-03-22', '16:00:00', 'Clubhouse', current_user_id),
  ('Health Checkup Camp', 'Free health checkup by Apollo Hospital', '2026-04-05', '09:00:00', 'Clubhouse', current_user_id),
  ('Society AGM 2026', 'Annual General Meeting - All members invited', '2026-04-20', '19:00:00', 'Clubhouse', current_user_id),
  ('Blood Donation Camp', 'Blood donation drive by Red Cross', '2026-04-14', '10:00:00', 'Clubhouse', current_user_id),
  ('Ganesh Chaturthi Celebration', 'Community Ganesh festival', '2026-09-07', '18:00:00', 'Society Garden', current_user_id),
  ('Independence Day Celebration', 'Flag hoisting and cultural program', '2026-08-15', '08:00:00', 'Main Gate', current_user_id),
  ('Diwali Mela', 'Diwali fair with food stalls and games', '2026-11-01', '17:00:00', 'Society Garden', current_user_id),
  ('New Year Party 2027', 'New Year celebration with DJ and dinner', '2026-12-31', '20:00:00', 'Clubhouse', current_user_id);
  
  RAISE NOTICE '✅ Added 10 events';
  
  -- ============================================
  -- CHAT MESSAGES - Community Chat
  -- ============================================
  
  INSERT INTO chat_messages (user_id, message, is_announcement, created_at) VALUES
  (current_user_id, '🎉 Welcome to Society Hub Community Chat!', true, '2026-02-10 09:00:00'),
  (current_user_id, '📢 Water supply will be interrupted tomorrow 10 AM - 2 PM for tank cleaning', true, '2026-02-15 18:00:00'),
  (current_user_id, 'Thanks for the update!', false, '2026-02-15 18:15:00'),
  (current_user_id, '🎊 Holi celebration on March 25th! Register your family at the office', true, '2026-02-16 10:00:00'),
  (current_user_id, 'Count me in! Excited for Holi!', false, '2026-02-16 10:30:00'),
  (current_user_id, '🚗 Please park only in designated slots. Unauthorized parking will be towed', true, '2026-02-17 08:00:00'),
  (current_user_id, 'Is the gym open on weekends?', false, '2026-02-17 19:00:00'),
  (current_user_id, 'Yes, gym is open 6 AM to 10 PM daily including weekends', false, '2026-02-17 19:15:00'),
  (current_user_id, 'Perfect! Thank you.', false, '2026-02-17 19:20:00'),
  (current_user_id, '🔧 Lift maintenance in Wing A on Saturday 9 AM - 12 PM', true, '2026-02-18 09:00:00');
  
  RAISE NOTICE '✅ Added 10 chat messages';
  
  -- ============================================
  -- NOTIFICATIONS
  -- ============================================
  
  INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
  (current_user_id, 'Payment Due', 'Monthly maintenance of ₹4,500 due on March 5', 'payment', false),
  (current_user_id, 'Upcoming Event', 'Holi celebration on March 25 - Register now!', 'event', false),
  (current_user_id, 'Issue Update', 'Lift repair work in progress - Expected completion by tomorrow', 'issue', false),
  (current_user_id, 'Welcome', 'Welcome to Society Hub! Explore all features.', 'general', true);
  
  RAISE NOTICE '✅ Added 4 notifications';
  
  -- ============================================
  -- REMINDERS
  -- ============================================
  
  INSERT INTO reminders (user_id, title, reminder_time, is_completed) VALUES
  (current_user_id, 'Pay Maintenance Fee - Due March 5', '2026-03-04 10:00:00', false),
  (current_user_id, 'Book Clubhouse for Birthday Party', '2026-03-10 09:00:00', false),
  (current_user_id, 'Gym Session - Morning Workout', '2026-02-19 06:00:00', false),
  (current_user_id, 'Society AGM Meeting - April 20', '2026-04-19 18:00:00', false);
  
  RAISE NOTICE '✅ Added 4 reminders';
  
  -- ============================================
  -- SUCCESS!
  -- ============================================
  
  RAISE NOTICE '';
  RAISE NOTICE '🎉 🎉 🎉 REALISTIC DATA LOADED! 🎉 🎉 🎉';
  RAISE NOTICE '';
  RAISE NOTICE '🏢 Building: 7 Floors | 2 Wings (A & B) | 4 Flats per Floor';
  RAISE NOTICE '👤 Your Flat: A-101';
  RAISE NOTICE '';
  RAISE NOTICE '✅ 9 Payments (₹850 - ₹4,500)';
  RAISE NOTICE '✅ 8 Realistic Issues';
  RAISE NOTICE '✅ 8 Visitors';
  RAISE NOTICE '✅ 10 Amenities';
  RAISE NOTICE '✅ 12 Documents';
  RAISE NOTICE '✅ 12 Society Bills';
  RAISE NOTICE '✅ 10 Events';
  RAISE NOTICE '✅ 10 Chat Messages';
  RAISE NOTICE '✅ 4 Notifications';
  RAISE NOTICE '✅ 4 Reminders';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Refresh your browser to see the realistic data!';
  RAISE NOTICE '';
  
END $$;
