-- Check partners table data
SELECT id, name, logo_url, website_url, display_order, is_active FROM partners_premium_20251230 ORDER BY display_order;

-- Clean up any invalid data
DELETE FROM partners_premium_20251230 WHERE name IS NULL OR name = '';

-- Update any partners with invalid URLs
UPDATE partners_premium_20251230 
SET logo_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop&q=80'
WHERE logo_url IS NULL OR logo_url = '' OR logo_url LIKE '%invalid%';