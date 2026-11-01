-- Add Map Settings for Location Control
-- Created: 2025-12-25 17:25 UTC

-- Add map-related settings to site_settings table
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
('map_latitude', '30.0444', 'text', 'map', 'Map center latitude coordinate'),
('map_longitude', '31.2357', 'text', 'map', 'Map center longitude coordinate'),
('map_zoom', '15', 'text', 'map', 'Map zoom level (1-20)'),
('map_marker_title', 'Cairo International Exhibition Center', 'text', 'map', 'Map marker title/label'),
('map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.123456789!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjgiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1234567890', 'text', 'map', 'Google Maps embed URL')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Update existing location settings descriptions
UPDATE site_settings_premium_20251225
SET description = 'Event venue name (displayed on website)'
WHERE setting_key = 'event_location';

UPDATE site_settings_premium_20251225
SET description = 'Full physical address (displayed on contact page and map)'
WHERE setting_key = 'contact_address';