"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Author {
  profile: {
    firstName: string
    lastName: string
    photoUrl: string | null
  }
}

interface Publication {
  id: string
  title: string
  description: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  authors: Author[]
  createdAt: string
}

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    publications: number
  }
  publications: Array<{
    publication: Publication
  }>
}

export default function CategoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statusMap = {
    DRAFT: { label: "Draft", variant: "secondary" },
    PUBLISHED: { label: "Published", variant: "default" },
    ARCHIVED: { label: "Archived", variant: "outline" },
  }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/categories/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch category")
        const data = await response.json()
        setCategory(data)
      } catch (error) {
        console.error("Error fetching category:", error)
        setError("Failed to load category. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading category...</p>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-destructive">{error || "Category not found"}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/publications/categories")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {category.name}
          </h1>
          <p className="text-muted-foreground">
            View all publications in this category
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/publications/categories")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
            <CardDescription>
              Information about this category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{category.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Slug</p>
                <p className="text-sm text-muted-foreground">{category.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Publications</p>
                <Badge variant="secondary" className="mt-1">
                  {category._count.publications}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publications</CardTitle>
            <CardDescription>
              All publications in this category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Authors</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.publications.map(({ publication }) => (
                  <TableRow key={publication.id}>
                    <TableCell className="font-medium">
                      {publication.title}
                      <p className="text-sm text-muted-foreground">
                        {publication.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {publication.authors.map((author, index) => (
                          <Avatar key={index} className="h-8 w-8 border-2 border-background">
                            <AvatarImage
                              src={author.profile.photoUrl || ""}
                              alt={`${author.profile.firstName} ${author.profile.lastName}`}
                            />
                            <AvatarFallback>
                              {author.profile.firstName[0]}
                              {author.profile.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[publication.status].variant as any}>
                        {statusMap[publication.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(publication.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/dashboard/publications/${publication.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {category.publications.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No publications found in this category
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 