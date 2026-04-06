-- ISSUES SEED PART 4

INSERT INTO issues (title, description, category, priority, status, created_at) VALUES
('Pipe burst — C-Wing basement', 'Water pipe burst in C-Wing basement. Water flooding storage area.', 'Plumbing', 'critical', 'in_progress', NOW() - INTERVAL '1 day'),
('Broken tiles in lobby — A Wing', 'Floor tiles near A-Wing lift lobby cracked and broken. Tripping hazard.', 'Maintenance', 'medium', 'open', NOW() - INTERVAL '7 days'),
('Power outage — D Wing floor 9-14', 'Floors 9 to 14 in D-Wing without power for 3 hours. MCB tripping.', 'Electrical', 'critical', 'in_progress', NOW() - INTERVAL '6 hours'),
('Rats in garbage room', 'Rats spotted in garbage collection room near B-Wing. Health hazard.', 'Housekeeping', 'high', 'open', NOW() - INTERVAL '4 days'),
('CCTV footage request — parking incident', 'Resident requesting CCTV footage of parking area from 15th March.', 'Security', 'medium', 'open', NOW() - INTERVAL '8 days'),
('Pool pump not working', 'Swimming pool pump has stopped. Water not circulating.', 'Amenities', 'high', 'open', NOW() - INTERVAL '3 days'),
('Dog barking complaint — A-201', 'Resident in A-201 has dog that barks continuously from 6-8 AM.', 'Noise', 'low', 'open', NOW() - INTERVAL '10 days'),
('Parking gate sensor broken', 'Parking area boom barrier sensor not detecting vehicles. Gate stays closed.', 'Parking', 'high', 'open', NOW() - INTERVAL '2 days'),
('Bathroom drain slow — B-Wing common', 'Common bathroom drain on B-Wing ground floor draining very slowly.', 'Plumbing', 'medium', 'open', NOW() - INTERVAL '9 days'),
('Corridor fan not working — C floor 4', 'Corridor exhaust fan on C-Wing 4th floor not working. Stuffy air.', 'Electrical', 'low', 'open', NOW() - INTERVAL '12 days'),
('Playground equipment rusting', 'Kids play area equipment showing significant rust. Safety concern for children.', 'Amenities', 'high', 'open', NOW() - INTERVAL '5 days'),
('Renovation noise before 8 AM', 'Flat D-302 doing renovation work starting at 6:30 AM. Violating society rules.', 'Noise', 'medium', 'open', NOW() - INTERVAL '6 days'),
('Double parking blocking exit', 'Vehicle double-parked near exit blocking other residents from leaving.', 'Parking', 'high', 'open', NOW() - INTERVAL '3 days'),
('Water pressure low — A Wing floors 10-14', 'Water pressure very low on upper floors of A-Wing. Barely enough for shower.', 'Plumbing', 'high', 'open', NOW() - INTERVAL '4 days'),
('Meter room door broken', 'Electricity meter room door lock broken. Unauthorized access possible.', 'Security', 'high', 'open', NOW() - INTERVAL '5 days'),
('Gym mirror cracked', 'Large mirror in gym has a crack running across it. Safety hazard.', 'Amenities', 'medium', 'open', NOW() - INTERVAL '8 days'),
('Lift A emergency phone not working', 'Emergency phone inside Lift A is dead. Safety concern.', 'Maintenance', 'critical', 'open', NOW() - INTERVAL '2 days'),
('Sewage smell in B-Wing basement', 'Strong sewage smell in B-Wing basement parking area.', 'Plumbing', 'high', 'open', NOW() - INTERVAL '4 days'),
('Broken railing — C Wing staircase floor 8', 'Staircase railing on C-Wing 8th floor is loose and broken. Fall risk.', 'Maintenance', 'critical', 'open', NOW() - INTERVAL '1 day'),
('Electricity bill discrepancy', 'Common area electricity bill for March seems unusually high. Requesting audit.', 'Electrical', 'medium', 'open', NOW() - INTERVAL '7 days');
