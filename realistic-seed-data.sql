-- ============================================================
-- REALISTIC SEED DATA — Greenwood Heights CHS
-- Visitor Passes (~50 entries) + Issues (25 entries)
-- Safe to run: uses gen_random_uuid(), no TRUNCATE
-- ============================================================

-- ============================================================
-- SECTION 1: VISITOR PASSES
-- Schema: id, resident_id, flat_number, visitor_name,
--         visitor_phone, purpose, otp, exit_otp,
--         exit_otp_expires_at, valid_from, valid_until,
--         status, entry_time, exit_time, guard_note, created_at
-- NOTE: resident_id uses a placeholder UUID since we don't
--       know actual auth user IDs. Replace with real UUIDs
--       from your profiles table if needed, or use a known
--       resident UUID.
-- ============================================================

-- Helper: we use a fixed demo resident UUID for seeding.
-- Replace 'aaaaaaaa-0000-0000-0000-000000000001' with a real
-- profiles.id from your Supabase database.

DO $$
DECLARE
  demo_resident UUID := 'e39ac55b-9a41-4da3-abde-1eb0b03c57d7';
BEGIN

-- ── PAST RECORDS (previous month — expired/exited/used) ──────

INSERT INTO visitor_passes (id, resident_id, flat_number, visitor_name, visitor_phone, purpose, otp, exit_otp, valid_from, valid_until, status, entry_time, exit_time, created_at) VALUES
(gen_random_uuid(), demo_resident, 'A-101', 'Rahul Sharma',     '9876543210', 'Guest',    '112233', '445566', NOW() - INTERVAL '32 days', NOW() - INTERVAL '31 days 22 hours', 'exited',   NOW() - INTERVAL '31 days 23 hours', NOW() - INTERVAL '31 days 20 hours', NOW() - INTERVAL '32 days'),
(gen_random_uuid(), demo_resident, 'A-203', 'Priya Mehta',      '9823456701', 'Guest',    '223344', '556677', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days 22 hours', 'exited',   NOW() - INTERVAL '29 days 23 hours', NOW() - INTERVAL '29 days 19 hours', NOW() - INTERVAL '30 days'),
(gen_random_uuid(), demo_resident, 'B-105', 'Delivery - Flipkart', NULL,      'Delivery', '334455', '667788', NOW() - INTERVAL '29 days', NOW() - INTERVAL '28 days 22 hours', 'exited',   NOW() - INTERVAL '28 days 23 hours', NOW() - INTERVAL '28 days 22 hours', NOW() - INTERVAL '29 days'),
(gen_random_uuid(), demo_resident, 'B-302', 'Suresh Patil',     '9712345678', 'Guest',    '445566', '778899', NOW() - INTERVAL '28 days', NOW() - INTERVAL '27 days 22 hours', 'exited',   NOW() - INTERVAL '27 days 23 hours', NOW() - INTERVAL '27 days 18 hours', NOW() - INTERVAL '28 days'),
(gen_random_uuid(), demo_resident, 'C-401', 'Anita Desai',      '9634567890', 'Service',  '556677', '889900', NOW() - INTERVAL '27 days', NOW() - INTERVAL '26 days 22 hours', 'exited',   NOW() - INTERVAL '26 days 23 hours', NOW() - INTERVAL '26 days 21 hours', NOW() - INTERVAL '27 days'),
(gen_random_uuid(), demo_resident, 'A-502', 'Vikram Joshi',     '9545678901', 'Guest',    '667788', '990011', NOW() - INTERVAL '26 days', NOW() - INTERVAL '25 days 22 hours', 'exited',   NOW() - INTERVAL '25 days 23 hours', NOW() - INTERVAL '25 days 17 hours', NOW() - INTERVAL '26 days'),
(gen_random_uuid(), demo_resident, 'D-201', 'Neha Kulkarni',    '9456789012', 'Guest',    '778899', '100122', NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days 22 hours', 'exited',   NOW() - INTERVAL '24 days 23 hours', NOW() - INTERVAL '24 days 20 hours', NOW() - INTERVAL '25 days'),
(gen_random_uuid(), demo_resident, 'B-403', 'Cab - Ola',        NULL,         'Cab',      '889900', '211233', NOW() - INTERVAL '24 days', NOW() - INTERVAL '23 days 22 hours', 'exited',   NOW() - INTERVAL '23 days 23 hours', NOW() - INTERVAL '23 days 22 hours', NOW() - INTERVAL '24 days'),
(gen_random_uuid(), demo_resident, 'C-103', 'Ramesh Nair',      '9367890123', 'Guest',    '990011', '322344', NOW() - INTERVAL '23 days', NOW() - INTERVAL '22 days 22 hours', 'exited',   NOW() - INTERVAL '22 days 23 hours', NOW() - INTERVAL '22 days 19 hours', NOW() - INTERVAL '23 days'),
(gen_random_uuid(), demo_resident, 'A-304', 'Sunita Rao',       '9278901234', 'Guest',    '100122', '433455', NOW() - INTERVAL '22 days', NOW() - INTERVAL '21 days 22 hours', 'exited',   NOW() - INTERVAL '21 days 23 hours', NOW() - INTERVAL '21 days 16 hours', NOW() - INTERVAL '22 days'),
(gen_random_uuid(), demo_resident, 'D-502', 'Plumber - Raju',   '9189012345', 'Service',  '211233', '544566', NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days 22 hours', 'exited',   NOW() - INTERVAL '20 days 23 hours', NOW() - INTERVAL '20 days 21 hours', NOW() - INTERVAL '21 days'),
(gen_random_uuid(), demo_resident, 'B-201', 'Kavita Iyer',      '9090123456', 'Guest',    '322344', '655677', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days 22 hours', 'exited',   NOW() - INTERVAL '19 days 23 hours', NOW() - INTERVAL '19 days 18 hours', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), demo_resident, 'A-601', 'Delivery - Amazon',NULL,         'Delivery', '433455', '766788', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days 22 hours', 'exited',   NOW() - INTERVAL '18 days 23 hours', NOW() - INTERVAL '18 days 22 hours', NOW() - INTERVAL '19 days'),
(gen_random_uuid(), demo_resident, 'C-302', 'Arun Verma',       '9901234567', 'Guest',    '544566', '877899', NOW() - INTERVAL '18 days', NOW() - INTERVAL '17 days 22 hours', 'exited',   NOW() - INTERVAL '17 days 23 hours', NOW() - INTERVAL '17 days 17 hours', NOW() - INTERVAL '18 days'),
(gen_random_uuid(), demo_resident, 'B-504', 'Meena Pillai',     '9812345678', 'Guest',    '655677', '988900', NOW() - INTERVAL '17 days', NOW() - INTERVAL '16 days 22 hours', 'exited',   NOW() - INTERVAL '16 days 23 hours', NOW() - INTERVAL '16 days 20 hours', NOW() - INTERVAL '17 days'),
(gen_random_uuid(), demo_resident, 'D-103', 'Cab - Uber',       NULL,         'Cab',      '766788', '199011', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days 22 hours', 'exited',   NOW() - INTERVAL '15 days 23 hours', NOW() - INTERVAL '15 days 22 hours', NOW() - INTERVAL '16 days'),
(gen_random_uuid(), demo_resident, 'A-402', 'Deepak Gupta',     '9723456789', 'Guest',    '877899', '200122', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days 22 hours', 'exited',   NOW() - INTERVAL '14 days 23 hours', NOW() - INTERVAL '14 days 19 hours', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), demo_resident, 'C-501', 'Electrician - Mohan', '9634567890', 'Service','988900', '311233', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days 22 hours', 'exited',  NOW() - INTERVAL '13 days 23 hours', NOW() - INTERVAL '13 days 21 hours', NOW() - INTERVAL '14 days'),
(gen_random_uuid(), demo_resident, 'B-101', 'Pooja Sharma',     '9545678901', 'Guest',    '199011', '422344', NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days 22 hours', 'exited',   NOW() - INTERVAL '12 days 23 hours', NOW() - INTERVAL '12 days 18 hours', NOW() - INTERVAL '13 days'),
(gen_random_uuid(), demo_resident, 'A-203', 'Delivery - Zomato',NULL,         'Delivery', '200122', '533455', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days 22 hours', 'exited',   NOW() - INTERVAL '11 days 23 hours', NOW() - INTERVAL '11 days 22 hours', NOW() - INTERVAL '12 days');

-- ── CURRENT MONTH RECORDS (mixed statuses) ───────────────────

INSERT INTO visitor_passes (id, resident_id, flat_number, visitor_name, visitor_phone, purpose, otp, exit_otp, valid_from, valid_until, status, entry_time, exit_time, created_at) VALUES
(gen_random_uuid(), demo_resident, 'D-401', 'Sanjay Bhat',      '9456789012', 'Guest',    '311233', '644566', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days 22 hours', 'exited',   NOW() - INTERVAL '10 days 23 hours', NOW() - INTERVAL '10 days 17 hours', NOW() - INTERVAL '11 days'),
(gen_random_uuid(), demo_resident, 'C-204', 'Ritu Agarwal',     '9367890123', 'Guest',    '422344', '755677', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days 22 hours',  'exited',   NOW() - INTERVAL '9 days 23 hours',  NOW() - INTERVAL '9 days 20 hours',  NOW() - INTERVAL '10 days'),
(gen_random_uuid(), demo_resident, 'A-503', 'Cab - Rapido',     NULL,         'Cab',      '533455', '866788', NOW() - INTERVAL '9 days',  NOW() - INTERVAL '8 days 22 hours',  'exited',   NOW() - INTERVAL '8 days 23 hours',  NOW() - INTERVAL '8 days 22 hours',  NOW() - INTERVAL '9 days'),
(gen_random_uuid(), demo_resident, 'B-303', 'Harish Menon',     '9278901234', 'Guest',    '644566', '977899', NOW() - INTERVAL '8 days',  NOW() - INTERVAL '7 days 22 hours',  'exited',   NOW() - INTERVAL '7 days 23 hours',  NOW() - INTERVAL '7 days 19 hours',  NOW() - INTERVAL '8 days'),
(gen_random_uuid(), demo_resident, 'D-302', 'Delivery - Swiggy',NULL,         'Delivery', '755677', '988900', NOW() - INTERVAL '7 days',  NOW() - INTERVAL '6 days 22 hours',  'exited',   NOW() - INTERVAL '6 days 23 hours',  NOW() - INTERVAL '6 days 22 hours',  NOW() - INTERVAL '7 days'),
(gen_random_uuid(), demo_resident, 'A-102', 'Lalita Nair',      '9189012345', 'Guest',    '866788', '199011', NOW() - INTERVAL '6 days',  NOW() - INTERVAL '5 days 22 hours',  'exited',   NOW() - INTERVAL '5 days 23 hours',  NOW() - INTERVAL '5 days 18 hours',  NOW() - INTERVAL '6 days'),
(gen_random_uuid(), demo_resident, 'C-403', 'Painter - Sunil',  '9090123456', 'Service',  '977899', '200122', NOW() - INTERVAL '5 days',  NOW() - INTERVAL '4 days 22 hours',  'exited',   NOW() - INTERVAL '4 days 23 hours',  NOW() - INTERVAL '4 days 21 hours',  NOW() - INTERVAL '5 days'),
(gen_random_uuid(), demo_resident, 'B-402', 'Mohan Das',        '9901234567', 'Guest',    '100223', '311334', NOW() - INTERVAL '4 days',  NOW() - INTERVAL '3 days 22 hours',  'exited',   NOW() - INTERVAL '3 days 23 hours',  NOW() - INTERVAL '3 days 17 hours',  NOW() - INTERVAL '4 days'),
(gen_random_uuid(), demo_resident, 'A-301', 'Delivery - BigBasket', NULL,     'Delivery', '211334', '422445', NOW() - INTERVAL '3 days',  NOW() - INTERVAL '2 days 22 hours',  'exited',   NOW() - INTERVAL '2 days 23 hours',  NOW() - INTERVAL '2 days 22 hours',  NOW() - INTERVAL '3 days'),
(gen_random_uuid(), demo_resident, 'D-501', 'Geeta Pillai',     '9812345678', 'Guest',    '322445', '533556', NOW() - INTERVAL '2 days',  NOW() - INTERVAL '1 day 22 hours',   'exited',   NOW() - INTERVAL '1 day 23 hours',   NOW() - INTERVAL '1 day 20 hours',   NOW() - INTERVAL '2 days'),
(gen_random_uuid(), demo_resident, 'C-101', 'Cab - Ola',        NULL,         'Cab',      '433556', '644667', NOW() - INTERVAL '1 day',   NOW() - INTERVAL '22 hours',         'exited',   NOW() - INTERVAL '23 hours',         NOW() - INTERVAL '22 hours',         NOW() - INTERVAL '1 day'),
(gen_random_uuid(), demo_resident, 'B-502', 'Ashok Tiwari',     '9723456789', 'Guest',    '544667', '655778', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '18 hours',        'exited',   NOW() - INTERVAL '19 hours',         NOW() - INTERVAL '18 hours',         NOW() - INTERVAL '20 hours'),
(gen_random_uuid(), demo_resident, 'A-401', 'Carpenter - Ravi', '9634567890', 'Service',  '655778', '766889', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '8 hours',         'exited',   NOW() - INTERVAL '9 hours',          NOW() - INTERVAL '8 hours',          NOW() - INTERVAL '10 hours'),

-- ── CANCELLED PASSES ─────────────────────────────────────────
(gen_random_uuid(), demo_resident, 'B-204', 'Nitin Joshi',      '9545678901', 'Guest',    '766889', NULL,     NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days 22 hours', 'cancelled', NULL, NULL, NOW() - INTERVAL '15 days'),
(gen_random_uuid(), demo_resident, 'C-303', 'Delivery - Meesho',NULL,         'Delivery', '877990', NULL,     NOW() - INTERVAL '8 days',  NOW() - INTERVAL '7 days 22 hours',  'cancelled', NULL, NULL, NOW() - INTERVAL '8 days'),
(gen_random_uuid(), demo_resident, 'D-102', 'Smita Kulkarni',   '9456789012', 'Guest',    '988001', NULL,     NOW() - INTERVAL '3 days',  NOW() - INTERVAL '2 days 22 hours',  'cancelled', NULL, NULL, NOW() - INTERVAL '3 days'),

-- ── EXPIRED PASSES ───────────────────────────────────────────
(gen_random_uuid(), demo_resident, 'A-502', 'Tarun Mehta',      '9367890123', 'Guest',    '199112', NULL,     NOW() - INTERVAL '5 days',  NOW() - INTERVAL '4 days',           'expired',   NULL, NULL, NOW() - INTERVAL '5 days'),
(gen_random_uuid(), demo_resident, 'B-101', 'Delivery - Nykaa', NULL,         'Delivery', '200223', NULL,     NOW() - INTERVAL '2 days',  NOW() - INTERVAL '1 day',            'expired',   NULL, NULL, NOW() - INTERVAL '2 days'),

-- ── CURRENTLY INSIDE (visitor entered, not yet exited) ───────
(gen_random_uuid(), demo_resident, 'C-202', 'Vinod Sharma',     '9278901234', 'Guest',    '311334', '422445', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '22 hours',         'inside',    NOW() - INTERVAL '1 hour 30 minutes', NULL, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), demo_resident, 'D-403', 'AC Technician - Ramesh', '9189012345', 'Service', '422445', '533556', NOW() - INTERVAL '3 hours', NOW() + INTERVAL '21 hours', 'inside', NOW() - INTERVAL '2 hours', NULL, NOW() - INTERVAL '3 hours'),

-- ── 2 ACTIVE PASSES (generated, not yet used) ────────────────
(gen_random_uuid(), demo_resident, 'A-201', 'Priyanka Verma',   '9090123456', 'Guest',    '543219', '654321', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '26 hours',         'active',    NULL, NULL, NOW() - INTERVAL '30 minutes'),
(gen_random_uuid(), demo_resident, 'B-304', 'Delivery - Amazon',NULL,         'Delivery', '654321', '765432', NOW() + INTERVAL '1 hour',  NOW() + INTERVAL '25 hours',         'active',    NULL, NULL, NOW() - INTERVAL '15 minutes'),

-- ── FUTURE SCHEDULED PASSES (next month) ─────────────────────
(gen_random_uuid(), demo_resident, 'C-501', 'Rajesh Iyer',      '9901234567', 'Guest',    '765432', '876543', NOW() + INTERVAL '5 days',  NOW() + INTERVAL '6 days',           'active',    NULL, NULL, NOW()),
(gen_random_uuid(), demo_resident, 'A-103', 'Sundar Krishnan',  '9812345678', 'Guest',    '876543', '987654', NOW() + INTERVAL '7 days',  NOW() + INTERVAL '8 days',           'active',    NULL, NULL, NOW()),
(gen_random_uuid(), demo_resident, 'D-204', 'Delivery - Myntra',NULL,         'Delivery', '987654', '198765', NOW() + INTERVAL '10 days', NOW() + INTERVAL '11 days',          'active',    NULL, NULL, NOW()),
(gen_random_uuid(), demo_resident, 'B-401', 'Meera Nambiar',    '9723456789', 'Guest',    '198765', '209876', NOW() + INTERVAL '12 days', NOW() + INTERVAL '13 days',          'active',    NULL, NULL, NOW()),
(gen_random_uuid(), demo_resident, 'C-302', 'Cab - Uber',       NULL,         'Cab',      '209876', '310987', NOW() + INTERVAL '15 days', NOW() + INTERVAL '16 days',          'active',    NULL, NULL, NOW()),
(gen_random_uuid(), demo_resident, 'A-601', 'Kiran Bose',       '9634567890', 'Guest',    '310987', '421098', NOW() + INTERVAL '20 days', NOW() + INTERVAL '21 days',          'active',    NULL, NULL, NOW()),
(gen_random_uuid(), demo_resident, 'D-501', 'Plumber - Ganesh', '9545678901', 'Service',  '421098', '532109', NOW() + INTERVAL '25 days', NOW() + INTERVAL '26 days',          'active',    NULL, NULL, NOW());

END $$;


-- ============================================================
-- SECTION 2: ISSUES (25 entries for Issue Map)
-- Schema: title, description, category, priority, status,
--         created_at, resolved_at
-- Categories: Plumbing, Electrical, Security, Maintenance,
--             Housekeeping, Amenities, Parking, Noise
-- Priority: low, medium, high, critical
-- Status: open, in_progress, resolved
-- ============================================================

INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- ── OPEN ISSUES ──────────────────────────────────────────────
('Water leakage — D-Wing terrace',
 'Rainwater seeping through terrace of D-Wing into flat D-1201. Ceiling paint peeling and dampness spreading to walls.',
 'Plumbing', 'high', 'open', NOW() - INTERVAL '3 days', NULL),

('Street light out — main gate',
 'The street light near the main entrance gate has been non-functional for 4 days. Security risk at night.',
 'Electrical', 'high', 'open', NOW() - INTERVAL '4 days', NULL),

('CCTV camera offline — B-Wing parking',
 'CCTV camera covering B-Wing parking area is offline. Blind spot created near parking slots B-12 to B-20.',
 'Security', 'critical', 'open', NOW() - INTERVAL '2 days', NULL),

('Broken bench — garden area',
 'One of the garden benches near the children''s play area has a broken leg. Risk of injury to elderly residents.',
 'Maintenance', 'medium', 'open', NOW() - INTERVAL '6 days', NULL),

('Garbage not collected — C-Wing',
 'Garbage from C-Wing collection point has not been picked up for 2 days. Foul smell spreading to nearby flats.',
 'Housekeeping', 'high', 'open', NOW() - INTERVAL '2 days', NULL),

('Gym equipment broken — treadmill',
 'Treadmill in the gym has a broken belt. Out of service since last week. Residents requesting urgent repair.',
 'Amenities', 'medium', 'open', NOW() - INTERVAL '7 days', NULL),

('Unauthorized parking — visitor slot',
 'A vehicle (MH-12-AB-1234) has been parked in visitor slot V-05 for 3 days without any visitor pass.',
 'Parking', 'medium', 'open', NOW() - INTERVAL '3 days', NULL),

('Loud music after midnight — A-803',
 'Flat A-803 playing loud music after midnight on weekdays. Multiple complaints from A-802 and A-804.',
 'Noise', 'medium', 'open', NOW() - INTERVAL '1 day', NULL),

-- ── IN PROGRESS ──────────────────────────────────────────────
('Lift B stuck on 7th floor',
 'Lift B in B-Wing stuck between 7th and 8th floor since morning. AMC team contacted, technician arriving today.',
 'Maintenance', 'critical', 'in_progress', NOW() - INTERVAL '1 day', NULL),

('Pipe burst — A-Wing basement',
 'Water pipe burst in A-Wing basement near meter room. Plumber engaged, repair work ongoing.',
 'Plumbing', 'critical', 'in_progress', NOW() - INTERVAL '2 days', NULL),

('Intercom not working — D-Wing',
 'Intercom system in D-Wing floors 3 to 6 not functioning. Vendor contacted for repair.',
 'Electrical', 'high', 'in_progress', NOW() - INTERVAL '5 days', NULL),

('Swimming pool pump repair',
 'Pool circulation pump making grinding noise. Pool temporarily closed. Technician inspecting.',
 'Amenities', 'high', 'in_progress', NOW() - INTERVAL '4 days', NULL),

('Waterproofing — B-Wing terrace',
 'B-Wing terrace waterproofing work in progress. Contractor engaged. Expected completion in 3 days.',
 'Maintenance', 'high', 'in_progress', NOW() - INTERVAL '8 days', NULL),

('Repainting — lobby A-Wing',
 'A-Wing lobby repainting work started. Painter working on ground and first floor. 2 days remaining.',
 'Maintenance', 'low', 'in_progress', NOW() - INTERVAL '3 days', NULL),

-- ── RESOLVED ISSUES ──────────────────────────────────────────
('Water motor tripped — overhead tank',
 'Overhead tank water motor tripped causing no water supply to C-Wing floors 8-12. Reset and restored.',
 'Plumbing', 'critical', 'resolved', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),

('Main gate lock broken',
 'Main entrance gate electronic lock malfunctioned. Residents unable to use key fob. Replaced within 4 hours.',
 'Security', 'critical', 'resolved', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'),

('Parking area light — B-Wing',
 'Parking area near B-Wing completely dark at night. Replaced 3 tube lights and 1 LED fixture.',
 'Electrical', 'high', 'resolved', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days'),

('Lift A annual maintenance',
 'Lift A in A-Wing due for annual AMC service. Completed by vendor. Certificate updated.',
 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days'),

('Pest control — common areas',
 'Cockroach infestation reported near garbage area. Pest control treatment done for all common areas.',
 'Housekeeping', 'medium', 'resolved', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),

('Broken window grill — staircase B',
 'Window grill on B-Wing staircase floor 4 broken. Repaired and welded by maintenance team.',
 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '18 days', NOW() - INTERVAL '16 days'),

('Seepage in C-201 bathroom',
 'Wall seepage in C-201 bathroom causing dampness. Waterproofing compound applied. Issue resolved.',
 'Plumbing', 'medium', 'resolved', NOW() - INTERVAL '22 days', NOW() - INTERVAL '20 days'),

('Clubhouse AC not cooling',
 'Clubhouse AC unit not cooling properly. Gas refilled and filter cleaned by AC technician.',
 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '25 days', NOW() - INTERVAL '23 days'),

('Unauthorized vendor entry',
 'Unknown vendor entered society without pass. Security briefed and entry log updated.',
 'Security', 'high', 'resolved', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

('Drainage blocked — D-Wing',
 'Drainage near D-Wing entrance blocked causing water logging after rain. Cleared by plumber.',
 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days'),

('Generator fuel low',
 'Society generator fuel level critically low. Fuel refilled. Generator tested and operational.',
 'Maintenance', 'high', 'resolved', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days');
