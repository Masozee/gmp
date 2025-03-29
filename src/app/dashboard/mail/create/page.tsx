import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MailCreateForm } from "@/components/mail/mail-create-form"

export const metadata: Metadata = {
  title: "Create Mail",
  description: "Create a new mail record",
}

export default function CreateMailPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Create Mail</h1>
          <p className="text-sm text-muted-foreground">
            Create a new mail record in the system
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/mail">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Mail Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Mail</CardTitle>
          <CardDescription>
            Fill in the details to create a new mail record. Required fields are marked with an asterisk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MailCreateForm />
        </CardContent>
      </Card>
    </div>
  )
} 