-- ISSUES SEED — Greenwood Heights CHS
-- Active issues (open/in_progress)
-- Run this first, then parts 2-5

TRUNCATE TABLE issues RESTART IDENTITY CASCADE;

INSERT INTO issues (title, description, category, priority, status, created_at) VALUES
('Water leakage in A-Wing lobby', 'Water dripping from ceiling near A-Wing main entrance. Floor is slippery.', 'Plumbing', 'high', 'open', NOW() - INTERVAL '2 days'),
('Lift A not working', 'Lift A in Wing A has been stuck on 3rd floor since morning. Residents unable to use.', 'Maintenance', 'critical', 'open', NOW() - INTERVAL '1 day'),
('Broken tubelight — B staircase floor 5', 'Tubelight on 5th floor B-Wing staircase is broken. Very dark at night.', 'Electrical', 'medium', 'open', NOW() - INTERVAL '3 days'),
('Garbage overflow near D-Wing', 'Garbage bins near D-Wing entrance overflowing. Not collected in 2 days.', 'Housekeeping', 'high', 'open', NOW() - INTERVAL '1 day'),
('CCTV offline at main gate', 'Main gate CCTV camera showing blank screen since yesterday.', 'Security', 'high', 'open', NOW() - INTERVAL '2 days'),
('Gym treadmill belt torn', 'Treadmill belt in gym is torn and cannot be used safely.', 'Amenities', 'medium', 'open', NOW() - INTERVAL '4 days'),
('Loud music from C-302 after midnight', 'Resident in C-302 plays loud music after 12 AM regularly.', 'Noise', 'medium', 'open', NOW() - INTERVAL '5 days'),
('Visitor parking misuse', 'Resident vehicles parked in visitor slots V-01 and V-02 for 4 days.', 'Parking', 'low', 'open', NOW() - INTERVAL '6 days'),
('Water supply disruption — C Wing', 'No water supply to C-Wing flats from 6 AM to 2 PM daily.', 'Plumbing', 'critical', 'open', NOW() - INTERVAL '1 day'),
('Side gate lock broken', 'Side entrance gate lock is broken. Gate stays open all night.', 'Security', 'high', 'open', NOW() - INTERVAL '3 days');
