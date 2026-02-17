-- Check partners table data and clean up any issues
SELECT * FROM partners_premium_20251230 ORDER BY display_order;

-- Clean up any invalid data
DELETE FROM partners_premium_20251230 WHERE name IS NULL OR name = '';

-- Update any partners with invalid URLs
UPDATE partners_premium_20251230 
SET logo_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop&q=80'
WHERE logo_url IS NULL OR logo_url = '' OR logo_url = 'invalid-url';

-- Ensure display_order is sequential
UPDATE partners_premium_20251230 
SET display_order = row_number() OVER (ORDER BY created_at);