-- Ensure logo and favicon settings exist
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
('logo_url', '/images/green_life_expo_logo_variations_20251225134629_1.webp', 'text', 'general', 'Site Logo URL'),
('favicon_url', '/images/green_life_expo_logo_variations_20251225134629_1.webp', 'text', 'general', 'Site Favicon URL')
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description;