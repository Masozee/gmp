"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import type { EventCategory } from "@/types/events"

export default function EventCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryToDelete, setCategoryToDelete] = useState<EventCategory | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/event-categories${searchQuery ? `?search=${searchQuery}` : ""}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load event categories")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/event-categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete category")
      }

      setCategories(categories.filter(category => category.id !== id))
      toast.success("Category deleted successfully")
      setCategoryToDelete(null)
    } catch (error: unknown) {
      console.error("Error deleting category:", error)
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        toast.error((error as { message: string }).message)
      } else {
        toast.error("Failed to delete category")
      }
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Event Categories</h1>
        <Button onClick={() => router.push("/dashboard/event-categories/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Categories</CardTitle>
          <CardDescription>Find event categories by name or description</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No categories found</p>
            <Button onClick={() => router.push("/dashboard/event-categories/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create your first category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>
                  {category._count?.events ? (
                    <Badge variant="secondary" className="mt-1">
                      {category._count?.events ?? 0} {category._count?.events === 1 ? 'event' : 'events'}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1">No events</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {category.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="dashboard-yellow-btn" onClick={() => router.push(`/dashboard/event-categories/${category.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setCategoryToDelete(category)}
                      disabled={category._count?.events > 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the category &quot;{categoryToDelete?.name}&quot;.
                        {categoryToDelete?._count?.events && categoryToDelete._count.events > 0 && (
                          <p className="text-red-500 mt-2">
                            This category has {categoryToDelete._count?.events ?? 0} events. 
                            You must reassign or delete these events before deleting this category.
                          </p>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => categoryToDelete && handleDelete(categoryToDelete.id)}
                        disabled={!!categoryToDelete?._count?.events && categoryToDelete._count.events > 0}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 