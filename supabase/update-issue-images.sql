-- Update issue images based on title keywords
UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/intercom.jpg'
WHERE title ILIKE '%intercom%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/pool.jpg'
WHERE title ILIKE '%pool%' OR title ILIKE '%swimming%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/parkingslot.jpg'
WHERE title ILIKE '%parking%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/gym.jpg'
WHERE title ILIKE '%gym%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/cctv.jpg'
WHERE title ILIKE '%cctv%' OR title ILIKE '%camera%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/leakage.jpg'
WHERE title ILIKE '%leakage%' OR title ILIKE '%water leakage%' OR title ILIKE '%pressure%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/garbagec.jpg'
WHERE title ILIKE '%garbage%' OR title ILIKE '%waste%' OR title ILIKE '%collection%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/playground.jpg'
WHERE title ILIKE '%playground%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/elevator.jpg'
WHERE title ILIKE '%elevator%' OR title ILIKE '%lift%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/broken light.jpg'
WHERE title ILIKE '%light%' OR title ILIKE '%street light%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/staircase.jpg'
WHERE title ILIKE '%staircase%' OR title ILIKE '%stair%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/garden.jpg'
WHERE title ILIKE '%garden%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/basement.jpg'
WHERE title ILIKE '%basement%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/waterpressure.webp'
WHERE title ILIKE '%water pressure%';

UPDATE issues SET image_url = 'https://teflcmjofvgxptolvcea.supabase.co/storage/v1/object/public/issue-images/intercom.jpg'
WHERE title ILIKE '%intercom system%';
