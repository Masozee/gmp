import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Get publication count
export async function GET(request: NextRequest) {
  try {
    const count = await prisma.publication.count()
    
    return NextResponse.json({
      success: true,
      data: { count },
      message: 'Publication count retrieved successfully'
    })
  } catch (error) {
    console.error("Error counting publications:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to count publications'
    }, { status: 500 })
  }
} 