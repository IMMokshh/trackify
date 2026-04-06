-- First, delete old chat messages
DELETE FROM chat_messages;

-- Get the actual user IDs from your profiles table
-- This will work with ANY profiles in your database
-- It picks the first 4 profiles and creates messages from them

-- Message 1
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Hey everyone! Good morning! 🌅',
  NOW() - INTERVAL '2 hours'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 0;

-- Message 2
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Good morning! How are you?',
  NOW() - INTERVAL '1 hour 55 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 1;

-- Message 3
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Morning guys! Anyone up for a cricket match this evening?',
  NOW() - INTERVAL '1 hour 50 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 2;

-- Message 4
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Count me in! What time?',
  NOW() - INTERVAL '1 hour 45 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 3;

-- Message 5
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'I''m in too! Let''s do 5 PM at the ground',
  NOW() - INTERVAL '1 hour 40 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 0;

-- Message 6
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Can we use the clubhouse for a party next weekend?',
  NOW() - INTERVAL '1 hour 30 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 1;

-- Message 7
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'That sounds fun! What''s the occasion?',
  NOW() - INTERVAL '1 hour 25 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 2;

-- Message 8
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'My birthday! 🎂 Everyone is invited!',
  NOW() - INTERVAL '1 hour 20 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 1;

-- Message 9
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Happy early birthday! We''ll be there!',
  NOW() - INTERVAL '1 hour 15 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 3;

-- Message 10
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Did anyone see the notice about the water supply?',
  NOW() - INTERVAL '1 hour'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 0;

-- Message 11
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Yeah, it''ll be off tomorrow from 10 AM to 2 PM',
  NOW() - INTERVAL '55 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 2;

-- Message 12
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Thanks for the reminder! Need to fill water',
  NOW() - INTERVAL '50 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 1;

-- Message 13
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'The new gym equipment is amazing! 💪',
  NOW() - INTERVAL '45 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 3;

-- Message 14
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Really? I should check it out!',
  NOW() - INTERVAL '40 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 0;

-- Message 15
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Anyone lost a black umbrella? Found one near the gate',
  NOW() - INTERVAL '30 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 2;

-- Message 16
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Not mine, but I''ll ask around',
  NOW() - INTERVAL '25 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 1;

-- Message 17
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'The parking situation is getting better!',
  NOW() - INTERVAL '20 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 3;

-- Message 18
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Yes! The new system is working well',
  NOW() - INTERVAL '15 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 0;

-- Message 19
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'See you all at cricket! Don''t forget!',
  NOW() - INTERVAL '10 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 2;

-- Message 20
INSERT INTO chat_messages (user_id, message, created_at)
SELECT 
  id,
  'Looking forward to it! 🏏',
  NOW() - INTERVAL '5 minutes'
FROM profiles
ORDER BY created_at
LIMIT 1
OFFSET 1;
