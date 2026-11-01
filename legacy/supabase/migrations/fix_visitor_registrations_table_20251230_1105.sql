-- Check if visitor registrations table exists, if not create it
CREATE TABLE IF NOT EXISTS visitor_registrations_premium_20251225 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  job_title VARCHAR(255),
  country VARCHAR(100),
  interests TEXT[],
  visit_date DATE,
  how_heard VARCHAR(255),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE visitor_registrations_premium_20251225 ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert to visitor registrations" ON visitor_registrations_premium_20251225;
DROP POLICY IF EXISTS "Allow authenticated users full access to visitor registrations" ON visitor_registrations_premium_20251225;

-- Create policies for visitor registrations
CREATE POLICY "Allow public insert to visitor registrations" ON visitor_registrations_premium_20251225
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to visitor registrations" ON visitor_registrations_premium_20251225
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample data for testing
INSERT INTO visitor_registrations_premium_20251225 (name, email, phone, company, job_title, country, interests, visit_date, how_heard, is_read) VALUES
('Ahmed Hassan', 'ahmed@example.com', '+20123456789', 'Green Solutions Ltd', 'Marketing Manager', 'Egypt', ARRAY['Organic Products', 'Sustainability'], '2024-01-15', 'Social Media', false),
('Sarah Johnson', 'sarah@example.com', '+1234567890', 'Eco Innovations', 'CEO', 'USA', ARRAY['Green Technology', 'Renewable Energy'], '2024-01-16', 'Website', false),
('Mohamed Ali', 'mohamed@example.com', '+971501234567', 'Sustainable Living Co', 'Director', 'UAE', ARRAY['Healthy Living', 'Organic Food'], '2024-01-17', 'Email Newsletter', true);