-- Geolocation Migration — run in Supabase SQL Editor
-- Adds location fields to the issues table

ALTER TABLE issues
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS location_description TEXT,
  ADD COLUMN IF NOT EXISTS ward_id TEXT;

-- Index for fast geo queries
CREATE INDEX IF NOT EXISTS idx_issues_lat_lng ON issues (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Index for ward-based filtering
CREATE INDEX IF NOT EXISTS idx_issues_ward_id ON issues (ward_id)
  WHERE ward_id IS NOT NULL;
