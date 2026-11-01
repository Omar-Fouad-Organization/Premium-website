-- Create partners table for footer partners section
CREATE TABLE IF NOT EXISTS partners_premium_20251230 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  logo_url TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE partners_premium_20251230 ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (for website display)
CREATE POLICY "Allow public read access to active partners" ON partners_premium_20251230
  FOR SELECT USING (is_active = true);

-- Policy for authenticated users (admin) to manage partners
CREATE POLICY "Allow authenticated users full access to partners" ON partners_premium_20251230
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('partner_logos', 'partner_logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for partner logos
CREATE POLICY "Allow public read access to partner logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'partner_logos');

CREATE POLICY "Allow authenticated users to upload partner logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'partner_logos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update partner logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'partner_logos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete partner logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'partner_logos' AND auth.role() = 'authenticated');

-- Insert sample partners
INSERT INTO partners_premium_20251230 (name, name_ar, logo_url, website_url, display_order, is_active) VALUES
('Partner Company 1', 'شركة الشريك الأول', 'https://via.placeholder.com/200x80/2A7038/FFFFFF?text=Partner+1', 'https://example.com', 1, true),
('Partner Company 2', 'شركة الشريك الثاني', 'https://via.placeholder.com/200x80/68B87B/FFFFFF?text=Partner+2', 'https://example.com', 2, true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners_premium_20251230 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();