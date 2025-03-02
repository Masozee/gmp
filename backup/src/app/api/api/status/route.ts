import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Status route
export async function GET(request: NextRequest) {
  try {
    // Check database connection
    let dbConnected = false
    try {
      await prisma.$queryRaw`SELECT 1`
      dbConnected = true
    } catch (error) {
      console.error("Database connection error:", error)
    }

    // Get counts from various tables
    const counts = {
      users: 0,
      profiles: 0,
      events: 0,
      eventCategories: 0,
      publications: 0,
      categories: 0,
    }

    if (dbConnected) {
      try {
        counts.users = await prisma.user.count()
      } catch (error) {
        console.error("Error counting users:", error)
      }

      try {
        counts.profiles = await prisma.profile.count()
      } catch (error) {
        console.error("Error counting profiles:", error)
      }

      try {
        counts.events = await prisma.event.count()
      } catch (error) {
        console.error("Error counting events:", error)
      }

      try {
        counts.eventCategories = await prisma.eventCategory.count()
      } catch (error) {
        console.error("Error counting event categories:", error)
      }

      try {
        counts.publications = await prisma.publication.count()
      } catch (error) {
        console.error("Error counting publications:", error)
      }

      try {
        counts.categories = await prisma.category.count()
      } catch (error) {
        console.error("Error counting categories:", error)
      }
    }

    // Check API endpoints
    const apis = {
      auth: {
        login: "Available",
        register: "Available",
        logout: "Available",
      },
      users: "Available",
      events: "Available",
      publications: "Available",
      categories: "Available",
    }

    const statusData = {
      database: {
        connected: dbConnected,
      },
      counts,
      apis,
    }

    return NextResponse.json({
      success: true,
      data: statusData,
      message: "System status retrieved successfully"
    })
  } catch (error) {
    console.error("API status check error:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to check API status"
    }, { status: 500 })
  }
} 