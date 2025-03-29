"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Calendar, FileText, Tag, User, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Mail {
  id: string
  mailNumber: string
  subject: string
  description: string | null
  content: string | null
  type: "INCOMING" | "OUTGOING"
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  date: string
  referenceNumber: string | null
  sender: string
  recipient: string
  category: {
    id: string
    name: string
    code: string
  }
}

interface MailDetailViewProps {
  id: string
}

export function MailDetailView({ id }: MailDetailViewProps) {
  const router = useRouter()
  const [mail, setMail] = useState<Mail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchMail = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/mails/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Mail not found")
          }
          throw new Error("Failed to fetch mail")
        }
        
        const data = await response.json()
        setMail(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    
    fetchMail()
  }, [id])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/mails/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete mail")
      }
      
      toast.success("Mail deleted", {
        description: "The mail has been deleted successfully.",
      })
      
      // Redirect to mail list
      router.push("/dashboard/mail/list")
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading mail details...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <div className="text-red-500">Error: {error}</div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/mail/list">Back to Mail List</Link>
        </Button>
      </div>
    )
  }

  if (!mail) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <div className="text-muted-foreground">Mail not found</div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/mail/list">Back to Mail List</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>
      case "PUBLISHED":
        return <Badge variant="default">Published</Badge>
      case "ARCHIVED":
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "INCOMING":
        return <Badge variant="default" className="bg-green-500">Incoming</Badge>
      case "OUTGOING":
        return <Badge variant="default" className="bg-blue-500">Outgoing</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{mail.mailNumber}</h3>
          {getTypeBadge(mail.type)}
          {getStatusBadge(mail.status)}
        </div>
        <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-2">{mail.subject}</h4>
            {mail.description && (
              <p className="text-muted-foreground mb-4">{mail.description}</p>
            )}
          </div>
          
          <div>
            <h5 className="text-sm font-medium mb-2">Content</h5>
            <div className="p-4 border rounded-md bg-muted/50">
              {mail.content ? (
                <p className="whitespace-pre-wrap">{mail.content}</p>
              ) : (
                <p className="text-muted-foreground italic">No content</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Category</p>
              <p className="text-sm text-muted-foreground">
                {mail.category.code} - {mail.category.name}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(mail.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Sender</p>
              <p className="text-sm text-muted-foreground">
                {mail.sender}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Recipient</p>
              <p className="text-sm text-muted-foreground">
                {mail.recipient}
              </p>
            </div>
          </div>
          {mail.referenceNumber && (
            <>
              <Separator />
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Reference Number</p>
                  <p className="text-sm text-muted-foreground">
                    {mail.referenceNumber}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the mail record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 