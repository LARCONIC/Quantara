-- SAFE DATABASE SETUP FOR EXISTING QUANTARA INSTALLATIONS
-- This script safely updates existing databases without conflicts

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('normal', 'client', 'member', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'completed', 'on_hold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- PROFILES TABLE (Safe update)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'normal' NOT NULL,
    sub_role TEXT,
    status user_status DEFAULT 'pending' NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add missing columns if they don't exist
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sub_role TEXT;
EXCEPTION
    WHEN others THEN null;
END $$;

-- Update existing profiles to use new enum types
DO $$ BEGIN
    -- Convert role column to new enum type if needed
    ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::text::user_role;
    ALTER TABLE profiles ALTER COLUMN status TYPE user_status USING status::text::user_status;
EXCEPTION
    WHEN others THEN 
        RAISE NOTICE 'Role/status columns already using correct types or conversion failed';
END $$;

-- =============================================
-- CLIENT APPLICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS client_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    org_name TEXT NOT NULL,
    description TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    status application_status DEFAULT 'pending' NOT NULL,
    contact_person TEXT,
    phone TEXT,
    website TEXT,
    additional_info JSONB,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add missing columns to existing client_applications
DO $$ BEGIN
    ALTER TABLE client_applications ADD COLUMN IF NOT EXISTS contact_person TEXT;
    ALTER TABLE client_applications ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE client_applications ADD COLUMN IF NOT EXISTS website TEXT;
    ALTER TABLE client_applications ADD COLUMN IF NOT EXISTS additional_info JSONB;
    ALTER TABLE client_applications ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id);
    ALTER TABLE client_applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE client_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
EXCEPTION
    WHEN others THEN null;
END $$;

-- =============================================
-- NEW TABLES
-- =============================================
CREATE TABLE IF NOT EXISTS invite_codes (
    code TEXT PRIMARY KEY,
    purpose TEXT NOT NULL,
    role user_role DEFAULT 'member' NOT NULL,
    single_use BOOLEAN DEFAULT true NOT NULL,
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    used_by UUID[] DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    owner_client UUID REFERENCES profiles(id) NOT NULL,
    assigned_members UUID[] DEFAULT '{}',
    status project_status DEFAULT 'planning' NOT NULL,
    budget_allocated DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =============================================
-- FUNCTIONS (Safe replacement)
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Enhanced function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, role, status, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'normal'),
        CASE 
            WHEN NEW.email_confirmed_at IS NOT NULL THEN 'active'::user_status
            ELSE 'pending'::user_status
        END,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO UPDATE SET
        email = NEW.email,
        status = CASE 
            WHEN NEW.email_confirmed_at IS NOT NULL THEN 'active'::user_status
            ELSE profiles.status
        END,
        updated_at = NOW();
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to handle email confirmation
CREATE OR REPLACE FUNCTION handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profile status when email is confirmed
    IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
        UPDATE profiles 
        SET status = 'active'::user_status
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =============================================
-- TRIGGERS (Safe replacement)
-- =============================================

-- Drop existing triggers if they exist, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_email_confirmation();

-- Updated_at triggers (safe creation)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_client_applications_updated_at ON client_applications;
CREATE TRIGGER update_client_applications_updated_at
    BEFORE UPDATE ON client_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEXES (Safe creation)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_client_applications_email ON client_applications(email);
CREATE INDEX IF NOT EXISTS idx_client_applications_status ON client_applications(status);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_client);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =============================================
-- VERIFICATION QUERY
-- =============================================
-- Run this to verify everything worked:
SELECT 
    'profiles' as table_name,
    COUNT(*) as row_count,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'profiles') as column_count
FROM profiles
UNION ALL
SELECT 
    'client_applications' as table_name,
    COUNT(*) as row_count,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'client_applications') as column_count
FROM client_applications
UNION ALL
SELECT 
    'invite_codes' as table_name,
    COUNT(*) as row_count,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'invite_codes') as column_count
FROM invite_codes
UNION ALL
SELECT 
    'projects' as table_name,
    COUNT(*) as row_count,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'projects') as column_count
FROM projects;