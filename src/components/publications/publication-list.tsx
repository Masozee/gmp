"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface Publication {
  id: string
  title: string
  slug: string
  description: string
  content: string
  coverImage: string | null
  coverCredit: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export function PublicationList() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Function to fetch publications
  const fetchPublications = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/api/publications?searchQuery=${searchQuery}`)
      const data = await response.json()
      
      if (data.success) {
        setPublications(data.data)
      } else {
        setError(data.error || "Failed to fetch publications")
      }
    } catch (err) {
      setError("An error occurred while fetching publications")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch publications on component mount and when search query changes
  useEffect(() => {
    fetchPublications()
  }, [searchQuery])

  // Function to delete a publication
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return

    try {
      const response = await fetch(`/api/api/publications/${id}`, {
        method: "DELETE"
      })
      const data = await response.json()
      
      if (data.success) {
        // Remove the deleted publication from state
        setPublications(publications.filter(publication => publication.id !== id))
      } else {
        setError(data.error || "Failed to delete publication")
      }
    } catch (err) {
      setError("An error occurred while deleting the publication")
      console.error(err)
    }
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Publications</CardTitle>
          <CardDescription>Manage your publications</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search publications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push("/dashboard/publications/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Publication
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : publications.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">No publications found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push("/dashboard/publications/new")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create your first publication
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.map((publication) => (
                <TableRow key={publication.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{publication.title}</div>
                      {publication.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {publication.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(publication.status)}>
                      {publication.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {publication.slug}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(publication.updatedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/dashboard/publications/${publication.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/dashboard/publications/${publication.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(publication.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
} 