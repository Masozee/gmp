import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MailsTable } from "@/components/mail/mails-table"

export const metadata: Metadata = {
  title: "Mail List",
  description: "View and manage all mail records",
}

export default function MailListPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Mail List</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all mail records in the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/mail">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Mail Dashboard
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/mail/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Mail
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Mail Records</CardTitle>
          <CardDescription>
            Browse, filter, and manage all mail records. Use the filters to narrow down your search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MailsTable />
        </CardContent>
      </Card>
    </div>
  )
} 