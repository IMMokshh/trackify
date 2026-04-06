-- ISSUES SEED PART 2

INSERT INTO issues (title, description, category, priority, status, created_at) VALUES
('Seepage in B-201 bathroom wall', 'Wall seepage in bathroom causing paint to peel. Dampness spreading.', 'Plumbing', 'medium', 'open', NOW() - INTERVAL '7 days'),
('Parking area light not working', 'Parking area near B-Wing completely dark at night. Safety hazard.', 'Electrical', 'high', 'open', NOW() - INTERVAL '2 days'),
('Lift B door sensor malfunction', 'Lift B door does not close properly. Keeps reopening.', 'Maintenance', 'high', 'in_progress', NOW() - INTERVAL '3 days'),
('Pest infestation in D-Wing basement', 'Cockroaches and rats spotted in D-Wing basement storage area.', 'Housekeeping', 'high', 'open', NOW() - INTERVAL '4 days'),
('Intercom not working — A-501', 'Intercom in flat A-501 has been dead for a week. Cannot receive visitor calls.', 'Maintenance', 'medium', 'open', NOW() - INTERVAL '8 days'),
('Terrace door left unlocked', 'Terrace access door on C-Wing is left unlocked. Security risk.', 'Security', 'medium', 'open', NOW() - INTERVAL '5 days'),
('Swimming pool water not clean', 'Pool water appears greenish. Needs cleaning and chemical treatment.', 'Amenities', 'high', 'open', NOW() - INTERVAL '2 days'),
('Broken bench in garden', 'Wooden bench near garden entrance is broken. Splinters visible.', 'Maintenance', 'low', 'open', NOW() - INTERVAL '10 days'),
('Electricity fluctuation — D Wing', 'Frequent voltage fluctuations in D-Wing causing appliance damage.', 'Electrical', 'critical', 'open', NOW() - INTERVAL '1 day'),
('Stray dogs near main gate', 'Pack of stray dogs near main gate. Residents afraid to enter at night.', 'Security', 'high', 'open', NOW() - INTERVAL '3 days'),
('Drain blocked near A-Wing', 'Drain near A-Wing entrance blocked. Water stagnating after rain.', 'Plumbing', 'high', 'open', NOW() - INTERVAL '4 days'),
('Gym AC not cooling', 'Air conditioner in gym not cooling. Temperature unbearable during workouts.', 'Amenities', 'medium', 'open', NOW() - INTERVAL '6 days'),
('Noise from construction — B-Wing', 'Renovation work in B-403 creating excessive noise from 7 AM.', 'Noise', 'medium', 'open', NOW() - INTERVAL '5 days'),
('Elevator music system broken', 'Lift A music/announcement system making loud static noise.', 'Maintenance', 'low', 'open', NOW() - INTERVAL '9 days'),
('Parking slot marking faded', 'Parking slot numbers in A-Wing area completely faded. Causing confusion.', 'Parking', 'low', 'open', NOW() - INTERVAL '12 days'),
('Water meter reading incorrect', 'Water meter for flat B-302 showing abnormally high reading.', 'Plumbing', 'medium', 'open', NOW() - INTERVAL '7 days'),
('Corridor light flickering — C Wing floor 3', 'Light on C-Wing 3rd floor corridor flickering continuously.', 'Electrical', 'medium', 'open', NOW() - INTERVAL '8 days'),
('Clubhouse AC leaking water', 'AC unit in clubhouse dripping water onto floor. Slipping hazard.', 'Amenities', 'high', 'open', NOW() - INTERVAL '3 days'),
('Garbage chute blocked — B Wing', 'Garbage chute on B-Wing floors 4-6 is blocked. Residents unable to dispose waste.', 'Housekeeping', 'high', 'open', NOW() - INTERVAL '2 days'),
('Fire extinguisher missing — D floor 7', 'Fire extinguisher on D-Wing 7th floor is missing from its bracket.', 'Security', 'critical', 'open', NOW() - INTERVAL '1 day');
