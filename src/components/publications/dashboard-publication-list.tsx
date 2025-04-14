"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Eye, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface Publication {
  id: string
  title: string
  slug: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
}

export function DashboardPublicationList() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Function to fetch recent publications
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/api/publications?limit=5')
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
    
    fetchPublications()
  }, [])

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
          <CardTitle>Recent Publications</CardTitle>
          <CardDescription>Your most recently updated publications</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push("/dashboard/publications/new")}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Publication
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : publications.length === 0 ? (
          <div className="rounded-md bg-muted p-4 text-center text-muted-foreground">
            <p className="mb-2">No publications found</p>
            <Button 
              variant="outline" 
              size="sm" 
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
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.map((publication) => (
                <TableRow key={publication.id}>
                  <TableCell className="font-medium">
                    {publication.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(publication.status)}>
                      {publication.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(publication.updatedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/dashboard/publications/${publication.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {publications.length > 0 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push("/dashboard/publications")}
            >
              View All Publications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 