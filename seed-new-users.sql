-- ============================================================
-- SEED 3 USERS — Run in Supabase SQL Editor
-- STEP 1: Create auth users in Supabase Dashboard first
--   → Authentication → Users → Add User (with emails + passwords below)
--
--   sonarmoksh07@gmail.com       → Purva@1316
--   tanmaykolekar98098@gmail.com → Tanny@1008
--   yashwardhanjain04@gmail.com  → Yash@1223
--
-- STEP 2: Run this SQL
-- ============================================================

DO $$
DECLARE
  v_purva  UUID;
  v_tanmay UUID;
  v_yash   UUID;
BEGIN

  SELECT id INTO v_purva  FROM auth.users WHERE email = 'sonarmoksh07@gmail.com'       LIMIT 1;
  SELECT id INTO v_tanmay FROM auth.users WHERE email = 'tanmaykolekar98098@gmail.com' LIMIT 1;
  SELECT id INTO v_yash   FROM auth.users WHERE email = 'yashwardhanjain04@gmail.com'  LIMIT 1;

  -- ── PROFILES ──────────────────────────────────────────────

  IF v_purva IS NOT NULL THEN
    INSERT INTO profiles (id, email, full_name, phone, flat_number, role)
    VALUES (v_purva, 'sonarmoksh07@gmail.com', 'Purva Chavan', '9876501234', 'B-303', 'admin')
    ON CONFLICT (id) DO UPDATE SET full_name = 'Purva Chavan', flat_number = 'B-303', role = 'admin';
  END IF;

  IF v_tanmay IS NOT NULL THEN
    INSERT INTO profiles (id, email, full_name, phone, flat_number, role)
    VALUES (v_tanmay, 'tanmaykolekar98098@gmail.com', 'Tanmay Kolekar', '9876502345', 'C-704', 'resident')
    ON CONFLICT (id) DO UPDATE SET full_name = 'Tanmay Kolekar', flat_number = 'C-704';
  END IF;

  IF v_yash IS NOT NULL THEN
    INSERT INTO profiles (id, email, full_name, phone, flat_number, role)
    VALUES (v_yash, 'yashwardhanjain04@gmail.com', 'Yash Bandawane', '9876503456', 'A-302', 'resident')
    ON CONFLICT (id) DO UPDATE SET full_name = 'Yash Bandawane', flat_number = 'A-302';
  END IF;

  -- ── SOCIETY MEMBERS ───────────────────────────────────────

  DELETE FROM society_members WHERE flat_number IN ('B-303', 'C-704', 'A-302');
  DELETE FROM society_members WHERE email IN (
    'sonarmoksh07@gmail.com',
    'tanmaykolekar98098@gmail.com',
    'yashwardhanjain04@gmail.com'
  );

  INSERT INTO society_members (full_name, flat_number, phone, email, role, badge, badge_color, family_members, has_parking, parking_slot, has_pets, pets_count)
  VALUES
    ('Purva Chavan',   'B-303', '9876501234', 'sonarmoksh07@gmail.com',       'admin',    'Chairwoman', 'gold', 3, true,  'B-303-P1', false, 0),
    ('Tanmay Kolekar', 'C-704', '9876502345', 'tanmaykolekar98098@gmail.com', 'resident', 'Committee',  'blue', 2, true,  'C-704-P1', false, 0),
    ('Yash Bandawane', 'A-302', '9876503456', 'yashwardhanjain04@gmail.com',  'resident', 'Committee',  'blue', 2, false, NULL,       false, 0);

  RAISE NOTICE 'Users seeded: Purva, Tanmay, Yash';
END $$;
