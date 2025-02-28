"use client"

import { useEffect, useState } from "react"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  Download,
} from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditProfileDialog } from "./edit-profile-dialog"
import { DeleteProfileDialog } from "./delete-profile-dialog"
import { Profile } from "@/types/profile"

interface ProfileTableProps {
  searchQuery?: string
  categoryFilter?: string
}

type SortField = "name" | "email" | "category" | "updatedAt"
type SortOrder = "asc" | "desc"

export function ProfileTable({
  searchQuery = "",
  categoryFilter = "all",
}: ProfileTableProps) {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const categoryMap = {
    AUTHOR: { label: "Author", variant: "default" },
    BOARD: { label: "Board Member", variant: "secondary" },
    STAFF: { label: "Staff", variant: "outline" },
    RESEARCHER: { label: "Researcher", variant: "destructive" },
  }

  const fetchProfiles = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      params.append('sort', sortField)
      params.append('order', sortOrder)

      const response = await fetch(`/api/authors?${params}`, {
        credentials: 'include',
      })

      if (response.status === 401) {
        // Redirect to login page if unauthorized
        router.push('/auth/login')
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch profiles")
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
  }, [searchQuery, categoryFilter, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.size === profiles.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(profiles.map(profile => profile.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleDelete = async (ids: string[]) => {
    try {
      setIsLoading(true)
      setError(null)

      await Promise.all(
        ids.map(id =>
          fetch(`/api/authors/${id}`, {
            method: "DELETE",
          })
        )
      )

      setProfiles(prev => prev.filter(profile => !ids.includes(profile.id)))
      setSelectedIds(new Set())
      setShowDeleteAlert(false)
    } catch (error) {
      console.error("Error deleting profiles:", error)
      setError("Failed to delete profiles. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const selectedProfiles = profiles.filter(profile => selectedIds.has(profile.id))
    const csv = [
      ["Name", "Email", "Organization", "Category"],
      ...selectedProfiles.map(profile => [
        `${profile.firstName} ${profile.lastName}`,
        profile.email,
        profile.organization || "",
        profile.category,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "profiles.csv"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={fetchProfiles}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  const SortIcon = sortOrder === "asc" ? SortAsc : SortDesc

  return (
    <>
      <div className="flex items-center justify-between mb-4 p-4">
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteAlert(true)}
              >
                Delete Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
              <Badge variant="secondary">
                {selectedIds.size} selected
              </Badge>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProfiles}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                View Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortField === "name"}
                onCheckedChange={() => handleSort("name")}
              >
                Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortField === "email"}
                onCheckedChange={() => handleSort("email")}
              >
                Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortField === "category"}
                onCheckedChange={() => handleSort("category")}
              >
                Category
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortOrder === "asc"}
                onCheckedChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                Ascending Order
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative w-full p-4">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="w-[40px] h-10">
                  <Checkbox
                    checked={selectedIds.size === profiles.length && profiles.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="font-medium text-primary h-10 cursor-pointer" onClick={() => handleSort("name")}>
                  Name {sortField === "name" && <SortIcon className="inline-block ml-1 h-4 w-4" />}
                </TableHead>
                <TableHead className="font-medium text-primary h-10 cursor-pointer" onClick={() => handleSort("email")}>
                  Email {sortField === "email" && <SortIcon className="inline-block ml-1 h-4 w-4" />}
                </TableHead>
                <TableHead className="font-medium text-primary h-10">Organization</TableHead>
                <TableHead className="font-medium text-primary h-10 cursor-pointer" onClick={() => handleSort("category")}>
                  Category {sortField === "category" && <SortIcon className="inline-block ml-1 h-4 w-4" />}
                </TableHead>
                <TableHead className="w-[100px] h-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">Loading profiles...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-muted-foreground">No profiles found</p>
                      {searchQuery || categoryFilter !== 'all' ? (
                        <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id} className="group hover:bg-accent/5 data-[state=selected]:bg-accent/10">
                    <TableCell className="py-3">
                      <Checkbox
                        checked={selectedIds.has(profile.id)}
                        onCheckedChange={() => handleSelectOne(profile.id)}
                        aria-label={`Select ${profile.firstName} ${profile.lastName}`}
                      />
                    </TableCell>
                    <TableCell className="py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile.photoUrl || ""} />
                          <AvatarFallback>
                            {profile.firstName[0]}
                            {profile.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {profile.firstName} {profile.lastName}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">{profile.email}</TableCell>
                    <TableCell className="py-3">{profile.organization || "-"}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant={categoryMap[profile.category].variant as any} className="font-normal">
                        {categoryMap[profile.category].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedProfile(profile)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedProfile(profile)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Profiles</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected profiles?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(Array.from(selectedIds))}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 