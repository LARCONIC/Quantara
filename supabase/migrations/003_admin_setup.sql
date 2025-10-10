-- Admin Setup Functions
-- Special functions for initial admin creation that bypass RLS

-- =============================================
-- ADMIN SETUP FUNCTION
-- =============================================

-- Function to create the first admin (bypasses RLS for initial setup)
CREATE OR REPLACE FUNCTION create_first_admin(
    admin_email TEXT,
    admin_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    existing_admin_count INTEGER;
    result JSONB;
BEGIN
    -- Check if any admin already exists
    SELECT COUNT(*) INTO existing_admin_count
    FROM profiles 
    WHERE role = 'admin';
    
    IF existing_admin_count > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Admin already exists in the system'
        );
    END IF;
    
    -- Create or update the profile with admin role
    INSERT INTO profiles (id, email, role, status, full_name)
    VALUES (
        admin_user_id,
        admin_email,
        'admin',
        'pending', -- Will be activated after email verification
        'System Administrator'
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        status = CASE 
            WHEN NEW.status = 'active' THEN 'active'::user_status
            ELSE 'pending'::user_status
        END,
        updated_at = NOW();
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'First admin created successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'message', 'Failed to create admin: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_first_admin(TEXT, UUID) TO authenticated;