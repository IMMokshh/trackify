-- Remove duplicate issues and keep only one copy of each
-- Run this in Supabase SQL Editor

-- Step 1: Check for duplicates first (optional - just to see what will be removed)
SELECT title, COUNT(*) as count
FROM issues
GROUP BY title
HAVING COUNT(*) > 1;

-- Step 2: Remove duplicates - keeps the OLDEST entry (first created) for each title
DELETE FROM issues
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) as row_num
    FROM issues
  ) t
  WHERE row_num > 1
);

-- Step 3: Verify - check if duplicates are gone
SELECT title, COUNT(*) as count
FROM issues
GROUP BY title
HAVING COUNT(*) > 1;

-- Step 4: View all remaining issues
SELECT id, title, category, priority, status, created_at
FROM issues
ORDER BY created_at DESC;
