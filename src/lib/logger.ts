"use client"

import { getSession } from './auth'

export enum ErrorSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export interface ErrorLogParams {
  message: string
  path: string
  method: string
  stack?: string
  severity?: ErrorSeverity
  metadata?: Record<string, any>
}

export async function logError(params: ErrorLogParams) {
  try {
    const session = await getSession()
    
    // Send error log to API endpoint
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        userId: session?.user?.id,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to log error')
    }

    const errorLog = await response.json()

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', {
        ...params,
        userId: session?.user?.id,
        errorId: errorLog.id,
      })
    }

    return errorLog
  } catch (error) {
    // Fallback to console if logging fails
    console.error('Failed to log error:', error)
    console.error('Original error:', params)
  }
}

export async function getErrorLogs(options?: {
  userId?: string
  severity?: ErrorSeverity
  limit?: number
  offset?: number
}) {
  const params = new URLSearchParams()
  if (options?.severity) params.set('severity', options.severity)
  if (options?.userId) params.set('userId', options.userId)
  if (options?.limit) params.set('limit', options.limit.toString())
  if (options?.offset) params.set('offset', options.offset.toString())

  const response = await fetch(`/api/logs?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch error logs')
  }

  return response.json()
} 