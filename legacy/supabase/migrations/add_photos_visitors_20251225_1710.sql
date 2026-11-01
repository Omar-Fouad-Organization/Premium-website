-- Add Photo Management and Visitor Submissions
-- Created: 2025-12-25 17:10 UTC

-- Photos Table for managing all website images
CREATE TABLE IF NOT EXISTS photos_premium_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_name TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  photo_alt TEXT,
  page_location TEXT NOT NULL, -- 'home', 'about', 'exhibitors', 'sponsors', 'sectors', 'content', 'visitors', 'contact'
  section_name TEXT, -- 'hero', 'gallery', 'features', etc.
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor Registrations Table
CREATE TABLE IF NOT EXISTS visitor_registrations_premium_20251225 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  country TEXT,
  interests TEXT[], -- Array of interests
  visit_date TEXT, -- Preferred visit date
  how_heard TEXT, -- How they heard about the expo
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default photos for each page
INSERT INTO photos_premium_20251225 (photo_name, photo_url, photo_alt, page_location, section_name, display_order) VALUES
-- Homepage photos
('Hero Background', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&auto=format&fit=crop&q=80', 'Organic vegetables and healthy food', 'home', 'hero', 1),
('Organic Food', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80', 'Fresh organic produce', 'home', 'sectors', 2),
('Health & Wellness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80', 'Yoga and wellness', 'home', 'sectors', 3),
('Sustainable Living', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80', 'Eco-friendly products', 'home', 'sectors', 4),

-- About page photos
('About Hero', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&auto=format&fit=crop&q=80', 'Green living exhibition', 'about', 'hero', 1),
('Vision Image', 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&auto=format&fit=crop&q=80', 'Sustainable future', 'about', 'vision', 2),

-- Exhibitors page photos
('Exhibitors Hero', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=80', 'Exhibition booth', 'exhibitors', 'hero', 1),
('Booth Setup', 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format&fit=crop&q=80', 'Professional booth', 'exhibitors', 'benefits', 2),

-- Sponsors page photos
('Sponsors Hero', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&auto=format&fit=crop&q=80', 'Partnership handshake', 'sponsors', 'hero', 1),
('Partnership', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80', 'Business partnership', 'sponsors', 'benefits', 2),

-- Sectors page photos
('Sectors Hero', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&auto=format&fit=crop&q=80', 'Organic market', 'sectors', 'hero', 1),

-- Content & Talks page photos
('Content Hero', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&auto=format&fit=crop&q=80', 'Conference speaker', 'content', 'hero', 1),

-- Visitors page photos
('Visitors Hero', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=80', 'Expo visitors', 'visitors', 'hero', 1),

-- Contact page photos
('Contact Hero', 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&auto=format&fit=crop&q=80', 'Contact us', 'contact', 'hero', 1)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE photos_premium_20251225 ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_registrations_premium_20251225 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Photos
CREATE POLICY "Public can view active photos" ON photos_premium_20251225 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage photos" ON photos_premium_20251225 
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for Visitor Registrations
CREATE POLICY "Anyone can submit visitor registration" ON visitor_registrations_premium_20251225 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view visitor registrations" ON visitor_registrations_premium_20251225 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update visitor registrations" ON visitor_registrations_premium_20251225 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create storage bucket for uploaded photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('premium_photos', 'premium_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for premium photos
CREATE POLICY "Public can view premium photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'premium_photos');

CREATE POLICY "Authenticated users can upload premium photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'premium_photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update premium photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'premium_photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete premium photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'premium_photos' AND auth.role() = 'authenticated');