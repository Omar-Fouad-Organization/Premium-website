-- Create color design settings
INSERT INTO site_settings_premium_20251225 (setting_key, setting_value, setting_type, category, description) VALUES
('primary_color', '#2A7038', 'color', 'colors', 'Primary Brand Color'),
('secondary_color', '#68B87B', 'color', 'colors', 'Secondary Brand Color'),
('accent_color', '#D4AF37', 'color', 'colors', 'Accent Color'),
('background_color', '#FFFFFF', 'color', 'colors', 'Background Color'),
('text_color', '#323232', 'color', 'colors', 'Text Color'),
('muted_color', '#F8F6F0', 'color', 'colors', 'Muted Background Color')
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description;