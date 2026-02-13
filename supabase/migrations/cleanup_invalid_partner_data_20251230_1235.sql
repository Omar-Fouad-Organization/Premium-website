-- Clean up invalid partner logo URLs
UPDATE partners_premium_20251230 
SET logo_url = '/images/green_life_expo_logo_variations_20251225134629_1.webp'
WHERE logo_url IS NULL 
   OR logo_url = '' 
   OR logo_url LIKE '%FFFFFF%'
   OR logo_url NOT LIKE 'http%' AND logo_url NOT LIKE '/%';

-- Also ensure all partners have valid names
UPDATE partners_premium_20251230 
SET name = 'Partner Company'
WHERE name IS NULL OR name = '';

-- Set inactive any partners with still invalid data
UPDATE partners_premium_20251230 
SET is_active = false
WHERE logo_url IS NULL OR logo_url = '' OR name IS NULL OR name = '';