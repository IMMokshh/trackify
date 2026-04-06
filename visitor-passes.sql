-- ============================================================
-- Visitor Pre-approval / Gate Pass
-- Production-grade schema with enums, constraints, RLS
-- ============================================================

-- Enum: purpose of visit
CREATE TYPE visitor_purpose AS ENUM (
  'Guest',
  'Delivery',
  'Service',
  'Cab',
  'Other'
);

-- Enum: pass lifecycle status
CREATE TYPE visitor_status AS ENUM (
  'active',
  'used',
  'expired',
  'cancelled'
);

-- ============================================================
-- Main Table
-- ============================================================
CREATE TABLE visitor_passes (
  id            UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id   UUID             NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  flat_number   TEXT             NOT NULL,
  visitor_name  TEXT             NOT NULL CHECK (char_length(visitor_name) >= 2),
  visitor_phone TEXT             CHECK (visitor_phone ~ '^[0-9]{10}$'),
  purpose       visitor_purpose  NOT NULL DEFAULT 'Guest',
  otp           TEXT             NOT NULL CHECK (otp ~ '^[0-9]{6}$'),
  valid_from    TIMESTAMPTZ      NOT NULL DEFAULT now(),
  valid_until   TIMESTAMPTZ      NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  status        visitor_status   NOT NULL DEFAULT 'active',
  entry_time    TIMESTAMPTZ,
  guard_note    TEXT,
  created_at    TIMESTAMPTZ      NOT NULL DEFAULT now(),

  -- OTP must be unique among active passes only (partial unique index below)
  -- valid_until must be after valid_from
  CONSTRAINT valid_time_range CHECK (valid_until > valid_from)
);

-- ============================================================
-- Indexes
-- ============================================================

-- Fast OTP lookup at gate (most critical query)
CREATE UNIQUE INDEX idx_visitor_passes_otp_active
  ON visitor_passes (otp)
  WHERE status = 'active';

-- Resident fetching their own passes
CREATE INDEX idx_visitor_passes_resident
  ON visitor_passes (resident_id, created_at DESC);

-- Admin log view (by flat)
CREATE INDEX idx_visitor_passes_flat
  ON visitor_passes (flat_number, created_at DESC);

-- ============================================================
-- Auto-expire: handled lazily in the API
-- When fetching passes, the API runs:
--   UPDATE visitor_passes SET status = 'expired'
--   WHERE status = 'active' AND valid_until < now()
-- No pg_cron needed.
-- ============================================================

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE visitor_passes ENABLE ROW LEVEL SECURITY;

-- 1. Resident: full access to their own passes only
CREATE POLICY "resident_own_passes"
  ON visitor_passes
  FOR ALL
  TO authenticated
  USING (resident_id = auth.uid())
  WITH CHECK (resident_id = auth.uid());

-- 2. Guard portal: can read active passes by OTP (service role via API)
--    Guard never hits Supabase directly - goes through /api/visitors/verify-otp
--    which uses the service role key server-side. No extra RLS needed for guard.

-- 3. Admin: full read access to all passes
CREATE POLICY "admin_read_all_passes"
  ON visitor_passes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM society_members
      WHERE email = auth.jwt() ->> 'email'
        AND badge IN ('Chairwoman', 'Secretary', 'Committee')
    )
  );

-- Admin can also update status (e.g. cancel a pass)
CREATE POLICY "admin_update_passes"
  ON visitor_passes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM society_members
      WHERE email = auth.jwt() ->> 'email'
        AND badge IN ('Chairwoman', 'Secretary', 'Committee')
    )
  );
