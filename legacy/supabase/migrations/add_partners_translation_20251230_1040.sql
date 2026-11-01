-- Add footer partners translation
INSERT INTO translations_premium_20251225 (translation_key, english_text, arabic_text, category) VALUES
('footer_partners', 'Our Partners', 'شركاؤنا', 'footer')
ON CONFLICT (translation_key) DO UPDATE SET
english_text = EXCLUDED.english_text,
arabic_text = EXCLUDED.arabic_text;