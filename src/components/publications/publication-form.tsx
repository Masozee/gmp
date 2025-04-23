"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"

interface PublicationFormProps {
  publicationId?: string
}

interface PublicationFormData {
  title: string
  slug: string
  abstract: string
  content: string
  coverImage: string
  coverCredit: string
  status: string
}

export function PublicationForm({ publicationId }: PublicationFormProps) {
  const router = useRouter()
  const isEditing = !!publicationId
  
  const [formData, setFormData] = useState<PublicationFormData>({
    title: "",
    slug: "",
    abstract: "",
    content: "",
    coverImage: "",
    coverCredit: "",
    status: "DRAFT"
  })
  
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch publication data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchPublication = async () => {
        try {
          const response = await fetch(`/api/api/publications/${publicationId}`)
          const data = await response.json()
          
          if (data.success) {
            setFormData({
              title: data.data.title || "",
              slug: data.data.slug || "",
              abstract: data.data.abstract || "",
              content: data.data.content || "",
              coverImage: data.data.coverImage || "",
              coverCredit: data.data.coverCredit || "",
              status: data.data.status || "DRAFT"
            })
          } else {
            setError(data.error || "Failed to fetch publication")
          }
        } catch (err) {
          setError("An error occurred while fetching the publication")
          console.error(err)
        } finally {
          setFetchLoading(false)
        }
      }
      
      fetchPublication()
    }
  }, [publicationId, isEditing])
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Auto-generate slug from title
  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      
      setFormData(prev => ({ ...prev, slug }))
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Validate form data
      if (!formData.title) {
        throw new Error("Title is required")
      }
      
      if (!formData.slug) {
        throw new Error("Slug is required")
      }
      
      if (!formData.abstract) {
        throw new Error("Abstract is required")
      }
      
      if (!formData.content) {
        throw new Error("Content is required")
      }
      
      // Prepare data for API
      const apiData = {
        ...formData,
        // Convert empty strings to null for optional fields
        coverImage: formData.coverImage || null,
        coverCredit: formData.coverCredit || null
      }
      
      // Make API request
      const url = isEditing 
        ? `/api/api/publications/${publicationId}` 
        : "/api/api/publications"
      
      const method = isEditing ? "PATCH" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Redirect to publications list on success
        router.push("/dashboard/publications")
      } else {
        throw new Error(data.error || "Failed to save publication")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }
  
  if (fetchLoading) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
          <div>
            <CardTitle>{isEditing ? "Edit Publication" : "Create Publication"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update publication details" : "Add a new publication to your dashboard"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={generateSlug}
              placeholder="Enter publication title"
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateSlug}
                className="h-8 text-xs"
                disabled={loading || !formData.title}
              >
                Generate from title
              </Button>
            </div>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="enter-publication-slug"
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract</Label>
            <Textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              placeholder="Enter publication abstract"
              disabled={loading}
              rows={2}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter publication content"
              disabled={loading}
              rows={10}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
              <Input
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverCredit">Cover Credit (Optional)</Label>
              <Input
                id="coverCredit"
                name="coverCredit"
                value={formData.coverCredit}
                onChange={handleChange}
                placeholder="Photo by John Doe"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
              disabled={loading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/publications")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Publication" : "Create Publication"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}