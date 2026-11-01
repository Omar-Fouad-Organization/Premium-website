-- Create comprehensive site settings that affect the entire website
-- This ensures every setting in the admin panel affects the real website

-- Clear existing settings to avoid conflicts
DELETE FROM site_settings_premium_20251225 WHERE category IN ('general', 'hero', 'stats', 'contact', 'social');

-- General Website Settings
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'Green Life Expo', 'text', 'general', 'Website Name'),
('site_tagline', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'general', 'Website Tagline'),
('site_description', 'Egypt''s premier exhibition for sustainable living, organic products, and green innovation.', 'textarea', 'general', 'Website Description'),
('site_keywords', 'green life expo, sustainable living, organic products, healthy lifestyle, egypt expo', 'text', 'general', 'Website Keywords'),
('site_logo_url', '/images/green_life_expo_logo_variations_20251225134629_1.webp', 'text', 'general', 'Site Logo URL'),
('site_favicon_url', '/images/green_life_expo_logo_variations_20251225134629_1.webp', 'text', 'general', 'Site Favicon URL'),

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

-- Contact Information
('contact_email', 'info@greenlifeexpo.com', 'email', 'contact', 'Contact Email'),
('contact_phone', '+20 2 1234 5678', 'text', 'contact', 'Contact Phone'),
('contact_address', 'Cairo International Convention Center, New Cairo, Egypt', 'textarea', 'contact', 'Event Address'),
('contact_office_address', '123 Business District, New Cairo, Egypt', 'textarea', 'contact', 'Office Address'),
('contact_hours', 'Sunday - Thursday: 9:00 AM - 6:00 PM', 'text', 'contact', 'Office Hours'),

-- Social Media Links
('social_facebook', 'https://facebook.com/greenlifeexpo', 'url', 'social', 'Facebook URL'),
('social_instagram', 'https://instagram.com/greenlifeexpo', 'url', 'social', 'Instagram URL'),
('social_twitter', 'https://twitter.com/greenlifeexpo', 'url', 'social', 'Twitter URL'),
('social_linkedin', 'https://linkedin.com/company/greenlifeexpo', 'url', 'social', 'LinkedIn URL'),
('social_youtube', 'https://youtube.com/@greenlifeexpo', 'url', 'social', 'YouTube URL'),

-- Event Information
('event_venue', 'Cairo International Convention Center', 'text', 'event', 'Event Venue'),
('event_hall', 'Hall 1 & 2', 'text', 'event', 'Event Hall'),
('event_timing', '10:00 AM - 8:00 PM', 'text', 'event', 'Event Timing'),
('event_entry_fee', 'Free Entry', 'text', 'event', 'Entry Fee'),
('event_parking', 'Free Parking Available', 'text', 'event', 'Parking Information'),

-- Registration Settings
('visitor_registration_enabled', 'true', 'boolean', 'registration', 'Enable Visitor Registration'),
('exhibitor_registration_enabled', 'true', 'boolean', 'registration', 'Enable Exhibitor Registration'),
('sponsor_registration_enabled', 'true', 'boolean', 'registration', 'Enable Sponsor Registration'),
('visitor_registration_closed_message', 'Visitor registration is currently closed. Please check back later.', 'textarea', 'registration', 'Visitor Registration Closed Message'),

-- Arabic versions for key content
('hero_title_ar', 'معرض الحياة الخضراء الرائد في مصر للحياة الصحية والخضراء', 'text', 'hero', 'Hero Section Title (Arabic)'),
('hero_subtitle_ar', 'المنصة الرائدة التي تربط الشركات المستدامة والمستهلكين المهتمين بالبيئة والمبتكرين الخضر في الشرق الأوسط.', 'textarea', 'hero', 'Hero Section Subtitle (Arabic)'),
('hero_cta_primary_ar', 'اعرض معنا', 'text', 'hero', 'Primary Call-to-Action Button (Arabic)'),
('hero_cta_secondary_ar', 'كن راعياً', 'text', 'hero', 'Secondary Call-to-Action Button (Arabic)'),
('visitor_registration_closed_message_ar', 'تسجيل الزوار مغلق حالياً. يرجى المحاولة لاحقاً.', 'textarea', 'registration', 'Visitor Registration Closed Message (Arabic)');