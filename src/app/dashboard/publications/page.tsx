"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Search, Filter, Bug, RefreshCw } from "lucide-react"

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
import { PublicationTable } from "@/components/publications/publication-table"
import { CreatePublicationDialog } from "@/components/publications/create-publication-dialog"
import { Separator } from "@/components/ui/separator"

export default function PublicationsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [key, setKey] = useState(0)

  const refreshPublications = () => {
    setKey(prev => prev + 1)
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
          <p className="text-muted-foreground">
            Manage your publications and articles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/publications/test'}>
            <Bug className="mr-2 h-4 w-4" />
            Debug
          </Button>
          <Button variant="outline" onClick={refreshPublications}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Publication
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Publication Management</CardTitle>
          <CardDescription>
            Search, filter, and manage publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search publications..."
                  className="pl-8 bg-background transition-colors focus-visible:ring-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-lg border bg-card shadow-sm">
        <PublicationTable
          key={key}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </div>
      
      <CreatePublicationDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refreshPublications}
      />
    </div>
  )
} 