-- Insert comprehensive photo entries for all website sections
-- This ensures every photo used on the website can be managed through the admin panel

-- Clear existing sample data first
DELETE FROM photos_premium_20251225 WHERE photo_name LIKE '%Sample%' OR photo_name LIKE '%Test%';

-- Homepage sections
INSERT INTO photos_premium_20251225 (photo_name, photo_url, photo_alt, page_location, section_name, display_order, is_active) VALUES
-- Homepage Hero
('Homepage Hero Image', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80', 'Green Life Expo main banner showcasing sustainable living', 'home', 'hero', 1, true),

-- Homepage Features (multiple images for different sections)
('Homepage Features - Exhibition Floor', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80', 'Exhibition floor with sustainable products and visitors', 'home', 'features', 1, true),
('Homepage Features - Expert Talks', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80', 'Expert speakers presenting sustainable solutions', 'home', 'features', 2, true),
('Homepage Features - Networking', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80', 'Business networking and connections at the expo', 'home', 'features', 3, true),

-- Homepage Sectors
('Homepage Sectors - Organic Food', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80', 'Organic food and beverages display', 'home', 'sectors', 1, true),
('Homepage Sectors - Health Wellness', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80', 'Health and wellness products showcase', 'home', 'sectors', 2, true),
('Homepage Sectors - Sustainable Living', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80', 'Sustainable living solutions and eco-friendly products', 'home', 'sectors', 3, true),
('Homepage Sectors - Natural Beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80', 'Natural beauty and personal care products', 'home', 'sectors', 4, true),

-- About page sections
('About Hero Image', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80', 'About Green Life Expo - sustainable innovation', 'about', 'hero', 1, true),
('About Mission Image', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80', 'Our mission for sustainable future', 'about', 'mission', 1, true),
('About Vision Image', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80', 'Vision for green innovation in Egypt', 'about', 'vision', 1, true),
('About Values Image', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80', 'Our core values and principles', 'about', 'values', 1, true),

-- Exhibitors page sections
('Exhibitors Hero Image', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80', 'Exhibition space for sustainable businesses', 'exhibitors', 'hero', 1, true),
('Exhibitors Gallery - Networking', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80', 'Business networking and connections', 'exhibitors', 'gallery', 1, true),
('Exhibitors Gallery - Booth Setup', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', 'Professional booth setup and displays', 'exhibitors', 'gallery', 2, true),
('Exhibitors Benefits Image', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80', 'Benefits of exhibiting at Green Life Expo', 'exhibitors', 'benefits', 1, true),

-- Visitors page sections
('Visitors Hero Image', 'https://images.unsplash.com/photo-1648501909236-6d15a74c5cfb?w=600&auto=format&fit=crop&q=80', 'Visitor experience at Green Life Expo', 'visitors', 'hero', 1, true),
('Visitors Gallery - Experience 1', 'https://images.unsplash.com/photo-1599048961640-3dcd9ee60d72?w=600&auto=format&fit=crop&q=80', 'Interactive visitor experience zones', 'visitors', 'gallery', 1, true),
('Visitors Gallery - Experience 2', 'https://images.unsplash.com/photo-1582016609297-053772cc6649?w=600&auto=format&fit=crop&q=80', 'Visitor engagement and learning areas', 'visitors', 'gallery', 2, true),
('Visitors Gallery - Experience 3', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80', 'Product discovery and shopping experience', 'visitors', 'gallery', 3, true),

-- Sponsors page sections
('Sponsors Hero Image', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80', 'Sponsorship opportunities at Green Life Expo', 'sponsors', 'hero', 1, true),
('Sponsors Benefits Image', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80', 'Sponsor benefits and visibility opportunities', 'sponsors', 'benefits', 1, true),

-- Sectors page sections
('Sectors Hero Image', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80', 'Various sustainable sectors and industries', 'sectors', 'hero', 1, true),

-- Content & Talks page sections
('Content Hero Image', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80', 'Expert talks and educational content', 'content', 'hero', 1, true),
('Content Speakers Image', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80', 'Industry speakers and thought leaders', 'content', 'speakers', 1, true),

-- Contact page sections
('Contact Hero Image', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop&q=80', 'Contact us for Green Life Expo inquiries', 'contact', 'hero', 1, true),
('Contact Office Image', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80', 'Our office and team ready to help', 'contact', 'office', 1, true)

ON CONFLICT (photo_name) DO UPDATE SET
    photo_url = EXCLUDED.photo_url,
    photo_alt = EXCLUDED.photo_alt,
    page_location = EXCLUDED.page_location,
    section_name = EXCLUDED.section_name,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;