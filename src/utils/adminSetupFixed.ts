import { supabase } from '../lib/supabase'

/**
 * FIXED Admin Setup Utility
 * Uses database functions to bypass RLS issues
 * Provides secure admin creation without infinite recursion
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
  return `${currentUrl}/confirm`
}

/**
 * Check if any admin exists using the safe database function
 */
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('admin_exists')
    
    if (error) {
      console.error('Error checking admin existence:', error)
      return false // Assume no admin exists if we can't check
    }
    
    return data === true
  } catch (error) {
    console.error('Unexpected error checking admin:', error)
    return false
  }
}

/**
 * Creates the first admin user using the secure database function
 * This bypasses RLS issues and auto-confirms the email
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

    // Check if admin already exists using safe function
    const adminExists = await checkAdminExists()
    
    if (adminExists) {
      return { 
        success: false, 
        message: 'An admin account already exists. Please use the existing admin credentials to log in.',
        error: 'ADMIN_EXISTS'
      }
    }

    // Use the database function to create the first admin
    const { data, error } = await supabase.rpc('create_first_admin', {
      admin_email: email,
      admin_password: password
    })

    if (error) {
      console.error('Database function error:', error)
      return { 
        success: false, 
        message: 'Failed to create admin account. Please try again.',
        error: 'DATABASE_ERROR'
      }
    }

    if (!data || !data.success) {
      return { 
        success: false, 
        message: data?.message || 'Failed to create admin account',
        error: data?.error || 'CREATION_FAILED'
      }
    }

    return { 
      success: true, 
      message: 'Admin account created successfully! You can now log in directly - no email confirmation needed.',
      data: { 
        userId: data.user_id, 
        email: data.email,
        needsVerification: false, // Auto-confirmed by database function
        autoConfirmed: true
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
 * Alternative method using Supabase Auth (with email confirmation)
 * Use this if you want email confirmation flow
 */
export const createFirstAdminWithEmail = async (
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

    // Check if admin already exists
    const adminExists = await checkAdminExists()
    
    if (adminExists) {
      return { 
        success: false, 
        message: 'An admin account already exists.',
        error: 'ADMIN_EXISTS'
      }
    }

    // Get the correct redirect URL
    const redirectUrl = getRedirectUrl()

    // Create the user account with proper redirect URL
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          role: 'admin',
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

    return { 
      success: true, 
      message: 'Admin account created! Please check your email and click the confirmation link.',
      data: { 
        userId: authData.user.id, 
        email,
        needsVerification: !authData.user.email_confirmed_at,
        redirectUrl
      }
    }

  } catch (error: any) {
    console.error('Unexpected error in createFirstAdminWithEmail:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.',
      error: 'UNEXPECTED_ERROR'
    }
  }
}

/**
 * Get admin statistics safely
 */
export const getAdminStats = async (): Promise<AdminSetupResult> => {
  try {
    // Use the safe admin check function
    const adminExists = await checkAdminExists()
    
    return {
      success: true,
      message: 'Admin stats retrieved successfully',
      data: {
        hasAdmin: adminExists,
        setupRequired: !adminExists
      }
    }
  } catch (error: any) {
    console.error('Error getting admin stats:', error)
    return {
      success: false,
      message: 'Failed to get admin statistics',
      error: 'STATS_ERROR'
    }
  }
}

export default {
  createFirstAdmin,
  createFirstAdminWithEmail,
  checkAdminExists,
  getAdminStats
}