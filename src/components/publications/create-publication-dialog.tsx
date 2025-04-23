"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Author {
  id: string
  firstName: string
  lastName: string
  email: string
  category: string
  photoUrl?: string | null
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  abstract: z.string().min(10, "Abstract must be at least 10 characters").max(500, "Abstract must be less than 500 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  status: z.enum(["DRAFT", "PUBLISHED"], {
    required_error: "Please select a status",
  }),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  coverCredit: z.string().optional(),
  coverImage: z.any()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      "Cover image must be less than 5MB"
    )
    .optional(),
  authors: z.array(z.string()).min(1, "At least one author is required"),
})

export function CreatePublicationDialog({ 
  open, 
  onOpenChange,
  onSuccess
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false)
  const [createTagLoading, setCreateTagLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      abstract: "",
      content: "",
      status: "DRAFT",
      category: "",
      tags: [],
      coverCredit: "",
      coverImage: undefined,
      authors: [],
    },
  })

  const watchAbstract = form.watch("abstract")
  const watchContent = form.watch("content")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingAuthors(true)
        const authorsRes = await fetch("/api/authors")
        if (!authorsRes.ok) {
          throw new Error("Failed to fetch authors")
        }
        const authorsData = await authorsRes.json()
        setAuthors(authorsData)
      } catch (error) {
        console.error("Error fetching authors:", error)
        toast.error("Failed to fetch authors", {
          description: "Please try again.",
        })
      } finally {
        setIsLoadingAuthors(false)
      }

      try {
        const categoriesRes = await fetch("/api/categories")
        if (!categoriesRes.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to fetch categories", {
          description: "Please try again.",
        })
      }

      try {
        const tagsRes = await fetch("/api/tags")
        if (!tagsRes.ok) {
          throw new Error("Failed to fetch tags")
        }
        const tagsData = await tagsRes.json()
        setTags(tagsData)
      } catch (error) {
        console.error("Error fetching tags:", error)
        toast.error("Failed to fetch tags", {
          description: "Please try again.",
        })
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      form.reset()
      setError(null)
    }
  }, [open, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setError(null)

      // Validate required fields explicitly to show errors
      if (!values.title) {
        form.setError("title", { 
          type: "required", 
          message: "Title is required" 
        })
        setLoading(false)
        return
      }

      if (!values.abstract) {
        form.setError("abstract", { 
          type: "required", 
          message: "Abstract is required" 
        })
        setLoading(false)
        return
      }

      if (!values.content) {
        form.setError("content", { 
          type: "required", 
          message: "Content is required" 
        })
        setLoading(false)
        return
      }

      if (!values.category) {
        form.setError("category", { 
          type: "required", 
          message: "Category is required" 
        })
        setLoading(false)
        return
      }

      if (!values.authors.length) {
        form.setError("authors", { 
          type: "required", 
          message: "At least one author is required" 
        })
        setLoading(false)
        return
      }

      const formData = new FormData()
      for (const [key, value] of Object.entries(values)) {
        if (key === "authors") {
          value.forEach((authorId: string) => {
            formData.append("authors[]", authorId)
          })
        } else if (key === "category") {
          formData.append("categories[]", value)
        } else if (key === "tags") {
          if (value && Array.isArray(value)) {
            value.forEach((tagId: string) => {
              formData.append("tags[]", tagId)
            })
          }
        } else if (key !== "coverImage") {
          formData.append(key, value)
        }
      }

      if (values.coverImage instanceof File) {
        formData.append("coverImage", values.coverImage)
      }

      const response = await fetch("/api/publications", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create publication")
      }

      const data = await response.json()
      form.reset()
      onOpenChange(false)
      onSuccess?.()
      router.push(`/dashboard/publications/${data.id}`)
    } catch (error) {
      console.error("Form submission error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      toast.error("Failed to create publication", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  const createNewTag = async (name: string) => {
    try {
      setCreateTagLoading(true)
      setError(null)

      if (!name || name.trim() === "") {
        throw new Error("Tag name is required")
      }

      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create tag")
      }

      if (!data.id || !data.name) {
        throw new Error("Invalid response from server")
      }

      // Add the new tag to the local state
      setTags((prev) => [...prev, data])

      // Add the newly created tag to the selected tags
      const currentValue = new Set(form.getValues("tags") || [])
      currentValue.add(data.id)
      form.setValue("tags", Array.from(currentValue), { shouldValidate: true })
      
      toast.success("Tag created successfully")

      return data
    } catch (error) {
      console.error("Error creating tag:", error)
      const message = error instanceof Error ? error.message : "Failed to create tag"
      setError(message)
      toast.error("Failed to create tag", {
        description: message,
      })
      throw error
    } finally {
      setCreateTagLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Publication</DialogTitle>
          <DialogDescription>
            Create a new publication. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title of your publication. This will be displayed prominently.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea placeholder="Enter abstract" {...field} />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {watchAbstract?.length || 0}/500
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    A brief summary of the publication. This will appear in listings and previews.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Enter content"
                        className="min-h-[200px]"
                        {...field}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {watchContent?.length || 0} characters
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    The main content of your publication. Minimum 50 characters required.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Draft publications are not visible to the public.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a primary category for your publication.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authors</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value.length && "text-muted-foreground"
                          )}
                        >
                          {field.value.length > 0
                            ? `${field.value.length} author${field.value.length > 1 ? "s" : ""} selected`
                            : "Select authors"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search authors..." />
                        <CommandList>
                          <CommandEmpty>No authors found.</CommandEmpty>
                          <CommandGroup>
                            {authors.map((author) => (
                              <CommandItem
                                key={author.id}
                                onSelect={() => {
                                  const currentValue = new Set(field.value)
                                  if (currentValue.has(author.id)) {
                                    currentValue.delete(author.id)
                                  } else {
                                    currentValue.add(author.id)
                                  }
                                  field.onChange(Array.from(currentValue))
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value.includes(author.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {author.firstName} {author.lastName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((authorId) => {
                      const author = authors.find((a) => a.id === authorId)
                      if (!author) return null
                      return (
                        <Badge
                          key={author.id}
                          variant="secondary"
                          className="text-sm"
                        >
                          {author.firstName} {author.lastName}
                        </Badge>
                      )
                    })}
                  </div>
                  <FormDescription>
                    Select one or more authors for this publication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        onChange(file)
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image (max 5MB). Recommended size: 1200x630 pixels.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverCredit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image Credit</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter cover image credit" {...field} />
                  </FormControl>
                  <FormDescription>
                    Credit the creator or source of the cover image if applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value && field.value.length > 0
                            ? `${field.value.length} tag${field.value.length > 1 ? "s" : ""} selected`
                            : "Select tags"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search tags..." 
                          onValueChange={(value) => {
                            const span = document.getElementById("new-tag-text");
                            if (span) span.textContent = value;
                          }}
                        />
                        <CommandList>
                          <CommandEmpty>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start mt-2"
                              onClick={() => {
                                const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
                                const value = input?.value;
                                if (value && value.trim() !== "") {
                                  createNewTag(value);
                                }
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create "<span id="new-tag-text"></span>"
                            </Button>
                          </CommandEmpty>
                          <CommandGroup>
                            {tags.map((tag) => (
                              <CommandItem
                                key={tag.id}
                                onSelect={() => {
                                  const currentValue = new Set(field.value || [])
                                  if (currentValue.has(tag.id)) {
                                    currentValue.delete(tag.id)
                                  } else {
                                    currentValue.add(tag.id)
                                  }
                                  field.onChange(Array.from(currentValue))
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(tag.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {tag.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((tagId) => {
                      const tag = tags.find((t) => t.id === tagId)
                      if (!tag) return null
                      return (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="text-sm"
                        >
                          {tag.name}
                        </Badge>
                      )
                    })}
                  </div>
                  <FormDescription>
                    Select existing tags or type to create new ones for better discoverability.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}