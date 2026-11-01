-- Add Visitor Registration Control to Site Settings (Fixed)
-- Created: 2025-12-26 01:06 UTC

-- Add visitor registration control columns to site settings
ALTER TABLE site_settings_premium_20251225 
ADD COLUMN IF NOT EXISTS visitor_registration_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS visitor_registration_closed_message TEXT DEFAULT 'Visitor registration is currently closed. Please check back later.',
ADD COLUMN IF NOT EXISTS visitor_registration_closed_message_ar TEXT DEFAULT 'تسجيل الزوار مغلق حالياً. يرجى المحاولة لاحقاً.';

-- Update existing row (get first row)
UPDATE site_settings_premium_20251225 
SET 
  visitor_registration_enabled = true,
  visitor_registration_closed_message = 'Visitor registration is currently closed. Please check back later.',
  visitor_registration_closed_message_ar = 'تسجيل الزوار مغلق حالياً. يرجى المحاولة لاحقاً.'
WHERE id = (SELECT id FROM site_settings_premium_20251225 LIMIT 1);