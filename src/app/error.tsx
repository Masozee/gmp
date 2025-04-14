"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-3xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">
        An unexpected error has occurred. Please try again later.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
} 