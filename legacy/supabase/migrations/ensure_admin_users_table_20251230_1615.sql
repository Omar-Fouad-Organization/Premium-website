-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users_premium_20251225 (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for admin_users table
ALTER TABLE admin_users_premium_20251225 ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read admin users
CREATE POLICY "Allow authenticated users to read admin users" ON admin_users_premium_20251225
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to manage admin users
CREATE POLICY "Allow authenticated users to manage admin users" ON admin_users_premium_20251225
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users_premium_20251225 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();