"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronLeft, LinkIcon, Unlink, UserPlus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  email: string
  name: string
  image: string
  role: string
  profile: Profile | null
}

interface Profile {
  id: string
  firstName: string
  lastName: string
  email: string
  category: string
  userId: string | null
}

export default function UserProfilesPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch users
        const usersResponse = await fetch('/api/users')
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users')
        }
        const usersData = await usersResponse.json()
        
        // Fetch profiles
        const profilesResponse = await fetch('/api/profiles')
        if (!profilesResponse.ok) {
          throw new Error('Failed to fetch profiles')
        }
        const profilesData = await profilesResponse.json()
        
        setUsers(usersData)
        setProfiles(profilesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleConnectProfile = async () => {
    if (!selectedUser || !selectedProfile) return
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/connect-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId: selectedProfile }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to connect profile')
      }
      
      const updatedUser = await response.json()
      
      // Update the users list
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ))
      
      toast.success('Profile connected', {
        description: 'The profile has been connected to the user successfully.',
      })
      
      setDialogOpen(false)
      setSelectedProfile("")
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }

  const handleDisconnectProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/disconnect-profile`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to disconnect profile')
      }
      
      const updatedUser = await response.json()
      
      // Update the users list
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ))
      
      toast.success('Profile disconnected', {
        description: 'The profile has been disconnected from the user successfully.',
      })
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }

  const getAvailableProfiles = () => {
    return profiles.filter(profile => !profile.userId || profile.userId === selectedUser?.id)
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">User Profiles</h1>
          <p className="text-sm text-muted-foreground">
            Manage connections between users and profiles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/users">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/profiles">
              <Users className="mr-2 h-4 w-4" />
              View Profiles
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users and Their Profiles</CardTitle>
          <CardDescription>
            View and manage connections between users and profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Email</TableHead>
                <TableHead>User Role</TableHead>
                <TableHead>Connected Profile</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.profile ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>
                          <span className="text-sm text-muted-foreground">{user.profile.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No profile connected</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.profile ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnectProfile(user.id)}
                        >
                          <Unlink className="mr-2 h-4 w-4" />
                          Disconnect
                        </Button>
                      ) : (
                        <Dialog open={dialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                          setDialogOpen(open)
                          if (open) {
                            setSelectedUser(user)
                          } else {
                            setSelectedUser(null)
                            setSelectedProfile("")
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setDialogOpen(true)
                              }}
                            >
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Connect Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Connect Profile to User</DialogTitle>
                              <DialogDescription>
                                Select an existing profile to connect to {user.email}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a profile" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableProfiles().length === 0 ? (
                                    <SelectItem value="none" disabled>No available profiles</SelectItem>
                                  ) : (
                                    getAvailableProfiles().map((profile) => (
                                      <SelectItem key={profile.id} value={profile.id}>
                                        {profile.firstName} {profile.lastName} ({profile.email})
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleConnectProfile}
                                disabled={!selectedProfile || selectedProfile === "none"}
                              >
                                Connect
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 