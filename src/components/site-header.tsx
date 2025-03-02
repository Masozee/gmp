"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { WeatherDisplay } from "@/components/weather-display"
import { DateDisplay } from "@/components/date-display"
import { Separator } from "@/components/ui/separator"

export function SiteHeader() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-6">
        <SidebarTrigger className="-ml-2 h-9 w-9" />
        <div className="flex items-center gap-2 font-medium">
          <Link href="/dashboard" className="text-lg font-semibold">Generasi Melek Politik</Link>
          {paths.length > 0 && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground capitalize">
                {paths[paths.length - 1].replace(/-/g, " ")}
              </span>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative w-full lg:w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 pl-8 lg:w-[240px]"
            />
          </div>
          <DateDisplay />
          <Separator orientation="vertical" className="h-6" />
          <WeatherDisplay />
          <Separator orientation="vertical" className="h-6" />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
