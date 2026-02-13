-- Check photos in database
SELECT id, photo_name, photo_url, page_location, section_name, display_order, is_active 
FROM photos_premium_20251225 
ORDER BY page_location, section_name, display_order;