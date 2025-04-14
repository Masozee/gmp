"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-center text-foreground">
          <h2 className="text-3xl font-bold">Something went wrong!</h2>
          <p className="text-muted-foreground">
            A critical error has occurred. Please try again later.
          </p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  )
} 