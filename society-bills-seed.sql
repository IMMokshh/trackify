-- SOCIETY BILLS SEED — Admin Panel
-- Realistic society-level expenses for Greenwood Heights CHS
-- These appear in Admin Panel > Society Bills

TRUNCATE TABLE society_bills RESTART IDENTITY CASCADE;

INSERT INTO society_bills (bill_type, vendor_name, bill_number, amount, due_date, status, notes) VALUES

-- PAID BILLS (historical)
('Electricity', 'MSEDCL - Maharashtra State Electricity', 'MSEDCL/KHR/2026/01/4471', 18500, '2026-01-15', 'paid', 'Common area electricity — January 2026'),
('Water Charges', 'CIDCO Water Supply Division', 'CIDCO/KHR/2026/01/0847', 19246, '2026-01-15', 'paid', 'Bulk water supply — January 2026'),
('Security Services', 'Shield Force Security Pvt. Ltd.', 'SSA/GH/2026/01', 60000, '2026-01-05', 'paid', 'Monthly security staff charges — January 2026'),
('Housekeeping', 'CleanPro Services', 'CP/GH/2026/01', 22000, '2026-01-05', 'paid', 'Sweeping, mopping, garbage collection — January 2026'),
('Lift AMC', 'Otis Elevator Company India Ltd.', 'OTIS/NM/2026/Q1', 53100, '2026-01-10', 'paid', 'Quarterly lift maintenance — Q1 2026 (4 lifts)'),
('Electricity', 'MSEDCL - Maharashtra State Electricity', 'MSEDCL/KHR/2026/02/4512', 17800, '2026-02-15', 'paid', 'Common area electricity — February 2026'),
('Water Charges', 'CIDCO Water Supply Division', 'CIDCO/KHR/2026/02/0891', 18900, '2026-02-15', 'paid', 'Bulk water supply — February 2026'),
('Security Services', 'Shield Force Security Pvt. Ltd.', 'SSA/GH/2026/02', 60000, '2026-02-05', 'paid', 'Monthly security staff charges — February 2026'),
('Housekeeping', 'CleanPro Services', 'CP/GH/2026/02', 22000, '2026-02-05', 'paid', 'Sweeping, mopping, garbage collection — February 2026'),
('Garden Maintenance', 'GreenThumb Landscaping', 'GT/GH/2026/02', 8500, '2026-02-20', 'paid', 'Monthly garden upkeep and replanting'),
('Pest Control', 'BugBusters Pest Management', 'BB/GH/2026/02', 12000, '2026-02-25', 'paid', 'Quarterly pest control — all wings'),
('Electricity', 'MSEDCL - Maharashtra State Electricity', 'MSEDCL/KHR/2026/03/4589', 19200, '2026-03-15', 'paid', 'Common area electricity — March 2026'),
('Water Charges', 'CIDCO Water Supply Division', 'CIDCO/KHR/2026/03/0934', 19246, '2026-03-15', 'paid', 'Bulk water supply — March 2026'),
('Security Services', 'Shield Force Security Pvt. Ltd.', 'SSA/GH/2026/03', 60000, '2026-03-05', 'paid', 'Monthly security staff charges — March 2026'),
('Housekeeping', 'CleanPro Services', 'CP/GH/2026/03', 22000, '2026-03-05', 'paid', 'Sweeping, mopping, garbage collection — March 2026'),
('CCTV Maintenance', 'SecureVision Systems', 'SV/GH/2026/03', 6500, '2026-03-20', 'paid', 'Quarterly CCTV system check and repair'),
('Fire Safety', 'Maharashtra Fire Safety Services', 'MFSS/GH/2026/03', 8000, '2026-03-25', 'paid', 'Annual fire extinguisher refill and inspection'),
('Painting', 'ColorPalette Painters', 'CP/GH/2026/03', 35000, '2026-03-30', 'paid', 'Repainting of lobby and staircase — A & B Wing'),

-- PENDING BILLS (current month — April 2026)
('Electricity', 'MSEDCL - Maharashtra State Electricity', 'MSEDCL/KHR/2026/04/4621', 18700, '2026-04-15', 'pending', 'Common area electricity — April 2026'),
('Water Charges', 'CIDCO Water Supply Division', 'CIDCO/KHR/2026/04/0978', 19246, '2026-04-15', 'pending', 'Bulk water supply — April 2026'),
('Security Services', 'Shield Force Security Pvt. Ltd.', 'SSA/GH/2026/04', 60000, '2026-04-05', 'pending', 'Monthly security staff charges — April 2026'),
('Housekeeping', 'CleanPro Services', 'CP/GH/2026/04', 22000, '2026-04-05', 'pending', 'Sweeping, mopping, garbage collection — April 2026'),
('Lift AMC', 'Otis Elevator Company India Ltd.', 'OTIS/NM/2026/Q2', 53100, '2026-04-10', 'pending', 'Quarterly lift maintenance — Q2 2026 (4 lifts)'),
('Terrace Waterproofing', 'WaterShield Contractors', 'WS/GH/2026/04', 85000, '2026-04-30', 'pending', 'Waterproofing treatment — C & D Wing terrace'),
('Garden Maintenance', 'GreenThumb Landscaping', 'GT/GH/2026/04', 8500, '2026-04-20', 'pending', 'Monthly garden upkeep — April 2026'),
('Internet — Common Areas', 'Jio Fiber Business', 'JIO/GH/2026/04', 3500, '2026-04-10', 'pending', 'Common area WiFi — lobby, gym, clubhouse');
