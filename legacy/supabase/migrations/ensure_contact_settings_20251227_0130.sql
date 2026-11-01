-- Ensure contact settings exist in site_settings table
-- Created: 2025-12-27 01:30 UTC

-- Update existing contact settings to have correct category
UPDATE site_settings_premium_20251225
SET category = 'contact'
WHERE setting_key IN ('contact_email', 'contact_phone', 'contact_address');

-- Insert contact_email if it doesn't exist
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description)
SELECT 
  'contact_email',
  'info@greenlifeexpo.com',
  'text',
  'contact',
  'Contact Email Address'
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings_premium_20251225 WHERE setting_key = 'contact_email'
);

-- Insert contact_phone if it doesn't exist
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description)
SELECT 
  'contact_phone',
  '+20 123 456 7890',
  'text',
  'contact',
  'Contact Phone Number'
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings_premium_20251225 WHERE setting_key = 'contact_phone'
);

-- Insert contact_address if it doesn't exist
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description)
SELECT 
  'contact_address',
  'Cairo International Convention Center, El Nasr Road, Nasr City, Cairo, Egypt',
  'textarea',
  'contact',
  'Contact Address'
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings_premium_20251225 WHERE setting_key = 'contact_address'
);

-- Show the contact settings
SELECT setting_key, setting_value, category, description 
FROM site_settings_premium_20251225 
WHERE category = 'contact'
ORDER BY setting_key;