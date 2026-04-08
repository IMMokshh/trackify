-- ============================================================
-- VISITOR PASSES V2 — Entry/Exit Tracking Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add new status values to the enum
ALTER TYPE visitor_status ADD VALUE IF NOT EXISTS 'inside';
ALTER TYPE visitor_status ADD VALUE IF NOT EXISTS 'exited';

-- 2. Add exit OTP and tracking columns
ALTER TABLE visitor_passes
  ADD COLUMN IF NOT EXISTS exit_otp TEXT CHECK (exit_otp ~ '^[0-9]{6}$'),
  ADD COLUMN IF NOT EXISTS exit_otp_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS exit_time TIMESTAMPTZ;

-- 3. Index for fast exit OTP lookup
CREATE INDEX IF NOT EXISTS idx_visitor_passes_exit_otp
  ON visitor_passes (exit_otp)
  WHERE exit_otp IS NOT NULL AND status = 'inside';

-- 4. Index for reports page (date range queries)
CREATE INDEX IF NOT EXISTS idx_visitor_passes_created_at
  ON visitor_passes (created_at DESC);
