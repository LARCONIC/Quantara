import { supabase } from '../lib/supabase'

/**
 * Admin Setup Utility
 * Provides functions to create admin accounts and manage user roles
 */

export interface AdminSetupResult {
  success: boolean
  message: string
  data?: any
}

/**
 * Creates the first admin user in the system
 * This should only be used during initial setup
 */
export const createFirstAdmin = async (
  email: string, 
  password: string
): Promise<AdminSetupResult> => {
  try {
    // Check if any admin already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      return { success: false, message: `Database error: ${checkError.message}` }
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return { 
        success: false, 
        message: 'Admin already exists. Use the existing admin account to create more admins.' 
      }
    }

    // Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return { success: false, message: `Auth error: ${authError.message}` }
    }

    if (!authData.user) {
      return { success: false, message: 'Failed to create user account' }
    }

    // Update the profile to admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin', 
        status: 'active' 
      })
      .eq('id', authData.user.id)

    if (profileError) {
      return { success: false, message: `Profile update error: ${profileError.message}` }
    }

    return { 
      success: true, 
      message: 'Admin account created successfully! Please check your email to verify your account.',
      data: { userId: authData.user.id, email }
    }

  } catch (error: any) {
    return { success: false, message: `Unexpected error: ${error.message}` }
  }
}

/**
 * Promotes an existing user to admin role
 * Can only be called by existing admins
 */
export const promoteToAdmin = async (
  targetEmail: string,
  currentUserRole: string
): Promise<AdminSetupResult> => {
  try {
    // Check if current user is admin
    if (currentUserRole !== 'admin') {
      return { success: false, message: 'Only admins can promote users to admin role' }
    }

    // Find the target user
    const { data: targetUser, error: findError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', targetEmail)
      .single()

    if (findError) {
      return { success: false, message: `User not found: ${findError.message}` }
    }

    if (targetUser.role === 'admin') {
      return { success: false, message: 'User is already an admin' }
    }

    // Update to admin role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin', 
        status: 'active' 
      })
      .eq('email', targetEmail)

    if (updateError) {
      return { success: false, message: `Failed to promote user: ${updateError.message}` }
    }

    return { 
      success: true, 
      message: `Successfully promoted ${targetEmail} to admin role`,
      data: { email: targetEmail, newRole: 'admin' }
    }

  } catch (error: any) {
    return { success: false, message: `Unexpected error: ${error.message}` }
  }
}

/**
 * Gets admin statistics
 */
export const getAdminStats = async (): Promise<AdminSetupResult> => {
  try {
    const [adminsResult, usersResult, applicationsResult] = await Promise.all([
      supabase.from('profiles').select('id').eq('role', 'admin'),
      supabase.from('profiles').select('id'),
      supabase.from('client_applications').select('id, status')
    ])

    if (adminsResult.error || usersResult.error || applicationsResult.error) {
      return { success: false, message: 'Failed to fetch statistics' }
    }

    const stats = {
      totalAdmins: adminsResult.data?.length || 0,
      totalUsers: usersResult.data?.length || 0,
      totalApplications: applicationsResult.data?.length || 0,
      pendingApplications: applicationsResult.data?.filter(app => app.status === 'pending').length || 0
    }

    return { success: true, message: 'Statistics retrieved', data: stats }

  } catch (error: any) {
    return { success: false, message: `Error fetching stats: ${error.message}` }
  }
}