import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const AdminSetupPage: React.FC = () => {
  const [email, setEmail] = useState('yourancient0@gmail.com')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const createAdminDirectly = async () => {
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Method 1: Try direct profile creation
      console.log('Attempting direct profile creation...')
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: '302debab-1325-450c-9c80-bea04d94006f',
          email,
          role: 'admin',
          status: 'active'
        })

      if (!insertError) {
        setMessage('✅ Admin profile created successfully! You can now log in.')
        return
      }

      console.log('Direct insert failed, trying auth creation...')

      // Method 2: Try auth user creation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // Try to update the profile
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin', status: 'active' })
          .eq('id', authData.user.id)

        if (updateError) {
          console.log('Profile update failed:', updateError)
        }

        setMessage('✅ Admin account created! Check your email for confirmation or try logging in directly.')
      }

    } catch (err: any) {
      console.error('Admin creation error:', err)
      setError(`Failed to create admin: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDirectLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(`Login failed: ${error.message}`)
      } else {
        setMessage('✅ Login successful! Redirecting...')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      }
    } catch (err: any) {
      setError(`Login error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Setup Admin Account</h1>
          <p className="text-gray-300 text-sm">
            Create the first admin account for your Quantara system.
            <br />This is a one-time setup.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-4">
            <p className="text-green-200 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); createAdminDirectly(); }} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum 8 characters"
              required
            />
            <p className="text-gray-400 text-xs mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Admin Account...
              </>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/20">
          <button
            onClick={handleDirectLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Try Direct Login
          </button>
          <p className="text-gray-400 text-xs text-center mt-2">
            Use this if admin account already exists
          </p>
        </div>

        <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">📝 Important Notes:</h3>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• This creates the first admin account</li>
            <li>• You'll need to verify your email</li>
            <li>• Keep these credentials secure</li>
            <li>• You can create more admins later</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminSetupPage