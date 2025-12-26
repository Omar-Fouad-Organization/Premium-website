-- Create Blogs Table with Bilingual Support
-- Created: 2025-12-26 01:10 UTC

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs_premium_20251226 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  excerpt_ar TEXT,
  content TEXT NOT NULL,
  content_ar TEXT,
  cover_image_url TEXT,
  author VARCHAR(100),
  author_ar VARCHAR(100),
  category VARCHAR(100),
  category_ar VARCHAR(100),
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs_premium_20251226(is_published, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs_premium_20251226(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs_premium_20251226(category);

-- Enable Row Level Security
ALTER TABLE blogs_premium_20251226 ENABLE ROW LEVEL SECURITY;

-- Create policies for blogs
CREATE POLICY "Allow public read access to published blogs"
  ON blogs_premium_20251226
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Allow authenticated users full access"
  ON blogs_premium_20251226
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample blog posts
INSERT INTO blogs_premium_20251226 (title, title_ar, slug, excerpt, excerpt_ar, content, content_ar, cover_image_url, author, author_ar, category, category_ar, is_published, published_date) VALUES
(
  'The Future of Sustainable Living in Egypt',
  'مستقبل الحياة المستدامة في مصر',
  'future-sustainable-living-egypt',
  'Discover how Egypt is leading the way in sustainable practices and green innovation across the Middle East.',
  'اكتشف كيف تقود مصر الطريق في الممارسات المستدامة والابتكار الأخضر في الشرق الأوسط.',
  'Egypt is experiencing a remarkable transformation in sustainable living practices. From renewable energy projects to organic farming initiatives, the country is positioning itself as a leader in green innovation. This article explores the key trends and developments shaping Egypt''s sustainable future.',
  'تشهد مصر تحولاً ملحوظاً في ممارسات الحياة المستدامة. من مشاريع الطاقة المتجددة إلى مبادرات الزراعة العضوية، تضع الدولة نفسها كقائد في الابتكار الأخضر. يستكشف هذا المقال الاتجاهات والتطورات الرئيسية التي تشكل مستقبل مصر المستدام.',
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop&q=80',
  'Green Life Team',
  'فريق الحياة الخضراء',
  'Sustainability',
  'الاستدامة',
  true,
  NOW()
),
(
  'Top 10 Organic Products to Try This Year',
  'أفضل 10 منتجات عضوية لتجربتها هذا العام',
  'top-10-organic-products-2025',
  'A curated list of the best organic products that are making waves in the sustainable living community.',
  'قائمة منتقاة من أفضل المنتجات العضوية التي تحدث ضجة في مجتمع الحياة المستدامة.',
  'The organic products market is booming with innovative solutions for healthier living. From organic skincare to sustainable food products, we''ve compiled a list of must-try items that combine quality, sustainability, and effectiveness.',
  'يشهد سوق المنتجات العضوية ازدهاراً مع حلول مبتكرة لحياة أكثر صحة. من العناية بالبشرة العضوية إلى المنتجات الغذائية المستدامة، قمنا بتجميع قائمة من العناصر التي يجب تجربتها والتي تجمع بين الجودة والاستدامة والفعالية.',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
  'Sarah Ahmed',
  'سارة أحمد',
  'Products',
  'المنتجات',
  true,
  NOW() - INTERVAL '2 days'
),
(
  'Green Technology Innovations Transforming Industries',
  'ابتكارات التكنولوجيا الخضراء تحول الصناعات',
  'green-technology-innovations',
  'Explore the latest green technology innovations that are revolutionizing how businesses operate sustainably.',
  'استكشف أحدث ابتكارات التكنولوجيا الخضراء التي تحدث ثورة في كيفية عمل الشركات بشكل مستدام.',
  'Green technology is no longer a luxury—it''s a necessity. This article examines cutting-edge innovations in renewable energy, waste management, and sustainable manufacturing that are helping businesses reduce their environmental footprint while improving efficiency.',
  'لم تعد التكنولوجيا الخضراء رفاهية - بل ضرورة. يفحص هذا المقال الابتكارات المتطورة في الطاقة المتجددة وإدارة النفايات والتصنيع المستدام التي تساعد الشركات على تقليل بصمتها البيئية مع تحسين الكفاءة.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  'Mohamed Hassan',
  'محمد حسن',
  'Technology',
  'التكنولوجيا',
  true,
  NOW() - INTERVAL '5 days'
);