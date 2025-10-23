import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * ENTERPRISE EMAIL CONFIRMATION HANDLER
 * Implements Supabase's recommended approach for enterprise email scanning
 * This prevents email scanners from invalidating confirmation links
 */

const EmailConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Extract token and type from URL
  const token = searchParams.get('token')
  const type = searchParams.get('type')
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')

  const handleConfirmation = async () => {
    if (!token || !type) {
      setError('Invalid confirmation link. Missing required parameters.')
      return
    }

    setLoading(true)
    setError('')

    try {
      let result

      if (type === 'signup') {
        // Handle email confirmation
        result = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        })
      } else if (type === 'recovery') {
        // Handle password reset
        result = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery'
        })
      } else if (accessToken && refreshToken) {
        // Handle session from URL fragments
        result = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
      } else {
        throw new Error('Unknown confirmation type')
      }

      if (result.error) {
        throw result.error
      }

      setSuccess(true)
      
      // Redirect to appropriate page after successful confirmation
      setTimeout(() => {
        if (type === 'recovery') {
          navigate('/reset-password')
        } else {
          navigate('/dashboard')
        }
      }, 2000)

    } catch (err: any) {
      console.error('Confirmation error:', err)
      setError(`Confirmation failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email Confirmation</h1>
          <p className="text-gray-300 text-sm">
            Click the button below to confirm your email address and complete your account setup.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-200 text-sm">
                Email confirmed successfully! Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}

        {!success && (
          <button
            onClick={handleConfirmation}
            disabled={loading || !token}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirming Email...
              </>
            ) : (
              'Confirm Email Address'
            )}
          </button>
        )}

        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">🔒 Security Notice</h3>
            <p className="text-blue-200 text-sm">
              This confirmation process protects against email scanning systems that may invalidate links. 
              Click the button above to safely complete your email verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmationPage