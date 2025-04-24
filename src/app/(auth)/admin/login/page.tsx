"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Update the default redirect path to ensure it works with route groups
  const from = searchParams?.get("from") || "/admin"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Login failed")
      }

      // Force a full reload to ensure the auth cookie is recognized
      window.location.href = from
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="mb-8">
        <Link href="/">
          <Image
            src="/logos/logo.png"
            alt="Generasi Melek Politik"
            width={150}
            height={50}
            className="w-auto h-10"
          />
        </Link>
      </div>
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Administrator Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-right">
              <Link href="/admin/auth/forgot-password" className="text-blue-500 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-sm text-center">
              <Link href="/" className="text-blue-500 hover:text-blue-700">
                Back to Homepage
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
} 