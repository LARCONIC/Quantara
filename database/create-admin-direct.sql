-- QUANTARA EMAIL CONFIRMATION FIX
-- Fixes the confirmation URL redirect issue

-- =====================================================
-- CREATE ADMIN DIRECTLY (BYPASS EMAIL CONFIRMATION)
-- =====================================================

-- Create admin profile directly without email confirmation
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

-- =====================================================
-- CREATE AUTH USER ENTRY (IF NEEDED)
-- =====================================================

-- This ensures the user can log in
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '302debab-1325-450c-9c80-bea04d94006f',
  'authenticated',
  'authenticated',
  'yourancient0@gmail.com',
  crypt('YourPassword123!', gen_salt('bf')), -- Replace with your desired password
  NOW(), -- Email confirmed
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email_confirmed_at = NOW(),
  updated_at = NOW();

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Check if admin was created successfully
SELECT 
  p.id,
  p.email,
  p.role,
  p.status,
  u.email_confirmed_at
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'yourancient0@gmail.com';

-- =====================================================
-- EXECUTION NOTES
-- =====================================================

/*
EXECUTE THIS SCRIPT TO:

1. Create admin profile directly
2. Create auth user entry
3. Bypass email confirmation
4. Enable immediate login

AFTER RUNNING:
- Admin account will be ready
- Can log in immediately
- No email confirmation needed
- Full admin privileges

REPLACE 'YourPassword123!' with your desired admin password
*/