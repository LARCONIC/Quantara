-- Row Level Security Policies for Quantara
-- This file contains all RLS policies for secure data access

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is member or admin
CREATE OR REPLACE FUNCTION is_member_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('member', 'admin')
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is client, member, or admin
CREATE OR REPLACE FUNCTION is_authenticated_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('client', 'member', 'admin')
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- Users can update their own profile (except role and status)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND role = (SELECT role FROM profiles WHERE id = auth.uid())
        AND status = (SELECT status FROM profiles WHERE id = auth.uid())
    );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT 
    USING (is_admin());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE 
    USING (is_admin());

-- Members can view other members and clients
CREATE POLICY "Members can view team profiles" ON profiles
    FOR SELECT 
    USING (
        is_member_or_admin() 
        AND role IN ('client', 'member', 'admin')
    );

-- Profiles are automatically created via trigger, no manual INSERT needed
CREATE POLICY "Profiles auto-created only" ON profiles
    FOR INSERT 
    WITH CHECK (false);

-- Only admins can delete profiles (soft delete recommended)
CREATE POLICY "Admins can delete profiles" ON profiles
    FOR DELETE 
    USING (is_admin());

-- =============================================
-- CLIENT APPLICATIONS TABLE POLICIES
-- =============================================

-- Anyone can submit applications (public form)
CREATE POLICY "Anyone can submit applications" ON client_applications
    FOR INSERT 
    WITH CHECK (true);

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON client_applications
    FOR SELECT 
    USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON client_applications
    FOR SELECT 
    USING (is_admin());

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update applications" ON client_applications
    FOR UPDATE 
    USING (is_admin())
    WITH CHECK (is_admin());

-- Members can view approved applications
CREATE POLICY "Members can view approved applications" ON client_applications
    FOR SELECT 
    USING (
        is_member_or_admin() 
        AND status = 'approved'
    );

-- Only admins can delete applications
CREATE POLICY "Admins can delete applications" ON client_applications
    FOR DELETE 
    USING (is_admin());

-- =============================================
-- INVITE CODES TABLE POLICIES
-- =============================================

-- Only admins can create invite codes
CREATE POLICY "Admins can create invite codes" ON invite_codes
    FOR INSERT 
    WITH CHECK (is_admin());

-- Admins can view all invite codes
CREATE POLICY "Admins can view all invite codes" ON invite_codes
    FOR SELECT 
    USING (is_admin());

-- Admins can update invite codes
CREATE POLICY "Admins can update invite codes" ON invite_codes
    FOR UPDATE 
    USING (is_admin());

-- Anyone can view valid invite codes (for registration)
CREATE POLICY "Anyone can view valid invite codes" ON invite_codes
    FOR SELECT 
    USING (
        expires_at IS NULL 
        OR expires_at > NOW()
    );

-- Admins can delete invite codes
CREATE POLICY "Admins can delete invite codes" ON invite_codes
    FOR DELETE 
    USING (is_admin());

-- =============================================
-- PROJECTS TABLE POLICIES
-- =============================================

-- Clients can view their own projects
CREATE POLICY "Clients can view own projects" ON projects
    FOR SELECT 
    USING (
        owner_client = auth.uid()
        OR auth.uid() = ANY(assigned_members)
    );

-- Members and admins can view all projects
CREATE POLICY "Team can view all projects" ON projects
    FOR SELECT 
    USING (is_member_or_admin());

-- Admins can create projects
CREATE POLICY "Admins can create projects" ON projects
    FOR INSERT 
    WITH CHECK (is_admin());

-- Admins and assigned members can update projects
CREATE POLICY "Team can update projects" ON projects
    FOR UPDATE 
    USING (
        is_admin() 
        OR auth.uid() = ANY(assigned_members)
    );

-- Only admins can delete projects
CREATE POLICY "Admins can delete projects" ON projects
    FOR DELETE 
    USING (is_admin());

-- =============================================
-- AUDIT LOGS TABLE POLICIES
-- =============================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT 
    USING (is_admin());

-- Audit logs are created automatically, no manual INSERT
CREATE POLICY "Audit logs auto-created only" ON audit_logs
    FOR INSERT 
    WITH CHECK (false);

-- Audit logs cannot be updated
CREATE POLICY "Audit logs immutable" ON audit_logs
    FOR UPDATE 
    WITH CHECK (false);

-- Audit logs cannot be deleted (permanent record)
CREATE POLICY "Audit logs permanent" ON audit_logs
    FOR DELETE 
    USING (false);

-- =============================================
-- SECURITY FUNCTIONS FOR APPLICATION LAYER
-- =============================================

-- Function to safely promote user to admin (with validation)
CREATE OR REPLACE FUNCTION promote_user_to_admin(target_email TEXT)
RETURNS JSONB AS $$
DECLARE
    target_user_id UUID;
    current_user_role TEXT;
    result JSONB;
BEGIN
    -- Check if current user is admin
    SELECT role INTO current_user_role 
    FROM profiles 
    WHERE id = auth.uid();
    
    IF current_user_role != 'admin' THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Only admins can promote users'
        );
    END IF;
    
    -- Find target user
    SELECT id INTO target_user_id 
    FROM profiles 
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'User not found'
        );
    END IF;
    
    -- Update user role
    UPDATE profiles 
    SET role = 'admin', status = 'active'
    WHERE id = target_user_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'User promoted to admin successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely approve client application
CREATE OR REPLACE FUNCTION approve_client_application(application_id UUID)
RETURNS JSONB AS $$
DECLARE
    app_email TEXT;
    user_id UUID;
    result JSONB;
BEGIN
    -- Check if current user is admin
    IF NOT is_admin() THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Only admins can approve applications'
        );
    END IF;
    
    -- Get application email
    SELECT email INTO app_email 
    FROM client_applications 
    WHERE id = application_id;
    
    IF app_email IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Application not found'
        );
    END IF;
    
    -- Update application status
    UPDATE client_applications 
    SET 
        status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = NOW()
    WHERE id = application_id;
    
    -- Update user role if they have an account
    UPDATE profiles 
    SET role = 'client', status = 'active'
    WHERE email = app_email;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Application approved successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_member_or_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_authenticated_user() TO authenticated;
GRANT EXECUTE ON FUNCTION promote_user_to_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION approve_client_application(UUID) TO authenticated;