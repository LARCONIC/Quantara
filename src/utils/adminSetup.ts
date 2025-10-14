import { supabase } from '../lib/supabase'

/**
 * Admin Setup Utility
 * Provides functions to create admin accounts and manage user roles
 * Works with proper database schema and RLS policies
 */

export interface AdminSetupResult {
  success: boolean
  message: string
  data?: any
  error?: string
}

/**
 * Get the correct redirect URL based on environment
 */
const getRedirectUrl = (): string => {
  const currentUrl = window.location.origin
  
  // Always use the current domain for redirect
  return `${currentUrl}/confirm`
}

/**
 * Creates the first admin user in the system
 * This should only be used during initial setup
 * Uses proper database functions for security
 */
export const createFirstAdmin = async (
  email: string, 
  password: string
): Promise<AdminSetupResult> => {
  try {
    // Validate input
    if (!email || !password) {
      return { 
        success: false, 
        message: 'Email and password are required',
        error: 'VALIDATION_ERROR'
      }
    }

    if (password.length < 8) {
      return { 
        success: false, 
        message: 'Password must be at least 8 characters long',
        error: 'PASSWORD_TOO_SHORT'
      }
    }

    if (!email.includes('@')) {
      return { 
        success: false, 
        message: 'Please enter a valid email address',
        error: 'INVALID_EMAIL'
      }
    }

    // Check if any admin already exists (using RLS-safe query)
    const { data: existingAdmins, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      console.error('Database check error:', checkError)
      return { 
        success: false, 
        message: 'Unable to verify admin status. Please try again.',
        error: 'DATABASE_ERROR'
      }
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return { 
        success: false, 
        message: 'An admin account already exists. Please use the existing admin credentials to log in.',
        error: 'ADMIN_EXISTS'
      }
    }

    // Get the correct redirect URL
    const redirectUrl = getRedirectUrl()
    console.log('Using redirect URL:', redirectUrl)

    // Create the user account with proper redirect URL
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          role: 'admin', // This will be used by the trigger
          is_first_admin: true
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return { 
        success: false, 
        message: `Account creation failed: ${authError.message}`,
        error: 'AUTH_ERROR'
      }
    }

    if (!authData.user) {
      return { 
        success: false, 
        message: 'Failed to create user account. Please try again.',
        error: 'USER_CREATION_FAILED'
      }
    }

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update the profile to admin role using a direct update
    // This bypasses RLS since we're creating the first admin
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin', 
        status: 'active' 
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      // Try to clean up the auth user if profile update fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError)
      }
      
      return { 
        success: false, 
        message: 'Failed to set admin privileges. Please contact support.',
        error: 'PROFILE_UPDATE_FAILED'
      }
    }

    return { 
      success: true, 
      message: `Admin account created successfully! Please check your email and click the confirmation link. Make sure to open the email on the same device/browser where you created the account.`,
      data: { 
        userId: authData.user.id, 
        email,
        needsVerification: !authData.user.email_confirmed_at,
        redirectUrl
      }
    }

  } catch (error: any) {
    console.error('Unexpected error in createFirstAdmin:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.',
      error: 'UNEXPECTED_ERROR'
    }
  }
}

/**
 * Promotes an existing user to admin role
 * Uses database function for security and proper validation
 */
export const promoteToAdmin = async (
  targetEmail: string,
  currentUserRole: string
): Promise<AdminSetupResult> => {
  try {
    // Validate input
    if (!targetEmail || !targetEmail.includes('@')) {
      return { 
        success: false, 
        message: 'Please enter a valid email address',
        error: 'INVALID_EMAIL'
      }
    }

    // Client-side role check (server-side validation in RPC)
    if (currentUserRole !== 'admin') {
      return { 
        success: false, 
        message: 'Only administrators can promote users to admin role',
        error: 'INSUFFICIENT_PERMISSIONS'
      }
    }

    // Use the secure database function for promotion
    const { data, error } = await supabase.rpc('promote_user_to_admin', {
      target_email: targetEmail
    })

    if (error) {
      console.error('RPC error:', error)
      return { 
        success: false, 
        message: 'Failed to promote user. Please try again.',
        error: 'RPC_ERROR'
      }
    }

    if (!data || !data.success) {
      return { 
        success: false, 
        message: data?.message || 'Failed to promote user',
        error: 'PROMOTION_FAILED'
      }
    }

    return { 
      success: true, 
      message: `Successfully promoted ${targetEmail} to admin role`,
      data: { email: targetEmail, newRole: 'admin' }
    }

  } catch (error: any) {
    console.error('Unexpected error in promoteToAdmin:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.',
      error: 'UNEXPECTED_ERROR'
    }
  }
}

/**
 * Gets comprehensive admin statistics
 * Uses proper queries with RLS compliance
 */
export const getAdminStats = async (): Promise<AdminSetupResult> => {
  try {
    // Use Promise.allSettled for better error handling
    const results = await Promise.allSettled([
      supabase.from('profiles').select('id, role').eq('role', 'admin'),
      supabase.from('profiles').select('id, role, status'),
      supabase.from('client_applications').select('id, status')
    ])

    // Check if any queries failed
    const [adminsResult, usersResult, applicationsResult] = results

    if (adminsResult.status === 'rejected' || 
        usersResult.status === 'rejected' || 
        applicationsResult.status === 'rejected') {
      console.error('Stats query errors:', results)
      return { 
        success: false, 
        message: 'Unable to fetch statistics. Please try again.',
        error: 'STATS_QUERY_FAILED'
      }
    }

    const adminsData = adminsResult.value.data || []
    const usersData = usersResult.value.data || []
    const applicationsData = applicationsResult.value.data || []

    const stats = {
      totalAdmins: adminsData.length,
      totalUsers: usersData.length,
      activeUsers: usersData.filter(user => user.status === 'active').length,
      pendingUsers: usersData.filter(user => user.status === 'pending').length,
      totalApplications: applicationsData.length,
      pendingApplications: applicationsData.filter(app => app.status === 'pending').length,
      approvedApplications: applicationsData.filter(app => app.status === 'approved').length,
      rejectedApplications: applicationsData.filter(app => app.status === 'rejected').length,
      usersByRole: {
        admin: usersData.filter(user => user.role === 'admin').length,
        member: usersData.filter(user => user.role === 'member').length,
        client: usersData.filter(user => user.role === 'client').length,
        normal: usersData.filter(user => user.role === 'normal').length
      }
    }

    return { 
      success: true, 
      message: 'Statistics retrieved successfully',
      data: stats
    }

  } catch (error: any) {
    console.error('Unexpected error in getAdminStats:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred while fetching statistics.',
      error: 'UNEXPECTED_ERROR'
    }
  }
}

/**
 * Validates if the current user has admin privileges
 * Used for client-side route protection
 */
export const validateAdminAccess = async (): Promise<AdminSetupResult> => {
  try {
    const profile = await getCurrentProfile()
    
    if (!profile) {
      return { 
        success: false, 
        message: 'User not authenticated',
        error: 'NOT_AUTHENTICATED'
      }
    }

    if (profile.role !== 'admin') {
      return { 
        success: false, 
        message: 'Insufficient privileges. Admin access required.',
        error: 'INSUFFICIENT_PRIVILEGES'
      }
    }

    return { 
      success: true, 
      message: 'Admin access validated',
      data: { profile }
    }

  } catch (error: any) {
    console.error('Unexpected error in validateAdminAccess:', error)
    return { 
      success: false, 
      message: 'Unable to validate admin access. Please try again.',
      error: 'VALIDATION_ERROR'
    }
  }
}

// Helper function to get current profile (imported from supabase.ts)
const getCurrentProfile = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return null
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) return null
    return profile
  } catch (error) {
    console.error('Error getting current profile:', error)
    return null
  }
}