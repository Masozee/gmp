"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/hooks/use-session"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditProfileDialog } from "./edit-profile-dialog"
import { DeleteProfileDialog } from "./delete-profile-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Profile } from "@/types/profile"

interface ProfileTableProps {
  searchQuery?: string
  categoryFilter?: string
}

export function ProfileTable({
  searchQuery = "",
  categoryFilter = "all",
}: ProfileTableProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const fetchProfiles = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (categoryFilter !== "all") params.set("category", categoryFilter)

      const response = await fetch(`/api/authors?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch profiles")
      }

      const data = await response.json()
      setProfiles(data)
    } catch (error) {
      console.error("Error fetching profiles:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch profiles")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [searchQuery, categoryFilter])

  const getCategoryBadge = (category: Profile["category"]) => {
    const variants: Record<Profile["category"], "default" | "secondary" | "outline" | "destructive"> = {
      AUTHOR: "default",
      BOARD: "secondary",
      STAFF: "outline",
      RESEARCHER: "destructive",
    }

    return (
      <Badge variant={variants[category]}>
        {category.charAt(0) + category.slice(1).toLowerCase()}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={fetchProfiles}
          variant="outline"
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No profiles found</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow  className="px-4">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell className="font-medium">
                {profile.firstName} {profile.lastName}
              </TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.organization || "-"}</TableCell>
              <TableCell>{getCategoryBadge(profile.category)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  className="mr-2"
                  onClick={() => {
                    setSelectedProfile(profile)
                    setIsEditDialogOpen(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedProfile(profile)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
  )
} 