-- First, create auth users (required for foreign key)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'purva@fake.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'yash@fake.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('44444444-4444-4444-4444-444444444444', 'tanmay@fake.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Then create profiles for these users
INSERT INTO profiles (id, full_name, flat_number, email, created_at)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Purva Chavan', 'B-201', 'purva@fake.com', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Yash Bandwane', 'C-105', 'yash@fake.com', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Tanmay Kolekar', 'A-402', 'tanmay@fake.com', NOW())
ON CONFLICT (id) DO NOTHING;

-- Clear old messages
DELETE FROM chat_messages;

-- Insert chat messages from Moksh, Purva, Yash, and Tanmay
INSERT INTO chat_messages (user_id, message, created_at) VALUES
('e39ac55b-9a41-4da3-abde-1eb0b03c57d7', 'Hey everyone! Good morning! 🌅', NOW() - INTERVAL '2 hours'),
('22222222-2222-2222-2222-222222222222', 'Good morning Moksh! How are you?', NOW() - INTERVAL '1 hour 55 minutes'),
('33333333-3333-3333-3333-333333333333', 'Morning guys! Anyone up for a cricket match this evening?', NOW() - INTERVAL '1 hour 50 minutes'),
('44444444-4444-4444-4444-444444444444', 'Count me in! What time?', NOW() - INTERVAL '1 hour 45 minutes'),
('e39ac55b-9a41-4da3-abde-1eb0b03c57d7', 'I''m in too! Let''s do 5 PM at the ground', NOW() - INTERVAL '1 hour 40 minutes'),
('22222222-2222-2222-2222-222222222222', 'Can we use the clubhouse for a party next weekend?', NOW() - INTERVAL '1 hour 30 minutes'),
('33333333-3333-3333-3333-333333333333', 'That sounds fun! What''s the occasion?', NOW() - INTERVAL '1 hour 25 minutes'),
('22222222-2222-2222-2222-222222222222', 'My birthday! 🎂 Everyone is invited!', NOW() - INTERVAL '1 hour 20 minutes'),
('44444444-4444-4444-4444-444444444444', 'Happy early birthday! We''ll be there!', NOW() - INTERVAL '1 hour 15 minutes'),
('e39ac55b-9a41-4da3-abde-1eb0b03c57d7', 'Did anyone see the notice about the water supply?', NOW() - INTERVAL '1 hour'),
('33333333-3333-3333-3333-333333333333', 'Yeah, it''ll be off tomorrow from 10 AM to 2 PM', NOW() - INTERVAL '55 minutes'),
('22222222-2222-2222-2222-222222222222', 'Thanks for the reminder! Need to fill water', NOW() - INTERVAL '50 minutes'),
('44444444-4444-4444-4444-444444444444', 'The new gym equipment is amazing! 💪', NOW() - INTERVAL '45 minutes'),
('e39ac55b-9a41-4da3-abde-1eb0b03c57d7', 'Really? I should check it out!', NOW() - INTERVAL '40 minutes'),
('33333333-3333-3333-3333-333333333333', 'Anyone lost a black umbrella? Found one near the gate', NOW() - INTERVAL '30 minutes'),
('22222222-2222-2222-2222-222222222222', 'Not mine, but I''ll ask around', NOW() - INTERVAL '25 minutes'),
('44444444-4444-4444-4444-444444444444', 'The parking situation is getting better!', NOW() - INTERVAL '20 minutes'),
('e39ac55b-9a41-4da3-abde-1eb0b03c57d7', 'Yes! The new system is working well', NOW() - INTERVAL '15 minutes'),
('33333333-3333-3333-3333-333333333333', 'See you all at cricket! Don''t forget!', NOW() - INTERVAL '10 minutes'),
('22222222-2222-2222-2222-222222222222', 'Looking forward to it! 🏏', NOW() - INTERVAL '5 minutes');
