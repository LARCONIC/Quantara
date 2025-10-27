import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * ENTERPRISE-GRADE EMAIL CONFIRMATION HANDLER
 * Implements proper PKCE flow for email confirmation
 * Follows Supabase production best practices
 */

const EmailConfirmationHandler: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing email confirmation...')

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // PKCE Flow: Extract code from URL
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Handle error from Supabase
        if (error) {
          console.error('Supabase auth error:', error, errorDescription)
          setStatus('error')
          setMessage(errorDescription || 'Authentication failed. Please try again.')
          return
        }

        // PKCE Flow: Exchange code for session
        if (code) {
          console.log('Exchanging code for session...')
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Code exchange error:', exchangeError)
            setStatus('error')
            setMessage(`Confirmation failed: ${exchangeError.message}`)
            return
          }

          if (data.session) {
            console.log('Session established successfully')
            setStatus('success')
            setMessage('Email confirmed successfully! Redirecting to dashboard...')
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              navigate('/dashboard')
            }, 2000)
            return
          }
        }

        // Fallback: Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          console.log('User already authenticated')
          setStatus('success')
          setMessage('You are already logged in. Redirecting...')
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
          return
        }

        // No code and no session
        setStatus('error')
        setMessage('Invalid confirmation link. Please try creating your account again.')

      } catch (error: any) {
        console.error('Unexpected error during confirmation:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    handleEmailConfirmation()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {status === 'loading' && (
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {status === 'success' && (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email Confirmation</h1>
          <p className="text-gray-300 text-sm">
            {status === 'loading' && 'Verifying your email address...'}
            {status === 'success' && 'Email confirmed successfully!'}
            {status === 'error' && 'Confirmation failed'}
          </p>
        </div>

        <div className={`rounded-lg p-4 mb-6 ${
          status === 'success' ? 'bg-green-500/20 border border-green-500/50' :
          status === 'error' ? 'bg-red-500/20 border border-red-500/50' :
          'bg-blue-500/20 border border-blue-500/50'
        }`}>
          <p className={`text-sm ${
            status === 'success' ? 'text-green-200' :
            status === 'error' ? 'text-red-200' :
            'text-blue-200'
          }`}>
            {message}
          </p>
        </div>

        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin-setup')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Try Creating Account Again
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'success' && (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Dashboard Now
          </button>
        )}
      </div>
    </div>
  )
}

export default EmailConfirmationHandler