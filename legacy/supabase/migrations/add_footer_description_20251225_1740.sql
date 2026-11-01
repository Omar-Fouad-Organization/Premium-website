-- Add Footer Description Translation
-- Created: 2025-12-25 17:40 UTC

INSERT INTO translations_premium_20251225 (translation_key, english_text, arabic_text, category) VALUES
('footer_description', 'Egypt''s leading platform for sustainable living, organic products, and green innovation.', 'المنصة الرائدة في مصر للحياة المستدامة والمنتجات العضوية والابتكار الأخضر.', 'footer')
ON CONFLICT (translation_key) DO UPDATE SET
  english_text = EXCLUDED.english_text,
  arabic_text = EXCLUDED.arabic_text;