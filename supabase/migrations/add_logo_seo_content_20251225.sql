-- Add SEO and logo settings to site_settings table
INSERT INTO site_settings_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
-- SEO Settings
('meta_title', 'Green Life Expo - Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'seo', 'Website meta title (SEO)'),
('meta_description', 'Join Egypt''s premier green living exhibition. Discover organic products, sustainable solutions, and healthy lifestyles at Green Life Expo.', 'text', 'seo', 'Website meta description (SEO)'),
('meta_keywords', 'green expo, organic products, sustainable living, healthy lifestyle, Egypt exhibition, eco-friendly', 'text', 'seo', 'Website meta keywords (SEO)'),
('og_title', 'Green Life Expo - Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'seo', 'Open Graph title (social media)'),
('og_description', 'Join Egypt''s premier green living exhibition. Discover organic products, sustainable solutions, and healthy lifestyles.', 'text', 'seo', 'Open Graph description (social media)'),
('og_image', '/images/green_life_expo_logo_variations_20251225134629_1.webp', 'text', 'seo', 'Open Graph image URL (social media)'),

-- Logo Settings
('logo_url', '/images/green_life_expo_logo_variations_20251225134629_1.webp', 'image', 'branding', 'Main website logo'),
('logo_alt_text', 'Green Life Expo Logo', 'text', 'branding', 'Logo alt text for accessibility'),
('favicon_url', '/favicon.ico', 'image', 'branding', 'Website favicon')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default page content for all pages
INSERT INTO page_content_20251225 (page_name, section_name, content_key, content_value, content_type, display_order) VALUES
-- Homepage Content
('home', 'hero', 'title', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 1),
('home', 'hero', 'subtitle', 'A curated exhibition bringing together organic products, healthy lifestyles, and sustainable solutions under one platform.', 'text', 2),
('home', 'about_preview', 'title', 'Where Green Living Meets a Healthier Future', 'text', 1),
('home', 'about_preview', 'description', 'Green Life Expo is Egypt''s premier platform for sustainable living, bringing together innovators, businesses, and consumers passionate about creating a healthier, greener future.', 'text', 2),
('home', 'benefits', 'title', 'Why Attend Green Life Expo?', 'text', 1),
('home', 'benefits', 'subtitle', 'Join thousands of visitors and exhibitors in Egypt''s most comprehensive green living event', 'text', 2),
('home', 'categories', 'title', 'Exhibition Categories', 'text', 1),
('home', 'categories', 'subtitle', 'Explore diverse sectors of sustainable living and green innovation', 'text', 2),
('home', 'cta', 'title', 'Ready to Join Us?', 'text', 1),
('home', 'cta', 'description', 'Whether you''re an exhibitor, sponsor, or visitor, Green Life Expo offers unique opportunities to connect, learn, and grow in the green economy.', 'text', 2),

-- About Page Content
('about', 'hero', 'title', 'About Green Life Expo', 'text', 1),
('about', 'hero', 'subtitle', 'Egypt''s premier platform for sustainable living and green innovation', 'text', 2),
('about', 'mission', 'title', 'Our Mission', 'text', 1),
('about', 'mission', 'description', 'To create a comprehensive platform that connects sustainable businesses, eco-conscious consumers, and green innovators, fostering a healthier and more sustainable future for Egypt and the region.', 'text', 2),
('about', 'vision', 'title', 'Our Vision', 'text', 1),
('about', 'vision', 'description', 'To be the leading exhibition in the Middle East for green living, inspiring positive change and driving the adoption of sustainable practices across all sectors of society.', 'text', 2),
('about', 'story', 'title', 'Our Story', 'text', 1),
('about', 'story', 'paragraph1', 'Green Life Expo was founded with a simple yet powerful vision: to create a space where sustainability meets innovation, and where businesses and consumers can come together to shape a greener future.', 'text', 2),
('about', 'story', 'paragraph2', 'Since our inception, we''ve grown to become Egypt''s most comprehensive exhibition for organic products, healthy lifestyles, and sustainable solutions. Each year, we bring together hundreds of exhibitors and thousands of visitors who share our passion for green living.', 'text', 3),

-- Exhibitors Page Content
('exhibitors', 'hero', 'title', 'Exhibit With Us', 'text', 1),
('exhibitors', 'hero', 'subtitle', 'Showcase your sustainable products and services to thousands of engaged visitors', 'text', 2),
('exhibitors', 'benefits', 'title', 'Why Exhibit at Green Life Expo?', 'text', 1),
('exhibitors', 'benefits', 'subtitle', 'Join Egypt''s premier green living exhibition and grow your business', 'text', 2),
('exhibitors', 'packages', 'title', 'Exhibition Packages', 'text', 1),
('exhibitors', 'packages', 'subtitle', 'Choose the package that best fits your business needs', 'text', 2),

-- Sponsors Page Content
('sponsors', 'hero', 'title', 'Become a Sponsor', 'text', 1),
('sponsors', 'hero', 'subtitle', 'Partner with Egypt''s leading green living expo and amplify your brand''s impact', 'text', 2),
('sponsors', 'benefits', 'title', 'Sponsorship Benefits', 'text', 1),
('sponsors', 'benefits', 'subtitle', 'Align your brand with sustainability and reach a highly engaged audience', 'text', 2),
('sponsors', 'packages', 'title', 'Sponsorship Packages', 'text', 1),
('sponsors', 'packages', 'subtitle', 'Choose the sponsorship level that aligns with your marketing goals', 'text', 2),

-- Visitors Page Content
('visitors', 'hero', 'title', 'Plan Your Visit', 'text', 1),
('visitors', 'hero', 'subtitle', 'Everything you need to know for an amazing Green Life Expo experience', 'text', 2),
('visitors', 'event_info', 'title', 'Event Information', 'text', 1),
('visitors', 'event_info', 'subtitle', 'Mark your calendar and join us for three days of green living', 'text', 2),
('visitors', 'highlights', 'title', 'What to Expect', 'text', 1),
('visitors', 'highlights', 'subtitle', 'Discover the exciting experiences waiting for you at Green Life Expo', 'text', 2),

-- Contact Page Content
('contact', 'hero', 'title', 'Get in Touch', 'text', 1),
('contact', 'hero', 'subtitle', 'Have questions? We''re here to help and answer any questions you might have', 'text', 2),
('contact', 'form', 'title', 'Send Us a Message', 'text', 1),
('contact', 'form', 'subtitle', 'Fill out the form below and we''ll respond as soon as possible', 'text', 2),
('contact', 'faq', 'title', 'Frequently Asked Questions', 'text', 1),
('contact', 'faq', 'subtitle', 'Quick answers to common questions', 'text', 2)
ON CONFLICT (page_name, section_name, content_key) DO NOTHING;

-- Create storage bucket for logo uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for logo uploads
CREATE POLICY "Public can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');