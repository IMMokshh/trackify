-- Sample Chat Messages
INSERT INTO chat_messages (user_id, message, created_at) VALUES
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Hey everyone! Good morning! 🌅', NOW() - INTERVAL '2 hours'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Good morning Moksh! How are you?', NOW() - INTERVAL '1 hour 55 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'Morning guys! Anyone up for a cricket match this evening?', NOW() - INTERVAL '1 hour 50 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'Count me in! What time?', NOW() - INTERVAL '1 hour 45 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'I''m in too! Let''s do 5 PM at the ground', NOW() - INTERVAL '1 hour 40 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Can we use the clubhouse for a party next weekend?', NOW() - INTERVAL '1 hour 30 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'That sounds fun! What''s the occasion?', NOW() - INTERVAL '1 hour 25 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'My birthday! 🎂 Everyone is invited!', NOW() - INTERVAL '1 hour 20 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'Happy early birthday! We''ll be there!', NOW() - INTERVAL '1 hour 15 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Did anyone see the notice about the water supply?', NOW() - INTERVAL '1 hour'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'Yeah, it''ll be off tomorrow from 10 AM to 2 PM', NOW() - INTERVAL '55 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Thanks for the reminder! Need to fill water', NOW() - INTERVAL '50 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'The new gym equipment is amazing! 💪', NOW() - INTERVAL '45 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Really? I should check it out!', NOW() - INTERVAL '40 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'Anyone lost a black umbrella? Found one near the gate', NOW() - INTERVAL '30 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Not mine, but I''ll ask around', NOW() - INTERVAL '25 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'The parking situation is getting better!', NOW() - INTERVAL '20 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Yes! The new system is working well', NOW() - INTERVAL '15 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'See you all at cricket! Don''t forget!', NOW() - INTERVAL '10 minutes'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Looking forward to it! 🏏', NOW() - INTERVAL '5 minutes');

-- Sample Community Posts
INSERT INTO community_posts (user_id, content, created_at) VALUES
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Beautiful sunrise this morning! Our society looks amazing in the golden light 🌅', NOW() - INTERVAL '3 days'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Thank you to the maintenance team for fixing the elevator so quickly! Great service 👏', NOW() - INTERVAL '2 days'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'Organizing a cricket tournament next month! Who wants to participate? Comment below!', NOW() - INTERVAL '2 days'),
((SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'Just moved in last week. Everyone has been so welcoming! Happy to be part of this community 🏠', NOW() - INTERVAL '1 day'),
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Reminder: Society meeting this Saturday at 6 PM in the clubhouse. Important decisions to be made!', NOW() - INTERVAL '1 day'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'The new garden looks beautiful! Kudos to the landscaping team 🌺🌸', NOW() - INTERVAL '12 hours'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'Anyone interested in starting a book club? Let me know!', NOW() - INTERVAL '8 hours'),
((SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'Lost my cat near Block B. Grey with white paws. Please contact if you see her 🐱', NOW() - INTERVAL '6 hours'),
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'The Diwali decorations committee needs volunteers! DM me if interested ✨', NOW() - INTERVAL '4 hours'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Yoga classes starting next week! Every morning 6-7 AM at the clubhouse 🧘‍♀️', NOW() - INTERVAL '2 hours');

-- Sample Post Likes
INSERT INTO post_likes (post_id, user_id) VALUES
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 0), (SELECT id FROM profiles WHERE full_name = 'Yash Bandwane')),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 0), (SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar')),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 1), (SELECT id FROM profiles WHERE full_name = 'Moksh Sonar')),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 1), (SELECT id FROM profiles WHERE full_name = 'Yash Bandwane')),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 2), (SELECT id FROM profiles WHERE full_name = 'Purva Chavan')),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 2), (SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar')),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 3), (SELECT id FROM profiles WHERE full_name = 'Moksh Sonar')),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 4), (SELECT id FROM profiles WHERE full_name = 'Purva Chavan'));

-- Sample Post Comments
INSERT INTO post_comments (post_id, user_id, content, created_at) VALUES
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 2), (SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Count me in! I love cricket!', NOW() - INTERVAL '1 day'),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 2), (SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Me too! When do we start?', NOW() - INTERVAL '23 hours'),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 6), (SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'Great idea! I''m interested', NOW() - INTERVAL '7 hours'),
((SELECT id FROM community_posts ORDER BY created_at DESC LIMIT 1 OFFSET 0), (SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'That sounds amazing! Count me in', NOW() - INTERVAL '1 hour');

-- Sample Polls
INSERT INTO polls (question, options, anonymous, expires_at, created_by, created_at) VALUES
('Should we install solar panels on the rooftop?', ARRAY['Yes, great for environment', 'No, too expensive', 'Need more information'], false, NOW() + INTERVAL '7 days', (SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), NOW() - INTERVAL '2 days'),
('Best time for society events?', ARRAY['Weekday evenings', 'Saturday morning', 'Saturday evening', 'Sunday afternoon'], false, NOW() + INTERVAL '5 days', (SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), NOW() - INTERVAL '1 day'),
('Should we allow pets in common areas?', ARRAY['Yes, with leash', 'Yes, without restrictions', 'No', 'Only small pets'], true, NOW() + INTERVAL '10 days', (SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), NOW() - INTERVAL '12 hours'),
('Preferred gym timing extension?', ARRAY['6 AM - 11 PM', '5 AM - 10 PM', 'Keep current timing', '24/7 access'], false, NOW() + INTERVAL '3 days', (SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), NOW() - INTERVAL '6 hours');

-- Sample Poll Votes
INSERT INTO poll_votes (poll_id, user_id, option) VALUES
((SELECT id FROM polls ORDER BY created_at DESC LIMIT 1 OFFSET 3), (SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Yes, great for environment'),
((SELECT id FROM polls ORDER BY created_at DESC LIMIT 1 OFFSET 3), (SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Yes, great for environment'),
((SELECT id FROM polls ORDER BY created_at DESC LIMIT 1 OFFSET 3), (SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'Need more information'),
((SELECT id FROM polls ORDER BY created_at DESC LIMIT 1 OFFSET 2), (SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'Saturday evening'),
((SELECT id FROM polls ORDER BY created_at DESC LIMIT 1 OFFSET 2), (SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Saturday evening'),
((SELECT id FROM polls ORDER BY created_at DESC LIMIT 1 OFFSET 1), (SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Yes, with leash'),
((SELECT id FROM polls ORDER BY created_at DESC LIMIT 1 OFFSET 0), (SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), '6 AM - 11 PM');

-- Sample Marketplace Listings
INSERT INTO marketplace (user_id, title, description, price, category, contact, status, created_at) VALUES
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Sofa Set - 3+2 Seater', 'Gently used sofa set in excellent condition. Brown leather, very comfortable. Moving out sale!', 15000, 'sell', '9876543210', 'active', NOW() - INTERVAL '3 days'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Looking for Treadmill', 'Want to buy a good condition treadmill for home use. Budget up to 20k', 20000, 'buy', '9876543211', 'active', NOW() - INTERVAL '2 days'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'Home Tutor Available', 'Experienced tutor for Math and Science (Class 8-10). Flexible timings. Contact for details', 500, 'service', '9876543212', 'active', NOW() - INTERVAL '1 day'),
((SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'Lost: Gold Chain', 'Lost my gold chain near the swimming pool area. Sentimental value. Reward if found!', 0, 'lost', '9876543213', 'active', NOW() - INTERVAL '12 hours'),
((SELECT id FROM profiles WHERE full_name = 'Moksh Sonar'), 'Dining Table with 6 Chairs', 'Wooden dining table with 6 chairs. Great condition. Must sell urgently', 8000, 'sell', '9876543210', 'active', NOW() - INTERVAL '8 hours'),
((SELECT id FROM profiles WHERE full_name = 'Purva Chavan'), 'Yoga Classes at Home', 'Certified yoga instructor offering personalized sessions. Morning and evening slots available', 1000, 'service', '9876543211', 'active', NOW() - INTERVAL '6 hours'),
((SELECT id FROM profiles WHERE full_name = 'Yash Bandwane'), 'Kids Bicycle', 'Red bicycle for 5-8 year olds. Good condition with training wheels', 2500, 'sell', '9876543212', 'active', NOW() - INTERVAL '4 hours'),
((SELECT id FROM profiles WHERE full_name = 'Tanmay Kolekar'), 'Looking for Carpool Partner', 'Need carpool partner for daily commute to Hinjewadi. Timings: 9 AM - 6 PM', 0, 'service', '9876543213', 'active', NOW() - INTERVAL '2 hours');
