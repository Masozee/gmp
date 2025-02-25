"use client"

import { useState } from "react"
import { PlusCircle, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PeopleTable } from "@/components/people/people-table"
import { CreatePersonDialog } from "@/components/people/create-person-dialog"
import { Separator } from "@/components/ui/separator"

export default function PeoplePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">People</h1>
          <p className="text-muted-foreground">
            Manage people and their profiles
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Person
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>People Management</CardTitle>
          <CardDescription>
            Search, filter, and manage people profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search people..."
                  className="pl-8 bg-background transition-colors focus-visible:ring-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="AUTHOR">Author</SelectItem>
                  <SelectItem value="BOARD">Board Member</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="RESEARCHER">Researcher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-lg border bg-card shadow-sm">
        <PeopleTable
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
        />
      </div>
      
      <CreatePersonDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
} 