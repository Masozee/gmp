"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: "group border-border text-foreground bg-background",
        descriptionClassName: "text-muted-foreground",
      }}
    />
  )
}
