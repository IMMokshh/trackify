-- BOOKINGS SEED — Greenwood Heights CHS
-- Uses subqueries to find amenity UUIDs by name (avoids hardcoded IDs)

INSERT INTO amenity_bookings (amenity_id, booking_date, start_time, end_time, status, notes, total_amount) VALUES

-- Clubhouse Main Hall
((SELECT id FROM amenities WHERE name = 'Clubhouse — Main Hall' LIMIT 1), '2026-04-05', '18:00', '22:00', 'approved', 'Birthday celebration for resident A-301', 2000),
((SELECT id FROM amenities WHERE name = 'Clubhouse — Main Hall' LIMIT 1), '2026-04-12', '10:00', '14:00', 'approved', 'Society AGM meeting', 2000),
((SELECT id FROM amenities WHERE name = 'Clubhouse — Main Hall' LIMIT 1), '2026-04-20', '17:00', '21:00', 'pending', 'Kitty party — Wing A ladies group', 2000),

-- Clubhouse Mini Hall
((SELECT id FROM amenities WHERE name = 'Clubhouse — Mini Hall' LIMIT 1), '2026-04-06', '15:00', '18:00', 'approved', 'Kids birthday party', 900),
((SELECT id FROM amenities WHERE name = 'Clubhouse — Mini Hall' LIMIT 1), '2026-04-15', '10:00', '12:00', 'approved', 'Committee meeting', 600),

-- Swimming Pool
((SELECT id FROM amenities WHERE name = 'Swimming Pool' LIMIT 1), '2026-04-08', '07:00', '09:00', 'approved', 'Morning swim session — Wing B residents', 1600),
((SELECT id FROM amenities WHERE name = 'Swimming Pool' LIMIT 1), '2026-04-22', '16:00', '18:00', 'pending', 'Kids swimming competition', 1600),

-- Terrace Banquet Area
((SELECT id FROM amenities WHERE name = 'Terrace Banquet Area' LIMIT 1), '2026-04-10', '19:00', '23:00', 'approved', 'Anniversary dinner — flat B-402', 1600),
((SELECT id FROM amenities WHERE name = 'Terrace Banquet Area' LIMIT 1), '2026-04-25', '18:00', '22:00', 'pending', 'Farewell party for resident D-501', 1600),

-- Conference Room
((SELECT id FROM amenities WHERE name = 'Conference Room' LIMIT 1), '2026-04-07', '10:00', '12:00', 'approved', 'Sub-committee meeting', 400),
((SELECT id FROM amenities WHERE name = 'Conference Room' LIMIT 1), '2026-04-14', '14:00', '16:00', 'approved', 'Vendor meeting — lift AMC renewal', 400),

-- Badminton Court
((SELECT id FROM amenities WHERE name = 'Badminton Court' LIMIT 1), '2026-04-09', '06:00', '07:00', 'approved', 'Morning badminton — regular slot', 100);
