-- Create site_settings table for general website configuration
CREATE TABLE IF NOT EXISTS site_settings_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT NOT NULL, -- 'text', 'number', 'color', 'image', 'json'
  category TEXT NOT NULL, -- 'general', 'hero', 'about', 'contact', 'colors', 'stats'
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_content table for page-specific content
CREATE TABLE IF NOT EXISTS page_content_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_value TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'text', 'html', 'image', 'json'
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_name, section_name, content_key)
);

-- Create packages table for exhibitor and sponsor packages
CREATE TABLE IF NOT EXISTS packages_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_type TEXT NOT NULL, -- 'exhibitor' or 'sponsor'
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  features JSONB NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  submission_type TEXT NOT NULL, -- 'contact', 'exhibitor', 'sponsor'
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
-- Colors
('primary_color', '130 45% 30%', 'color', 'colors', 'Primary brand color (HSL)'),
('secondary_color', '135 35% 56%', 'color', 'colors', 'Secondary brand color (HSL)'),
('accent_color', '43 65% 53%', 'color', 'colors', 'Accent color (HSL)'),
('background_color', '40 25% 97%', 'color', 'colors', 'Background color (HSL)'),

-- General Info
('site_title', 'Green Life Expo', 'text', 'general', 'Website title'),
('site_tagline', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'general', 'Main tagline'),
('contact_email', 'info@greenlifeexpo.com', 'text', 'contact', 'Contact email'),
('contact_phone', '+20 123 456 7890', 'text', 'contact', 'Contact phone'),
('contact_address', 'Cairo International Convention Center, El Nasr Road, Nasr City, Cairo, Egypt', 'text', 'contact', 'Physical address'),

-- Hero Section
('hero_title', 'Egypt''s Leading Go Green & Healthy Living Expo', 'text', 'hero', 'Hero section title'),
('hero_subtitle', 'A curated exhibition bringing together organic products, healthy lifestyles, and sustainable solutions under one platform.', 'text', 'hero', 'Hero section subtitle'),
('event_date', 'March 15-17, 2025', 'text', 'hero', 'Event date'),
('event_location', 'Cairo, Egypt', 'text', 'hero', 'Event location'),

-- Stats
('stat_exhibitors', '500+', 'text', 'stats', 'Number of exhibitors'),
('stat_visitors', '10,000+', 'text', 'stats', 'Number of visitors'),
('stat_workshops', '50+', 'text', 'stats', 'Number of workshops'),
('stat_days', '3', 'text', 'stats', 'Number of days'),

-- Social Media
('facebook_url', 'https://facebook.com', 'text', 'contact', 'Facebook URL'),
('instagram_url', 'https://instagram.com', 'text', 'contact', 'Instagram URL'),
('linkedin_url', 'https://linkedin.com', 'text', 'contact', 'LinkedIn URL')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default packages
INSERT INTO packages_20251225 (package_type, name, price, features, is_popular, display_order) VALUES
('exhibitor', 'Standard Booth', 'Starting from $2,500', '["9 sqm booth space", "Basic booth setup", "Company listing in catalog", "2 exhibitor passes", "WiFi access"]', false, 1),
('exhibitor', 'Premium Booth', 'Starting from $5,000', '["18 sqm booth space", "Premium booth design", "Featured listing in catalog", "4 exhibitor passes", "WiFi access", "Marketing materials", "Social media promotion"]', true, 2),
('exhibitor', 'VIP Booth', 'Starting from $10,000', '["36 sqm booth space", "Custom booth design", "Premium catalog placement", "8 exhibitor passes", "WiFi access", "Full marketing package", "Dedicated account manager", "Speaking opportunity"]', false, 3),
('sponsor', 'Bronze Sponsor', '$5,000', '["Logo on website", "Logo in event catalog", "Social media mentions", "2 VIP passes", "Booth space discount"]', false, 1),
('sponsor', 'Silver Sponsor', '$10,000', '["All Bronze benefits", "Logo on event banners", "Speaking opportunity", "4 VIP passes", "Premium booth location", "Press release mention"]', false, 2),
('sponsor', 'Gold Sponsor', '$20,000', '["All Silver benefits", "Main stage branding", "Keynote speaking slot", "8 VIP passes", "Exclusive networking event", "Full page ad in catalog", "Dedicated social campaign"]', true, 3),
('sponsor', 'Platinum Sponsor', '$50,000', '["All Gold benefits", "Title sponsor recognition", "Opening ceremony speech", "15 VIP passes", "Custom activation space", "Year-round partnership", "Exclusive media coverage", "Co-branding opportunities"]', false, 4);

-- Insert default FAQs
INSERT INTO faqs_20251225 (question, answer, category, display_order) VALUES
('When is Green Life Expo 2025?', 'The expo will take place from March 15-17, 2025, at the Cairo International Convention Center.', 'general', 1),
('Is registration required?', 'Yes, free registration is required for all visitors. You can register online in advance or on-site.', 'visitors', 2),
('How can I become an exhibitor?', 'Visit our Exhibitors page to view packages and submit an application. Our team will contact you within 24 hours.', 'exhibitors', 3),
('Are there sponsorship opportunities?', 'Yes! We offer various sponsorship packages. Check our Sponsors page for details or contact us directly.', 'sponsors', 4),
('Is parking available?', 'Yes, free parking is available on-site at the Cairo International Convention Center.', 'visitors', 5);

-- Enable Row Level Security
ALTER TABLE site_settings_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions_20251225 ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read site settings" ON site_settings_20251225 FOR SELECT USING (true);
CREATE POLICY "Public can read page content" ON page_content_20251225 FOR SELECT USING (true);
CREATE POLICY "Public can read active packages" ON packages_20251225 FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active FAQs" ON faqs_20251225 FOR SELECT USING (is_active = true);

-- Create policy for contact submissions (anyone can insert)
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions_20251225 FOR INSERT WITH CHECK (true);

-- Create policies for authenticated admin users (full access)
CREATE POLICY "Authenticated users can manage site settings" ON site_settings_20251225 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage page content" ON page_content_20251225 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage packages" ON packages_20251225 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage FAQs" ON faqs_20251225 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all submissions" ON contact_submissions_20251225 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update submissions" ON contact_submissions_20251225 
  FOR UPDATE USING (auth.role() = 'authenticated');