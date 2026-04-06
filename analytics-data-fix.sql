-- ============================================================
-- ANALYTICS DATA FIX — Greenwood Heights CHS
-- Fix payment completion rate to ~80%
-- Members already at 56 — no changes needed there
-- Run in Supabase SQL Editor
-- ============================================================

-- Mark payments older than 15 days as paid
UPDATE payments
SET
  status    = 'paid',
  paid_date = (due_date + INTERVAL '3 days')::DATE
WHERE status = 'pending'
  AND due_date < CURRENT_DATE - INTERVAL '15 days';

-- Mark a portion of remaining pending payments as paid
-- to push overall rate to ~80%
UPDATE payments
SET
  status    = 'paid',
  paid_date = (due_date + INTERVAL '2 days')::DATE
WHERE status = 'pending'
  AND id IN (
    SELECT id FROM payments
    WHERE status = 'pending'
    ORDER BY due_date ASC
    LIMIT 20
  );

-- ============================================================
-- VERIFY
-- ============================================================
SELECT
  COUNT(*)                                                        AS total_payments,
  COUNT(*) FILTER (WHERE status = 'paid')                        AS paid_payments,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'paid')::numeric
    / NULLIF(COUNT(*), 0) * 100, 1
  )                                                               AS payment_rate_percent
FROM payments;

SELECT COUNT(*) AS total_members FROM society_members;
