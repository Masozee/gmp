"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    required_error: "Please select a status",
  }),
  coverCredit: z.string().optional(),
  coverImage: z.any()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      "Cover image must be less than 5MB"
    )
    .optional(),
  authors: z.array(z.string()).min(1, "At least one author is required"),
})

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditPublicationPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false)
  const [publication, setPublication] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      status: "DRAFT",
      coverCredit: "",
      authors: [],
    },
  })

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
  }, [])

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/publications/${resolvedParams.id}`)
        if (!response.ok) throw new Error("Failed to fetch publication")
        const data = await response.json()
        setPublication(data)
        
        // Set form values
        form.reset({
          title: data.title,
          description: data.description,
          content: data.content,
          status: data.status,
          coverCredit: data.coverCredit || "",
          authors: data.authors.map((author: any) => author.profile.id),
        })
      } catch (error) {
        console.error("Error fetching publication:", error)
        setError("Failed to load publication. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchPublication()
  }, [resolvedParams.id, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      for (const [key, value] of Object.entries(values)) {
        if (key === "authors") {
          value.forEach((authorId: string) => {
            formData.append("authors[]", authorId)
          })
        } else if (key !== "coverImage") {
          formData.append(key, value)
        }
      }

      if (values.coverImage instanceof File) {
        formData.append("coverImage", values.coverImage)
      }

      const response = await fetch(`/api/publications/${resolvedParams.id}`, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update publication")
      }

      router.push(`/dashboard/publications/${resolvedParams.id}`)
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
        <Button variant="outline" onClick={() => router.push(`/dashboard/publications/${resolvedParams.id}`)}>
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
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
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
                      <Textarea
                        placeholder="Enter content"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/publications/${resolvedParams.id}`)}
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