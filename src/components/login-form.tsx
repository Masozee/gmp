"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({ 
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    let response: Response | undefined
    let data: any
    
    try {
      setIsLoading(true)
      setError(null)

      console.log("[Login Form] Attempting login...")

      response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      })

      console.log("[Login Form] Response status:", response.status)

      data = await response.json()
      console.log("[Login Form] Response data:", {
        success: data.success,
        error: data.error,
      })

      if (!response.ok) {
        throw new Error(data.error || `Login failed with status ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.error || "Login failed - Invalid credentials")
      }

      // Clear form
      form.reset()

      // Get redirect path
      const from = searchParams?.get("from") || "/dashboard"
      console.log("[Login Form] Redirecting to:", from)

      // Force a full page reload to ensure the cookie is picked up
      window.location.href = from

    } catch (error) {
      console.error("[Login Form] Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      setError(errorMessage)
      form.setValue("password", "")

      // Log the error with more details
      console.error({
        message: errorMessage,
        path: "/api/auth/login",
        method: "POST",
        stack: error instanceof Error ? error.stack : undefined,
        metadata: {
          email: values.email,
          statusCode: response?.status,
          responseData: data,
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
