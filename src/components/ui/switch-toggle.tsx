"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  activeColor?: string
}

const SwitchToggle = React.forwardRef<HTMLDivElement, SwitchToggleProps>(
  ({ className, checked, onCheckedChange, label, activeColor = "#00A99D", ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-3", className)} ref={ref} {...props}>
        {label && <span className="text-base font-normal">{label}</span>}
        <div
          role="switch"
          aria-checked={checked}
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            "relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
            checked ? "bg-[#00A99D]" : "bg-gray-200",
            activeColor !== "#00A99D" && checked ? `bg-[${activeColor}]` : ""
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
              checked ? "translate-x-6" : "translate-x-0"
            )}
          />
        </div>
      </div>
    )
  }
)
SwitchToggle.displayName = "SwitchToggle"

export { SwitchToggle } 