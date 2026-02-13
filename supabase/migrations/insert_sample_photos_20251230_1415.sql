-- Insert sample photos for different pages
INSERT INTO photos_premium_20251225 (photo_name, photo_url, photo_alt, page_location, section_name, display_order, is_active) VALUES
-- Homepage photos
('Green Life Expo Hero', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80', 'Green Life Expo main banner', 'home', 'hero', 1, true),
('Sustainable Living', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80', 'Sustainable living showcase', 'home', 'features', 2, true),
('Organic Products', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80', 'Organic products display', 'home', 'features', 3, true),

-- About page photos
('About Green Life', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80', 'About Green Life Expo', 'about', 'hero', 1, true),

-- Exhibitors page photos
('Exhibitor Showcase', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80', 'Exhibitor showcase area', 'exhibitors', 'hero', 1, true),
('Exhibition Hall', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80', 'Exhibition hall overview', 'exhibitors', 'gallery', 2, true),

-- Visitors page photos
('Visitor Experience 1', 'https://images.unsplash.com/photo-1648501909236-6d15a74c5cfb?w=600&auto=format&fit=crop&q=80', 'Visitor experience showcase', 'visitors', 'gallery', 1, true),
('Visitor Experience 2', 'https://images.unsplash.com/photo-1599048961640-3dcd9ee60d72?w=600&auto=format&fit=crop&q=80', 'Interactive visitor area', 'visitors', 'gallery', 2, true),
('Visitor Experience 3', 'https://images.unsplash.com/photo-1582016609297-053772cc6649?w=600&auto=format&fit=crop&q=80', 'Visitor engagement zone', 'visitors', 'gallery', 3, true)

ON CONFLICT DO NOTHING;