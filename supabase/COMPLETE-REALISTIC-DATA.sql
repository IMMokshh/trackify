-- ============================================
-- COMPLETE REALISTIC SOCIETY DATA
-- Building: Sunrise Apartments (Est. 2015)
-- 7 Floors | 2 Wings (A & B) | 4 Flats per Floor = 56 Flats
-- ============================================

DO $$
DECLARE
  moksh_id UUID;
  purva_id UUID;
  yash_id UUID;
  tanmay_id UUID;
  user_ids UUID[];
  temp_user_id UUID;
BEGIN
  -- ============================================
  -- STEP 1: Clean existing data
  -- ============================================
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
  
  -- ============================================
  -- STEP 2: Get Committee Members
  -- ============================================
  
  -- Get Moksh Sonar (Secretary - A-301)
  SELECT id INTO moksh_id FROM profiles WHERE email = 'moksh@societyhub.com' LIMIT 1;
  
  IF moksh_id IS NULL THEN
    RAISE EXCEPTION '❌ Moksh not found! Please login first';
  END IF;
  
  -- Update Moksh's details
  UPDATE profiles SET 
    flat_number = 'A-301',
    role = 'admin',
    full_name = 'Moksh Sonar',
    phone = '9876543210'
  WHERE id = moksh_id;
  
  RAISE NOTICE '✅ Committee: Moksh Sonar (Secretary) - A-301';
  
  -- Note: Other committee members (Purva, Yash, Tanmay) will be created if they don't exist
  -- For now, we'll use Moksh as the main user and create sample data
  
  -- ============================================
  -- STEP 3: PAYMENTS - Varied dates and amounts
  -- ============================================
  
  -- Pending Payments (Current Month - March 2026)
  INSERT INTO payments (user_id, title, description, amount, due_date, status) VALUES
  (moksh_id, 'Monthly Maintenance - March 2026', 'Regular society maintenance charges', 4500.00, '2026-03-05', 'pending'),
  (moksh_id, 'Water Charges - March 2026', 'Monthly water bill based on usage', 850.00, '2026-03-10', 'pending'),
  (moksh_id, 'Electricity Common Area - March 2026', 'Common area electricity charges', 320.00, '2026-03-08', 'pending'),
  (moksh_id, 'Parking Charges - Q1 2026', 'Quarterly covered parking fee', 2500.00, '2026-03-31', 'pending'),
  (moksh_id, 'Sinking Fund - March 2026', 'Building repair and maintenance fund', 1200.00, '2026-03-15', 'pending');
  
  -- Paid Payments (Different months)
  INSERT INTO payments (user_id, title, description, amount, due_date, status, paid_date) VALUES
  (moksh_id, 'Monthly Maintenance - February 2026', 'Regular society maintenance charges', 4500.00, '2026-02-05', 'paid', '2026-02-03'),
  (moksh_id, 'Water Charges - February 2026', 'Monthly water bill', 820.00, '2026-02-10', 'paid', '2026-02-08'),
  (moksh_id, 'Monthly Maintenance - January 2026', 'Regular society maintenance charges', 4500.00, '2026-01-05', 'paid', '2026-01-04'),
  (moksh_id, 'Water Charges - January 2026', 'Monthly water bill', 790.00, '2026-01-10', 'paid', '2026-01-09'),
  (moksh_id, 'Monthly Maintenance - December 2025', 'Regular society maintenance charges', 4500.00, '2025-12-05', 'paid', '2025-12-03'),
  (moksh_id, 'Parking Charges - Q4 2025', 'Quarterly parking fee', 2500.00, '2025-12-31', 'paid', '2025-12-28');
  
  RAISE NOTICE '✅ Added 11 payments with varied dates';
  
  -- ============================================
  -- STEP 4: PREPARE FOR ISSUES FROM DIFFERENT USERS
  -- ============================================
  
  -- NOTE: To have issues from different users, you need to:
  -- 1. Register additional users through the app's registration page
  -- 2. Then update their profiles with proper flat numbers
  -- 3. For now, we'll use moksh_id for all issues
  
  -- Try to get other users if they exist (from manual registration)
  SELECT id INTO purva_id FROM profiles WHERE email = 'purva@societyhub.com' LIMIT 1;
  SELECT id INTO yash_id FROM profiles WHERE email = 'yash@societyhub.com' LIMIT 1;
  SELECT id INTO tanmay_id FROM profiles WHERE email = 'tanmay@societyhub.com' LIMIT 1;
  
  -- If users don't exist, use moksh_id as fallback
  IF purva_id IS NULL THEN purva_id := moksh_id; END IF;
  IF yash_id IS NULL THEN yash_id := moksh_id; END IF;
  IF tanmay_id IS NULL THEN tanmay_id := moksh_id; END IF;
  
  -- Get any other registered users
  user_ids := ARRAY(
    SELECT id FROM profiles 
    WHERE id != moksh_id
    LIMIT 5
  );
  
  -- If no other users, fill array with moksh_id
  IF array_length(user_ids, 1) IS NULL OR array_length(user_ids, 1) < 5 THEN
    user_ids := ARRAY[moksh_id, moksh_id, moksh_id, moksh_id, moksh_id];
  END IF;
  
  RAISE NOTICE '✅ Prepared user IDs for issues (using available users)';
  
  -- ============================================
  -- STEP 5: ISSUES - From DIFFERENT users, RANDOM dates
  -- ============================================
  
  INSERT INTO issues (title, description, category, priority, status, created_by, vote_count, created_at) VALUES
  -- Different users and random dates from Jan-Feb 2026
  ('Lift Not Working in Wing A', 'The lift in Wing A has been stuck on 5th floor since morning. Residents are facing difficulty.', 'Maintenance', 'high', 'in_progress', moksh_id, 15, '2026-01-15 09:30:00'),
  ('Water Pressure Low on 6th & 7th Floor', 'Water pressure is very low during morning hours on top floors', 'Plumbing', 'high', 'in_progress', purva_id, 12, '2026-01-22 08:15:00'),
  ('Parking Slot Encroachment', 'Someone is parking in my designated slot A-301-P1', 'Parking', 'medium', 'open', yash_id, 8, '2026-02-03 19:45:00'),
  ('Gym Equipment Needs Repair', 'Treadmill in gym is making noise and belt is loose', 'Amenities', 'medium', 'open', tanmay_id, 6, '2026-01-28 17:20:00'),
  ('Street Light Not Working Near Gate', 'The street light near main gate is not working since 3 days', 'Electrical', 'medium', 'resolved', user_ids[1], 10, '2026-01-18 20:10:00'),
  ('Garbage Collection Timing Issue', 'Garbage collection happens too early at 6 AM, causing disturbance', 'Housekeeping', 'low', 'open', user_ids[2], 4, '2026-02-08 11:30:00'),
  ('Swimming Pool Cleaning Required', 'Pool water looks dirty and needs immediate cleaning', 'Amenities', 'medium', 'resolved', user_ids[3], 3, '2026-01-12 14:00:00'),
  ('CCTV Camera Not Working in Basement', 'Security camera in basement parking is not functioning', 'Security', 'high', 'open', user_ids[4], 14, '2026-02-11 10:45:00'),
  ('Intercom System Down', 'Intercom not working in multiple flats', 'Maintenance', 'high', 'in_progress', user_ids[5], 11, '2026-01-25 16:30:00'),
  ('Garden Needs Maintenance', 'Garden plants are dying, need immediate attention', 'Landscaping', 'low', 'open', moksh_id, 5, '2026-02-01 09:00:00'),
  ('Noise from Construction Work', 'Loud construction noise from flat B-502 during afternoon', 'Noise', 'medium', 'open', purva_id, 7, '2026-01-30 15:20:00'),
  ('Staircase Lighting Not Working', 'Lights on 3rd floor staircase are not working', 'Electrical', 'medium', 'in_progress', yash_id, 9, '2026-02-05 18:00:00');
  
  RAISE NOTICE '✅ Added 12 issues from different users with random dates (Jan-Feb 2026)';
  
  -- ============================================
  -- STEP 6: SOCIETY BILLS - From 2015 to 2026
  -- ============================================
  
  -- Recent Bills (2026)
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes, created_at) VALUES
  ('Electricity', 'MSEB - Common Area', 'EB-MAR-2026', 18500.00, '2026-03-10', 'pending', 'Common area electricity', '2026-03-01'),
  ('Water Supply', 'Municipal Corporation', 'WB-MAR-2026', 8500.00, '2026-03-15', 'pending', 'Society water charges', '2026-03-01'),
  ('Security Services', 'SecureGuard Pvt Ltd', 'SEC-MAR-2026', 65000.00, '2026-03-05', 'paid', '8 security guards salary', '2026-03-01'),
  ('Housekeeping', 'CleanPro Services', 'CLN-MAR-2026', 22000.00, '2026-03-08', 'pending', 'Cleaning staff salary', '2026-03-01');
  
  -- 2025 Bills
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes, created_at) VALUES
  ('Lift Maintenance', 'Otis Elevator Co', 'LIFT-DEC-2025', 28000.00, '2025-12-20', 'paid', 'Annual AMC - 2 lifts', '2025-12-01'),
  ('Building Painting', 'ColorCraft Painters', 'PAINT-NOV-2025', 185000.00, '2025-11-30', 'paid', 'Exterior painting work', '2025-11-01'),
  ('Generator Repair', 'PowerGen Services', 'GEN-OCT-2025', 45000.00, '2025-10-15', 'paid', 'Generator major repair', '2025-10-01');
  
  -- 2020 Bills
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes, created_at) VALUES
  ('Terrace Waterproofing', 'WaterSeal Pro', 'WP-JUN-2020', 225000.00, '2020-06-30', 'paid', 'Terrace waterproofing', '2020-06-01'),
  ('CCTV Installation', 'SecureTech Systems', 'CCTV-MAR-2020', 150000.00, '2020-03-31', 'paid', '16 CCTV cameras installed', '2020-03-01');
  
  -- 2018 Bills
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes, created_at) VALUES
  ('Swimming Pool Renovation', 'AquaBuild', 'POOL-AUG-2018', 380000.00, '2018-08-31', 'paid', 'Pool tiles and filtration', '2018-08-01'),
  ('Gym Equipment Purchase', 'FitPro Equipment', 'GYM-MAY-2018', 425000.00, '2018-05-31', 'paid', 'New gym equipment', '2018-05-01');
  
  -- 2016 Bills
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes, created_at) VALUES
  ('Fire Safety Equipment', 'FireGuard Systems', 'FIRE-DEC-2016', 195000.00, '2016-12-31', 'paid', 'Fire extinguishers and alarms', '2016-12-01'),
  ('Landscaping', 'Green Paradise', 'LAND-SEP-2016', 125000.00, '2016-09-30', 'paid', 'Garden development', '2016-09-01');
  
  -- 2015 Bills (Building Establishment)
  INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes, created_at) VALUES
  ('Society Registration', 'Legal Associates', 'REG-DEC-2015', 85000.00, '2015-12-31', 'paid', 'Society registration fees', '2015-12-01'),
  ('Initial Setup', 'Various Vendors', 'SETUP-NOV-2015', 550000.00, '2015-11-30', 'paid', 'Initial society setup', '2015-11-01');
  
  RAISE NOTICE '✅ Added 15 society bills from 2015-2026';
  
  -- ============================================
  -- STEP 7: VISITORS - Different flats, RANDOM dates, times
  -- ============================================
  
  INSERT INTO visitors (name, phone, purpose, flat_number, host_id, check_in_time, check_out_time, qr_code) VALUES
  -- Random dates from Jan-Feb 2026
  ('Rajesh Kumar', '9876543210', 'Plumber - Kitchen sink repair', 'A-201', moksh_id, '2026-01-15 10:30:00', '2026-01-15 12:00:00', 'QR_VIS_001'),
  ('Priya Sharma', '9876543211', 'Friend visiting', 'B-303', moksh_id, '2026-01-22 18:00:00', '2026-01-22 22:30:00', 'QR_VIS_002'),
  ('Amazon Delivery', '9876543212', 'Package delivery', 'A-401', moksh_id, '2026-02-03 15:30:00', '2026-02-03 15:35:00', 'QR_VIS_003'),
  ('Swiggy Delivery', '9876543213', 'Food delivery', 'B-201', moksh_id, '2026-01-28 20:15:00', '2026-01-28 20:20:00', 'QR_VIS_004'),
  ('Dr. Mehta', '9876543214', 'Home visit - Medical checkup', 'A-501', moksh_id, '2026-02-07 11:00:00', '2026-02-07 11:45:00', 'QR_VIS_005'),
  ('Ravi Electrician', '9876543215', 'AC servicing', 'B-402', moksh_id, '2026-01-18 15:00:00', '2026-01-18 17:30:00', 'QR_VIS_006'),
  ('Amit Patel', '9876543216', 'Family visit', 'A-301', moksh_id, '2026-02-12 10:00:00', '2026-02-12 18:00:00', 'QR_VIS_007'),
  ('Meena Maid', '9876543217', 'Housekeeping', 'B-601', moksh_id, '2026-01-25 08:00:00', '2026-01-25 10:00:00', 'QR_VIS_008'),
  ('Zomato Delivery', '9876543218', 'Food delivery', 'A-701', moksh_id, '2026-02-14 13:20:00', '2026-02-14 13:25:00', 'QR_VIS_009'),
  ('Flipkart Delivery', '9876543219', 'Package delivery', 'B-504', moksh_id, '2026-01-30 16:45:00', '2026-01-30 16:50:00', 'QR_VIS_010'),
  ('Carpenter', '9876543220', 'Furniture repair', 'A-102', moksh_id, '2026-02-01 09:00:00', '2026-02-01 14:00:00', 'QR_VIS_011'),
  ('Tutor', '9876543221', 'Home tuition', 'B-203', moksh_id, '2026-01-20 17:00:00', '2026-01-20 19:00:00', 'QR_VIS_012'),
  ('Courier', '9876543222', 'Document delivery', 'A-603', moksh_id, '2026-02-09 11:30:00', '2026-02-09 11:35:00', 'QR_VIS_013'),
  ('Painter', '9876543223', 'Wall painting work', 'B-405', moksh_id, '2026-01-12 08:30:00', '2026-01-12 16:00:00', 'QR_VIS_014'),
  ('Grocery Delivery', '9876543224', 'BigBasket delivery', 'A-502', moksh_id, '2026-02-16 19:00:00', '2026-02-16 19:10:00', 'QR_VIS_015');
  
  RAISE NOTICE '✅ Added 15 visitors with random dates';
  
  -- ============================================
  -- STEP 8: AMENITIES
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
  -- STEP 9: DOCUMENTS
  -- ============================================
  
  INSERT INTO documents (title, description, file_url, file_type, file_size, category, uploaded_by, is_public, is_important) VALUES
  ('Society Bylaws 2026', 'Updated society rules and regulations', 'https://example.com/bylaws-2026.pdf', 'application/pdf', 245678, 'Legal', moksh_id, true, true),
  ('Maintenance Payment Guidelines', 'How to pay maintenance charges', 'https://example.com/payment-guide.pdf', 'application/pdf', 156789, 'Finance', moksh_id, true, true),
  ('Emergency Contact Numbers', 'Important emergency contacts', 'https://example.com/emergency.pdf', 'application/pdf', 89456, 'Important', moksh_id, true, true),
  ('Parking Allocation List', 'Parking slot allocation for all 56 flats', 'https://example.com/parking.pdf', 'application/pdf', 123456, 'Parking', moksh_id, true, true),
  ('Annual Budget 2026', 'Society annual budget and expenses', 'https://example.com/budget-2026.pdf', 'application/pdf', 567890, 'Finance', moksh_id, true, false),
  ('AGM Minutes - Jan 2026', 'Annual General Meeting minutes', 'https://example.com/agm-jan-2026.pdf', 'application/pdf', 234567, 'Meeting', moksh_id, true, false),
  ('Amenity Booking Rules', 'Rules for booking society amenities', 'https://example.com/amenity-rules.pdf', 'application/pdf', 98765, 'Rules', moksh_id, true, true),
  ('Waste Segregation Guidelines', 'How to segregate wet and dry waste', 'https://example.com/waste-guide.pdf', 'application/pdf', 145678, 'Environment', moksh_id, true, false),
  ('Security Protocol', 'Security procedures and visitor policy', 'https://example.com/security.pdf', 'application/pdf', 187654, 'Security', moksh_id, true, true),
  ('Pet Policy', 'Guidelines for pet owners', 'https://example.com/pet-policy.pdf', 'application/pdf', 112345, 'Rules', moksh_id, true, false),
  ('Renovation Guidelines', 'Rules for flat renovation work', 'https://example.com/renovation.pdf', 'application/pdf', 198765, 'Rules', moksh_id, true, false),
  ('Fire Safety Plan', 'Emergency evacuation and fire safety', 'https://example.com/fire-safety.pdf', 'application/pdf', 134567, 'Safety', moksh_id, true, true);
  
  RAISE NOTICE '✅ Added 12 documents';
  
  -- ============================================
  -- STEP 10: EVENTS
  -- ============================================
  
  INSERT INTO society_events (title, description, event_date, event_time, location, created_by) VALUES
  ('Holi Celebration 2026', 'Annual Holi festival with colors and music', '2026-03-25', '10:00:00', 'Society Garden', moksh_id),
  ('Yoga Workshop', 'Free yoga session by certified instructor', '2026-03-15', '06:30:00', 'Yoga Room', moksh_id),
  ('Kids Drawing Competition', 'Art competition for children aged 5-12', '2026-03-22', '16:00:00', 'Clubhouse', moksh_id),
  ('Health Checkup Camp', 'Free health checkup by Apollo Hospital', '2026-04-05', '09:00:00', 'Clubhouse', moksh_id),
  ('Society AGM 2026', 'Annual General Meeting - All members invited', '2026-04-20', '19:00:00', 'Clubhouse', moksh_id),
  ('Blood Donation Camp', 'Blood donation drive by Red Cross', '2026-04-14', '10:00:00', 'Clubhouse', moksh_id),
  ('Ganesh Chaturthi Celebration', 'Community Ganesh festival', '2026-09-07', '18:00:00', 'Society Garden', moksh_id),
  ('Independence Day Celebration', 'Flag hoisting and cultural program', '2026-08-15', '08:00:00', 'Main Gate', moksh_id),
  ('Diwali Mela', 'Diwali fair with food stalls and games', '2026-11-01', '17:00:00', 'Society Garden', moksh_id),
  ('New Year Party 2027', 'New Year celebration with DJ and dinner', '2026-12-31', '20:00:00', 'Clubhouse', moksh_id);
  
  RAISE NOTICE '✅ Added 10 events';
  
  -- ============================================
  -- STEP 11: CHAT, NOTIFICATIONS, REMINDERS
  -- ============================================
  
  INSERT INTO chat_messages (user_id, message, is_announcement, created_at) VALUES
  (moksh_id, '🎉 Welcome to Sunrise Apartments Community Chat!', true, '2026-02-10 09:00:00'),
  (moksh_id, '📢 Water supply will be interrupted tomorrow 10 AM - 2 PM for tank cleaning', true, '2026-02-15 18:00:00'),
  (moksh_id, 'Thanks for the update!', false, '2026-02-15 18:15:00'),
  (moksh_id, '🎊 Holi celebration on March 25th! Register your family at the office', true, '2026-02-16 10:00:00'),
  (moksh_id, 'Count me in! Excited for Holi!', false, '2026-02-16 10:30:00'),
  (moksh_id, '🚗 Please park only in designated slots. Unauthorized parking will be towed', true, '2026-02-17 08:00:00'),
  (moksh_id, 'Is the gym open on weekends?', false, '2026-02-17 19:00:00'),
  (moksh_id, 'Yes, gym is open 6 AM to 10 PM daily including weekends', false, '2026-02-17 19:15:00'),
  (moksh_id, 'Perfect! Thank you.', false, '2026-02-17 19:20:00'),
  (moksh_id, '🔧 Lift maintenance in Wing A on Saturday 9 AM - 12 PM', true, '2026-02-18 09:00:00');
  
  INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
  (moksh_id, 'Payment Due', 'Monthly maintenance of ₹4,500 due on March 5', 'payment', false),
  (moksh_id, 'Upcoming Event', 'Holi celebration on March 25 - Register now!', 'event', false),
  (moksh_id, 'Issue Update', 'Lift repair work in progress - Expected completion by tomorrow', 'issue', false),
  (moksh_id, 'Welcome', 'Welcome to Sunrise Apartments Society Hub!', 'general', true);
  
  INSERT INTO reminders (user_id, title, reminder_time, is_completed) VALUES
  (moksh_id, 'Pay Maintenance Fee - Due March 5', '2026-03-04 10:00:00', false),
  (moksh_id, 'Book Clubhouse for Birthday Party', '2026-03-10 09:00:00', false),
  (moksh_id, 'Gym Session - Morning Workout', '2026-02-19 06:00:00', false),
  (moksh_id, 'Society AGM Meeting - April 20', '2026-04-19 18:00:00', false);
  
  RAISE NOTICE '✅ Added 15 visitors across different flats and dates';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next: Run this SQL, then we will create Members page';
  RAISE NOTICE '🚀 Refresh your browser!';
  RAISE NOTICE '';
  
END $$;
