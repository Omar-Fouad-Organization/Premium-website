-- Premium Website Database Tables (Separate from original)
-- Created: 2025-12-25 17:00 UTC

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings_premium_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'text',
  category TEXT DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Content Table
CREATE TABLE IF NOT EXISTS page_content_premium_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_value TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_name, section_name, content_key)
);

-- Packages Table
CREATE TABLE IF NOT EXISTS packages_premium_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_type TEXT NOT NULL,
  package_name TEXT NOT NULL,
  price TEXT,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs_premium_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions_premium_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  inquiry_type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Site Settings
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
-- General Settings
('site_title', 'Green Life Expo', 'text', 'general', 'Website title'),
('site_tagline', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'general', 'Website tagline'),

-- Hero Section
('hero_headline', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'hero', 'Main headline'),
('hero_subtitle', 'The premier platform connecting sustainable businesses, eco-conscious consumers, and green innovators across the Middle East.', 'text', 'hero', 'Hero subtitle'),
('event_date', 'March 15-17, 2025', 'text', 'hero', 'Event date'),
('event_location', 'Cairo International Convention Center', 'text', 'hero', 'Event location'),

-- Statistics
('stat_exhibitors', '500+', 'text', 'stats', 'Number of exhibitors'),
('stat_visitors', '10,000+', 'text', 'stats', 'Number of visitors'),
('stat_speakers', '50+', 'text', 'stats', 'Number of expert speakers'),
('stat_days', '3', 'text', 'stats', 'Number of days'),

-- Contact Information
('contact_email', 'info@greenlifeexpo.com', 'text', 'contact', 'Contact email'),
('contact_phone', '+20 123 456 7890', 'text', 'contact', 'Contact phone'),
('contact_address', 'Cairo International Convention Center, El Nasr Road, Nasr City, Cairo, Egypt', 'text', 'contact', 'Physical address'),
('facebook_url', 'https://facebook.com', 'text', 'contact', 'Facebook URL'),
('instagram_url', 'https://instagram.com', 'text', 'contact', 'Instagram URL'),
('linkedin_url', 'https://linkedin.com', 'text', 'contact', 'LinkedIn URL'),

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
('favicon_url', '/favicon.ico', 'image', 'branding', 'Website favicon'),

-- Design Colors (HSL format)
('color_primary', '95 55% 20%', 'color', 'design', 'Primary brand color (Deep Natural Green)'),
('color_secondary', '145 35% 75%', 'color', 'design', 'Secondary color (Soft Light Green)'),
('color_accent', '43 45% 58%', 'color', 'design', 'Accent color (Premium Gold)'),
('color_background', '0 0% 100%', 'color', 'design', 'Background color (Pure White)')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Default Page Content
INSERT INTO page_content_premium_20251225 (page_name, section_name, content_key, content_value, content_type, display_order) VALUES
-- Homepage Content
('home', 'hero', 'title', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 1),
('home', 'hero', 'subtitle', 'The premier platform connecting sustainable businesses, eco-conscious consumers, and green innovators across the Middle East.', 'text', 2),
('home', 'value_prop', 'title', 'Where Green Living Meets Business Growth', 'text', 1),
('home', 'value_prop', 'description', 'Green Life Expo is not just an event—it''s the definitive platform for sustainable businesses to connect, grow, and lead the green economy transformation in Egypt and beyond.', 'text', 2),

-- About Page Content
('about', 'hero', 'title', 'Building Egypt''s Green Economy Platform', 'text', 1),
('about', 'hero', 'subtitle', 'Green Life Expo exists to bridge the gap between sustainable innovation and market adoption, creating a thriving ecosystem where green businesses flourish.', 'text', 2),
('about', 'vision', 'title', 'Our Vision', 'text', 1),
('about', 'vision', 'description', 'To establish Egypt as the Middle East''s leading platform for sustainable living, where green innovation meets market opportunity.', 'text', 2),
('about', 'mission', 'title', 'Our Mission', 'text', 1),
('about', 'mission', 'description', 'To create a comprehensive platform that connects sustainable businesses with conscious consumers, facilitates knowledge exchange, and drives green innovation.', 'text', 2),

-- Exhibitors Page Content
('exhibitors', 'hero', 'title', 'Exhibit at Egypt''s Premier Green Living Platform', 'text', 1),
('exhibitors', 'hero', 'subtitle', 'Position your brand at the forefront of Egypt''s green economy. Connect with qualified buyers, generate high-value leads, and establish your market leadership.', 'text', 2),

-- Sponsors Page Content
('sponsors', 'hero', 'title', 'Partner with Egypt''s Leading Sustainability Platform', 'text', 1),
('sponsors', 'hero', 'subtitle', 'Align your brand with the green economy movement. Demonstrate leadership, enhance ESG credentials, and connect with millions of sustainability-conscious stakeholders.', 'text', 2),

-- Visitors Page Content
('visitors', 'hero', 'title', 'Plan Your Visit to Green Life Expo', 'text', 1),
('visitors', 'hero', 'subtitle', 'Join thousands of sustainability enthusiasts, business professionals, and conscious consumers for three days of discovery, learning, and connection.', 'text', 2),

-- Contact Page Content
('contact', 'hero', 'title', 'Let''s Start a Conversation', 'text', 1),
('contact', 'hero', 'subtitle', 'Whether you''re interested in exhibiting, sponsoring, or visiting, our team is here to help you make the most of Green Life Expo.', 'text', 2)
ON CONFLICT (page_name, section_name, content_key) DO NOTHING;

-- Insert Default Packages
INSERT INTO packages_premium_20251225 (package_type, package_name, price, features, is_popular, display_order) VALUES
('exhibitor', 'Standard Booth', 'Custom', '["9 sqm exhibition space", "Company listing in catalog", "2 exhibitor passes", "Basic booth furniture", "WiFi access"]', false, 1),
('exhibitor', 'Premium Booth', 'Custom', '["18 sqm exhibition space", "Premium location", "4 exhibitor passes", "Premium booth design", "WiFi access", "Marketing support"]', true, 2),
('exhibitor', 'Elite Booth', 'Custom', '["36 sqm exhibition space", "Corner location", "6 exhibitor passes", "Custom booth design", "WiFi access", "Full marketing package", "Speaking opportunity"]', false, 3),

('sponsor', 'Silver Partner', 'Custom', '["Logo on website", "Logo in event materials", "2 VIP passes", "Social media mentions", "Networking opportunities"]', false, 1),
('sponsor', 'Gold Partner', 'Custom', '["Prominent logo placement", "Speaking opportunity", "4 VIP passes", "Booth space included", "Media coverage", "Custom activations"]', true, 2),
('sponsor', 'Platinum Partner', 'Custom', '["Exclusive naming rights", "Keynote opportunity", "8 VIP passes", "Premium booth space", "Full media package", "Custom brand experiences", "Year-round partnership"]', false, 3)
ON CONFLICT DO NOTHING;

-- Insert Default FAQs
INSERT INTO faqs_premium_20251225 (question, answer, category, display_order) VALUES
('When is Green Life Expo 2025?', 'Green Life Expo 2025 will take place from March 15-17, 2025 at the Cairo International Convention Center.', 'general', 1),
('How can I exhibit at the expo?', 'To exhibit, please contact our exhibition team through the contact form or email exhibitors@greenlifeexpo.com. We offer various booth packages to suit different needs.', 'exhibitors', 2),
('What are the sponsorship opportunities?', 'We offer multiple sponsorship levels including Platinum, Gold, and Silver partnerships. Each level provides different benefits and visibility. Contact our partnership team for a custom proposal.', 'sponsors', 3),
('Is visitor registration free?', 'Yes! Visitor registration is completely free. Simply register online to receive your free entry pass.', 'visitors', 4),
('What sectors are featured at the expo?', 'We feature six main sectors: Organic Food & Beverages, Health & Wellness, Sustainable Living, Natural Beauty & Personal Care, Green Technology & Energy, and Eco-Fashion & Textiles.', 'general', 5)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE site_settings_premium_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content_premium_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages_premium_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs_premium_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions_premium_20251225 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Public Read Access
CREATE POLICY "Public can view site settings" ON site_settings_premium_20251225 FOR SELECT USING (true);
CREATE POLICY "Public can view page content" ON page_content_premium_20251225 FOR SELECT USING (true);
CREATE POLICY "Public can view packages" ON packages_premium_20251225 FOR SELECT USING (true);
CREATE POLICY "Public can view active FAQs" ON faqs_premium_20251225 FOR SELECT USING (is_active = true);

-- RLS Policies for Authenticated Users (Admin)
CREATE POLICY "Authenticated users can manage site settings" ON site_settings_premium_20251225 FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage page content" ON page_content_premium_20251225 FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage packages" ON packages_premium_20251225 FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage FAQs" ON faqs_premium_20251225 FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view all submissions" ON contact_submissions_premium_20251225 FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policy for Contact Submissions
CREATE POLICY "Anyone can submit contact form" ON contact_submissions_premium_20251225 FOR INSERT WITH CHECK (true);

-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('premium_logos', 'premium_logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for premium logos
CREATE POLICY "Public can view premium logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'premium_logos');

CREATE POLICY "Authenticated users can upload premium logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'premium_logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update premium logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'premium_logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete premium logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'premium_logos' AND auth.role() = 'authenticated');