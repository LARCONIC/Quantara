import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Loader2, Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { createFirstAdmin, getAdminStats } from '../utils/adminSetup'

const AdminSetupPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAdmins, setCheckingAdmins] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [adminExists, setAdminExists] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkExistingAdmins()
  }, [])

  const checkExistingAdmins = async () => {
    try {
      const result = await getAdminStats()
      if (result.success && result.data) {
        setAdminExists(result.data.totalAdmins > 0)
      }
    } catch (error) {
      console.error('Error checking admins:', error)
    } finally {
      setCheckingAdmins(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const result = await createFirstAdmin(email, password)
      
      if (result.success) {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth')
        }, 3000)
      } else {
        setError(result.message)
      }
    } catch (error: any) {
      setError(`Setup failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (checkingAdmins) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Checking system status...</p>
        </div>
      </div>
    )
  }

  if (adminExists) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Already Exists</CardTitle>
            <CardDescription className="text-gray-400">
              The system already has an admin account. Please use the existing admin credentials to log in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Created Successfully!</CardTitle>
            <CardDescription className="text-gray-400">
              Your admin account has been created. Please check your email to verify your account, then you can log in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-gray-500">
              Redirecting to login in 3 seconds...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-gray-900/50 border-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Setup Admin Account</CardTitle>
          <CardDescription className="text-gray-400">
            Create the first admin account for your Quantara system. This is a one-time setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="admin@quantara.dev"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="••••••••"
                minLength={8}
              />
              <p className="text-xs text-gray-500">Minimum 8 characters</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="••••••••"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Admin Account...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Create Admin Account
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Important Notes:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• This creates the first admin account</li>
              <li>• You'll need to verify your email</li>
              <li>• Keep these credentials secure</li>
              <li>• You can create more admins later</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSetupPage