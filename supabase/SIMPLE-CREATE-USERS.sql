-- ============================================
-- SIMPLE USER CREATION FOR DIFFERENT ISSUES
-- ============================================
-- This creates users directly in Supabase Auth
-- Run this FIRST, then run COMPLETE-REALISTIC-DATA.sql

-- Create users using Supabase's admin function
-- These will be actual authenticated users

SELECT auth.uid(); -- Just to test auth schema access

-- Insert users into auth.users table
DO $$
DECLARE
  purva_id UUID;
  yash_id UUID;
  tanmay_id UUID;
  rahul_id UUID;
  priya_id UUID;
  amit_id UUID;
  sneha_id UUID;
  vikram_id UUID;
BEGIN
  -- Create Purva
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at, confirmation_sent_at,
    recovery_sent_at, email_change_token_current, email_change_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'purva@societyhub.com', crypt('password123', gen_salt('bf')),
    NOW(), '', '', '', '', '{"provider":"email","providers":["email"]}',
    '{}', NOW(), NOW(), NOW(), NOW(), '', 0
  ) RETURNING id INTO purva_id;
  
  INSERT INTO public.profiles (id, email, full_name, flat_number, phone, role)
  VALUES (purva_id, 'purva@societyhub.com', 'Purva Chavan', 'B-303', '9876543201', 'admin');

  -- Create Yash
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at, confirmation_sent_at,
    recovery_sent_at, email_change_token_current, email_change_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'yash@societyhub.com', crypt('password123', gen_salt('bf')),
    NOW(), '', '', '', '', '{"provider":"email","providers":["email"]}',
    '{}', NOW(), NOW(), NOW(), NOW(), '', 0
  ) RETURNING id INTO yash_id;
  
  INSERT INTO public.profiles (id, email, full_name, flat_number, phone, role)
  VALUES (yash_id, 'yash@societyhub.com', 'Yash Bandwane', 'A-401', '9876543202', 'admin');

  -- Create Tanmay
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at, confirmation_sent_at,
    recovery_sent_at, email_change_token_current, email_change_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'tanmay@societyhub.com', crypt('password123', gen_salt('bf')),
    NOW(), '', '', '', '', '{"provider":"email","providers":["email"]}',
    '{}', NOW(), NOW(), NOW(), NOW(), '', 0
  ) RETURNING id INTO tanmay_id;
  
  INSERT INTO public.profiles (id, email, full_name, flat_number, phone, role)
  VALUES (tanmay_id, 'tanmay@societyhub.com', 'Tanmay Kolekar', 'B-201', '9876543203', 'admin');

  -- Create Rahul
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at, confirmation_sent_at,
    recovery_sent_at, email_change_token_current, email_change_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'rahul@societyhub.com', crypt('password123', gen_salt('bf')),
    NOW(), '', '', '', '', '{"provider":"email","providers":["email"]}',
    '{}', NOW(), NOW(), NOW(), NOW(), '', 0
  ) RETURNING id INTO rahul_id;
  
  INSERT INTO public.profiles (id, email, full_name, flat_number, phone, role)
  VALUES (rahul_id, 'rahul@societyhub.com', 'Rahul Deshmukh', 'A-501', '9876543204', 'resident');

  -- Create Priya
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at, confirmation_sent_at,
    recovery_sent_at, email_change_token_current, email_change_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'priya@societyhub.com', crypt('password123', gen_salt('bf')),
    NOW(), '', '', '', '', '{"provider":"email","providers":["email"]}',
    '{}', NOW(), NOW(), NOW(), NOW(), '', 0
  ) RETURNING id INTO priya_id;
  
  INSERT INTO public.profiles (id, email, full_name, flat_number, phone, role)
  VALUES (priya_id, 'priya@societyhub.com', 'Priya Sharma', 'B-402', '9876543205', 'resident');

  -- Create Amit
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at, confirmation_sent_at,
    recovery_sent_at, email_change_token_current, email_change_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'amit@societyhub.com', crypt('password123', gen_salt('bf')),
    NOW(), '', '', '', '', '{"provider":"email","providers":["email"]}',
    '{}', NOW(), NOW(), NOW(), NOW(), '', 0
  ) RETURNING id INTO amit_id;
  
  INSERT INTO public.profiles (id, email, full_name, flat_number, phone, role)
  VALUES (amit_id, 'amit@societyhub.com', 'Amit Patel', 'A-601', '9876543206', 'resident');

  -- Create Sneha
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at, confirmation_sent_at,
    recovery_sent_at, email_change_token_current, email_change_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'sneha@societyhub.com', crypt('password123', gen_salt('bf')),
    NOW(), '', '', '', '', '{"provider":"email","providers":["email"]}',
    '{}', NOW(), NOW(), NOW(), NOW(), '', 0
  ) RETURNING id INTO sneha_id;
  
  INSERT INTO public.profiles (id, email, full_name, flat_number, phone, role)
  VALUES (sneha_id, 'sneha@societyhub.com', 'Sneha Kulkarni', 'B-504', '9876543207', 'resident');

  -- Create Vikram
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, raw_app_meta_data,
    raw_user_meta_data, created_at, updated_at, confirmation_sent_at,
    recovery_sent_at, email_change_token_current, email_change_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    'vikram@societyhub.com', crypt('password123', gen_salt('bf')),
    NOW(), '', '', '', '', '{"provider":"email","providers":["email"]}',
    '{}', NOW(), NOW(), NOW(), NOW(), '', 0
  ) RETURNING id INTO vikram_id;
  
  INSERT INTO public.profiles (id, email, full_name, flat_number, phone, role)
  VALUES (vikram_id, 'vikram@societyhub.com', 'Vikram Singh', 'A-701', '9876543208', 'resident');

  RAISE NOTICE '✅ Created 8 users successfully!';
  RAISE NOTICE '📧 Emails: purva@, yash@, tanmay@, rahul@, priya@, amit@, sneha@, vikram@ societyhub.com';
  RAISE NOTICE '🔑 Password: password123';
  RAISE NOTICE '';
  RAISE NOTICE '▶️  NEXT: Run COMPLETE-REALISTIC-DATA.sql to load data with different users';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Error: %', SQLERRM;
    RAISE NOTICE '💡 Try registering users manually through the app instead';
END $$;
