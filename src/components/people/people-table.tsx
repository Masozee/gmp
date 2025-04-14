"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/hooks/use-session"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditPersonDialog } from "./edit-person-dialog"
import { DeletePersonDialog } from "./delete-person-dialog"
import { Profile } from "@/types/profile"

interface PeopleTableProps {
  searchQuery: string
  categoryFilter: string
}

export function PeopleTable({
  searchQuery,
  categoryFilter,
}: PeopleTableProps) {
  const { data: session } = useSession()
  const [people, setPeople] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPerson, setSelectedPerson] = useState<Profile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (session) {
      fetchPeople()
    }
  }, [searchQuery, categoryFilter, session])

  const fetchPeople = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (categoryFilter !== "all") params.set("category", categoryFilter)

      const response = await fetch(`/api/people?${params}`)
      if (!response.ok) throw new Error("Failed to fetch people")
      
      const data = await response.json()
      setPeople(data)
    } catch (error) {
      console.error("Error fetching people:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryBadge = (category: Profile["category"]) => {
    const variants: Record<Profile["category"], "default" | "secondary" | "outline" | "destructive"> = {
      AUTHOR: "default",
      BOARD: "secondary",
      STAFF: "outline",
      RESEARCHER: "destructive",
    }

    return (
      <Badge variant={variants[category]}>
        {category.charAt(0) + category.slice(1).toLowerCase()}
      </Badge>
    )
  }

  const handleEdit = (person: Profile) => {
    setSelectedPerson(person)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (person: Profile) => {
    setSelectedPerson(person)
    setIsDeleteDialogOpen(true)
  }

  if (!session) {
    return <div className="p-8 text-center text-muted-foreground">Please sign in to view people.</div>
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No people found
              </TableCell>
            </TableRow>
          ) : (
            people.map((person) => (
              <TableRow key={person.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={person.photoUrl || ""} />
                      <AvatarFallback>
                        {person.firstName[0]}
                        {person.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {person.firstName} {person.lastName}
                      </div>
                      {person.phoneNumber && (
                        <div className="text-sm text-muted-foreground">
                          {person.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell>{getCategoryBadge(person.category)}</TableCell>
                <TableCell>{person.organization || "-"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(person)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(person)}
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

      <EditPersonDialog
        person={selectedPerson}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={fetchPeople}
      />

      <DeletePersonDialog
        person={selectedPerson}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={fetchPeople}
      />
    </>
  )
} 