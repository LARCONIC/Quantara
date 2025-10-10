import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (matching the schema)
export interface Profile {
  id: string
  email: string
  role: 'normal' | 'client' | 'member' | 'admin'
  sub_role?: string
  status: 'pending' | 'active' | 'suspended'
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface ClientApplication {
  id: string
  email: string
  org_name: string
  description: string
  budget_range: string
  status: 'pending' | 'approved' | 'rejected'
  contact_person?: string
  phone?: string
  website?: string
  additional_info?: Record<string, any>
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface InviteCode {
  code: string
  purpose: string
  role: 'normal' | 'client' | 'member' | 'admin'
  single_use: boolean
  max_uses: number
  current_uses: number
  used_by: string[]
  expires_at?: string
  created_by: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  description?: string
  owner_client: string
  assigned_members: string[]
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  budget_allocated?: number
  start_date?: string
  end_date?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  table_name: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Auth helper functions with proper error handling
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Unexpected error getting current user:', error)
    return null
  }
}

export const getCurrentProfile = async (): Promise<Profile | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) return null
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error getting current profile:', error)
      return null
    }
    
    return profile
  } catch (error) {
    console.error('Unexpected error getting current profile:', error)
    return null
  }
}

export const signUp = async (email: string, password: string, additionalData?: Record<string, any>) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: additionalData
      }
    })
    return { data, error }
  } catch (error) {
    console.error('Unexpected error during sign up:', error)
    return { data: null, error }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    console.error('Unexpected error during sign in:', error)
    return { data: null, error }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Unexpected error during sign out:', error)
    return { error }
  }
}

// Database helper functions
export const submitClientApplication = async (applicationData: Omit<ClientApplication, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('client_applications')
      .insert([applicationData])
      .select()
      .single()
    
    return { data, error }
  } catch (error) {
    console.error('Unexpected error submitting application:', error)
    return { data: null, error }
  }
}

export const approveClientApplication = async (applicationId: string) => {
  try {
    const { data, error } = await supabase.rpc('approve_client_application', {
      application_id: applicationId
    })
    
    return { data, error }
  } catch (error) {
    console.error('Unexpected error approving application:', error)
    return { data: null, error }
  }
}

// Type guards for better type safety
export const isProfile = (obj: any): obj is Profile => {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string' && typeof obj.role === 'string'
}

export const isClientApplication = (obj: any): obj is ClientApplication => {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string' && typeof obj.org_name === 'string'
}

// Constants for roles and statuses
export const USER_ROLES = {
  NORMAL: 'normal' as const,
  CLIENT: 'client' as const,
  MEMBER: 'member' as const,
  ADMIN: 'admin' as const
}

export const USER_STATUSES = {
  PENDING: 'pending' as const,
  ACTIVE: 'active' as const,
  SUSPENDED: 'suspended' as const
}

export const APPLICATION_STATUSES = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const
}