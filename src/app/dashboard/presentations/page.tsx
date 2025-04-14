"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  ChevronDownIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  FileTextIcon, 
  PlusIcon, 
  SearchIcon, 
  TrashIcon 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Presentation = {
  id: string
  title: string
  abstract?: string
  startTime?: string
  endTime?: string
  duration?: number
  videoUrl?: string
  slides?: string
  speakerId: string
  eventId?: string
  speaker?: {
    id: string
    firstName: string
    lastName: string
    photoUrl?: string
  }
}

function PresentationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)
  
  // Search and filters
  const currentPage = Number(searchParams?.get('page') || '1')
  const pageSize = Number(searchParams?.get('pageSize') || '10')
  const search = searchParams?.get('search') || ''
  const speakerId = searchParams?.get('speakerId') || ''
  const eventId = searchParams?.get('eventId') || ''
  const sort = searchParams?.get('sort') || 'startTime'
  const order = searchParams?.get('order') || 'desc'
  
  // Local state for search input
  const [searchValue, setSearchValue] = useState(search)
  
  useEffect(() => {
    const fetchPresentations = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (speakerId) params.append('speakerId', speakerId)
        if (eventId) params.append('eventId', eventId)
        params.append('page', currentPage.toString())
        params.append('pageSize', pageSize.toString())
        params.append('sort', sort)
        params.append('order', order)
        
        const response = await fetch(`/api/presentations?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching presentations: ${response.statusText}`)
        }
        
        const data = await response.json()
        setPresentations(data.presentations || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } catch (err) {
        console.error("Failed to fetch presentations", err)
        setError("Failed to load presentations. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchPresentations()
  }, [currentPage, pageSize, search, speakerId, eventId, sort, order])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }
    params.set('page', '1') // Reset to first page on new search
    router.push(`/dashboard/presentations?${params.toString()}`)
  }
  
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('page', newPage.toString())
    router.push(`/dashboard/presentations?${params.toString()}`)
  }
  
  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('sort', newSort)
    router.push(`/dashboard/presentations?${params.toString()}`)
  }
  
  const handleOrderChange = (newOrder: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('order', newOrder)
    router.push(`/dashboard/presentations?${params.toString()}`)
  }
  
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }
  
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Presentations</h1>
          <p className="text-muted-foreground">
            Manage presentations and sessions from speakers
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/presentations/new')}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Presentation
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Presentations</CardTitle>
              <CardDescription>
                A list of all presentations in your account
              </CardDescription>
            </div>
            <form onSubmit={handleSearch} className="w-full sm:w-auto">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search presentations..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => router.refresh()}
                >
                  Try Again
                </Button>
              </div>
            ) : presentations.length === 0 ? (
              <div className="p-8 text-center">
                <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No presentations found</h3>
                <p className="text-muted-foreground">
                  {search ? "Try a different search term or filter." : "Get started by creating a new presentation."}
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => router.push('/dashboard/presentations/new')}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Presentation
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Speaker</TableHead>
                    <TableHead className="hidden md:table-cell">Start Time</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presentations.map((presentation) => (
                    <TableRow key={presentation.id}>
                      <TableCell className="font-medium">
                        <div>
                          {presentation.title}
                          {presentation.slides && (
                            <Badge variant="outline" className="ml-2">
                              Slides
                            </Badge>
                          )}
                          {presentation.videoUrl && (
                            <Badge variant="outline" className="ml-2">
                              Video
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm line-clamp-1">
                          {presentation.abstract || "No abstract provided"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {presentation.speaker ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={presentation.speaker.photoUrl || ""} alt={`${presentation.speaker.firstName} ${presentation.speaker.lastName}`} />
                              <AvatarFallback>
                                {presentation.speaker.firstName[0]}
                                {presentation.speaker.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {presentation.speaker.firstName} {presentation.speaker.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDateTime(presentation.startTime)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDuration(presentation.duration)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDownIcon className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/presentations/${presentation.id}`)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/presentations/${presentation.id}/edit`)}
                            >
                              Edit
                            </DropdownMenuItem>
                            {presentation.slides && (
                              <DropdownMenuItem
                                onClick={() => window.open(presentation.slides, '_blank')}
                              >
                                View Slides
                              </DropdownMenuItem>
                            )}
                            {presentation.videoUrl && (
                              <DropdownMenuItem
                                onClick={() => window.open(presentation.videoUrl, '_blank')}
                              >
                                Watch Video
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => {
                                // Delete functionality would go here
                                alert("Delete functionality not implemented yet.")
                              }}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
        {!loading && presentations.length > 0 && (
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{presentations.length}</strong> of{" "}
              <strong>{totalPages * pageSize}</strong> presentations
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <span className="sr-only">Next Page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default function PresentationsPage() {
  return (
    <Suspense fallback={<div>Loading presentations...</div>}>
      <PresentationsContent />
    </Suspense>
  )
} 