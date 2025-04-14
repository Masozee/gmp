"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [debug, setDebug] = useState<any>(null)
  const [redirecting, setRedirecting] = useState(false)

  // If we're redirecting, forcefully navigate to dashboard
  useEffect(() => {
    if (redirecting) {
      const redirectTimer = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [redirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setDebug(null)
    setRedirecting(false)

    try {
      console.log("Attempting login with:", { email });
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data:", data);
      
      // Save debug information
      setDebug({
        status: response.status,
        headers: Object.fromEntries([...response.headers.entries()]),
        data
      });

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Small delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to dashboard on successful login - try multiple approaches
      console.log("Login successful, redirecting to dashboard");
      setRedirecting(true);
      
      // Try Next.js router first
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {redirecting && (
              <div className="p-3 text-sm text-white bg-green-600 rounded">
                Login successful! Redirecting to dashboard...
              </div>
            )}
            {error && (
              <div className="p-3 text-sm text-white bg-destructive rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {debug && !redirecting && (
              <div className="mt-4 p-3 text-xs bg-muted rounded overflow-auto max-h-48">
                <pre>{JSON.stringify(debug, null, 2)}</pre>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || redirecting}
            >
              {loading ? "Logging in..." : redirecting ? "Redirecting..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
