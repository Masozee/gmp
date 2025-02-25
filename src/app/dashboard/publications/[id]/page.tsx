"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Eye, Pencil, Trash2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Publication {
  id: string
  title: string
  description: string
  content: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  coverImage?: string
  coverCredit?: string
  authors: Array<{
    profile: {
      firstName: string
      lastName: string
      photoUrl: string | null
    }
  }>
  createdAt: string
  updatedAt: string
  files: Array<{
    name: string
    url: string
    size: number
    type: string
  }>
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PublicationDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [publication, setPublication] = useState<Publication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statusMap = {
    DRAFT: { label: "Draft", variant: "secondary" },
    PUBLISHED: { label: "Published", variant: "default" },
    ARCHIVED: { label: "Archived", variant: "outline" },
  }

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/publications/${resolvedParams.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch publication")
        }
        const data = await response.json()
        setPublication(data)
      } catch (error) {
        console.error("Error fetching publication:", error)
        setError("Failed to load publication. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchPublication()
  }, [resolvedParams.id])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/publications/${resolvedParams.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete publication")
      }

      router.push("/dashboard/publications")
    } catch (error) {
      console.error("Error deleting publication:", error)
      setError("Failed to delete publication. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading publication...</p>
      </div>
    )
  }

  if (error || !publication) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-destructive">{error || "Publication not found"}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/publications")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Publications
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/publications")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Publications
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/publications/${resolvedParams.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
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
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>{publication.title}</CardTitle>
              <CardDescription>{publication.description}</CardDescription>
            </div>
            <Badge variant={statusMap[publication.status].variant as any}>
              {statusMap[publication.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {publication.coverImage && (
            <div className="space-y-2">
              <img
                src={publication.coverImage}
                alt={publication.title}
                className="w-full rounded-lg object-cover max-h-[400px]"
              />
              {publication.coverCredit && (
                <p className="text-sm text-muted-foreground text-right">
                  Photo credit: {publication.coverCredit}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Authors</h3>
            <div className="flex flex-wrap gap-4">
              {publication.authors.map((author, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={author.profile.photoUrl || ""}
                      alt={`${author.profile.firstName} ${author.profile.lastName}`}
                    />
                    <AvatarFallback>
                      {author.profile.firstName[0]}
                      {author.profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {author.profile.firstName} {author.profile.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Content</h3>
            <div className="prose max-w-none">
              {publication.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {publication.files.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Attachments</h3>
                <div className="grid gap-2">
                  {publication.files.map((file, index) => (
                    <a
                      key={index}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{file.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round(file.size / 1024)}KB)
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Created: {new Date(publication.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(publication.updatedAt).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 