import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/lib/prisma'

// Get all projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('searchQuery')
    const status = searchParams.get('status')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined
    
    // Build filter conditions
    const where: any = {}
    
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    const projects = await prisma.project.findMany({
      where,
      include: {
        // Include relations as needed
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: limit
    })
    
    // Return response
    return NextResponse.json({
      success: true,
      data: projects.length ? projects : [],
      message: projects.length 
        ? 'Projects retrieved successfully' 
        : 'No projects found'
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch projects'
    }, { status: 500 })
  }
}

// Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.status) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Missing required fields: name and status are required'
      }, { status: 400 })
    }
    
    // Create project data
    const data = {
      name: body.name,
      description: body.description || null,
      status: body.status,
      startDate: body.startDate ? new Date(body.startDate) : new Date(), // Default to today if not provided
      endDate: body.endDate ? new Date(body.endDate) : null,
      managedBy: body.managedBy || "system", // Default value
      createdBy: body.createdBy || "system", // Default value
    }
    
    // Create the project
    const project = await prisma.project.create({
      data,
      include: {
        // Include relations as needed
      }
    })
    
    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create project'
    }, { status: 500 })
  }
} 