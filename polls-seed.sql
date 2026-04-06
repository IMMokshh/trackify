-- POLLS SEED — 20+ polls with realistic society data
-- Run in Supabase SQL Editor

DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM profiles LIMIT 1;
  END IF;

  INSERT INTO polls (question, options, anonymous, expires_at, created_by) VALUES
  ('Should we upgrade the gym equipment?', ARRAY['Yes, immediately', 'Yes, but next quarter', 'No, current is fine', 'Need more info'], false, NOW() + INTERVAL '30 days', v_admin_id),
  ('What time should the swimming pool close on weekdays?', ARRAY['8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'], false, NOW() + INTERVAL '14 days', v_admin_id),
  ('Should we allow pets in the common garden area?', ARRAY['Yes, all pets', 'Yes, only small pets', 'No pets allowed', 'Designated pet zone only'], false, NOW() + INTERVAL '21 days', v_admin_id),
  ('How should we use the society surplus fund?', ARRAY['CCTV upgrade', 'Garden renovation', 'Children play area', 'Parking expansion'], false, NOW() + INTERVAL '10 days', v_admin_id),
  ('Should we hire a full-time security guard for night shift?', ARRAY['Yes, definitely', 'Yes, on trial basis', 'No, current is enough', 'Use CCTV instead'], false, NOW() + INTERVAL '7 days', v_admin_id),
  ('Preferred day for monthly society meeting?', ARRAY['First Sunday', 'Second Sunday', 'Last Sunday', 'Any weekday evening'], false, NOW() + INTERVAL '5 days', v_admin_id),
  ('Should we install solar panels on the terrace?', ARRAY['Yes, full installation', 'Yes, partial', 'No', 'Need cost analysis first'], false, NOW() + INTERVAL '45 days', v_admin_id),
  ('Should we ban single-use plastic in the society premises?', ARRAY['Yes, complete ban', 'Yes, with 3-month notice', 'No', 'Only in common areas'], true, NOW() + INTERVAL '20 days', v_admin_id),
  ('How often should the society newsletter be published?', ARRAY['Weekly', 'Bi-weekly', 'Monthly', 'Only for important updates'], false, NOW() + INTERVAL '15 days', v_admin_id),
  ('Should we add a co-working space in the clubhouse?', ARRAY['Yes, great idea', 'Yes, if cost is shared', 'No, not needed', 'Convert existing room'], false, NOW() + INTERVAL '30 days', v_admin_id),
  ('Should we increase maintenance charges for 2026-27?', ARRAY['Yes, by 5%', 'Yes, by 10%', 'No increase', 'Reduce charges'], false, NOW() + INTERVAL '25 days', v_admin_id),
  ('Should we organize a Diwali celebration this year?', ARRAY['Yes, grand event', 'Yes, small gathering', 'No', 'Online event only'], false, NOW() + INTERVAL '60 days', v_admin_id),
  ('Should we install EV charging stations in the parking?', ARRAY['Yes, immediately', 'Yes, in 6 months', 'No', 'Only if residents fund it'], false, NOW() + INTERVAL '40 days', v_admin_id),
  ('Should we allow Airbnb/short-term rentals in the society?', ARRAY['Yes, allowed', 'No, strictly prohibited', 'Only with committee approval', 'Need policy first'], true, NOW() + INTERVAL '30 days', v_admin_id),
  ('What should be the guest parking time limit?', ARRAY['2 hours', '4 hours', '8 hours', 'No limit'], false, NOW() + INTERVAL '10 days', v_admin_id),
  ('Should we add a rooftop garden/terrace lounge?', ARRAY['Yes, love it', 'Yes, if budget allows', 'No', 'Convert to solar instead'], false, NOW() + INTERVAL '35 days', v_admin_id),
  ('Should we start a society WhatsApp group for emergencies only?', ARRAY['Yes, emergencies only', 'Yes, general use too', 'Already have one', 'No, use the app'], false, NOW() + INTERVAL '5 days', v_admin_id),
  ('Should we install water purifiers in common areas?', ARRAY['Yes, all floors', 'Yes, ground floor only', 'No', 'Already sufficient'], false, NOW() + INTERVAL '20 days', v_admin_id),
  ('Should we organize monthly fitness classes in the gym?', ARRAY['Yes, yoga', 'Yes, Zumba/aerobics', 'Yes, both', 'No, not interested'], false, NOW() + INTERVAL '15 days', v_admin_id),
  ('Should we allow food delivery bikes inside the society?', ARRAY['Yes, up to lobby', 'Yes, up to building entrance', 'No, gate delivery only', 'Designated delivery zone'], false, NOW() + INTERVAL '7 days', v_admin_id),
  ('Should we upgrade the intercom system to video calling?', ARRAY['Yes, all flats', 'Yes, only main gate', 'No, current is fine', 'Use mobile app instead'], false, NOW() + INTERVAL '50 days', v_admin_id),
  ('Should we have a dedicated children play area with supervision?', ARRAY['Yes, with paid supervisor', 'Yes, volunteer-based', 'No, current park is enough', 'Need safety audit first'], false, NOW() + INTERVAL '25 days', v_admin_id);

  -- Add some votes to make polls look active
  INSERT INTO poll_votes (poll_id, user_id, option)
  SELECT p.id, v_admin_id, p.options[1]
  FROM polls p
  WHERE p.created_by = v_admin_id
  ON CONFLICT (poll_id, user_id) DO NOTHING;

  RAISE NOTICE 'Polls seeded successfully: 22 polls created';
END $$;
