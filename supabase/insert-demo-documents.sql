-- Insert demo documents for Society Hub
-- Run this in Supabase SQL Editor

INSERT INTO documents (
  title,
  description,
  category,
  file_type,
  file_url,
  is_public,
  uploaded_by
) VALUES
(
  'Society Registration Certificate',
  'Official registration certificate from the Registrar of Societies',
  'Legal',
  'application/pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Society Bylaws 2024',
  'Complete bylaws and regulations governing the society operations',
  'Legal',
  'application/pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Annual General Meeting Minutes - 2024',
  'Minutes from the Annual General Meeting held on January 15, 2024',
  'Meeting Minutes',
  'application/pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Maintenance Guidelines',
  'Guidelines for residents regarding maintenance and common area usage',
  'Guidelines',
  'application/pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Emergency Contact List',
  'Important emergency contacts for residents including security, fire, ambulance',
  'Emergency',
  'application/pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Parking Allocation Chart',
  'Parking slot allocation for all residents with slot numbers and vehicle details',
  'Parking',
  'application/pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Amenity Booking Rules',
  'Rules and procedures for booking society amenities like clubhouse, gym, pool',
  'Guidelines',
  'application/pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Financial Report Q1 2024',
  'Quarterly financial report showing income, expenses, and balance sheet',
  'Financial',
  'application/pdf',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);

-- Verify
SELECT id, title, category, created_at FROM documents ORDER BY created_at DESC;
