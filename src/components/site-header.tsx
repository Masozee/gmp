"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { WeatherCompact } from "@/components/weather-compact"
import { Separator } from "@/components/ui/separator"

export function SiteHeader() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger className="-ml-2 h-9 w-9" />
        <div className="flex items-center gap-2 font-medium">
          <Link href="/dashboard">Building Your Application</Link>
          {paths.length > 0 && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">
                {paths[paths.length - 1].replace(/-/g, " ")}
              </span>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <form className="w-full lg:w-[240px]">
            <Input
              type="search"
              placeholder="Type to search..."
              className="h-9 lg:w-[240px]"
            />
          </form>
          <WeatherCompact />
          <Separator orientation="vertical" className="h-6" />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
