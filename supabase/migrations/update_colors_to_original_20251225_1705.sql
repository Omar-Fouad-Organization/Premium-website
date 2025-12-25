-- Update Premium Website Colors to Match Original
-- Created: 2025-12-25 17:05 UTC

-- Update color settings to match original website
UPDATE site_settings_premium_20251225
SET setting_value = CASE setting_key
  WHEN 'color_primary' THEN '130 45% 30%'  -- Deep Natural Green #2A7038
  WHEN 'color_secondary' THEN '135 35% 56%'  -- Lighter Green #68B87B
  WHEN 'color_accent' THEN '43 65% 53%'  -- Soft Gold/Warm Sand #D4AF37
  WHEN 'color_background' THEN '40 25% 97%'  -- Off-white/Beige #F8F6F0
  ELSE setting_value
END
WHERE setting_key IN ('color_primary', 'color_secondary', 'color_accent', 'color_background');

-- Update color descriptions
UPDATE site_settings_premium_20251225
SET description = CASE setting_key
  WHEN 'color_primary' THEN 'Primary brand color (Deep Natural Green #2A7038)'
  WHEN 'color_secondary' THEN 'Secondary color (Lighter Green #68B87B)'
  WHEN 'color_accent' THEN 'Accent color (Soft Gold/Warm Sand #D4AF37)'
  WHEN 'color_background' THEN 'Background color (Off-white/Beige #F8F6F0)'
  ELSE description
END
WHERE setting_key IN ('color_primary', 'color_secondary', 'color_accent', 'color_background');