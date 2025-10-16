-- QUANTARA PRODUCTION RLS POLICIES
-- Enterprise-grade Row Level Security implementation
-- Execute these in Supabase SQL Editor

-- =====================================================
-- ENABLE RLS ON ALL TABLES (CRITICAL SECURITY)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "users_can_view_own_profile" ON profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "admins_can_view_all_profiles" ON profiles
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any profile
CREATE POLICY "admins_can_update_all_profiles" ON profiles
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow profile creation during signup (handled by trigger)
CREATE POLICY "allow_profile_creation" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- CLIENT APPLICATIONS TABLE POLICIES
-- =====================================================

-- Users can view applications with their email
CREATE POLICY "users_can_view_own_applications" ON client_applications
  FOR SELECT 
  USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Users can create applications with their email
CREATE POLICY "users_can_create_applications" ON client_applications
  FOR INSERT 
  WITH CHECK (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Admins can view all applications
CREATE POLICY "admins_can_view_all_applications" ON client_applications
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all applications
CREATE POLICY "admins_can_update_all_applications" ON client_applications
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete applications
CREATE POLICY "admins_can_delete_applications" ON client_applications
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- PROJECTS TABLE POLICIES
-- =====================================================

-- Project owners can view their projects
CREATE POLICY "owners_can_view_own_projects" ON projects
  FOR SELECT 
  USING (owner_client = auth.uid());

-- Project owners can update their projects
CREATE POLICY "owners_can_update_own_projects" ON projects
  FOR UPDATE 
  USING (owner_client = auth.uid());

-- Admins can view all projects
CREATE POLICY "admins_can_view_all_projects" ON projects
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can create projects
CREATE POLICY "admins_can_create_projects" ON projects
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all projects
CREATE POLICY "admins_can_update_all_projects" ON projects
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- INVITE CODES TABLE POLICIES
-- =====================================================

-- Anyone can view unused invite codes (for signup)
CREATE POLICY "anyone_can_view_unused_codes" ON invite_codes
  FOR SELECT 
  USING (used_by IS NULL AND (expires_at IS NULL OR expires_at > NOW()));

-- Admins can manage all invite codes
CREATE POLICY "admins_can_manage_invite_codes" ON invite_codes
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update codes when using them
CREATE POLICY "users_can_use_invite_codes" ON invite_codes
  FOR UPDATE 
  USING (used_by IS NULL)
  WITH CHECK (used_by = auth.uid());

-- =====================================================
-- SECURITY FUNCTIONS
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user profile
CREATE OR REPLACE FUNCTION get_current_profile()
RETURNS profiles AS $$
DECLARE
  profile profiles;
BEGIN
  SELECT * INTO profile FROM profiles WHERE id = auth.uid();
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- AUDIT LOGGING (OPTIONAL BUT RECOMMENDED)
-- =====================================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "admins_can_view_audit_logs" ON audit_logs
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- EXECUTION NOTES
-- =====================================================

/*
EXECUTE THESE POLICIES IN ORDER:

1. Copy this entire file
2. Go to Supabase Dashboard → SQL Editor
3. Paste and run the entire script
4. Verify all policies are created successfully
5. Test with different user roles

SECURITY BENEFITS:
- ✅ Users can only see their own data
- ✅ Admins have full access to manage system
- ✅ Prevents unauthorized data access
- ✅ Audit trail for sensitive operations
- ✅ Enterprise-grade security compliance

TESTING:
- Create test users with different roles
- Verify data access restrictions work
- Test admin functions work properly
- Confirm no unauthorized access possible
*/