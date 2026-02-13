-- Create photos table if it doesn't exist
CREATE TABLE IF NOT EXISTS photos_premium_20251225 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    photo_name VARCHAR(255) NOT NULL,
    photo_url TEXT NOT NULL,
    photo_alt VARCHAR(255),
    page_location VARCHAR(50) NOT NULL,
    section_name VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('premium_photos', 'premium_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for photos table
ALTER TABLE photos_premium_20251225 ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read access to photos" ON photos_premium_20251225
    FOR SELECT USING (true);

-- Policy for authenticated users to manage photos
CREATE POLICY "Allow authenticated users to manage photos" ON photos_premium_20251225
    FOR ALL USING (auth.role() = 'authenticated');

-- Storage policies for premium_photos bucket
CREATE POLICY "Allow public read access to premium_photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'premium_photos');

CREATE POLICY "Allow authenticated users to upload to premium_photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'premium_photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update premium_photos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'premium_photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete from premium_photos" ON storage.objects
    FOR DELETE USING (bucket_id = 'premium_photos' AND auth.role() = 'authenticated');