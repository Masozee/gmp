import { NextRequest } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import { apiResponse } from "@/lib/api-helpers"
import logger from "@/lib/logger"

/**
 * Get error logs with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return apiResponse.unauthorized()
    }

    // Verify user has admin permissions
    if (session.user.role !== 'ADMIN') {
      return apiResponse.forbidden("Only administrators can access logs")
    }

    // Parse query parameters
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const userId = searchParams.get("userId") || null
    const severity = searchParams.get("severity") || null
    const startDate = searchParams.get("startDate") || null
    const endDate = searchParams.get("endDate") || null
    
    const { offset } = await sqlite.paginate(page, limit)

    // Build query conditions
    const conditions = []
    const params = []

    if (userId) {
      conditions.push("userId = ?")
      params.push(userId)
    }

    if (severity) {
      conditions.push("severity = ?")
      params.push(severity)
    }

    if (startDate) {
      conditions.push("timestamp >= ?")
      params.push(new Date(startDate).toISOString())
    }

    if (endDate) {
      conditions.push("timestamp <= ?")
      params.push(new Date(endDate).toISOString())
    }

    // Combine conditions
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(" AND ")}`
      : ""

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM error_logs ${whereClause}`
    const countResult = await sqlite.get<{ total: number }>(countQuery, params)
    const total = countResult?.total || 0

    // Get logs with pagination
    const logsQuery = `
      SELECT id, timestamp, userId, severity, message, 
        SUBSTR(context, 1, 200) as context, 
        SUBSTR(stack, 1, 500) as stack
      FROM error_logs
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `
    const logsParams = [...params, limit, offset]
    const logs = await sqlite.all(logsQuery, logsParams)

    return apiResponse.success(logs, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    logger.error("Failed to fetch error logs", error instanceof Error ? error : new Error(String(error)))
    return apiResponse.error("Failed to fetch error logs")
  }
} 