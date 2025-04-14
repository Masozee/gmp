"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Speaker {
  id: string
  firstName: string
  lastName: string
  photoUrl?: string
}

interface Presentation {
  id: string
  title: string
  abstract?: string
  speakerId: string
  eventId?: string
  slides?: string
  videoUrl?: string
  duration?: number
  startTime?: string
  endTime?: string
  createdAt: string
  updatedAt: string
  speaker: Speaker | null
}

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch presentations
  useEffect(() => {
    const fetchPresentations = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          pageSize: pagination.pageSize.toString()
        })

        if (debouncedSearch) {
          params.append("search", debouncedSearch)
        }

        const response = await fetch(`/api/presentations?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch presentations")
        }

        const data = await response.json()
        setPresentations(data.presentations)
        setPagination(data.pagination)
      } catch (error) {
        console.error("Error fetching presentations:", error)
        toast.error("Failed to load presentations")
      } finally {
        setLoading(false)
      }
    }

    fetchPresentations()
  }, [pagination.page, pagination.pageSize, debouncedSearch])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Presentations</CardTitle>
          <CardDescription>Browse and manage presentations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Input
              placeholder="Search presentations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : presentations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No presentations found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Speaker</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presentations.map((presentation) => (
                    <TableRow key={presentation.id}>
                      <TableCell className="font-medium">{presentation.title}</TableCell>
                      <TableCell>
                        {presentation.speaker ? 
                          `${presentation.speaker.firstName} ${presentation.speaker.lastName}` : 
                          "Unknown"
                        }
                      </TableCell>
                      <TableCell>
                        {presentation.duration ? `${presentation.duration} min` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {presentation.startTime ? 
                          new Date(presentation.startTime).toLocaleDateString() : 
                          "N/A"
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.page} of {pagination.totalPages} pages
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 