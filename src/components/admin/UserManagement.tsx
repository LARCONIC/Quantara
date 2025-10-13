import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
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

interface UserManagementProps {
  users: Profile[]
  onPromoteUser: (email: string) => Promise<void>
  isLoading: boolean
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onPromoteUser, 
  isLoading 
}) => {
  const [promoteEmail, setPromoteEmail] = useState('')
  const [isPromoting, setIsPromoting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePromoteUser = async () => {
    if (!promoteEmail.trim()) {
      setMessage({ type: 'error', text: 'Please enter an email address' })
      return
    }

    if (!promoteEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    setIsPromoting(true)
    setMessage(null)

    try {
      await onPromoteUser(promoteEmail)
      setMessage({ type: 'success', text: `Successfully promoted ${promoteEmail} to admin` })
      setPromoteEmail('')
      setIsDialogOpen(false)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to promote user' })
    } finally {
      setIsPromoting(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 'member':
        return <Shield className="w-4 h-4 text-blue-500" />
      case 'client':
        return <Briefcase className="w-4 h-4 text-green-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'member':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'client':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <XCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const roleStats = {
    admin: users.filter(user => user.role === 'admin').length,
    member: users.filter(user => user.role === 'member').length,
    client: users.filter(user => user.role === 'client').length,
    normal: users.filter(user => user.role === 'normal').length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Admins</p>
                <p className="text-2xl font-bold">{roleStats.admin}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Members</p>
                <p className="text-2xl font-bold">{roleStats.member}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Clients</p>
                <p className="text-2xl font-bold">{roleStats.client}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Users</p>
                <p className="text-2xl font-bold">{roleStats.normal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promote User Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Promote existing users to admin role or manage user permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <UserPlus className="w-4 h-4 mr-2" />
                Promote User to Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Promote User to Admin</DialogTitle>
                <DialogDescription>
                  Enter the email address of the user you want to promote to admin role.
                  This will give them full administrative privileges.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="promote-email">User Email</Label>
                  <Input
                    id="promote-email"
                    type="email"
                    placeholder="user@example.com"
                    value={promoteEmail}
                    onChange={(e) => setPromoteEmail(e.target.value)}
                    disabled={isPromoting}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePromoteUser} 
                    disabled={isPromoting || !promoteEmail.trim()}
                    className="flex-1"
                  >
                    {isPromoting ? (
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
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isPromoting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users ({users.length})
          </CardTitle>
          <CardDescription>
            Overview of all users in the system with their roles and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{user.email}</span>
                        </div>
                        {user.created_at && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className="text-sm capitalize">{user.status}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getRoleBadgeColor(user.role)} capitalize`}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UserManagement