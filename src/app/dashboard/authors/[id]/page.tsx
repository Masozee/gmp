"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, Building, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Badge } from "@/components/ui/badge"

interface Author {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  organization?: string | null
  bio?: string | null
  category: "AUTHOR" | "BOARD" | "STAFF" | "RESEARCHER"
  photoUrl?: string | null
}

export default function AuthorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [author, setAuthor] = useState<Author | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/authors/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch author")
        const data = await response.json()
        setAuthor(data)
      } catch (error) {
        console.error("Error fetching author:", error)
        setError("Failed to load author. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchAuthor()
  }, [params.id])

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/authors/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete author")
      }

      toast.success("Author deleted successfully")
      router.push("/dashboard/authors")
    } catch (error) {
      console.error("Error deleting author:", error)
      toast.error("Failed to delete author")
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "AUTHOR":
        return "Author"
      case "BOARD":
        return "Board Member"
      case "STAFF":
        return "Staff"
      case "RESEARCHER":
        return "Researcher"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AUTHOR":
        return "bg-blue-100 text-blue-800"
      case "BOARD":
        return "bg-purple-100 text-purple-800"
      case "STAFF":
        return "bg-green-100 text-green-800"
      case "RESEARCHER":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && !author) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error || !author) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-destructive">{error || "Author not found"}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/authors")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Authors
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Author Details</h1>
          <p className="text-muted-foreground">
            View and manage author information
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/authors")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Authors
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={author.photoUrl || ""} alt={`${author.firstName} ${author.lastName}`} />
              <AvatarFallback className="text-2xl">
                {author.firstName.charAt(0)}{author.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">{author.firstName} {author.lastName}</h2>
            <Badge className={`mt-2 ${getCategoryColor(author.category)}`}>
              {getCategoryLabel(author.category)}
            </Badge>
            {author.organization && (
              <div className="flex items-center mt-4 text-muted-foreground">
                <Building className="h-4 w-4 mr-2" />
                <span>{author.organization}</span>
              </div>
            )}
            <div className="flex items-center mt-2 text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              <span>{author.email}</span>
            </div>
            {author.phoneNumber && (
              <div className="flex items-center mt-2 text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>{author.phoneNumber}</span>
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/authors/${author.id}/edit`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Biography</CardTitle>
          </CardHeader>
          <CardContent>
            {author.bio ? (
              <p className="text-muted-foreground whitespace-pre-wrap">{author.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">No biography provided</p>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the author profile for {author.firstName} {author.lastName}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 