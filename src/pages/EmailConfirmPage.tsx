import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { CheckCircle, XCircle, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'

/**
 * SCANNER-PROOF EMAIL CONFIRMATION PAGE
 * 
 * This page prevents email scanner issues by requiring manual user action.
 * Email scanners can't click buttons, only follow links automatically.
 * 
 * Flow:
 * 1. User clicks email link → Lands on this page
 * 2. Page shows "Confirm Email" button (NOT automatic)
 * 3. User clicks button → Email confirmed
 * 4. Redirect to login
 * 
 * This is the enterprise standard used by GitHub, GitLab, and other major platforms.
 */

const EmailConfirmPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'pending' | 'confirming' | 'success' | 'error'>('pending')
  const [message, setMessage] = useState('')

  // Extract token from URL
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const handleConfirmEmail = async () => {
    if (!token_hash || !type) {
      setStatus('error')
      setMessage('Invalid confirmation link. Please request a new confirmation email.')
      return
    }

    setStatus('confirming')
    setMessage('Confirming your email...')

    try {
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
        setMessage('Email confirmed successfully! Redirecting to login...')
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/auth')
        }, 2000)
        return
      }

      // Shouldn't reach here, but handle it
      setStatus('error')
      setMessage('Confirmation failed. Please try again.')

    } catch (error: any) {
      console.error('Unexpected error during confirmation:', error)
      setStatus('error')
      setMessage('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'pending' && <Mail className="w-16 h-16 text-blue-400" />}
            {status === 'confirming' && <Loader2 className="w-16 h-16 animate-spin text-blue-400" />}
            {status === 'success' && <CheckCircle className="w-16 h-16 text-green-400" />}
            {status === 'error' && <XCircle className="w-16 h-16 text-red-400" />}
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-white text-2xl">
            <ShieldCheck className="w-6 h-6" />
            Email Confirmation
          </CardTitle>
          <CardDescription className="text-gray-300">
            {status === 'pending' && 'Click the button below to confirm your email address'}
            {status === 'confirming' && 'Confirming your email...'}
            {status === 'success' && 'Email confirmed successfully!'}
            {status === 'error' && 'Confirmation failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'pending' && (
            <>
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <AlertDescription className="text-blue-200 text-sm">
                  <strong>Security Notice:</strong> To prevent automated systems from confirming your email, 
                  please click the button below to complete your registration.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleConfirmEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
                disabled={!token_hash || !type}
              >
                Confirm My Email Address
              </Button>

              {(!token_hash || !type) && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-200 text-sm">
                    Invalid confirmation link. Please check your email and try again.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {status === 'confirming' && (
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <AlertDescription className="text-blue-200">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <>
              <Alert className="border-green-500/50 bg-green-500/10">
                <AlertDescription className="text-green-200">
                  {message}
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                Go to Login Now
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-200">
                  {message}
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate('/admin-setup')}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Go to Login
                </Button>
              </div>
            </>
          )}

          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400">
              Having trouble? Contact support or try creating your account again.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailConfirmPage