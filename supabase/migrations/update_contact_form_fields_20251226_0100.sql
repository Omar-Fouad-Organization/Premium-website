-- Update Contact Form with Title, Country, and Country Code
-- Created: 2025-12-26 01:00 UTC

-- Add new columns to contact submissions table
ALTER TABLE contact_submissions_premium_20251225 
ADD COLUMN IF NOT EXISTS title VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS country_code VARCHAR(10);

-- Add form labels for new fields to page content
INSERT INTO page_content_premium_20251225 (page_name, section_name, content_key, content_value, content_value_ar, content_type) VALUES
('contact', 'form', 'form_title_label', 'Title', 'المسمى الوظيفي', 'text'),
('contact', 'form', 'form_title_placeholder', 'e.g., CEO, Manager, Director', 'مثال: الرئيس التنفيذي، مدير، مدير عام', 'text'),
('contact', 'form', 'form_country_label', 'Country', 'الدولة', 'text'),
('contact', 'form', 'form_country_placeholder', 'Select your country', 'اختر دولتك', 'text'),
('contact', 'form', 'form_country_code_label', 'Country Code', 'رمز الدولة', 'text'),
('contact', 'form', 'form_country_code_placeholder', '+20', '+20', 'text')
ON CONFLICT (page_name, section_name, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  content_value_ar = EXCLUDED.content_value_ar,
  content_type = EXCLUDED.content_type;