-- Check and fix logo_url column in site_settings
-- Created: 2025-12-27 01:25 UTC

-- First, let's see the current structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_settings_premium_20251225';

-- Add logo_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings_premium_20251225' 
    AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE site_settings_premium_20251225 
    ADD COLUMN logo_url TEXT;
  END IF;
END $$;

-- Ensure there's at least one row in the table
INSERT INTO site_settings_premium_20251225 (id, logo_url, favicon_url)
SELECT 
  gen_random_uuid(),
  '/images/green_life_expo_logo_variations_20251225134629_1.webp',
  '/favicon.ico'
WHERE NOT EXISTS (SELECT 1 FROM site_settings_premium_20251225 LIMIT 1);

-- Show the current data
SELECT id, logo_url, favicon_url FROM site_settings_premium_20251225 LIMIT 1;