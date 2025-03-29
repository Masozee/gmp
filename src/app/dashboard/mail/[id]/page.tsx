import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MailDetailView } from "@/components/mail/mail-detail-view"

export const metadata: Metadata = {
  title: "Mail Details",
  description: "View mail details",
}

interface MailDetailPageProps {
  params: {
    id: string
  }
}

export default function MailDetailPage({ params }: MailDetailPageProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Mail Details</h1>
          <p className="text-sm text-muted-foreground">
            View detailed information about this mail record
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/mail/list">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Mail List
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/mail/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Mail Information</CardTitle>
          <CardDescription>
            Detailed information about the mail record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MailDetailView id={params.id} />
        </CardContent>
      </Card>
    </div>
  )
} 