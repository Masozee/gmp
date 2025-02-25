"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Mail,
  Phone,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Author {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  photoUrl?: string | null
  organization?: string | null
  category: "AUTHOR" | "BOARD" | "STAFF" | "RESEARCHER"
}

interface AuthorTableProps {
  searchQuery: string
  categoryFilter: string
}

export function AuthorTable({
  searchQuery,
  categoryFilter,
}: AuthorTableProps) {
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAuthors()
  }, [searchQuery, categoryFilter])

  const fetchAuthors = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (categoryFilter !== "all") params.set("category", categoryFilter)

      const response = await fetch(`/api/authors?${params}`)
      if (!response.ok) throw new Error("Failed to fetch authors")
      const data = await response.json()
      setAuthors(data)
    } catch (error) {
      console.error("Error fetching authors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete author")
      }

      setAuthors((prev) => prev.filter((author) => author.id !== id))
    } catch (error) {
      console.error("Error deleting author:", error)
    }
  }

  const getCategoryBadge = (category: Author["category"]) => {
    const variants = {
      AUTHOR: "default",
      BOARD: "secondary",
      STAFF: "outline",
      RESEARCHER: "secondary",
    } as const

    return (
      <Badge variant={variants[category]}>
        {category.charAt(0) + category.slice(1).toLowerCase()}
      </Badge>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : authors.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No authors found
            </TableCell>
          </TableRow>
        ) : (
          authors.map((author) => (
            <TableRow key={author.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={author.photoUrl || ""} alt={`${author.firstName} ${author.lastName}`} />
                    <AvatarFallback>
                      {author.firstName[0]}
                      {author.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {author.firstName} {author.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {author.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getCategoryBadge(author.category)}</TableCell>
              <TableCell>{author.organization || "—"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => window.location.href = `mailto:${author.email}`}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  {author.phoneNumber && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.location.href = `tel:${author.phoneNumber}`}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/authors/${author.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/authors/${author.id}/edit`)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(author.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
} 