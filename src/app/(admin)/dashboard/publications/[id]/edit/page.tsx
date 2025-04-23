"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Check, ChevronsUpDown, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    required_error: "Please select a status",
  }),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  coverCredit: z.string().optional(),
  coverImage: z.union([z.instanceof(File), z.undefined()])
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      "Cover image must be less than 5MB"
    )
    .optional(),
  authors: z.array(z.string()).min(1, "At least one author is required"),
})

export default function EditPublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false)
  interface Publication {
  id: string;
  title: string;
  description: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categories?: { category: Category }[];
  tags?: { tag: Tag }[];
  coverCredit?: string;
  coverImage?: string;
  authors: { profile: Author }[];
  // Add any other fields as needed
}

const [publication, setPublication] = useState<Publication | null>(null)
  const [createTagLoading, setCreateTagLoading] = useState(false)

  // Unwrap the params object using React.use()
  const resolvedParams = React.use(params);
  const publicationId = resolvedParams.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      status: "DRAFT",
      category: "",
      tags: [],
      coverCredit: "",
      authors: [],
    },
  })

  const watchDescription = form.watch("description")
  const watchContent = form.watch("content")

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setIsLoadingAuthors(true)
        const response = await fetch("/api/authors")
        if (!response.ok) throw new Error("Failed to fetch authors")
        const data = await response.json()
        setAuthors(data)
      } catch (error) {
        console.error("Error fetching authors:", error)
        setError("Failed to load authors. Please try again.")
      } finally {
        setIsLoadingAuthors(false)
      }
    }
    fetchAuthors()

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories. Please try again.")
      }
    }
    fetchCategories()

    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags")
        if (!response.ok) throw new Error("Failed to fetch tags")
        const data = await response.json()
        setTags(data)
      } catch (error) {
        console.error("Error fetching tags:", error)
        setError("Failed to load tags. Please try again.")
      }
    }
    fetchTags()
  }, [])

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/publications/${publicationId}`)
        if (!response.ok) throw new Error("Failed to fetch publication")
        const data = await response.json()
        setPublication(data)
        
        // Set form values
        form.reset({
          title: data.title,
          description: data.description,
          content: data.content,
          status: data.status,
          category: data.categories?.[0]?.category?.id || "",
          tags: data.tags?.map((tag: { tag: Tag }) => tag.tag.id) || [],
          coverCredit: data.coverCredit || "",
          authors: data.authors.map((author: { profile: Author }) => author.profile.id),
        })
      } catch (error) {
        console.error("Error fetching publication:", error)
        setError("Failed to load publication. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchPublication()
  }, [publicationId, form])

  // Add a new effect to sync available authors with form data
  useEffect(() => {
    if (authors.length > 0 && form.getValues("authors")?.length > 0) {
      // Filter out any author IDs that don't exist in the authors array
      const validAuthorIds = form.getValues("authors").filter(
        (authorId) => authors.some((author) => author.id === authorId)
      );
      
      // If there's a difference, update the form
      if (validAuthorIds.length !== form.getValues("authors").length) {
        form.setValue("authors", validAuthorIds, { shouldValidate: true });
      }
    }
  }, [authors, form]);

  const createNewTag = async (name: string) => {
    try {
      setCreateTagLoading(true)
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to create tag")
      }

      const newTag = await response.json()
      setTags((prev) => [...prev, newTag])
      
      // Add the newly created tag to the selected tags
      const currentValue = new Set(form.getValues("tags") || [])
      currentValue.add(newTag.id)
      form.setValue("tags", Array.from(currentValue), { shouldValidate: true })
      
      toast.success("Tag created successfully")
    } catch (error) {
      console.error("Error creating tag:", error)
      toast.error("Failed to create tag", {
        description: "Please try again.",
      })
    } finally {
      setCreateTagLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      for (const [key, value] of Object.entries(values)) {
  if (key === "authors" && Array.isArray(value)) {
    value.forEach((authorId: string) => {
      formData.append("authors[]", authorId)
    })
  } else if (key === "category" && typeof value === "string") {
    formData.append("categories[]", value)
  } else if (key === "tags" && Array.isArray(value)) {
    value.forEach((tagId: string) => {
      formData.append("tags[]", tagId)
    })
  } else if (key !== "coverImage" && typeof value === "string") {
    formData.append(key, value)
  }
}

      if (values.coverImage instanceof File) {
        formData.append("coverImage", values.coverImage)
      }

      const response = await fetch(`/api/publications/${publicationId}`, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update publication")
      }

      router.push(`/dashboard/publications/${publicationId}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
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
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Publication</h1>
          <p className="text-muted-foreground">
            Make changes to your publication here
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/dashboard/publications/${publicationId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publication Details</CardTitle>
        </CardHeader>
        <CardContent>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea placeholder="Enter description" {...field} />
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                          {watchDescription?.length || 0}/500
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Control the visibility and state of your publication.
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
                            className="w-full justify-between"
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
                              {authors.map((author) => {
                                const isSelected = field.value.includes(author.id);
                                return (
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
                                    className={cn(
                                      field.value.includes(author.id) ? "bg-secondary" : ""
                                    )}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value.includes(author.id) ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {author.firstName} {author.lastName}
                                  </CommandItem>
                                )
                              })}
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
                    {publication.coverImage && (
                      <div className="mt-2">
                        <img
                          src={publication.coverImage}
                          alt="Current cover"
                          className="w-full max-w-[200px] rounded-lg"
                        />
                      </div>
                    )}
                    <FormDescription>
                      Upload an image (max 5MB). Leave empty to keep current image.
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
                              const span = document.getElementById("edit-new-tag-text");
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
                                Create "<span id="edit-new-tag-text"></span>"
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

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/publications/${publicationId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}