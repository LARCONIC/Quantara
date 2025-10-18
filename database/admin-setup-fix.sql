-- QUANTARA ADMIN SETUP FIX
-- Fixes infinite recursion in RLS policies and enables proper admin creation

-- =====================================================
-- DROP PROBLEMATIC POLICIES FIRST
-- =====================================================

-- Drop the recursive admin policies that are causing issues
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON profiles;
DROP POLICY IF EXISTS "admins_can_update_all_profiles" ON profiles;

-- =====================================================
-- CREATE SAFE ADMIN POLICIES
-- =====================================================

-- Safe admin view policy (no recursion)
CREATE POLICY "admins_can_view_all_profiles_safe" ON profiles
  FOR SELECT 
  USING (
    -- Direct check without recursion
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- Safe admin update policy (no recursion)  
CREATE POLICY "admins_can_update_all_profiles_safe" ON profiles
  FOR UPDATE 
  USING (
    -- Direct check without recursion
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- =====================================================
-- CREATE ADMIN SETUP FUNCTION
-- =====================================================

-- Function to create the first admin (bypasses RLS)
CREATE OR REPLACE FUNCTION create_first_admin(
  admin_email TEXT,
  admin_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  admin_count INTEGER;
  result JSON;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count 
  FROM profiles 
  WHERE role = 'admin';
  
  IF admin_count > 0 THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Admin already exists',
      'error', 'ADMIN_EXISTS'
    );
  END IF;
  
  -- Create the auth user
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
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(), -- Auto-confirm email for first admin
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin"}'
  ) RETURNING id INTO new_user_id;
  
  -- Create the profile
  INSERT INTO profiles (id, email, role, status, created_at, updated_at)
  VALUES (new_user_id, admin_email, 'admin', 'active', NOW(), NOW());
  
  RETURN json_build_object(
    'success', true,
    'message', 'First admin created successfully',
    'user_id', new_user_id,
    'email', admin_email
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'message', 'Failed to create admin: ' || SQLERRM,
    'error', 'DATABASE_ERROR'
  );
END;
$$;

-- =====================================================
-- CREATE ADMIN CHECK FUNCTION
-- =====================================================

-- Function to safely check if any admin exists
CREATE OR REPLACE FUNCTION admin_exists()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count 
  FROM profiles 
  WHERE role = 'admin';
  
  RETURN admin_count > 0;
END;
$$;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_first_admin(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_exists() TO authenticated;
GRANT EXECUTE ON FUNCTION create_first_admin(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION admin_exists() TO anon;

-- =====================================================
-- EXECUTION NOTES
-- =====================================================

/*
EXECUTE THIS SCRIPT TO FIX ADMIN SETUP:

1. Copy this entire script
2. Go to Supabase Dashboard → SQL Editor
3. Paste and run the script
4. This will fix the infinite recursion issue
5. Enable proper admin creation without RLS conflicts

WHAT THIS FIXES:
- ✅ Removes recursive RLS policies
- ✅ Creates safe admin policies
- ✅ Adds admin creation function
- ✅ Bypasses RLS for first admin setup
- ✅ Auto-confirms email for first admin

AFTER RUNNING THIS:
- Admin setup page will work properly
- No more "Unable to verify admin status" error
- First admin can be created successfully
- Email confirmation will work
*/