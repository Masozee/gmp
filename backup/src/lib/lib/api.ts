import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { Context as HonoContext } from 'hono'

export const prisma = new PrismaClient()

// API response types
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error?: string
  message?: string
}

// Create a base Hono app with common middleware
export const createApiApp = () => {
  const app = new Hono()
  
  // Add middleware
  app.use('*', logger())
  app.use('*', cors())
  
  // Add error handling
  app.onError((err: Error, c) => {
    console.error('API Error:', err)
    
    const responseBody = {
      success: false,
      data: null,
      error: err instanceof HTTPException ? err.message : 'Internal Server Error'
    };
    
    if (err instanceof HTTPException) {
      return c.json(responseBody, err.status)
    }
    
    return c.json(responseBody, 500)
  })
  
  return app
}

// Helper to return successful response
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

// Helper to return error response
export function errorResponse(error: string, status = 400): HTTPException {
  return new HTTPException(status as any, { message: error })
}

// Handle empty array results safely
export function handleEmptyResults<T>(results: T[], entityName: string): T[] {
  if (!results || results.length === 0) {
    // Return empty array instead of throwing error
    return []
  }
  return results
}

// Handle single entity results safely
export function handleSingleResult<T>(result: T | null, entityName: string, notFoundStatus = 404): T {
  if (!result) {
    throw errorResponse(`${entityName} not found`, notFoundStatus)
  }
  return result
}

// Helper for NextJS handlers to ensure consistent error responses
export async function createNextJsHandler(
  app: Hono,
  request: Request,
  params?: Record<string, string>
) {
  try {
    // For dynamic routes, add the parameters to the path
    if (params) {
      const url = new URL(request.url)
      // Format the path using the first param - this assumes only one dynamic segment
      // You may need to adjust this for more complex paths
      const paramValue = Object.values(params)[0]
      url.pathname = `/${paramValue}`
      request = new Request(url, request)
    }
    
    // Get the response from Hono app
    const response = await app.fetch(request)
    
    // Ensure the response is properly formed
    return response
  } catch (error) {
    console.error("Error handling request:", error)
    return new Response(
      JSON.stringify({
        success: false,
        data: null,
        error: "Failed to process request"
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
} 