"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, Save } from "lucide-react"
import { EventCategory } from "@/types/events"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const categoryId = resolvedParams.id
  const [category, setCategory] = useState<EventCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/event-categories/${categoryId}`)
        
        if (response.status === 404) {
          toast.error("Category not found")
          router.push("/dashboard/event-categories")
          return
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch category")
        }
        
        const data = await response.json()
        setCategory(data)
        
        // Set form values
        form.reset({
          name: data.name,
          description: data.description || "",
        })
      } catch (error) {
        console.error("Error fetching category:", error)
        toast.error("Failed to load category")
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [categoryId, router, form])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/event-categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update category")
      }

      toast.success("Category updated successfully")
      router.push("/dashboard/event-categories")
    } catch (error: any) {
      console.error("Error updating category:", error)
      toast.error(error.message || "Failed to update category")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-20 mr-4" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard/event-categories")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Update the details for this event category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the category as it will appear to users
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe this category (optional)" 
                        {...field} 
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of what this category represents
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {category?._count?.events && category?._count?.events > 0 && (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">
                    This category has {category?._count?.events ?? 0} {(category?._count?.events ?? 0) === 1 ? 'event' : 'events'} associated with it.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Updating this category will affect all associated events.
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 