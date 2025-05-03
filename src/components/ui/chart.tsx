"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label: string
    color?: string
  }
>

// Remove potentially empty interface definition if it adds no members
// interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

// Use the extended type directly if the interface is removed
const ChartContainer = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement> // Use React.HTMLAttributes directly
>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("size-full", className)}
        {...props}
      />
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mb-0.5 rounded-lg border bg-background px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  )
})
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent } 