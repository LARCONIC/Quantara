import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog'
import { 
  UserPlus, 
  Shield, 
  Users, 
  Crown, 
  Briefcase, 
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { Profile } from '../../lib/supabase'
import { promoteToAdmin } from '../../utils/adminSetup'

interface UserManagementProps {
  profiles: Profile[]
  currentUserRole: string
  onRefresh: () => void
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  profiles, 
  currentUserRole, 
  onRefresh 
}) => {
  const [promoteEmail, setPromoteEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePromoteToAdmin = async () => {
    if (!promoteEmail.trim()) {
      setError('Please enter an email address')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await promoteToAdmin(promoteEmail, currentUserRole)
      
      if (result.success) {
        setSuccess(result.message)
        setPromoteEmail('')
        setIsDialogOpen(false)
        onRefresh()
      } else {
        setError(result.message)
      }
    } catch (error: any) {
      setError(`Failed to promote user: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-purple-400" />
      case 'member':
        return <Briefcase className="w-4 h-4 text-blue-400" />
      case 'client':
        return <Users className="w-4 h-4 text-green-400" />
      default:
        return <User className="w-4 h-4 text-gray-400" />
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-400',
      member: 'bg-blue-500/20 text-blue-400 border-blue-400',
      client: 'bg-green-500/20 text-green-400 border-green-400',
      normal: 'bg-gray-500/20 text-gray-400 border-gray-400'
    }
    return (
      <Badge variant="outline" className={colors[role as keyof typeof colors] || colors.normal}>
        {getRoleIcon(role)}
        <span className="ml-1 capitalize">{role}</span>
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-400">
        <XCircle className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    )
  }

  const roleStats = {
    admin: profiles.filter(p => p.role === 'admin').length,
    member: profiles.filter(p => p.role === 'member').length,
    client: profiles.filter(p => p.role === 'client').length,
    normal: profiles.filter(p => p.role === 'normal').length,
  }

  return (
    <div className="space-y-6">
      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-purple-400">{roleStats.admin}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Members</p>
                <p className="text-2xl font-bold text-blue-400">{roleStats.member}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Clients</p>
                <p className="text-2xl font-bold text-green-400">{roleStats.client}</p>
              </div>
              <Users className="w-8 h-8 text-green-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Users</p>
                <p className="text-2xl font-bold text-gray-400">{roleStats.normal}</p>
              </div>
              <User className="w-8 h-8 text-gray-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      {currentUserRole === 'admin' && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Actions
            </CardTitle>
            <CardDescription>
              Manage user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <AlertDescription className="text-green-400">{success}</AlertDescription>
              </Alert>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Promote to Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Promote User to Admin</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Enter the email address of the user you want to promote to admin role.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="promoteEmail" className="text-white">User Email</Label>
                    <Input
                      id="promoteEmail"
                      type="email"
                      value={promoteEmail}
                      onChange={(e) => setPromoteEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="user@example.com"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handlePromoteToAdmin}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Promoting...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Promote to Admin
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">All Users</h3>
        {profiles.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No users found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {profiles.map((user) => (
              <Card key={user.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-white">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-3 h-3" />
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
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
      </div>
    </div>
  )
}

export default UserManagement