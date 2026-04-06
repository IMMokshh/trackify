-- ============================================================
-- ISSUES FINAL SEED — Greenwood Heights CHS (SAFE VERSION)
-- ============================================================
-- SAFETY GUARANTEE:
--   - NO TRUNCATE used anywhere
--   - Issues with image_url IS NOT NULL are NEVER touched
--   - Only deletes issues where image_url IS NULL (fake/random ones)
--   - Only inserts resolved issues (active ones already exist with images)
-- ============================================================
-- TARGET STATE:
--   Active issues  → preserved from DB (image-based, untouched)
--   Resolved issues → ~175 inserted here
--   Total          → ~200
--   Resolution rate → ~87%+
-- ============================================================

-- ============================================================
-- STEP 1: ADD MISSING COLUMN (safe — does nothing if already exists)
-- ============================================================

ALTER TABLE issues ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

-- ============================================================
-- STEP 2: SAFE CLEANUP
-- Delete ONLY issues that have NO image attached.
-- This removes the 99 random/fake entries.
-- Issues with real images are completely untouched.
-- ============================================================

DELETE FROM issue_comments
WHERE issue_id IN (
  SELECT id FROM issues WHERE image_url IS NULL
);

DELETE FROM issue_votes
WHERE issue_id IN (
  SELECT id FROM issues WHERE image_url IS NULL
);

DELETE FROM issues
WHERE image_url IS NULL;

-- ============================================================
-- STEP 2: INSERT RESOLVED ISSUES (~175)
-- All have status = 'resolved' and resolved_at set.
-- None have image_url — keeping image_url reserved for active issues only.
-- ============================================================

INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- === PLUMBING (resolved) ===
('Water pressure low — 6th & 7th floor', 'Water pressure very low on upper floors. Barely enough for shower.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '60 days', NOW() - INTERVAL '55 days'),
('Tap leaking in common bathroom', 'Tap in ground floor common bathroom leaking continuously. Water wastage.', 'Plumbing', 'medium', 'resolved', NOW() - INTERVAL '58 days', NOW() - INTERVAL '54 days'),
('Drain blocked near A-Wing', 'Drain near A-Wing entrance blocked. Water stagnating after rain.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '55 days', NOW() - INTERVAL '51 days'),
('Hot water not available — A Wing', 'Solar water heater for A-Wing not functioning. No hot water in mornings.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '52 days', NOW() - INTERVAL '48 days'),
('Bathroom drain slow — B-Wing common', 'Common bathroom drain on B-Wing ground floor draining very slowly.', 'Plumbing', 'medium', 'resolved', NOW() - INTERVAL '50 days', NOW() - INTERVAL '46 days'),
('Water meter reading incorrect — B-302', 'Water meter for flat B-302 showing abnormally high reading.', 'Plumbing', 'medium', 'resolved', NOW() - INTERVAL '48 days', NOW() - INTERVAL '44 days'),
('Pipe corrosion — A-Wing riser', 'Main water riser pipe in A-Wing showing corrosion. Risk of burst.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days'),
('Water supply disruption — C Wing', 'No water supply to C-Wing flats from 6 AM to 2 PM daily.', 'Plumbing', 'critical', 'resolved', NOW() - INTERVAL '43 days', NOW() - INTERVAL '39 days'),
('Overhead tank cleaning overdue', 'Overhead tank not cleaned in 6 months. Water quality concern.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '40 days', NOW() - INTERVAL '36 days'),
('Water meter room flooding', 'Water meter room flooding during rain. Meters getting wet.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '38 days', NOW() - INTERVAL '34 days'),
('Sewage smell in B-Wing basement', 'Strong sewage smell in B-Wing basement parking area.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '36 days', NOW() - INTERVAL '32 days'),
('Pipe burst — A-Wing floor 3', 'Water pipe burst on A-Wing 3rd floor corridor. Water flooding.', 'Plumbing', 'critical', 'resolved', NOW() - INTERVAL '30 days', NOW() - INTERVAL '26 days'),
('Water leakage in A-Wing lobby', 'Water dripping from ceiling near A-Wing main entrance. Floor slippery.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '28 days', NOW() - INTERVAL '24 days'),
('Water pressure low — A Wing floors 10-14', 'Water pressure very low on upper floors of A-Wing.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '80 days', NOW() - INTERVAL '75 days'),
('Hot water not available — B Wing', 'Solar water heater for B-Wing not functioning.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '88 days', NOW() - INTERVAL '83 days'),
('Drain blocked near C-Wing', 'Drain near C-Wing entrance blocked. Water stagnating.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '104 days', NOW() - INTERVAL '99 days'),
('Water leakage — B-Wing lobby ceiling', 'Water dripping from B-Wing lobby ceiling after rain.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '120 days', NOW() - INTERVAL '115 days'),
('Hot water not available — C Wing', 'Solar water heater for C-Wing not functioning.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '98 days', NOW() - INTERVAL '93 days'),
('Seepage in A-401 bathroom wall', 'Wall seepage in bathroom causing paint to peel.', 'Plumbing', 'medium', 'resolved', NOW() - INTERVAL '71 days', NOW() - INTERVAL '66 days'),
('Water leakage — C-Wing lobby ceiling', 'Water dripping from C-Wing lobby ceiling after rain.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '130 days', NOW() - INTERVAL '125 days'),
('Seepage in C-301 bathroom wall', 'Wall seepage in bathroom causing paint to peel.', 'Plumbing', 'medium', 'resolved', NOW() - INTERVAL '70 days', NOW() - INTERVAL '65 days'),
('Water pressure low — B Wing floors 8-12', 'Water pressure very low on upper floors of B-Wing.', 'Plumbing', 'high', 'resolved', NOW() - INTERVAL '79 days', NOW() - INTERVAL '74 days');


INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- === ELECTRICAL (resolved) ===
('Corridor light flickering — C Wing floor 3', 'Light on C-Wing 3rd floor corridor flickering continuously.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '62 days', NOW() - INTERVAL '58 days'),
('Parking area light not working', 'Parking area near B-Wing completely dark at night. Safety hazard.', 'Electrical', 'high', 'resolved', NOW() - INTERVAL '59 days', NOW() - INTERVAL '55 days'),
('Electricity fluctuation — D Wing', 'Frequent voltage fluctuations in D-Wing causing appliance damage.', 'Electrical', 'critical', 'resolved', NOW() - INTERVAL '57 days', NOW() - INTERVAL '52 days'),
('Street light timer malfunction', 'Society street lights staying on all day. Electricity wastage.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '54 days', NOW() - INTERVAL '50 days'),
('Power outage — D Wing floor 9-14', 'Floors 9 to 14 in D-Wing without power for 3 hours. MCB tripping.', 'Electrical', 'critical', 'resolved', NOW() - INTERVAL '51 days', NOW() - INTERVAL '47 days'),
('Corridor fan not working — C floor 4', 'Corridor exhaust fan on C-Wing 4th floor not working. Stuffy air.', 'Electrical', 'low', 'resolved', NOW() - INTERVAL '49 days', NOW() - INTERVAL '45 days'),
('Electricity bill discrepancy', 'Common area electricity bill for last month seems unusually high.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '46 days', NOW() - INTERVAL '42 days'),
('Transformer humming loudly', 'Society transformer making loud humming noise. Residents concerned.', 'Electrical', 'high', 'resolved', NOW() - INTERVAL '44 days', NOW() - INTERVAL '40 days'),
('Electrical panel door open', 'Main electrical panel door in D-Wing basement left open. Safety hazard.', 'Electrical', 'high', 'resolved', NOW() - INTERVAL '41 days', NOW() - INTERVAL '37 days'),
('Power socket sparking — B-Wing lobby', 'Power socket in B-Wing lobby sparking when plugged. Fire risk.', 'Electrical', 'critical', 'resolved', NOW() - INTERVAL '39 days', NOW() - INTERVAL '35 days'),
('Garden lights not working', 'Garden pathway lights not working. Dark and unsafe at night.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '37 days', NOW() - INTERVAL '33 days'),
('Corridor light timer wrong — C Wing', 'Corridor lights in C-Wing turning off at 9 PM. Too early.', 'Electrical', 'low', 'resolved', NOW() - INTERVAL '35 days', NOW() - INTERVAL '31 days'),
('Broken tubelight — B staircase floor 5', 'Tubelight on 5th floor B-Wing staircase is broken. Very dark at night.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '33 days', NOW() - INTERVAL '29 days'),
('Switchboard sparking — A-Wing floor 4', 'Common area switchboard on A-Wing 4th floor sparking.', 'Electrical', 'critical', 'resolved', NOW() - INTERVAL '74 days', NOW() - INTERVAL '69 days'),
('Electricity fluctuation — A Wing', 'Frequent voltage fluctuations in A-Wing.', 'Electrical', 'critical', 'resolved', NOW() - INTERVAL '86 days', NOW() - INTERVAL '81 days'),
('Electricity fluctuation — B Wing', 'Frequent voltage fluctuations in B-Wing.', 'Electrical', 'critical', 'resolved', NOW() - INTERVAL '96 days', NOW() - INTERVAL '91 days'),
('Broken tubelight — A staircase floor 3', 'Tubelight on 3rd floor A-Wing staircase broken. Dark at night.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '116 days', NOW() - INTERVAL '111 days'),
('Broken tubelight — C staircase floor 6', 'Tubelight on 6th floor C-Wing staircase broken.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '126 days', NOW() - INTERVAL '121 days'),
('Corridor light flickering — A Wing floor 7', 'Light on A-Wing 7th floor corridor flickering.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '102 days', NOW() - INTERVAL '97 days'),
('Corridor light flickering — B Wing floor 4', 'Light on B-Wing 4th floor corridor flickering.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '112 days', NOW() - INTERVAL '107 days'),
('Street light not working — Gate 1', 'Street light near Gate 1 is out.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '76 days', NOW() - INTERVAL '71 days'),
('Street light not working — Gate 3', 'Street light near Gate 3 is out.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '86 days', NOW() - INTERVAL '81 days'),
('Switchboard sparking — B-Wing floor 3', 'Common area switchboard on B-Wing 3rd floor sparking.', 'Electrical', 'critical', 'resolved', NOW() - INTERVAL '73 days', NOW() - INTERVAL '68 days'),
('Corridor light not working — D Wing floor 2', 'Corridor light on D-Wing 2nd floor not working.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '56 days', NOW() - INTERVAL '51 days'),
('Corridor light not working — B Wing floor 6', 'Corridor light on B-Wing 6th floor not working.', 'Electrical', 'medium', 'resolved', NOW() - INTERVAL '58 days', NOW() - INTERVAL '53 days');


INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- === MAINTENANCE / LIFTS (resolved) ===
('Lift A not working', 'Lift A in Wing A stuck on 3rd floor. Residents unable to use.', 'Maintenance', 'critical', 'resolved', NOW() - INTERVAL '90 days', NOW() - INTERVAL '85 days'),
('Lift B door sensor malfunction', 'Lift B door does not close properly. Keeps reopening.', 'Maintenance', 'high', 'resolved', NOW() - INTERVAL '87 days', NOW() - INTERVAL '82 days'),
('Lift C overloaded alarm', 'Lift C overload alarm triggers even with 3 people. Needs calibration.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '84 days', NOW() - INTERVAL '79 days'),
('Lift D weight sensor issue', 'Lift D showing overload with only 4 people. Sensor needs calibration.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '81 days', NOW() - INTERVAL '76 days'),
('Lift A emergency phone not working', 'Emergency phone inside Lift A is dead. Safety concern.', 'Maintenance', 'critical', 'resolved', NOW() - INTERVAL '78 days', NOW() - INTERVAL '73 days'),
('Lift A rope inspection overdue', 'Lift A rope inspection certificate expired 2 months ago.', 'Maintenance', 'critical', 'resolved', NOW() - INTERVAL '75 days', NOW() - INTERVAL '70 days'),
('Lift button panel damaged — D Wing', 'Lift D button panel has multiple buttons not working. Floors 8-10 unreachable.', 'Maintenance', 'critical', 'resolved', NOW() - INTERVAL '72 days', NOW() - INTERVAL '67 days'),
('Lift A stuck between floors', 'Lift A stuck between 5th and 6th floor. Residents trapped briefly.', 'Maintenance', 'critical', 'resolved', NOW() - INTERVAL '118 days', NOW() - INTERVAL '113 days'),
('Lift B stuck between floors', 'Lift B stuck between 2nd and 3rd floor. Residents trapped briefly.', 'Maintenance', 'critical', 'resolved', NOW() - INTERVAL '128 days', NOW() - INTERVAL '123 days'),
('Lift indicator light broken — B Wing', 'Floor indicator display inside Lift B not working.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '29 days', NOW() - INTERVAL '25 days'),
('Elevator music system broken', 'Lift A announcement system making loud static noise.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '42 days', NOW() - INTERVAL '38 days'),
('Broken bench in garden', 'Wooden bench near garden entrance is broken. Splinters visible.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '69 days', NOW() - INTERVAL '65 days'),
('Garden sprinkler broken', 'Garden sprinkler system not working. Plants drying up.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '66 days', NOW() - INTERVAL '62 days'),
('Jogging track surface cracked', 'Jogging track surface has multiple cracks. Ankle injury risk.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '63 days', NOW() - INTERVAL '59 days'),
('Staircase handrail loose — A Wing floor 3', 'Handrail on A-Wing 3rd floor staircase is loose. Elderly residents at risk.', 'Maintenance', 'high', 'resolved', NOW() - INTERVAL '60 days', NOW() - INTERVAL '56 days'),
('Broken door closer — main entrance', 'Main entrance door closer broken. Door banging loudly.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '57 days', NOW() - INTERVAL '53 days'),
('Society notice board damaged', 'Notice board near main gate is broken. Notices falling off.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '54 days', NOW() - INTERVAL '50 days'),
('Bathroom exhaust fan broken — C-Wing', 'Common bathroom exhaust fan on C-Wing ground floor not working.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '51 days', NOW() - INTERVAL '47 days'),
('Water tank bird netting torn', 'Bird netting on overhead tank torn. Birds entering tank area.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '48 days', NOW() - INTERVAL '44 days'),
('Lift B floor gap too wide', 'Gap between Lift B and floor is too wide. Elderly residents struggling.', 'Maintenance', 'high', 'resolved', NOW() - INTERVAL '45 days', NOW() - INTERVAL '41 days'),
('Intercom not working — A-501', 'Intercom in flat A-501 has been dead for a week.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '43 days', NOW() - INTERVAL '39 days'),
('Terrace waterproofing — A Wing', 'Terrace of A-Wing showing cracks. Water seeping into top floor.', 'Maintenance', 'high', 'resolved', NOW() - INTERVAL '78 days', NOW() - INTERVAL '73 days'),
('Terrace waterproofing — C Wing', 'Terrace of C-Wing showing cracks. Water seeping into top floor.', 'Maintenance', 'high', 'resolved', NOW() - INTERVAL '88 days', NOW() - INTERVAL '83 days'),
('Broken window grill — A-Wing staircase', 'Window grill on A-Wing staircase floor 3 is broken. Safety risk.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '68 days', NOW() - INTERVAL '63 days'),
('Broken window grill — C-Wing floor 4', 'Window grill on C-Wing 4th floor broken.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '94 days', NOW() - INTERVAL '89 days'),
('Broken window grill — D-Wing floor 2', 'Window grill on D-Wing 2nd floor broken.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '94 days', NOW() - INTERVAL '89 days'),
('Broken tiles in lobby — B Wing', 'Floor tiles near B-Wing lift lobby cracked and broken. Tripping hazard.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '77 days', NOW() - INTERVAL '72 days'),
('Broken tiles in lobby — C Wing', 'Floor tiles near C-Wing lift lobby cracked. Tripping hazard.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '76 days', NOW() - INTERVAL '71 days'),
('Intercom not working — B-301', 'Intercom in flat B-301 has been dead for a week.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '80 days', NOW() - INTERVAL '75 days'),
('Intercom not working — C-401', 'Intercom in flat C-401 has been dead for a week.', 'Maintenance', 'medium', 'resolved', NOW() - INTERVAL '90 days', NOW() - INTERVAL '85 days'),
('Meter room door broken', 'Electricity meter room door lock broken. Unauthorized access possible.', 'Security', 'high', 'resolved', NOW() - INTERVAL '31 days', NOW() - INTERVAL '27 days'),
('Broken bench — B-Wing garden', 'Bench near B-Wing garden broken.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '53 days', NOW() - INTERVAL '48 days'),
('Broken bench — C-Wing garden', 'Bench near C-Wing garden broken. Needs replacement.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '55 days', NOW() - INTERVAL '50 days'),
('Broken bench — main entrance', 'Bench near main entrance broken. Needs replacement.', 'Maintenance', 'low', 'resolved', NOW() - INTERVAL '100 days', NOW() - INTERVAL '95 days');


INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- === SECURITY (resolved) ===
('Side gate lock broken', 'Side entrance gate lock is broken. Gate stays open all night.', 'Security', 'high', 'resolved', NOW() - INTERVAL '95 days', NOW() - INTERVAL '90 days'),
('CCTV offline at main gate', 'Main gate CCTV camera showing blank screen since yesterday.', 'Security', 'high', 'resolved', NOW() - INTERVAL '92 days', NOW() - INTERVAL '87 days'),
('Terrace door left unlocked', 'Terrace access door on C-Wing is left unlocked. Security risk.', 'Security', 'medium', 'resolved', NOW() - INTERVAL '89 days', NOW() - INTERVAL '84 days'),
('Intercom panel damaged — main gate', 'Main gate intercom panel buttons not responding.', 'Security', 'high', 'resolved', NOW() - INTERVAL '86 days', NOW() - INTERVAL '81 days'),
('Stray dogs near main gate', 'Pack of stray dogs near main gate. Residents afraid to enter at night.', 'Security', 'high', 'resolved', NOW() - INTERVAL '83 days', NOW() - INTERVAL '78 days'),
('Fire extinguisher missing — D floor 7', 'Fire extinguisher on D-Wing 7th floor is missing from its bracket.', 'Security', 'critical', 'resolved', NOW() - INTERVAL '80 days', NOW() - INTERVAL '75 days'),
('Security guard sleeping on duty', 'Night guard at main gate found sleeping at 2 AM. Security concern.', 'Security', 'high', 'resolved', NOW() - INTERVAL '77 days', NOW() - INTERVAL '72 days'),
('Visitor log not maintained', 'Security guard not maintaining visitor log book properly.', 'Security', 'medium', 'resolved', NOW() - INTERVAL '74 days', NOW() - INTERVAL '70 days'),
('Guard not checking visitor ID', 'Security guard allowing visitors without ID verification.', 'Security', 'high', 'resolved', NOW() - INTERVAL '71 days', NOW() - INTERVAL '67 days'),
('Unauthorized banner on society wall', 'Political banner pasted on society boundary wall without permission.', 'Security', 'low', 'resolved', NOW() - INTERVAL '68 days', NOW() - INTERVAL '64 days'),
('CCTV footage request — parking incident', 'Resident requesting CCTV footage of parking area from last month.', 'Security', 'medium', 'resolved', NOW() - INTERVAL '65 days', NOW() - INTERVAL '61 days'),
('CCTV offline — B-Wing entrance', 'B-Wing entrance CCTV camera offline for 3 days.', 'Security', 'high', 'resolved', NOW() - INTERVAL '112 days', NOW() - INTERVAL '107 days'),
('CCTV offline — C-Wing entrance', 'C-Wing entrance CCTV camera offline for 2 days.', 'Security', 'high', 'resolved', NOW() - INTERVAL '122 days', NOW() - INTERVAL '117 days'),
('Side gate CCTV not working', 'Side gate CCTV camera not recording.', 'Security', 'high', 'resolved', NOW() - INTERVAL '96 days', NOW() - INTERVAL '91 days'),
('Main gate CCTV angle misaligned', 'Main gate CCTV camera angle not covering full entrance.', 'Security', 'medium', 'resolved', NOW() - INTERVAL '106 days', NOW() - INTERVAL '101 days'),
('Terrace door left unlocked — A Wing', 'Terrace access door on A-Wing is left unlocked.', 'Security', 'medium', 'resolved', NOW() - INTERVAL '62 days', NOW() - INTERVAL '57 days'),
('Terrace door left unlocked — B Wing', 'Terrace access door on B-Wing is left unlocked.', 'Security', 'medium', 'resolved', NOW() - INTERVAL '64 days', NOW() - INTERVAL '59 days'),
('Stray dogs near side gate', 'Stray dogs near side gate. Residents afraid.', 'Security', 'high', 'resolved', NOW() - INTERVAL '74 days', NOW() - INTERVAL '69 days'),
('Stray dogs near main entrance', 'Stray dogs near main entrance. Residents afraid.', 'Security', 'high', 'resolved', NOW() - INTERVAL '84 days', NOW() - INTERVAL '79 days');


INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- === HOUSEKEEPING (resolved) ===
('Garbage overflow near C-Wing', 'Garbage bins near C-Wing entrance overflowing. Not collected in 2 days.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '62 days', NOW() - INTERVAL '58 days'),
('Rats in garbage room', 'Rats spotted in garbage collection room near B-Wing. Health hazard.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '59 days', NOW() - INTERVAL '55 days'),
('Pest control needed — D Wing', 'Cockroach infestation reported in multiple D-Wing flats.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '56 days', NOW() - INTERVAL '52 days'),
('Garbage chute blocked — B Wing', 'Garbage chute on B-Wing floors 4-6 is blocked. Residents unable to dispose waste.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '53 days', NOW() - INTERVAL '49 days'),
('Garbage collection timing issue', 'Garbage collected at 5 AM. Residents unable to put out bins in time.', 'Housekeeping', 'medium', 'resolved', NOW() - INTERVAL '50 days', NOW() - INTERVAL '46 days'),
('Garbage bin lids missing', 'Lids of garbage bins near C-Wing missing. Smell and flies.', 'Housekeeping', 'medium', 'resolved', NOW() - INTERVAL '47 days', NOW() - INTERVAL '43 days'),
('Pest control chemicals smell', 'Strong chemical smell after pest control in B-Wing. Residents feeling unwell.', 'Housekeeping', 'medium', 'resolved', NOW() - INTERVAL '44 days', NOW() - INTERVAL '40 days'),
('Dust from renovation — D-Wing', 'Renovation in D-501 creating excessive dust in corridor.', 'Housekeeping', 'medium', 'resolved', NOW() - INTERVAL '41 days', NOW() - INTERVAL '37 days'),
('Renovation dust affecting asthma patients', 'Renovation in C-Wing creating dust. Resident with asthma severely affected.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '38 days', NOW() - INTERVAL '34 days'),
('Mosquito breeding in water tank area', 'Stagnant water near overhead tank area. Mosquito breeding observed.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '34 days', NOW() - INTERVAL '30 days'),
('Garbage overflow near A-Wing', 'Garbage bins near A-Wing entrance overflowing.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '114 days', NOW() - INTERVAL '109 days'),
('Garbage overflow near B-Wing', 'Garbage bins near B-Wing entrance overflowing.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '124 days', NOW() - INTERVAL '119 days'),
('Pest control needed — B Wing', 'Cockroach infestation reported in B-Wing flats.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '98 days', NOW() - INTERVAL '93 days'),
('Pest control needed — C Wing', 'Cockroach infestation reported in C-Wing flats.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '108 days', NOW() - INTERVAL '103 days'),
('Pest infestation in A-Wing basement', 'Cockroaches spotted in A-Wing basement storage area.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '65 days', NOW() - INTERVAL '60 days'),
('Pest infestation in B-Wing basement', 'Cockroaches spotted in B-Wing basement storage area.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '67 days', NOW() - INTERVAL '62 days'),
('Garbage chute blocked — C Wing', 'Garbage chute on C-Wing floors 3-5 is blocked.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '82 days', NOW() - INTERVAL '77 days'),
('Garbage chute blocked — D Wing', 'Garbage chute on D-Wing floors 2-4 is blocked.', 'Housekeeping', 'high', 'resolved', NOW() - INTERVAL '92 days', NOW() - INTERVAL '87 days');


INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- === AMENITIES (resolved) ===
('Badminton court net torn', 'Badminton court net is torn and unusable.', 'Amenities', 'low', 'resolved', NOW() - INTERVAL '100 days', NOW() - INTERVAL '95 days'),
('Table tennis table damaged', 'Table tennis table surface cracked. Cannot be used.', 'Amenities', 'low', 'resolved', NOW() - INTERVAL '97 days', NOW() - INTERVAL '92 days'),
('Pool pump not working', 'Swimming pool pump has stopped. Water not circulating.', 'Amenities', 'high', 'resolved', NOW() - INTERVAL '94 days', NOW() - INTERVAL '89 days'),
('Gym water dispenser empty', 'Water dispenser in gym empty for 3 days. No drinking water available.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '91 days', NOW() - INTERVAL '86 days'),
('Gym locker broken', 'Locker number 4 in gym changing room is broken. Cannot be locked.', 'Amenities', 'low', 'resolved', NOW() - INTERVAL '88 days', NOW() - INTERVAL '83 days'),
('Pool changing room lock broken', 'Changing room lock near pool broken. No privacy.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '85 days', NOW() - INTERVAL '80 days'),
('Clubhouse booking system confusion', 'Multiple residents booked clubhouse for same slot. Needs admin resolution.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '82 days', NOW() - INTERVAL '77 days'),
('Clubhouse chairs damaged', 'Several chairs in clubhouse have broken legs. Replacement needed.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '79 days', NOW() - INTERVAL '74 days'),
('Broken bench — kids play area', 'Bench near kids play area broken. Parents have no place to sit.', 'Amenities', 'low', 'resolved', NOW() - INTERVAL '76 days', NOW() - INTERVAL '71 days'),
('Gym treadmill belt torn', 'Treadmill belt in gym is torn and cannot be used safely.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '83 days', NOW() - INTERVAL '78 days'),
('Gym mirror cracked', 'Large mirror in gym has a crack running across it. Safety hazard.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '39 days', NOW() - INTERVAL '35 days'),
('Gym AC not cooling', 'Air conditioner in gym not cooling. Temperature unbearable during workouts.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '36 days', NOW() - INTERVAL '32 days'),
('Clubhouse AC leaking water', 'AC unit in clubhouse dripping water onto floor. Slipping hazard.', 'Amenities', 'high', 'resolved', NOW() - INTERVAL '33 days', NOW() - INTERVAL '29 days'),
('Gym treadmill 2 not working', 'Second treadmill in gym stopped working.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '110 days', NOW() - INTERVAL '105 days'),
('Gym rowing machine broken', 'Rowing machine in gym not working properly.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '120 days', NOW() - INTERVAL '115 days'),
('Gym cycle broken', 'Stationary cycle in gym not working.', 'Amenities', 'low', 'resolved', NOW() - INTERVAL '72 days', NOW() - INTERVAL '67 days'),
('Gym elliptical machine broken', 'Elliptical machine in gym not working.', 'Amenities', 'low', 'resolved', NOW() - INTERVAL '82 days', NOW() - INTERVAL '77 days'),
('Pool water pH imbalance', 'Pool water pH level too high. Chemical treatment needed.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '94 days', NOW() - INTERVAL '89 days'),
('Pool filter cleaning overdue', 'Pool filter not cleaned in 2 months. Water quality affected.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '104 days', NOW() - INTERVAL '99 days'),
('Clubhouse projector not working', 'Projector in clubhouse not working. Events affected.', 'Amenities', 'medium', 'resolved', NOW() - INTERVAL '61 days', NOW() - INTERVAL '56 days');


INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- === NOISE (resolved) ===
('Loud music from C-302 after midnight', 'Resident in C-302 plays loud music after 12 AM regularly.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '73 days', NOW() - INTERVAL '68 days'),
('Loud generator noise at night', 'Backup generator running loudly between 11 PM and 2 AM.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '70 days', NOW() - INTERVAL '65 days'),
('Noise from construction — B-Wing', 'Renovation work in B-403 creating excessive noise from 7 AM.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '67 days', NOW() - INTERVAL '62 days'),
('Party noise from terrace — weekend', 'Loud party on terrace every Saturday night till 2 AM.', 'Noise', 'high', 'resolved', NOW() - INTERVAL '64 days', NOW() - INTERVAL '59 days'),
('Dog barking complaint — A-201', 'Resident in A-201 has dog that barks continuously from 6-8 AM.', 'Noise', 'low', 'resolved', NOW() - INTERVAL '61 days', NOW() - INTERVAL '57 days'),
('Renovation noise before 8 AM', 'Flat D-302 doing renovation work starting at 6:30 AM. Violating society rules.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '58 days', NOW() - INTERVAL '54 days'),
('Noise from water pump at night', 'Water pump running loudly between 11 PM and 1 AM.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '55 days', NOW() - INTERVAL '51 days'),
('Loud TV from A-601 late night', 'Resident in A-601 watches TV at very high volume after 11 PM.', 'Noise', 'low', 'resolved', NOW() - INTERVAL '52 days', NOW() - INTERVAL '48 days'),
('Loud argument in common area', 'Residents having loud arguments in common area near B-Wing entrance.', 'Noise', 'low', 'resolved', NOW() - INTERVAL '49 days', NOW() - INTERVAL '45 days'),
('Drilling noise from D-401', 'Drilling work in D-401 from 8 AM to 6 PM daily for 2 weeks.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '46 days', NOW() - INTERVAL '42 days'),
('Loud music from B-504 late night', 'Resident in B-504 plays loud music after 11 PM.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '108 days', NOW() - INTERVAL '103 days'),
('Loud music from D-201 late night', 'Resident in D-201 plays loud music after 11 PM.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '118 days', NOW() - INTERVAL '113 days'),
('Renovation noise — A-Wing floor 5', 'Renovation work in A-502 creating excessive noise.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '92 days', NOW() - INTERVAL '87 days'),
('Renovation noise — B-Wing floor 3', 'Renovation work in B-302 creating excessive noise.', 'Noise', 'medium', 'resolved', NOW() - INTERVAL '102 days', NOW() - INTERVAL '97 days');


INSERT INTO issues (title, description, category, priority, status, created_at, resolved_at) VALUES

-- === PARKING (resolved) ===
('Visitor parking misuse', 'Resident vehicles parked in visitor slots V-01 and V-02 for 4 days.', 'Parking', 'low', 'resolved', NOW() - INTERVAL '110 days', NOW() - INTERVAL '105 days'),
('Parking slot marking faded — A Wing', 'Parking slot numbers in A-Wing area completely faded. Causing confusion.', 'Parking', 'low', 'resolved', NOW() - INTERVAL '107 days', NOW() - INTERVAL '102 days'),
('Bike parking area flooded', 'Two-wheeler parking area flooded after rain. Bikes getting damaged.', 'Parking', 'high', 'resolved', NOW() - INTERVAL '104 days', NOW() - INTERVAL '99 days'),
('Double parking blocking exit', 'Vehicle double-parked near exit blocking other residents from leaving.', 'Parking', 'high', 'resolved', NOW() - INTERVAL '101 days', NOW() - INTERVAL '96 days'),
('Parking slot paint faded — B Wing', 'Parking slot numbers in B-Wing area faded. Causing disputes.', 'Parking', 'low', 'resolved', NOW() - INTERVAL '98 days', NOW() - INTERVAL '93 days'),
('Visitor parking time limit violation', 'Same vehicle in visitor parking for 3 days. No action taken.', 'Parking', 'medium', 'resolved', NOW() - INTERVAL '95 days', NOW() - INTERVAL '90 days'),
('Bike stand full — no space', 'Two-wheeler parking stand completely full. New residents have no space.', 'Parking', 'medium', 'resolved', NOW() - INTERVAL '92 days', NOW() - INTERVAL '87 days'),
('Parking slot dispute — A-07 and A-08', 'Two residents claiming same parking slot. Needs admin resolution.', 'Parking', 'medium', 'resolved', NOW() - INTERVAL '89 days', NOW() - INTERVAL '84 days'),
('Unauthorized parking — fire exit', 'Vehicle parked blocking fire exit near D-Wing. Emergency access blocked.', 'Parking', 'critical', 'resolved', NOW() - INTERVAL '86 days', NOW() - INTERVAL '81 days'),
('Double parking — B-Wing exit', 'Vehicle double-parked near B-Wing exit blocking residents.', 'Parking', 'high', 'resolved', NOW() - INTERVAL '90 days', NOW() - INTERVAL '85 days'),
('Double parking — C-Wing exit', 'Vehicle double-parked near C-Wing exit blocking residents.', 'Parking', 'high', 'resolved', NOW() - INTERVAL '100 days', NOW() - INTERVAL '95 days'),
('Visitor parking misuse — Gate 2', 'Resident vehicles parked in visitor slots near Gate 2.', 'Parking', 'low', 'resolved', NOW() - INTERVAL '106 days', NOW() - INTERVAL '101 days'),
('Visitor parking misuse — B Wing', 'Resident vehicles parked in visitor slots near B-Wing.', 'Parking', 'low', 'resolved', NOW() - INTERVAL '116 days', NOW() - INTERVAL '111 days'),
('Visitor parking misuse — C Wing', 'Resident vehicles parked in visitor slots near C-Wing.', 'Parking', 'low', 'resolved', NOW() - INTERVAL '52 days', NOW() - INTERVAL '47 days');


-- ============================================================
-- STEP 3: VERIFICATION QUERY
-- Run this immediately after the inserts to confirm counts.
-- ============================================================

SELECT
  COUNT(*)                                                        AS total_issues,
  COUNT(*) FILTER (WHERE status = 'resolved')                    AS resolved_issues,
  COUNT(*) FILTER (WHERE status IN ('open', 'in_progress'))      AS active_issues,
  COUNT(*) FILTER (WHERE image_url IS NOT NULL)                  AS issues_with_images,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'resolved')::numeric
    / NULLIF(COUNT(*), 0) * 100, 1
  )                                                               AS resolution_rate_percent
FROM issues;

-- ============================================================
-- EXPECTED RESULTS (approximate — depends on how many
-- image-based issues already exist in your DB):
--
--   total_issues         → ~175 + (your existing image issues)
--   resolved_issues      → ~175
--   active_issues        → your existing image-based issues only
--   issues_with_images   → your existing image-based issues only
--   resolution_rate      → 85%+
--
-- The analytics dashboard reads these values live —
-- no code changes needed.
-- ============================================================
