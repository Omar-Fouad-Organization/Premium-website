-- Check page content data
SELECT page_name, section_name, content_key, content_value 
FROM page_content_premium_20251225 
ORDER BY page_name, section_name, display_order
LIMIT 20;