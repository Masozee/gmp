"use client"

import { useEffect, useState } from "react"
import { Edit2, Trash2 } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EditProfileDialog } from "./edit-profile-dialog"
import { DeleteProfileDialog } from "./delete-profile-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Profile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  photoUrl?: string | null
  organization?: string | null
  category: "AUTHOR" | "BOARD" | "STAFF" | "RESEARCHER"
}

export function ProfileTable() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/profiles")
      if (!response.ok) {
        throw new Error("Failed to fetch profiles")
      }
      const data = await response.json()
      setProfiles(data)
    } catch (error) {
      console.error("Failed to fetch profiles:", error)
      setError("Failed to fetch profiles")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const getCategoryBadge = (category: Profile["category"]) => {
    const variants = {
      AUTHOR: "default",
      BOARD: "secondary",
      STAFF: "outline",
      RESEARCHER: "secondary",
    } as const

    return (
      <Badge variant={variants[category]}>
        {category}
      </Badge>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading profiles...
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No profiles found
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={profile.photoUrl || ""} />
                        <AvatarFallback>
                          {profile.firstName[0]}{profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {profile.firstName} {profile.lastName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.organization || "—"}</TableCell>
                  <TableCell>{getCategoryBadge(profile.category)}</TableCell>
                  <TableCell>{profile.phoneNumber || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedProfile(profile)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedProfile(profile)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedProfile && (
        <>
          <EditProfileDialog
            profile={selectedProfile}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={fetchProfiles}
          />
          <DeleteProfileDialog
            profile={selectedProfile}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onSuccess={fetchProfiles}
          />
        </>
      )}
    </>
  )
} 