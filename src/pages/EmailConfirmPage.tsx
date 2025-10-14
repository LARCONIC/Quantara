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
        // Get the token from URL parameters
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'signup') {
          setStatus('error')
          setMessage('Invalid confirmation link. Please check your email and try again.')
          return
        }

        // Verify the email confirmation
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) {
          console.error('Email confirmation error:', error)
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
        } else {
          setStatus('error')
          setMessage('Email confirmation failed. Please try again.')
        }

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