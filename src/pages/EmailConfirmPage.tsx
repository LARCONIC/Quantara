import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

const EmailConfirmPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get parameters from URL
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const access_token = searchParams.get('access_token')
        const refresh_token = searchParams.get('refresh_token')

        console.log('URL params:', { token_hash, type, access_token, refresh_token })

        // Method 1: If we have access_token and refresh_token, set the session directly
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          })

          if (error) {
            console.error('Session error:', error)
            setStatus('error')
            setMessage(`Session setup failed: ${error.message}`)
            return
          }

          if (data.user) {
            setStatus('success')
            setMessage('Email confirmed successfully! You can now log in to your admin account.')
            
            // Redirect to auth page after 3 seconds
            setTimeout(() => {
              navigate('/auth')
            }, 3000)
            return
          }
        }

        // Method 2: If we have token_hash, verify OTP
        if (token_hash && type) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any
          })

          if (error) {
            console.error('OTP verification error:', error)
            setStatus('error')
            setMessage(`Confirmation failed: ${error.message}`)
            return
          }

          if (data.user) {
            setStatus('success')
            setMessage('Email confirmed successfully! You can now log in to your admin account.')
            
            // Redirect to auth page after 3 seconds
            setTimeout(() => {
              navigate('/auth')
            }, 3000)
            return
          }
        }

        // Method 3: Check if user is already authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (user && user.email_confirmed_at) {
          setStatus('success')
          setMessage('Email already confirmed! You can now log in to your admin account.')
          
          setTimeout(() => {
            navigate('/auth')
          }, 3000)
          return
        }

        // If none of the methods worked
        setStatus('error')
        setMessage('Invalid or expired confirmation link. Please try creating your admin account again.')

      } catch (error: any) {
        console.error('Unexpected error during email confirmation:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    handleEmailConfirmation()
  }, [searchParams, navigate])

  const handleManualRedirect = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && <Loader2 className="w-12 h-12 animate-spin text-blue-500" />}
            {status === 'success' && <CheckCircle className="w-12 h-12 text-green-500" />}
            {status === 'error' && <XCircle className="w-12 h-12 text-red-500" />}
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            Email Confirmation
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Confirming your email address...'}
            {status === 'success' && 'Email confirmed successfully!'}
            {status === 'error' && 'Confirmation failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className={`${
            status === 'success' ? 'border-green-500 bg-green-500/10' : 
            status === 'error' ? 'border-red-500 bg-red-500/10' : 
            'border-blue-500 bg-blue-500/10'
          }`}>
            <AlertDescription className={`${
              status === 'success' ? 'text-green-400' : 
              status === 'error' ? 'text-red-400' : 
              'text-blue-400'
            }`}>
              {message}
            </AlertDescription>
          </Alert>

          {status === 'success' && (
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-400">
                You will be redirected to the login page automatically in a few seconds.
              </p>
              <Button onClick={handleManualRedirect} className="w-full">
                Go to Login Now
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-400">
                If you continue to have issues, please try creating your admin account again.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/admin-setup')} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleManualRedirect} className="flex-1">
                  Go to Login
                </Button>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Please wait while we confirm your email address...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailConfirmPage