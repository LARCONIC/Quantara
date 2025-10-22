-- BYPASS EMAIL CONFIRMATION - CREATE ADMIN DIRECTLY
-- This creates an admin account without needing email confirmation

-- Step 1: Disable RLS temporarily for admin creation
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Create admin profile directly
INSERT INTO profiles (id, email, role, status, created_at, updated_at)
VALUES (
  '302debab-1325-450c-9c80-bea04d94006f',
  'yourancient0@gmail.com',
  'admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  status = 'active',
  updated_at = NOW();

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple policies that work
CREATE POLICY "allow_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "allow_profile_creation" ON profiles
  FOR INSERT WITH CHECK (true);

-- Step 5: Verify admin was created
SELECT id, email, role, status FROM profiles WHERE email = 'yourancient0@gmail.com';

-- INSTRUCTIONS:
-- 1. Run this script in Supabase SQL Editor
-- 2. Admin account will be created directly
-- 3. You can then log in at: https://quantara-l.vercel.app/login
-- 4. Use email: yourancient0@gmail.com
-- 5. Use the password you tried to create with