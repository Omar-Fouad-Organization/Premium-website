-- Update existing site settings and add missing ones
-- Use INSERT ... ON CONFLICT to handle existing settings

INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
-- General Website Settings
('site_name', 'Green Life Expo', 'text', 'general', 'Website Name'),
('site_tagline', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'general', 'Website Tagline'),
('site_description', 'Egypt''s premier exhibition for sustainable living, organic products, and green innovation.', 'textarea', 'general', 'Website Description'),
('site_keywords', 'green life expo, sustainable living, organic products, healthy lifestyle, egypt expo', 'text', 'general', 'Website Keywords'),

-- Hero Section Settings
('hero_title', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'hero', 'Hero Section Title'),
('hero_subtitle', 'The premier platform connecting sustainable businesses, eco-conscious consumers, and green innovators across the Middle East.', 'textarea', 'hero', 'Hero Section Subtitle'),
('hero_cta_primary', 'Exhibit With Us', 'text', 'hero', 'Primary Call-to-Action Button'),
('hero_cta_secondary', 'Become a Sponsor', 'text', 'hero', 'Secondary Call-to-Action Button'),
('hero_date', 'March 15-17, 2025', 'text', 'hero', 'Event Date'),
('hero_location', 'Cairo, Egypt', 'text', 'hero', 'Event Location'),

-- Statistics Settings
('stats_exhibitors', '500+', 'text', 'stats', 'Number of Exhibitors'),
('stats_visitors', '25,000+', 'text', 'stats', 'Expected Visitors'),
('stats_countries', '15+', 'text', 'stats', 'Participating Countries'),
('stats_sectors', '8', 'text', 'stats', 'Industry Sectors'),
('stats_speakers', '50+', 'text', 'stats', 'Expert Speakers'),
('stats_sessions', '30+', 'text', 'stats', 'Educational Sessions'),

-- Social Media Links
('social_facebook', 'https://facebook.com/greenlifeexpo', 'url', 'social', 'Facebook URL'),
('social_instagram', 'https://instagram.com/greenlifeexpo', 'url', 'social', 'Instagram URL'),
('social_twitter', 'https://twitter.com/greenlifeexpo', 'url', 'social', 'Twitter URL'),
('social_linkedin', 'https://linkedin.com/company/greenlifeexpo', 'url', 'social', 'LinkedIn URL'),
('social_youtube', 'https://youtube.com/@greenlifeexpo', 'url', 'social', 'YouTube URL')

ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    setting_type = EXCLUDED.setting_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    updated_at = NOW();