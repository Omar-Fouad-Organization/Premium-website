-- Check all site settings and their categories
SELECT category, setting_key, setting_value, description 
FROM site_settings_premium_20251225 
ORDER BY category, setting_key;