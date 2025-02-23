"use client"

import { useState } from "react"
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

interface Profile {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface DeleteProfileDialogProps {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProfileDialog({
  profile,
  open,
  onOpenChange,
}: DeleteProfileDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onDelete = async () => {
    if (!profile) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete profile")
      }

      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
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
            {profile?.firstName} {profile?.lastName}&apos;s profile and remove all
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
            {isLoading ? "Deleting..." : "Delete Profile"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 