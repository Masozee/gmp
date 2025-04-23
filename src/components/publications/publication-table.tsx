"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Archive,
  Clock,
  CheckCircle2,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Download,
} from "lucide-react"
import { toast } from "sonner"

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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
import { CreatePublicationDialog } from "@/components/publications/create-publication-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



interface Publication {
  id: string
  title: string
  published: number
  // authors: Array<{
  //   profile: {
  //     firstName: string
  //     lastName: string
  //     photoUrl: string | null
  //   }
  // }>
  createdAt: string
  updatedAt: string
}

interface PublicationTableProps {
  searchQuery: string
  statusFilter: string
  categoryFilter?: string | null
}

type SortField = "title" | "status" | "updatedAt"
type SortOrder = "asc" | "desc"

export function PublicationTable({
  searchQuery,
  statusFilter,
  categoryFilter,
}: PublicationTableProps) {
  const router = useRouter()
  const [publications, setPublications] = useState<Publication[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBatchProcessing, setIsBatchProcessing] = useState(false)
  const [sortField, setSortField] = useState<SortField>("updatedAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showBatchStatusAlert, setShowBatchStatusAlert] = useState(false)
  const [batchStatus, setBatchStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("PUBLISHED")

  const statusMap = {
    DRAFT: { label: "Draft", icon: Clock, variant: "secondary" },
    PUBLISHED: { label: "Published", icon: CheckCircle2, variant: "default" },
    ARCHIVED: { label: "Archived", icon: Archive, variant: "outline" },
  }

  const fetchPublications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams()
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter.toUpperCase())
      }

      if (categoryFilter) {
        params.append('category', categoryFilter)
      }
      
      params.append('sort', sortField)
      params.append('order', sortOrder)
      
      const response = await fetch(`/api/publications?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch publications')
      }
      
      const data = await response.json()
      setPublications(data.publications || [])
    } catch (error) {
      console.error('Error fetching publications:', error)
      setError('Failed to fetch publications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPublications()
  }, [searchQuery, statusFilter, categoryFilter, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.size === publications.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(publications.map(pub => pub.id)))
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
      setIsDeleting(true)
      setError(null)

      await Promise.all(
        ids.map(id =>
          fetch(`/api/publications/${id}`, {
            method: "DELETE",
          })
        )
      )

      setPublications(prev => prev.filter(pub => !ids.includes(pub.id)))
      setSelectedIds(new Set())
      setShowDeleteAlert(false)
    } catch (error) {
      console.error("Error deleting publications:", error)
      setError("Failed to delete publications. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBatchStatusUpdate = async () => {
    try {
      setIsBatchProcessing(true)
      setError(null)

      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/publications/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ published: batchStatus === "PUBLISHED" ? 1 : 0 }),
          })
        )
      )

      await fetchPublications()
      setSelectedIds(new Set())
      setShowBatchStatusAlert(false)
    } catch (error) {
      console.error("Error updating publications:", error)
      setError("Failed to update publications. Please try again.")
    } finally {
      setIsBatchProcessing(false)
    }
  }

  const handleSingleStatusUpdate = async (id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/publications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: status === "PUBLISHED" ? 1 : 0 }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update publication status")
      }

      const updatedPublication = await response.json()
      setPublications(prev =>
        prev.map(pub => (pub.id === id ? updatedPublication : pub))
      )

      toast.success("Publication status updated successfully")
    } catch (error: unknown) {
      console.error("Error updating publication status:", error)
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        toast.error((error as { message: string }).message)
      } else {
        toast.error("Failed to update publication status")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const selectedPublications = publications.filter(pub => selectedIds.has(pub.id))
    const csv = [
      ["Title", "Status", "Authors", "Last Updated"],
      ...selectedPublications.map(pub => [
        pub.title,
        getPublicationStatus(pub.published),
        "N/A", // Removed author mapping
        new Date(pub.updatedAt).toLocaleString(),
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "publications.csv"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  // Map the published value to status
  const getPublicationStatus = (published: number): "DRAFT" | "PUBLISHED" | "ARCHIVED" => {
    return published === 1 ? "PUBLISHED" : "DRAFT";
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={fetchPublications}>
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
                onClick={() => setShowBatchStatusAlert(true)}
              >
                Update Status
              </Button>
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
            onClick={fetchPublications}
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
                checked={sortField === "title"}
                onCheckedChange={() => handleSort("title")}
              >
                Title
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortField === "status"}
                onCheckedChange={() => handleSort("status")}
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortField === "updatedAt"}
                onCheckedChange={() => handleSort("updatedAt")}
              >
                Last Updated
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
                    checked={selectedIds.size === publications.length && publications.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="font-medium text-primary h-10 cursor-pointer" onClick={() => handleSort("title")}>
                  Title {sortField === "title" && <SortIcon className="inline-block ml-1 h-4 w-4" />}
                </TableHead>
                <TableHead className="font-medium text-primary h-10">Authors</TableHead>
                <TableHead className="font-medium text-primary h-10 cursor-pointer" onClick={() => handleSort("status")}>
                  Status {sortField === "status" && <SortIcon className="inline-block ml-1 h-4 w-4" />}
                </TableHead>
                <TableHead className="font-medium text-primary h-10 cursor-pointer" onClick={() => handleSort("updatedAt")}>
                  Last Updated {sortField === "updatedAt" && <SortIcon className="inline-block ml-1 h-4 w-4" />}
                </TableHead>
                <TableHead className="w-[100px] h-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">Loading publications...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : publications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-muted-foreground">No publications found</p>
                      {searchQuery || statusFilter !== 'all' ? (
                        <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                      ) : (
                        <Button 
                          variant="link" 
                          className="text-xs mt-2"
                          onClick={() => setIsCreateDialogOpen(true)}
                        >
                          Create your first publication
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                publications.map((publication) => {
                  const StatusIcon = statusMap[getPublicationStatus(publication.published)].icon
                  return (
                    <TableRow key={publication.id} className="group hover:bg-accent/5 data-[state=selected]:bg-accent/10">
                      <TableCell className="py-3">
                        <Checkbox
                          checked={selectedIds.has(publication.id)}
                          onCheckedChange={() => handleSelectOne(publication.id)}
                          aria-label={`Select ${publication.title}`}
                        />
                      </TableCell>
                      <TableCell className="py-3 font-medium">{publication.title}</TableCell>
                      <TableCell className="py-3 text-muted-foreground">N/A</TableCell> 
                      <TableCell className="py-3">
                        <Badge variant={statusMap[getPublicationStatus(publication.published)].variant as string} className="font-normal">
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusMap[getPublicationStatus(publication.published)].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-muted-foreground">
                        {new Date(publication.updatedAt).toLocaleDateString()}
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
                              onClick={() => router.push(`/dashboard/publications/${publication.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/publications/${publication.id}/edit`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Clock className="mr-2 h-4 w-4" />
                                Set Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() => handleSingleStatusUpdate(publication.id, "DRAFT")}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleSingleStatusUpdate(publication.id, "PUBLISHED")}
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Published
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleSingleStatusUpdate(publication.id, "ARCHIVED")}
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archived
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(publication.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreatePublicationDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchPublications}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              publication and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete([deleteId])}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Publications</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected publications?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(Array.from(selectedIds))}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Selected"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBatchStatusAlert} onOpenChange={setShowBatchStatusAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Publication Status</AlertDialogTitle>
            <AlertDialogDescription>
              Update the status of {selectedIds.size} selected publications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select
              value={batchStatus}
              onValueChange={(value: "DRAFT" | "PUBLISHED" | "ARCHIVED") => setBatchStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchStatusUpdate}
              disabled={isBatchProcessing}
            >
              {isBatchProcessing ? "Updating..." : "Update Status"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 