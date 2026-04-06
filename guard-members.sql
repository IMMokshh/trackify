-- Add 4 guard members to society_members
-- Guards are staff, not flat residents, so flat_number uses 'G-' prefix (Ground/Gate)

INSERT INTO society_members (full_name, email, phone, flat_number, badge, family_members, has_parking, has_pets)
VALUES
  ('Ramesh Gupta',   'guard1@greenwoodheights.in', '9000000001', 'G-01', 'Guard', 1, false, false),
  ('Sunil Yadav',    'guard2@greenwoodheights.in', '9000000002', 'G-02', 'Guard', 1, false, false),
  ('Manoj Tiwari',   'guard3@greenwoodheights.in', '9000000003', 'G-03', 'Guard', 1, false, false),
  ('Deepak Sharma',  'guard4@greenwoodheights.in', '9000000004', 'G-04', 'Guard', 1, false, false);
