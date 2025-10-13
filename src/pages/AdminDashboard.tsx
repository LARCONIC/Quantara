import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import UserManagement from '../components/admin/UserManagement'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  Building,
  DollarSign,
  Shield,
  LogOut
} from 'lucide-react'
import { supabase, ClientApplication, Profile } from '../lib/supabase'

const AdminDashboard: React.FC = () => {
  const { profile, signOut } = useAuth()
  const [applications, setApplications] = useState<ClientApplication[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch applications
      const { data: appsData, error: appsError } = await supabase
        .from('client_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (appsError) throw appsError

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      setApplications(appsData || [])
      setProfiles(profilesData || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationAction = async (applicationId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('client_applications')
        .update({ status: action })
        .eq('id', applicationId)

      if (error) throw error

      // If approved, create or update user profile
      if (action === 'approved') {
        const application = applications.find(app => app.id === applicationId)
        if (application) {
          // Check if user already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', application.email)
            .single()

          if (existingProfile) {
            // Update existing profile to client
            await supabase
              .from('profiles')
              .update({ role: 'client', status: 'active' })
              .eq('email', application.email)
          }
        }
      }

      await fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handlePromoteUser = async (email: string) => {
    try {
      // Check if user exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (fetchError) {
        throw new Error('User not found with that email address')
      }

      if (existingProfile.role === 'admin') {
        throw new Error('User is already an admin')
      }

      // Update user role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin', 
          status: 'active' 
        })
        .eq('email', email)

      if (updateError) throw updateError

      // Refresh data
      await fetchData()
    } catch (err: any) {
      throw new Error(err.message || 'Failed to promote user')
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="text-green-400 border-green-400"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="text-red-400 border-red-400"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    totalUsers: profiles.length
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-4">You need admin privileges to access this page.</p>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {profile.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Applications</p>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingApplications}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Approved</p>
                  <p className="text-2xl font-bold">{stats.approvedApplications}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-gray-400">Partnership applications will appear here when submitted.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            {application.org_name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {application.email}
                          </CardDescription>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">Description</h4>
                          <p className="text-gray-400 text-sm">{application.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Budget: {application.budget_range}</span>
                        </div>
                        {application.status === 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApplicationAction(application.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleApplicationAction(application.id, 'rejected')}
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement 
              users={profiles}
              onPromoteUser={handlePromoteUser}
              isLoading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard