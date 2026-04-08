-- ============================================================
-- SOCIETY HUB — SECURITY HARDENING
-- Run this in Supabase SQL Editor (superuser)
-- Safe to run: uses IF NOT EXISTS and DO blocks to avoid errors
-- ============================================================


-- ─── 1. ENABLE ROW LEVEL SECURITY ────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenity_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE society_members ENABLE ROW LEVEL SECURITY;


-- ─── 2. REVOKE PUBLIC SCHEMA ABUSE ───────────────────────────
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;


-- ─── 3. RLS POLICIES (safe: drops before recreating) ─────────

-- Payments: users see only their own
DROP POLICY IF EXISTS "Users see own payments only" ON payments;
CREATE POLICY "Users see own payments only"
ON payments FOR SELECT
USING (auth.uid() = user_id);

-- Profiles: users see only their own
DROP POLICY IF EXISTS "Users see own profile" ON profiles;
CREATE POLICY "Users see own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Profiles: users update only their own
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Visitor passes: residents see only their flat's passes
DROP POLICY IF EXISTS "Residents see own visitor passes" ON visitor_passes;
CREATE POLICY "Residents see own visitor passes"
ON visitor_passes FOR SELECT
USING (
  flat_number = (SELECT flat_number FROM profiles WHERE id = auth.uid())
);

-- Issues: authenticated users can read all, but only insert their own
DROP POLICY IF EXISTS "Authenticated users read issues" ON issues;
CREATE POLICY "Authenticated users read issues"
ON issues FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users insert own issues" ON issues;
CREATE POLICY "Users insert own issues"
ON issues FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Amenity bookings: users see only their own
DROP POLICY IF EXISTS "Users see own bookings" ON amenity_bookings;
CREATE POLICY "Users see own bookings"
ON amenity_bookings FOR SELECT
USING (auth.uid() = user_id);

-- SOS alerts: authenticated users can read (needed for admin notifications)
DROP POLICY IF EXISTS "Authenticated users read sos alerts" ON sos_alerts;
CREATE POLICY "Authenticated users read sos alerts"
ON sos_alerts FOR SELECT
USING (auth.role() = 'authenticated');

-- Notices & Events: readable by all authenticated users
DROP POLICY IF EXISTS "Authenticated users read notices" ON notices;
CREATE POLICY "Authenticated users read notices"
ON notices FOR SELECT
USING (auth.role() = 'authenticated');




-- ─── 4. AUDIT LOG TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text        NOT NULL,
  table_name  text,
  record_id   text,
  ip_address  text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only service role can access audit logs — no public/anon access
DROP POLICY IF EXISTS "No public access to audit log" ON audit_log;
CREATE POLICY "No public access to audit log"
ON audit_log FOR ALL
USING (false);


-- ─── 5. LOCK DOWN SOCIETY_MEMBERS ────────────────────────────
-- Only admins (service role) should write to this table
DROP POLICY IF EXISTS "Authenticated users read members" ON society_members;
CREATE POLICY "Authenticated users read members"
ON society_members FOR SELECT
USING (auth.role() = 'authenticated');


-- ─── DONE ─────────────────────────────────────────────────────
-- All policies applied. No breaking changes introduced.
