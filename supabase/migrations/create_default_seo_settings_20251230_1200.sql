-- Insert default SEO settings
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
('meta_title', 'Green Life Expo - Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'seo', 'Website meta title'),
('meta_description', 'Egypt''s premier exhibition for sustainable living, organic products, and green innovation. Join us for the ultimate green lifestyle experience.', 'text', 'seo', 'Website meta description'),
('meta_keywords', 'green life expo, sustainable living, organic products, healthy lifestyle, egypt expo, green innovation', 'text', 'seo', 'Website meta keywords'),
('og_title', 'Green Life Expo - Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'seo', 'Open Graph title'),
('og_description', 'Egypt''s premier exhibition for sustainable living, organic products, and green innovation. Join us for the ultimate green lifestyle experience.', 'text', 'seo', 'Open Graph description'),
('og_image', '/images/green_life_expo_logo_variations_20251225134629_1.webp', 'text', 'seo', 'Open Graph image URL'),
('twitter_title', 'Green Life Expo - Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'seo', 'Twitter card title'),
('twitter_description', 'Egypt''s premier exhibition for sustainable living, organic products, and green innovation.', 'text', 'seo', 'Twitter card description'),
('twitter_image', '/images/green_life_expo_logo_variations_20251225134629_1.webp', 'text', 'seo', 'Twitter card image URL'),
('canonical_url', '', 'text', 'seo', 'Canonical URL (leave empty for auto-detection)')
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = EXCLUDED.setting_value,
description = EXCLUDED.description;