-- ============================================
-- CREATE MEMBERS TABLE FOR DISPLAY
-- This is separate from profiles/auth - just for showing member list
-- ============================================

-- Create members table
CREATE TABLE IF NOT EXISTS society_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  flat_number TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT,
  role TEXT DEFAULT 'resident',
  badge TEXT,
  badge_color TEXT,
  family_members INTEGER DEFAULT 1,
  has_parking BOOLEAN DEFAULT false,
  parking_slot TEXT,
  has_pets BOOLEAN DEFAULT false,
  pets_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE society_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view members
CREATE POLICY "Anyone can view members" ON society_members
  FOR SELECT USING (true);

-- Clear existing data
TRUNCATE society_members;

-- Insert all 56 members with badges
INSERT INTO society_members (full_name, flat_number, phone, email, role, badge, badge_color, family_members, has_parking, parking_slot, has_pets, pets_count) VALUES
-- Committee Members
('Moksh Sonar', 'A-301', '9876543210', 'moksh@societyhub.com', 'admin', 'Secretary', 'gold', 3, true, 'A-301-P1', false, 0),
('Purva Chavan', 'B-303', '9876543201', 'purva@societyhub.com', 'admin', 'Treasurer', 'blue', 4, true, 'B-303-P1', true, 1),
('Yash Bandwane', 'A-401', '9876543202', 'yash@societyhub.com', 'admin', 'Committee', 'red', 2, true, 'A-401-P1', false, 0),
('Tanmay Kolekar', 'B-201', '9876543203', 'tanmay@societyhub.com', 'admin', 'Committee', 'red', 3, false, null, false, 0),

-- Floor 1 Residents
('Rajesh Kumar', 'A-101', '9876543210', 'rajesh@example.com', 'resident', 'Resident', 'green', 4, true, 'A-101-P1', false, 0),
('Priya Sharma', 'A-102', '9876543211', 'priya@example.com', 'resident', 'Resident', 'green', 3, false, null, true, 1),
('Amit Patel', 'A-103', '9876543212', 'amit@example.com', 'resident', 'Resident', 'green', 2, true, 'A-103-P1', false, 0),
('Sneha Desai', 'A-104', '9876543213', 'sneha@example.com', 'resident', 'Resident', 'green', 3, false, null, false, 0),
('Vikram Singh', 'B-101', '9876543214', 'vikram@example.com', 'resident', 'Resident', 'green', 4, true, 'B-101-P1', true, 2),
('Anjali Mehta', 'B-102', '9876543215', 'anjali@example.com', 'resident', 'Resident', 'green', 2, false, null, false, 0),
('Rahul Verma', 'B-103', '9876543216', 'rahul@example.com', 'resident', 'Resident', 'green', 3, true, 'B-103-P1', false, 0),
('Pooja Joshi', 'B-104', '9876543217', 'pooja@example.com', 'resident', 'Resident', 'green', 4, false, null, true, 1),

-- Floor 2 Residents
('Suresh Reddy', 'A-201', '9876543218', 'suresh@example.com', 'resident', 'Resident', 'green', 3, true, 'A-201-P1', false, 0),
('Kavita Nair', 'A-202', '9876543219', 'kavita@example.com', 'resident', 'Resident', 'green', 2, false, null, false, 0),
('Manoj Gupta', 'A-203', '9876543220', 'manoj@example.com', 'resident', 'Resident', 'green', 4, true, 'A-203-P1', true, 1),
('Divya Iyer', 'A-204', '9876543221', 'divya@example.com', 'resident', 'Resident', 'green', 3, false, null, false, 0),
('Arun Pillai', 'B-202', '9876543222', 'arun@example.com', 'resident', 'Resident', 'green', 2, true, 'B-202-P1', false, 0),
('Meera Rao', 'B-203', '9876543223', 'meera@example.com', 'resident', 'Resident', 'green', 4, false, null, false, 0),
('Karan Malhotra', 'B-204', '9876543224', 'karan@example.com', 'resident', 'Resident', 'green', 3, true, 'B-204-P1', true, 1),

-- Floor 3 Residents
('Deepak Shah', 'A-302', '9876543225', 'deepak@example.com', 'resident', 'Resident', 'green', 2, false, null, false, 0),
('Nisha Kapoor', 'A-303', '9876543226', 'nisha@example.com', 'resident', 'Resident', 'green', 4, true, 'A-303-P1', false, 0),
('Sanjay Agarwal', 'A-304', '9876543227', 'sanjay@example.com', 'resident', 'Resident', 'green', 3, false, null, true, 2),
('Ritu Bansal', 'B-301', '9876543228', 'ritu@example.com', 'resident', 'Resident', 'green', 2, true, 'B-301-P1', false, 0),
('Vishal Chopra', 'B-302', '9876543229', 'vishal@example.com', 'resident', 'Resident', 'green', 4, false, null, false, 0),
('Swati Kulkarni', 'B-304', '9876543230', 'swati@example.com', 'resident', 'Resident', 'green', 3, true, 'B-304-P1', false, 0),

-- Floor 4 Residents
('Nitin Jain', 'A-402', '9876543231', 'nitin@example.com', 'resident', 'Resident', 'green', 2, false, null, true, 1),
('Preeti Saxena', 'A-403', '9876543232', 'preeti@example.com', 'resident', 'Resident', 'green', 4, true, 'A-403-P1', false, 0),
('Rohit Bhatt', 'A-404', '9876543233', 'rohit@example.com', 'resident', 'Resident', 'green', 3, false, null, false, 0),
('Sunita Mishra', 'B-401', '9876543234', 'sunita@example.com', 'resident', 'Resident', 'green', 2, true, 'B-401-P1', false, 0),
('Alok Pandey', 'B-402', '9876543235', 'alok@example.com', 'resident', 'Resident', 'green', 4, false, null, true, 1),
('Geeta Sinha', 'B-403', '9876543236', 'geeta@example.com', 'resident', 'Resident', 'green', 3, true, 'B-403-P1', false, 0),
('Harish Tiwari', 'B-404', '9876543237', 'harish@example.com', 'resident', 'Resident', 'green', 2, false, null, false, 0),

-- Floor 5 Residents
('Ashok Dubey', 'A-501', '9876543238', 'ashok@example.com', 'resident', 'Resident', 'green', 4, true, 'A-501-P1', true, 1),
('Rekha Yadav', 'A-502', '9876543239', 'rekha@example.com', 'resident', 'Resident', 'green', 3, false, null, false, 0),
('Prakash Jha', 'A-503', '9876543240', 'prakash@example.com', 'resident', 'Resident', 'green', 2, true, 'A-503-P1', false, 0),
('Madhuri Dixit', 'A-504', '9876543241', 'madhuri@example.com', 'resident', 'Resident', 'green', 4, false, null, false, 0),
('Ramesh Thakur', 'B-501', '9876543242', 'ramesh@example.com', 'resident', 'Resident', 'green', 3, true, 'B-501-P1', true, 2),
('Seema Bhardwaj', 'B-502', '9876543243', 'seema@example.com', 'resident', 'Resident', 'green', 2, false, null, false, 0),
('Ajay Srivastava', 'B-503', '9876543244', 'ajay@example.com', 'resident', 'Resident', 'green', 4, true, 'B-503-P1', false, 0),
('Neha Tripathi', 'B-504', '9876543245', 'neha@example.com', 'resident', 'Resident', 'green', 3, false, null, true, 1),

-- Floor 6 Residents
('Dinesh Chauhan', 'A-601', '9876543246', 'dinesh@example.com', 'resident', 'Resident', 'green', 2, true, 'A-601-P1', false, 0),
('Shilpa Arora', 'A-602', '9876543247', 'shilpa@example.com', 'resident', 'Resident', 'green', 4, false, null, false, 0),
('Mukesh Sharma', 'A-603', '9876543248', 'mukesh@example.com', 'resident', 'Resident', 'green', 3, true, 'A-603-P1', true, 1),
('Anita Bose', 'A-604', '9876543249', 'anita@example.com', 'resident', 'Resident', 'green', 2, false, null, false, 0),
('Pankaj Kohli', 'B-601', '9876543250', 'pankaj@example.com', 'resident', 'Resident', 'green', 4, true, 'B-601-P1', false, 0),
('Sonal Khanna', 'B-602', '9876543251', 'sonal@example.com', 'resident', 'Resident', 'green', 3, false, null, true, 2),
('Gaurav Bhatia', 'B-603', '9876543252', 'gaurav@example.com', 'resident', 'Resident', 'green', 2, true, 'B-603-P1', false, 0),
('Rina Dutta', 'B-604', '9876543253', 'rina@example.com', 'resident', 'Resident', 'green', 4, false, null, false, 0),

-- Floor 7 Residents
('Sachin Tendulkar', 'A-701', '9876543254', 'sachin@example.com', 'resident', 'Resident', 'green', 3, true, 'A-701-P1', false, 0),
('Lata Mangeshkar', 'A-702', '9876543255', 'lata@example.com', 'resident', 'Resident', 'green', 2, false, null, true, 1),
('Ravi Shankar', 'A-703', '9876543256', 'ravi@example.com', 'resident', 'Resident', 'green', 4, true, 'A-703-P1', false, 0),
('Asha Parekh', 'A-704', '9876543257', 'asha@example.com', 'resident', 'Resident', 'green', 3, false, null, false, 0),
('Kapil Dev', 'B-701', '9876543258', 'kapil@example.com', 'resident', 'Resident', 'green', 2, true, 'B-701-P1', true, 1),
('Hema Malini', 'B-702', '9876543259', 'hema@example.com', 'resident', 'Resident', 'green', 4, false, null, false, 0),
('Amitabh Bachchan', 'B-703', '9876543260', 'amitabh@example.com', 'resident', 'Resident', 'green', 3, true, 'B-703-P1', false, 0),
('Rekha Ganesan', 'B-704', '9876543261', 'rekha.g@example.com', 'resident', 'Resident', 'green', 2, false, null, true, 2);

SELECT '✅ Created all 56 members successfully!' AS message;
SELECT '👑 Moksh Sonar (A-301) - Secretary - GOLD BADGE' AS committee_1;
SELECT '💙 Purva Chavan (B-303) - Treasurer - BLUE BADGE' AS committee_2;
SELECT '❤️ Yash Bandwane (A-401) - Committee - RED BADGE' AS committee_3;
SELECT '❤️ Tanmay Kolekar (B-201) - Committee - RED BADGE' AS committee_4;
SELECT '💚 52 Residents - GREEN BADGE' AS residents;
SELECT '🏢 Total: 56 members across 7 floors, 2 wings' AS summary;
