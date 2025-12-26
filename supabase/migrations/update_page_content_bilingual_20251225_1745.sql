-- Update Page Content for Bilingual Support
-- Created: 2025-12-25 17:45 UTC

-- Add Arabic content columns to page_content table
ALTER TABLE page_content_premium_20251225 
ADD COLUMN IF NOT EXISTS content_value_ar TEXT;

-- Update existing content with Arabic translations
UPDATE page_content_premium_20251225 SET content_value_ar = content_value WHERE content_value_ar IS NULL;

-- Add more comprehensive page content entries for all pages
INSERT INTO page_content_premium_20251225 (page_name, section_name, content_key, content_value, content_value_ar, content_type) VALUES
-- Homepage
('home', 'hero', 'hero_title', 'Egypt''s Leading Go Green & Healthy Living Expo', 'معرض مصر الرائد للحياة الخضراء والصحية', 'text'),
('home', 'hero', 'hero_subtitle', 'A curated exhibition bringing together organic products, healthy lifestyles, and sustainable solutions under one platform.', 'معرض منتقى يجمع المنتجات العضوية وأنماط الحياة الصحية والحلول المستدامة تحت منصة واحدة.', 'textarea'),
('home', 'hero', 'hero_cta_primary', 'Exhibit With Us', 'اعرض معنا', 'text'),
('home', 'hero', 'hero_cta_secondary', 'Become a Sponsor', 'كن راعياً', 'text'),
('home', 'stats', 'stats_exhibitors_label', 'Exhibitors', 'عارض', 'text'),
('home', 'stats', 'stats_visitors_label', 'Visitors', 'زائر', 'text'),
('home', 'stats', 'stats_speakers_label', 'Speakers', 'متحدث', 'text'),
('home', 'stats', 'stats_days_label', 'Days', 'يوم', 'text'),

-- About Page
('about', 'hero', 'about_hero_title', 'About Green Life Expo', 'عن معرض الحياة الخضراء', 'text'),
('about', 'hero', 'about_hero_subtitle', 'Leading the way in sustainable living and green innovation', 'نقود الطريق في الحياة المستدامة والابتكار الأخضر', 'text'),
('about', 'vision', 'vision_title', 'Our Vision', 'رؤيتنا', 'text'),
('about', 'vision', 'vision_content', 'To be the Middle East''s premier platform for sustainable living, connecting innovators, businesses, and conscious consumers.', 'أن نكون المنصة الرائدة في الشرق الأوسط للحياة المستدامة، نربط المبتكرين والشركات والمستهلكين الواعين.', 'textarea'),
('about', 'mission', 'mission_title', 'Our Mission', 'مهمتنا', 'text'),
('about', 'mission', 'mission_content', 'To promote sustainable practices, organic products, and healthy lifestyles through education, innovation, and community engagement.', 'تعزيز الممارسات المستدامة والمنتجات العضوية وأنماط الحياة الصحية من خلال التعليم والابتكار والمشاركة المجتمعية.', 'textarea'),

-- Exhibitors Page
('exhibitors', 'hero', 'exhibitors_hero_title', 'Exhibit With Us', 'اعرض معنا', 'text'),
('exhibitors', 'hero', 'exhibitors_hero_subtitle', 'Showcase your sustainable products and innovations to thousands of engaged visitors', 'اعرض منتجاتك وابتكاراتك المستدامة لآلاف الزوار المهتمين', 'text'),
('exhibitors', 'benefits', 'benefits_title', 'Why Exhibit?', 'لماذا تعرض معنا؟', 'text'),
('exhibitors', 'benefits', 'benefit_1_title', 'Targeted Audience', 'جمهور مستهدف', 'text'),
('exhibitors', 'benefits', 'benefit_1_desc', 'Connect with eco-conscious consumers and business partners', 'تواصل مع المستهلكين الواعين بيئياً وشركاء الأعمال', 'text'),
('exhibitors', 'benefits', 'benefit_2_title', 'Brand Visibility', 'ظهور العلامة التجارية', 'text'),
('exhibitors', 'benefits', 'benefit_2_desc', 'Increase your brand awareness in the sustainability sector', 'زد من وعي علامتك التجارية في قطاع الاستدامة', 'text'),

-- Sponsors Page
('sponsors', 'hero', 'sponsors_hero_title', 'Become a Sponsor', 'كن راعياً', 'text'),
('sponsors', 'hero', 'sponsors_hero_subtitle', 'Partner with Egypt''s premier sustainability event and amplify your impact', 'شارك في حدث الاستدامة الأول في مصر وضاعف تأثيرك', 'text'),
('sponsors', 'benefits', 'sponsor_benefits_title', 'Sponsorship Benefits', 'مزايا الرعاية', 'text'),
('sponsors', 'benefits', 'sponsor_benefit_1', 'Premium brand exposure', 'تعرض مميز للعلامة التجارية', 'text'),
('sponsors', 'benefits', 'sponsor_benefit_2', 'Networking opportunities', 'فرص التواصل', 'text'),

-- Sectors Page
('sectors', 'hero', 'sectors_hero_title', 'Exhibition Sectors', 'قطاعات المعرض', 'text'),
('sectors', 'hero', 'sectors_hero_subtitle', 'Explore diverse categories of sustainable products and services', 'استكشف فئات متنوعة من المنتجات والخدمات المستدامة', 'text'),

-- Content & Talks Page
('content', 'hero', 'content_hero_title', 'Content & Talks', 'المحتوى والمحاضرات', 'text'),
('content', 'hero', 'content_hero_subtitle', 'Learn from industry experts and thought leaders', 'تعلم من خبراء الصناعة وقادة الفكر', 'text'),

-- Visitors Page
('visitors', 'hero', 'visitors_hero_title', 'Visit the Expo', 'زر المعرض', 'text'),
('visitors', 'hero', 'visitors_hero_subtitle', 'Discover sustainable living solutions and connect with green innovators', 'اكتشف حلول الحياة المستدامة وتواصل مع المبتكرين الخضر', 'text'),

-- Contact Page
('contact', 'hero', 'contact_hero_title', 'Contact Us', 'اتصل بنا', 'text'),
('contact', 'hero', 'contact_hero_subtitle', 'Get in touch with our team', 'تواصل مع فريقنا', 'text'),
('contact', 'form', 'form_name_label', 'Name', 'الاسم', 'text'),
('contact', 'form', 'form_email_label', 'Email', 'البريد الإلكتروني', 'text'),
('contact', 'form', 'form_phone_label', 'Phone', 'الهاتف', 'text'),
('contact', 'form', 'form_company_label', 'Company', 'الشركة', 'text'),
('contact', 'form', 'form_message_label', 'Message', 'الرسالة', 'text'),
('contact', 'form', 'form_submit_button', 'Send Message', 'إرسال الرسالة', 'text')

ON CONFLICT (page_name, section_name, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  content_value_ar = EXCLUDED.content_value_ar,
  content_type = EXCLUDED.content_type;