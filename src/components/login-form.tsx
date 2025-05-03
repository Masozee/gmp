"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, FormEvent, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [envWarning, setEnvWarning] = useState<string | null>(null)
  const router = useRouter()

  // Create a Supabase client for the browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  useEffect(() => {
    // Check if the Supabase environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-url') {
      setEnvWarning('Supabase environment variables are not set. Please check your .env.local file.')
    }

    // Check if the user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If already logged in, redirect to admin dashboard
        router.push('/admin');
      }
    };

    checkSession();
  }, [router, supabase.auth]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        // Successfully logged in - middleware will handle redirect
        // But we'll also push here for better UX
        router.push('/admin')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to Admin Panel</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your credentials to access the admin dashboard
        </p>
      </div>
      {envWarning && (
        <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded">
          {envWarning}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-500 rounded">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !!envWarning}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  )
}
