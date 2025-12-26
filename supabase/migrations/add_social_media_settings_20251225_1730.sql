-- Add Social Media Settings
-- Created: 2025-12-25 17:30 UTC

-- Add social media link settings to site_settings table
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
('social_facebook', 'https://facebook.com/greenlifeexpo', 'text', 'contact', 'Facebook page URL'),
('social_instagram', 'https://instagram.com/greenlifeexpo', 'text', 'contact', 'Instagram profile URL'),
('social_linkedin', 'https://linkedin.com/company/greenlifeexpo', 'text', 'contact', 'LinkedIn company page URL'),
('social_twitter', 'https://twitter.com/greenlifeexpo', 'text', 'contact', 'Twitter/X profile URL'),
('social_youtube', 'https://youtube.com/@greenlifeexpo', 'text', 'contact', 'YouTube channel URL')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;