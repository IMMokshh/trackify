-- ============================================
-- CREATE ADDITIONAL USERS FOR TESTING
-- ============================================
-- This script creates additional test users with proper authentication
-- Run this BEFORE running COMPLETE-REALISTIC-DATA.sql if you want issues from different users

-- NOTE: This approach may not work on all Supabase instances
-- RECOMMENDED: Register users manually through the app instead

-- Committee Members (Admin role)
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Purva Chavan
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'purva@societyhub.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'purva@societyhub.com', crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      false, 'authenticated'
    ) RETURNING id INTO user_id;
    
    INSERT INTO profiles (id, email, full_name, flat_number, phone, role)
    VALUES (user_id, 'purva@societyhub.com', 'Purva Chavan', 'B-303', '9876543201', 'admin');
  END IF;

  -- Yash Bandwane
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'yash@societyhub.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'yash@societyhub.com', crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      false, 'authenticated'
    ) RETURNING id INTO user_id;
    
    INSERT INTO profiles (id, email, full_name, flat_number, phone, role)
    VALUES (user_id, 'yash@societyhub.com', 'Yash Bandwane', 'A-401', '9876543202', 'admin');
  END IF;

  -- Tanmay Kolekar
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tanmay@societyhub.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'tanmay@societyhub.com', crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      false, 'authenticated'
    ) RETURNING id INTO user_id;
    
    INSERT INTO profiles (id, email, full_name, flat_number, phone, role)
    VALUES (user_id, 'tanmay@societyhub.com', 'Tanmay Kolekar', 'B-201', '9876543203', 'admin');
  END IF;

  -- Rahul Deshmukh
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'rahul@societyhub.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'rahul@societyhub.com', crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      false, 'authenticated'
    ) RETURNING id INTO user_id;
    
    INSERT INTO profiles (id, email, full_name, flat_number, phone, role)
    VALUES (user_id, 'rahul@societyhub.com', 'Rahul Deshmukh', 'A-501', '9876543204', 'resident');
  END IF;

  -- Priya Sharma
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'priya@societyhub.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'priya@societyhub.com', crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      false, 'authenticated'
    ) RETURNING id INTO user_id;
    
    INSERT INTO profiles (id, email, full_name, flat_number, phone, role)
    VALUES (user_id, 'priya@societyhub.com', 'Priya Sharma', 'B-402', '9876543205', 'resident');
  END IF;

  -- Amit Patel
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'amit@societyhub.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'amit@societyhub.com', crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      false, 'authenticated'
    ) RETURNING id INTO user_id;
    
    INSERT INTO profiles (id, email, full_name, flat_number, phone, role)
    VALUES (user_id, 'amit@societyhub.com', 'Amit Patel', 'A-601', '9876543206', 'resident');
  END IF;

  -- Sneha Kulkarni
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sneha@societyhub.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'sneha@societyhub.com', crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      false, 'authenticated'
    ) RETURNING id INTO user_id;
    
    INSERT INTO profiles (id, email, full_name, flat_number, phone, role)
    VALUES (user_id, 'sneha@societyhub.com', 'Sneha Kulkarni', 'B-504', '9876543207', 'resident');
  END IF;

  -- Vikram Singh
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vikram@societyhub.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'vikram@societyhub.com', crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      false, 'authenticated'
    ) RETURNING id INTO user_id;
    
    INSERT INTO profiles (id, email, full_name, flat_number, phone, role)
    VALUES (user_id, 'vikram@societyhub.com', 'Vikram Singh', 'A-701', '9876543208', 'resident');
  END IF;

  RAISE NOTICE '✅ Created 8 additional users with profiles';
  RAISE NOTICE '📧 Emails: purva@, yash@, tanmay@, rahul@, priya@, amit@, sneha@, vikram@ societyhub.com';
  RAISE NOTICE '🔑 Password for all: password123';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  NOTE: This may not work on all Supabase instances due to auth restrictions';
  RAISE NOTICE '💡 Alternative: Register users manually through the app';
END $$;
