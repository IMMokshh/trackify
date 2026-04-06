-- Delete the fake profiles if they exist
DELETE FROM profiles WHERE id IN (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444'
);

-- Delete the fake auth users if they exist
DELETE FROM auth.users WHERE id IN (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444'
);

-- Create auth users with proper structure
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'purva@fake.com',
    '$2a$10$abcdefghijklmnopqrstuv',
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'yash@fake.com',
    '$2a$10$abcdefghijklmnopqrstuv',
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-4444-444444444444',
    'authenticated',
    'authenticated',
    'tanmay@fake.com',
    '$2a$10$abcdefghijklmnopqrstuv',
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

-- Now create the profiles
INSERT INTO profiles (id, full_name, flat_number, email, role, created_at)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Purva Chavan', 'B-201', 'purva@fake.com', 'resident', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Yash Bandwane', 'C-105', 'yash@fake.com', 'resident', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Tanmay Kolekar', 'A-402', 'tanmay@fake.com', 'resident', NOW());

-- Verify profiles were created
SELECT id, full_name, flat_number FROM profiles ORDER BY created_at;
