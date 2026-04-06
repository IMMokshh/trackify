-- ============================================================
-- ISSUES STATUS MIGRATION
-- Run in Supabase SQL Editor
-- ============================================================
-- 1. Add issue_id to visitor_passes (pass → issue link)
-- 2. Add Supabase DB function to auto-resolve linked issue
--    when a pass is marked used or expired
-- ============================================================

-- STEP 1: Link visitor passes to issues
ALTER TABLE visitor_passes
  ADD COLUMN IF NOT EXISTS issue_id UUID REFERENCES issues(id) ON DELETE SET NULL;

-- STEP 2: Function — when a pass status changes to 'used' or 'expired',
-- automatically set the linked issue to 'resolved'
CREATE OR REPLACE FUNCTION auto_resolve_issue_on_pass()
RETURNS TRIGGER AS $$
BEGIN
  -- Only act when status changes to 'used' or 'expired'
  IF NEW.status IN ('used', 'expired') AND OLD.status NOT IN ('used', 'expired') THEN
    IF NEW.issue_id IS NOT NULL THEN
      UPDATE issues
      SET
        status     = 'resolved',
        resolved_at = NOW(),
        updated_at  = NOW()
      WHERE id = NEW.issue_id
        AND status NOT IN ('resolved', 'closed'); -- never downgrade
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 3: Attach trigger to visitor_passes
DROP TRIGGER IF EXISTS trg_auto_resolve_issue ON visitor_passes;
CREATE TRIGGER trg_auto_resolve_issue
  AFTER UPDATE OF status ON visitor_passes
  FOR EACH ROW
  EXECUTE FUNCTION auto_resolve_issue_on_pass();

-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT 'Migration complete. visitor_passes now has issue_id column.' AS status;
