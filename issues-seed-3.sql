-- ISSUES SEED PART 3

INSERT INTO issues (title, description, category, priority, status, created_at) VALUES
('Roof leak during rain — A-701', 'Water entering flat A-701 through roof during heavy rain.', 'Plumbing', 'high', 'open', NOW() - INTERVAL '5 days'),
('Broken window grill — B-Wing staircase', 'Window grill on B-Wing staircase floor 2 is broken. Safety risk.', 'Maintenance', 'medium', 'open', NOW() - INTERVAL '11 days'),
('Lift C overloaded alarm', 'Lift C overload alarm triggers even with 3 people. Needs calibration.', 'Maintenance', 'medium', 'in_progress', NOW() - INTERVAL '6 days'),
('Mosquito breeding in water tank area', 'Stagnant water near overhead tank area. Mosquito breeding observed.', 'Housekeeping', 'high', 'open', NOW() - INTERVAL '3 days'),
('Intercom panel damaged — main gate', 'Main gate intercom panel buttons not responding. Guards unable to call residents.', 'Security', 'high', 'open', NOW() - INTERVAL '4 days'),
('Badminton court net torn', 'Badminton court net is torn and unusable.', 'Amenities', 'low', 'open', NOW() - INTERVAL '14 days'),
('Loud generator noise at night', 'Backup generator running loudly between 11 PM and 2 AM. Disturbing sleep.', 'Noise', 'medium', 'open', NOW() - INTERVAL '5 days'),
('Unauthorized vehicle in reserved slot', 'Unknown vehicle parked in slot D-08 for 5 days. Owner not traceable.', 'Parking', 'medium', 'open', NOW() - INTERVAL '7 days'),
('Hot water not available — A Wing', 'Solar water heater for A-Wing not functioning. No hot water in mornings.', 'Plumbing', 'high', 'open', NOW() - INTERVAL '2 days'),
('Switchboard sparking — C-Wing floor 6', 'Common area switchboard on C-Wing 6th floor sparking when switched on.', 'Electrical', 'critical', 'open', NOW() - INTERVAL '1 day'),
('Garden sprinkler broken', 'Garden sprinkler system not working. Plants drying up.', 'Maintenance', 'low', 'open', NOW() - INTERVAL '15 days'),
('Clubhouse booking system confusion', 'Multiple residents booked clubhouse for same slot. Needs admin resolution.', 'Amenities', 'medium', 'open', NOW() - INTERVAL '6 days'),
('Dust from renovation — D-Wing', 'Renovation in D-501 creating excessive dust in corridor. Residents with allergies affected.', 'Noise', 'medium', 'open', NOW() - INTERVAL '4 days'),
('Bike parking area flooded', 'Two-wheeler parking area flooded after rain. Bikes getting damaged.', 'Parking', 'high', 'open', NOW() - INTERVAL '3 days'),
('Overhead tank overflow', 'Overhead tank overflowing daily. Water wastage and wet terrace.', 'Plumbing', 'medium', 'open', NOW() - INTERVAL '8 days'),
('Street light timer malfunction', 'Society street lights staying on all day. Electricity wastage.', 'Electrical', 'medium', 'open', NOW() - INTERVAL '9 days'),
('Gym equipment rusting', 'Several gym equipment pieces showing rust. Needs maintenance.', 'Amenities', 'medium', 'open', NOW() - INTERVAL '10 days'),
('Foul smell from drain — B Wing entrance', 'Strong foul smell from drain near B-Wing main entrance.', 'Housekeeping', 'high', 'open', NOW() - INTERVAL '3 days'),
('Security guard sleeping on duty', 'Night guard at main gate found sleeping at 2 AM. Security concern.', 'Security', 'high', 'open', NOW() - INTERVAL '2 days'),
('Lift button panel damaged — D Wing', 'Lift D button panel has multiple buttons not working. Floors 8-10 unreachable.', 'Maintenance', 'critical', 'open', NOW() - INTERVAL '1 day');
