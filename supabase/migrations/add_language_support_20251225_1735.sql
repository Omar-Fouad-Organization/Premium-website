-- Add Language Support for Arabic and English
-- Created: 2025-12-25 17:35 UTC

-- Add language setting
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
('site_language', 'en', 'text', 'general', 'Website language (en or ar)'),
('enable_language_switcher', 'true', 'text', 'general', 'Show language switcher on website')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Create translations table for Arabic content
CREATE TABLE IF NOT EXISTS translations_premium_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_key TEXT NOT NULL UNIQUE,
  english_text TEXT NOT NULL,
  arabic_text TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE translations_premium_20251225 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Translations
CREATE POLICY "Anyone can view translations" 
  ON translations_premium_20251225 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage translations" 
  ON translations_premium_20251225 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Insert default translations
INSERT INTO translations_premium_20251225 (translation_key, english_text, arabic_text, category) VALUES
-- Navigation
('nav_home', 'Home', 'الرئيسية', 'navigation'),
('nav_about', 'About', 'عن المعرض', 'navigation'),
('nav_exhibitors', 'Exhibitors', 'العارضون', 'navigation'),
('nav_sponsors', 'Sponsors', 'الرعاة', 'navigation'),
('nav_sectors', 'Sectors', 'القطاعات', 'navigation'),
('nav_content', 'Content & Talks', 'المحتوى والمحاضرات', 'navigation'),
('nav_visitors', 'Visitors', 'الزوار', 'navigation'),
('nav_contact', 'Contact', 'اتصل بنا', 'navigation'),

-- Hero Section
('hero_headline', 'Egypt''s Leading Go Green & Healthy Living Expo', 'معرض مصر الرائد للحياة الخضراء والصحية', 'hero'),
('hero_subtitle', 'A curated exhibition bringing together organic products, healthy lifestyles, and sustainable solutions under one platform.', 'معرض منتقى يجمع المنتجات العضوية وأنماط الحياة الصحية والحلول المستدامة تحت منصة واحدة.', 'hero'),
('hero_cta_exhibit', 'Exhibit With Us', 'اعرض معنا', 'hero'),
('hero_cta_sponsor', 'Become a Sponsor', 'كن راعياً', 'hero'),
('hero_cta_visit', 'Visit the Expo', 'زر المعرض', 'hero'),

-- Common
('learn_more', 'Learn More', 'اعرف المزيد', 'common'),
('read_more', 'Read More', 'اقرأ المزيد', 'common'),
('get_started', 'Get Started', 'ابدأ الآن', 'common'),
('contact_us', 'Contact Us', 'اتصل بنا', 'common'),
('register_now', 'Register Now', 'سجل الآن', 'common'),
('download', 'Download', 'تحميل', 'common'),
('submit', 'Submit', 'إرسال', 'common'),
('save', 'Save', 'حفظ', 'common'),
('cancel', 'Cancel', 'إلغاء', 'common'),
('close', 'Close', 'إغلاق', 'common'),

-- Footer
('footer_participate', 'Participate', 'شارك معنا', 'footer'),
('footer_explore', 'Explore', 'استكشف', 'footer'),
('footer_get_in_touch', 'Get in Touch', 'تواصل معنا', 'footer'),
('footer_rights', 'All rights reserved', 'جميع الحقوق محفوظة', 'footer'),
('footer_privacy', 'Privacy Policy', 'سياسة الخصوصية', 'footer'),
('footer_terms', 'Terms of Service', 'شروط الخدمة', 'footer'),

-- About Page
('about_title', 'About Green Life Expo', 'عن معرض الحياة الخضراء', 'about'),
('about_vision_title', 'Our Vision', 'رؤيتنا', 'about'),
('about_mission_title', 'Our Mission', 'مهمتنا', 'about'),
('about_values_title', 'Our Values', 'قيمنا', 'about'),

-- Exhibitors Page
('exhibitors_title', 'Exhibit With Us', 'اعرض معنا', 'exhibitors'),
('exhibitors_subtitle', 'Showcase your sustainable products and innovations', 'اعرض منتجاتك وابتكاراتك المستدامة', 'exhibitors'),
('exhibitors_benefits', 'Benefits', 'المزايا', 'exhibitors'),
('exhibitors_packages', 'Packages', 'الباقات', 'exhibitors'),

-- Sponsors Page
('sponsors_title', 'Become a Sponsor', 'كن راعياً', 'sponsors'),
('sponsors_subtitle', 'Partner with Egypt''s premier sustainability event', 'شارك في حدث الاستدامة الأول في مصر', 'sponsors'),
('sponsors_benefits', 'Sponsorship Benefits', 'مزايا الرعاية', 'sponsors'),

-- Visitors Page
('visitors_title', 'Visit the Expo', 'زر المعرض', 'visitors'),
('visitors_subtitle', 'Discover sustainable living solutions', 'اكتشف حلول الحياة المستدامة', 'visitors'),
('visitors_register', 'Register as Visitor', 'سجل كزائر', 'visitors'),

-- Contact Page
('contact_title', 'Contact Us', 'اتصل بنا', 'contact'),
('contact_subtitle', 'Get in touch with our team', 'تواصل مع فريقنا', 'contact'),
('contact_name', 'Name', 'الاسم', 'contact'),
('contact_email', 'Email', 'البريد الإلكتروني', 'contact'),
('contact_phone', 'Phone', 'الهاتف', 'contact'),
('contact_message', 'Message', 'الرسالة', 'contact'),
('contact_send', 'Send Message', 'إرسال الرسالة', 'contact')

ON CONFLICT (translation_key) DO UPDATE SET
  english_text = EXCLUDED.english_text,
  arabic_text = EXCLUDED.arabic_text,
  category = EXCLUDED.category;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations_premium_20251225(translation_key);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations_premium_20251225(category);