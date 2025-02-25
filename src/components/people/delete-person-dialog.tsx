"use client"

import { useState, useEffect } from "react"
import { getSession } from "@/lib/auth"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Profile } from "@/types/profile"

interface DeletePersonDialogProps {
  person: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeletePersonDialog({
  person,
  open,
  onOpenChange,
  onSuccess,
}: DeletePersonDialogProps) {
  const [session, setSession] = useState<{ user?: { id: string } } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadSession = async () => {
      const sessionData = await getSession()
      setSession(sessionData)
    }
    loadSession()
  }, [])

  const onDelete = async () => {
    if (!session?.user) {
      setError("You must be signed in to delete a person")
      return
    }

    if (!person) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/people/${person.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete person")
      }

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {person?.firstName} {person?.lastName}&apos;s profile and remove all
            associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Person"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 