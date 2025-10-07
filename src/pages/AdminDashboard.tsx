import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus,
  Mail,
  Building,
  DollarSign
} from 'lucide-react'
import { supabase, ClientApplication, Profile } from '../lib/supabase'

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth()
  const [applications, setApplications] = useState<ClientApplication[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch client applications
      const { data: appsData, error: appsError } = await supabase
        .from('client_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (appsError) throw appsError

      // Fetch user profiles
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

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'text-purple-400 border-purple-400',
      member: 'text-blue-400 border-blue-400',
      client: 'text-green-400 border-green-400',
      normal: 'text-gray-400 border-gray-400'
    }
    return <Badge variant="outline" className={colors[role as keyof typeof colors] || colors.normal}>{role}</Badge>
  }

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    totalUsers: profiles.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {profile?.email}</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.approvedApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="applications" className="data-[state=active]:bg-gray-800">
              Applications ({stats.pendingApplications})
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-800">
              Users ({stats.totalUsers})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Partnership Applications</h2>
              <Button onClick={fetchData} variant="outline" size="sm">
                Refresh
              </Button>
            </div>

            {applications.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No applications yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id} className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {application.org_name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3" />
                            {application.email}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(application.status)}
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {application.budget_range}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{application.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Applied: {new Date(application.created_at).toLocaleDateString()}
                        </p>
                        {application.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-400 border-red-400 hover:bg-red-400/10"
                              onClick={() => handleApplicationAction(application.id, 'rejected')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApplicationAction(application.id, 'approved')}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Button onClick={fetchData} variant="outline" size="sm">
                Refresh
              </Button>
            </div>

            {profiles.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No users yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {profiles.map((user) => (
                  <Card key={user.id} className="bg-gray-900/50 border-gray-800">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{user.email}</p>
                          <p className="text-sm text-gray-400">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          <Badge 
                            variant="outline" 
                            className={user.status === 'active' ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'}
                          >
                            {user.status}
                          </Badge>
                          {user.sub_role && (
                            <Badge variant="outline" className="text-gray-400 border-gray-400">
                              {user.sub_role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard