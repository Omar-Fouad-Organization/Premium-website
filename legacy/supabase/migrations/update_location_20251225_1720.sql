-- Update Event Location to Cairo International Exhibition Center
-- Created: 2025-12-25 17:20 UTC

-- Update event location in site settings
UPDATE site_settings_premium_20251225
SET setting_value = 'Cairo International Exhibition Center'
WHERE setting_key = 'event_location';

-- Update contact address to match
UPDATE site_settings_premium_20251225
SET setting_value = 'Cairo International Exhibition Center, El Nasr Road, Nasr City, Cairo, Egypt'
WHERE setting_key = 'contact_address';