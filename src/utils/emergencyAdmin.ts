import { supabase } from '../lib/supabase'

/**
 * EMERGENCY ADMIN CREATION
 * Use this if email confirmation is not working
 * This bypasses email confirmation and creates admin directly
 */

export const createAdminDirectly = async (email: string, password: string) => {
  try {
    console.log('Creating admin directly...')
    
    // Step 1: Create auth user without email confirmation
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'admin'
      }
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      return { success: false, error: authError.message }
    }

    console.log('Auth user created:', authData.user?.id)

    // Step 2: Create profile directly
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        role: 'admin',
        status: 'active'
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { success: false, error: profileError.message }
    }

    console.log('Profile created successfully')
    return { 
      success: true, 
      message: 'Admin created successfully! You can now log in.',
      userId: authData.user.id 
    }

  } catch (error: any) {
    console.error('Unexpected error:', error)
    return { success: false, error: error.message }
  }
}

// Usage example:
// createAdminDirectly('yourancient0@gmail.com', 'your-password')