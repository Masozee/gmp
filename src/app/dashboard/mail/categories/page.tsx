import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoriesTable } from "@/components/mail/categories-table"
import { CategoryCreateForm } from "./components/category-create-form"

export const metadata: Metadata = {
  title: "Mail Categories",
  description: "Manage mail categories",
}

export default function MailCategoriesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Mail Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage categories for mail classification
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/mail">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Mail Dashboard
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Categories List</TabsTrigger>
          <TabsTrigger value="create">Create Category</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Mail Categories</CardTitle>
              <CardDescription>
                View and manage all mail categories. Categories are used for mail classification and numbering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoriesTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Category</CardTitle>
              <CardDescription>
                Add a new mail category to the system. The code will be used in mail numbering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryCreateForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 