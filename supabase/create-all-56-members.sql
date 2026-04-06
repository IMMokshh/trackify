-- ============================================
-- CREATE ALL 56 SOCIETY MEMBERS
-- 7 Floors × 2 Wings (A & B) × 4 Flats = 56 Total
-- ============================================

-- Add badge column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badge_color TEXT;

-- Update existing committee members with badges
UPDATE profiles SET 
  badge = 'Secretary',
  badge_color = 'gold',
  full_name = 'Moksh Sonar',
  flat_number = 'A-301',
  role = 'admin'
WHERE email = 'moksh@societyhub.com';

-- Insert all 56 members (including committee)
-- We'll use moksh's ID for all since they're just display data
DO $$
DECLARE
  moksh_id UUID;
  floor_num INT;
  flat_num INT;
  wing CHAR(1);
  flat_code TEXT;
  member_name TEXT;
  member_phone TEXT;
  member_role user_role;
  member_badge TEXT;
  member_badge_color TEXT;
BEGIN
  -- Get Moksh's ID
  SELECT id INTO moksh_id FROM profiles WHERE email = 'moksh@societyhub.com' LIMIT 1;
  
  -- Delete old fake member data (keep only real users)
  DELETE FROM profiles WHERE id = moksh_id AND flat_number != 'A-301';
  
  -- Committee Members (4 total)
  -- 1. Moksh Sonar - A-301 - Secretary (already exists, just update)
  
  -- 2. Purva Chavan - B-303 - Treasurer - BLUE BADGE
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color)
  VALUES (gen_random_uuid(), 'purva_display@fake.com', 'Purva Chavan', 'B-303', '9876543201', 'resident', 'Treasurer', 'blue')
  ON CONFLICT (email) DO UPDATE SET
    full_name = 'Purva Chavan',
    flat_number = 'B-303',
    badge = 'Treasurer',
    badge_color = 'blue';
  
  -- 3. Yash Bandwane - A-401 - Committee Member - RED BADGE
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color)
  VALUES (gen_random_uuid(), 'yash_display@fake.com', 'Yash Bandwane', 'A-401', '9876543202', 'resident', 'Committee', 'red')
  ON CONFLICT (email) DO UPDATE SET
    full_name = 'Yash Bandwane',
    flat_number = 'A-401',
    badge = 'Committee',
    badge_color = 'red';
  
  -- 4. Tanmay Kolekar - B-201 - Committee Member - RED BADGE
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color)
  VALUES (gen_random_uuid(), 'tanmay_display@fake.com', 'Tanmay Kolekar', 'B-201', '9876543203', 'resident', 'Committee', 'red')
  ON CONFLICT (email) DO UPDATE SET
    full_name = 'Tanmay Kolekar',
    flat_number = 'B-201',
    badge = 'Committee',
    badge_color = 'red';
  
  -- Now create remaining 52 residents with GREEN BADGE
  -- Indian names for realistic data
  
  -- Floor 1
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color) VALUES
  (gen_random_uuid(), 'a101@fake.com', 'Rajesh Kumar', 'A-101', '9876543210', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a102@fake.com', 'Priya Sharma', 'A-102', '9876543211', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a103@fake.com', 'Amit Patel', 'A-103', '9876543212', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a104@fake.com', 'Sneha Desai', 'A-104', '9876543213', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b101@fake.com', 'Vikram Singh', 'B-101', '9876543214', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b102@fake.com', 'Anjali Mehta', 'B-102', '9876543215', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b103@fake.com', 'Rahul Verma', 'B-103', '9876543216', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b104@fake.com', 'Pooja Joshi', 'B-104', '9876543217', 'resident', 'Resident', 'green')
  ON CONFLICT (email) DO NOTHING;
  
  -- Floor 2 (B-201 is Tanmay - already added)
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color) VALUES
  (gen_random_uuid(), 'a201@fake.com', 'Suresh Reddy', 'A-201', '9876543218', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a202@fake.com', 'Kavita Nair', 'A-202', '9876543219', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a203@fake.com', 'Manoj Gupta', 'A-203', '9876543220', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a204@fake.com', 'Divya Iyer', 'A-204', '9876543221', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b202@fake.com', 'Arun Pillai', 'B-202', '9876543222', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b203@fake.com', 'Meera Rao', 'B-203', '9876543223', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b204@fake.com', 'Karan Malhotra', 'B-204', '9876543224', 'resident', 'Resident', 'green')
  ON CONFLICT (email) DO NOTHING;
  
  -- Floor 3 (A-301 is Moksh, B-303 is Purva - already added)
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color) VALUES
  (gen_random_uuid(), 'a302@fake.com', 'Deepak Shah', 'A-302', '9876543225', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a303@fake.com', 'Nisha Kapoor', 'A-303', '9876543226', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a304@fake.com', 'Sanjay Agarwal', 'A-304', '9876543227', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b301@fake.com', 'Ritu Bansal', 'B-301', '9876543228', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b302@fake.com', 'Vishal Chopra', 'B-302', '9876543229', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b304@fake.com', 'Swati Kulkarni', 'B-304', '9876543230', 'resident', 'Resident', 'green')
  ON CONFLICT (email) DO NOTHING;
  
  -- Floor 4 (A-401 is Yash - already added)
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color) VALUES
  (gen_random_uuid(), 'a402@fake.com', 'Nitin Jain', 'A-402', '9876543231', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a403@fake.com', 'Preeti Saxena', 'A-403', '9876543232', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a404@fake.com', 'Rohit Bhatt', 'A-404', '9876543233', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b401@fake.com', 'Sunita Mishra', 'B-401', '9876543234', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b402@fake.com', 'Alok Pandey', 'B-402', '9876543235', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b403@fake.com', 'Geeta Sinha', 'B-403', '9876543236', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b404@fake.com', 'Harish Tiwari', 'B-404', '9876543237', 'resident', 'Resident', 'green')
  ON CONFLICT (email) DO NOTHING;
  
  -- Floor 5
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color) VALUES
  (gen_random_uuid(), 'a501@fake.com', 'Ashok Dubey', 'A-501', '9876543238', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a502@fake.com', 'Rekha Yadav', 'A-502', '9876543239', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a503@fake.com', 'Prakash Jha', 'A-503', '9876543240', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a504@fake.com', 'Madhuri Dixit', 'A-504', '9876543241', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b501@fake.com', 'Ramesh Thakur', 'B-501', '9876543242', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b502@fake.com', 'Seema Bhardwaj', 'B-502', '9876543243', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b503@fake.com', 'Ajay Srivastava', 'B-503', '9876543244', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b504@fake.com', 'Neha Tripathi', 'B-504', '9876543245', 'resident', 'Resident', 'green')
  ON CONFLICT (email) DO NOTHING;
  
  -- Floor 6
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color) VALUES
  (gen_random_uuid(), 'a601@fake.com', 'Dinesh Chauhan', 'A-601', '9876543246', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a602@fake.com', 'Shilpa Arora', 'A-602', '9876543247', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a603@fake.com', 'Mukesh Sharma', 'A-603', '9876543248', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a604@fake.com', 'Anita Bose', 'A-604', '9876543249', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b601@fake.com', 'Pankaj Kohli', 'B-601', '9876543250', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b602@fake.com', 'Sonal Khanna', 'B-602', '9876543251', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b603@fake.com', 'Gaurav Bhatia', 'B-603', '9876543252', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b604@fake.com', 'Rina Dutta', 'B-604', '9876543253', 'resident', 'Resident', 'green')
  ON CONFLICT (email) DO NOTHING;
  
  -- Floor 7
  INSERT INTO profiles (id, email, full_name, flat_number, phone, role, badge, badge_color) VALUES
  (gen_random_uuid(), 'a701@fake.com', 'Sachin Tendulkar', 'A-701', '9876543254', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a702@fake.com', 'Lata Mangeshkar', 'A-702', '9876543255', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a703@fake.com', 'Ravi Shankar', 'A-703', '9876543256', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'a704@fake.com', 'Asha Parekh', 'A-704', '9876543257', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b701@fake.com', 'Kapil Dev', 'B-701', '9876543258', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b702@fake.com', 'Hema Malini', 'B-702', '9876543259', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b703@fake.com', 'Amitabh Bachchan', 'B-703', '9876543260', 'resident', 'Resident', 'green'),
  (gen_random_uuid(), 'b704@fake.com', 'Rekha Ganesan', 'B-704', '9876543261', 'resident', 'Resident', 'green')
  ON CONFLICT (email) DO NOTHING;
  
  RAISE NOTICE '✅ Created all 56 members!';
  RAISE NOTICE '👑 Moksh Sonar (A-301) - Secretary - GOLD BADGE';
  RAISE NOTICE '💙 Purva Chavan (B-303) - Treasurer - BLUE BADGE';
  RAISE NOTICE '❤️  Yash Bandwane (A-401) - Committee - RED BADGE';
  RAISE NOTICE '❤️  Tanmay Kolekar (B-201) - Committee - RED BADGE';
  RAISE NOTICE '💚 52 Residents - GREEN BADGE';
  RAISE NOTICE '';
  RAISE NOTICE '🏢 Total: 56 members across 7 floors, 2 wings';
  
END $$;
