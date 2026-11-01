-- Create partners table with correct schema
CREATE TABLE IF NOT EXISTS partners_premium_20251230 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    logo_url TEXT,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for partners table
ALTER TABLE partners_premium_20251230 ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read partners
CREATE POLICY "Allow authenticated users to read partners" ON partners_premium_20251230
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to manage partners
CREATE POLICY "Allow authenticated users to manage partners" ON partners_premium_20251230
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partners_updated_at 
    BEFORE UPDATE ON partners_premium_20251230 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample partners data
INSERT INTO partners_premium_20251230 (name, name_ar, logo_url, website_url, display_order, is_active) VALUES
('Green Tech Solutions', 'حلول التكنولوجيا الخضراء', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop&q=80', 'https://greentechsolutions.com', 1, true),
('Organic Foods Egypt', 'الأغذية العضوية مصر', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=100&fit=crop&q=80', 'https://organicfoodsegypt.com', 2, true),
('Sustainable Living Co', 'شركة الحياة المستدامة', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=100&fit=crop&q=80', 'https://sustainableliving.co', 3, true),
('EcoFriendly Products', 'المنتجات الصديقة للبيئة', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=100&fit=crop&q=80', 'https://ecofriendlyproducts.com', 4, true),
('Natural Beauty Egypt', 'الجمال الطبيعي مصر', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=100&fit=crop&q=80', 'https://naturalbeautyegypt.com', 5, true)
ON CONFLICT DO NOTHING;