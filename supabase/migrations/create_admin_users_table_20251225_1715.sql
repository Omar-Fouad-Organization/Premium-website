-- Create Admin Users Table
-- Created: 2025-12-25 17:15 UTC

-- Admin Users Table for tracking admin access
CREATE TABLE IF NOT EXISTS admin_users_premium_20251225 (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_users_premium_20251225 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Admin Users
-- Authenticated users can view all admin users
CREATE POLICY "Authenticated users can view admin users" 
  ON admin_users_premium_20251225 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Authenticated users can insert admin users
CREATE POLICY "Authenticated users can create admin users" 
  ON admin_users_premium_20251225 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can delete admin users
CREATE POLICY "Authenticated users can delete admin users" 
  ON admin_users_premium_20251225 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Authenticated users can update admin users
CREATE POLICY "Authenticated users can update admin users" 
  ON admin_users_premium_20251225 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users_premium_20251225(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_created_at ON admin_users_premium_20251225(created_at DESC);

-- Insert current authenticated users as admins (if any exist)
-- This will help populate the table with existing users
INSERT INTO admin_users_premium_20251225 (id, email, role)
SELECT 
  id,
  email,
  'admin'
FROM auth.users
WHERE email IS NOT NULL
ON CONFLICT (id) DO NOTHING;