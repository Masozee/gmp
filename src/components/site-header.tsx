"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

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
        <div className="ml-auto flex items-center gap-4">
          <form className="w-full lg:w-[240px]">
            <Input
              type="search"
              placeholder="Type to search..."
              className="h-9 lg:w-[240px]"
            />
          </form>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => document.documentElement.classList.toggle('dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
