-- Create location settings
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
('event_location', 'Cairo International Convention Center, New Cairo, Egypt', 'text', 'location', 'Event Location'),
('map_latitude', '30.0444', 'text', 'location', 'Map Latitude'),
('map_longitude', '31.2357', 'text', 'location', 'Map Longitude'),
('map_zoom', '15', 'text', 'location', 'Map Zoom Level'),
('map_marker_title', 'Green Life Expo - Cairo International Convention Center', 'text', 'location', 'Map Marker Title'),
('map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.123456789!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjgiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1234567890123', 'text', 'location', 'Google Maps Embed URL')
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description;