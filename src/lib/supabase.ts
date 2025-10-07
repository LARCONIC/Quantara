import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://jkdbtisgxykaojavnxoc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZGJ0aXNneHlrYW9qYXZueG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxOTc0NzQsImV4cCI6MjA0Mzc3MzQ3NH0.YourActualAnonKey'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  role: 'normal' | 'client' | 'member' | 'admin'
  sub_role?: 'developer' | 'designer' | 'manager' | 'intern'
  status: 'pending' | 'active'
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
  created_at: string
}

export interface InviteCode {
  code: string
  purpose: string
  single_use: boolean
  used_by?: string
  expires_at?: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  owner_client: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  created_at: string
  updated_at: string
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getCurrentProfile = async () => {
  const user = await getCurrentUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}