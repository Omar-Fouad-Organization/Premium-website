-- Add Blog Navigation Translation
-- Created: 2025-12-26 01:15 UTC

INSERT INTO translations_premium_20251225 (translation_key, english_text, arabic_text, category) VALUES
('nav_blog', 'Blog', 'المدونة', 'navigation'),
('blog', 'Blog', 'المدونة', 'common')
ON CONFLICT (translation_key) DO UPDATE SET
  english_text = EXCLUDED.english_text,
  arabic_text = EXCLUDED.arabic_text;