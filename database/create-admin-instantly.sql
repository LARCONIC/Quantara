-- ✅ INSTANT ADMIN ACCOUNT CREATION
-- Run this in Supabase SQL Editor to create admin account immediately
-- No email confirmation needed!

-- Step 1: Create the auth user with confirmed email
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'yourancient0@gmail.com',
  crypt('YourPassword123', gen_salt('bf')), -- CHANGE THIS PASSWORD!
  NOW(), -- Email already confirmed!
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Step 2: Create the profile with admin role
INSERT INTO public.profiles (
  id,
  email,
  role,
  status,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  'admin',
  'active',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'yourancient0@gmail.com';

-- ✅ Done! You can now login at https://quantara-l.vercel.app/auth
-- Email: yourancient0@gmail.com
-- Password: YourPassword123 (or whatever you set above)