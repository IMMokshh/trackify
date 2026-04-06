-- ============================================================
-- AMENITIES SEED — Greenwood Heights CHS
-- Clean, deduplicated, categorized (Free vs Bookable)
-- Free = price_per_hour is 0, Bookable = price_per_hour > 0
-- ============================================================

TRUNCATE TABLE amenities RESTART IDENTITY CASCADE;

INSERT INTO amenities (name, description, capacity, price_per_hour, is_active) VALUES

-- FREE AMENITIES (price = 0, no booking required)
('Gymnasium', 'Fully equipped gym with cardio and weight training equipment. Open daily 5 AM – 10 PM. Free for all residents.', 20, 0, true),
('Kids Play Area', 'Safe outdoor play zone with swings, slides, and climbing frames. Free for all residents.', 30, 0, true),
('Jogging Track', '200m jogging track around the society garden. Open 24 hours. Free for all residents.', 50, 0, true),
('Society Garden', 'Landscaped garden with seating. Open for all residents. Free entry.', 100, 0, true),
('Senior Citizen Corner', 'Dedicated seating area with chess and carrom boards for senior residents. Free.', 15, 0, true),

-- BOOKABLE AMENITIES (price > 0, booking required, fee goes to society fund)
('Clubhouse — Main Hall', 'AC hall for events, meetings, and celebrations. Capacity 150 persons. Includes basic AV setup. Booking fee contributes to society fund.', 150, 500, true),
('Clubhouse — Mini Hall', 'Smaller hall for private gatherings and small events. Capacity 40 persons. Booking fee contributes to society fund.', 40, 300, true),
('Swimming Pool', 'Full-size pool for private events and competitions. Lifeguard on duty during bookings. Booking fee contributes to society fund.', 30, 800, true),
('Terrace Banquet Area', 'Open-air terrace for evening events and celebrations. Capacity 80 persons. Booking fee contributes to society fund.', 80, 400, true),
('Conference Room', 'Meeting room with projector and whiteboard. Ideal for AGMs and committee meetings. Booking fee contributes to society fund.', 20, 200, true),
('Badminton Court', 'Indoor badminton court with proper flooring and lighting. Equipment available on request.', 4, 100, true),
('Table Tennis Room', 'Two TT tables in an air-conditioned room. Equipment provided.', 8, 50, true);
