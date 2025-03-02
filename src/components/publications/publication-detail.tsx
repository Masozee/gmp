"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PublicationDetailProps {
  publicationId: string
}

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

export function PublicationDetail({ publicationId }: PublicationDetailProps) {
  const router = useRouter()
  const [publication, setPublication] = useState<Publication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch publication data
  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await fetch(`/api/api/publications/${publicationId}`)
        const data = await response.json()
        
        if (data.success) {
          setPublication(data.data)
        } else {
          setError(data.error || "Failed to fetch publication")
        }
      } catch (err) {
        setError("An error occurred while fetching the publication")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPublication()
  }, [publicationId])
  
  // Function to delete the publication
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this publication?")) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/api/publications/${publicationId}`, {
        method: "DELETE"
      })
      const data = await response.json()
      
      if (data.success) {
        router.push("/dashboard/publications")
      } else {
        setError(data.error || "Failed to delete publication")
        setLoading(false)
      }
    } catch (err) {
      setError("An error occurred while deleting the publication")
      console.error(err)
      setLoading(false)
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
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => router.push("/dashboard/publications")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Publications
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  if (!publication) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Publication not found
          </div>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => router.push("/dashboard/publications")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Publications
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/dashboard/publications")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{publication.title}</CardTitle>
              <Badge variant="outline" className={getStatusColor(publication.status)}>
                {publication.status}
              </Badge>
            </div>
            <CardDescription>
              Last updated {formatDistanceToNow(new Date(publication.updatedAt), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
          <p className="mt-1">{publication.description}</p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Slug</h3>
            <p className="mt-1">{publication.slug}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className="mt-1">{publication.status}</p>
          </div>
        </div>
        
        {publication.coverImage && (
          <>
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Cover Image</h3>
              <div className="mt-2 overflow-hidden rounded-md">
                <img 
                  src={publication.coverImage} 
                  alt={publication.title} 
                  className="h-48 w-full object-cover"
                />
                {publication.coverCredit && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Credit: {publication.coverCredit}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Content Preview</h3>
          <div className="mt-2 rounded-md bg-muted p-4">
            <p className="whitespace-pre-wrap">{publication.content.length > 300 
              ? publication.content.substring(0, 300) + "..." 
              : publication.content}</p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
          <p className="mt-1">
            {new Date(publication.createdAt).toLocaleDateString()} 
            ({formatDistanceToNow(new Date(publication.createdAt), { addSuffix: true })})
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/publications/${publicationId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Publication
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Publication
        </Button>
      </CardFooter>
    </Card>
  )
} 