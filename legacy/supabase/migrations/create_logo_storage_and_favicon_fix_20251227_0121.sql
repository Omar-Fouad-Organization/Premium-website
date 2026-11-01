-- Create storage bucket for logos and favicons
-- Created: 2025-12-27 01:21 UTC

-- Create storage bucket for premium logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'premium_logos',
  'premium_logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access for Logo Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete logos" ON storage.objects;

-- Set up storage policy for public access
CREATE POLICY "Public Access for Logo Uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'premium_logos');

CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'premium_logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'premium_logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'premium_logos' AND auth.role() = 'authenticated');

-- Add favicon_url column to site_settings table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings_premium_20251225' 
    AND column_name = 'favicon_url'
  ) THEN
    ALTER TABLE site_settings_premium_20251225 
    ADD COLUMN favicon_url TEXT;
  END IF;
END $$;

-- Update default favicon if not set
UPDATE site_settings_premium_20251225
SET favicon_url = '/favicon.ico'
WHERE favicon_url IS NULL OR favicon_url = '';