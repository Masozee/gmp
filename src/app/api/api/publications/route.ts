import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/lib/prisma'

// Get all publications with optional filtering
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
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    const publications = await prisma.publication.findMany({
      where,
      include: {
        authors: true,
        categories: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: limit
    })
    
    // Return response
    return NextResponse.json({
      success: true,
      data: publications.length ? publications : [],
      message: publications.length 
        ? 'Publications retrieved successfully' 
        : 'No publications found'
    })
  } catch (error) {
    console.error("Error fetching publications:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch publications'
    }, { status: 500 })
  }
}

// Create a new publication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.status) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Missing required fields: title and status are required'
      }, { status: 400 })
    }
    
    // Generate a slug from the title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-') + '-' + Date.now();
    
    // Create the publication with required fields
    const data = {
      title: body.title,
      slug: body.slug || slug,
      description: body.description || body.title,
      content: body.content || '',
      status: body.status,
      coverImage: body.coverImage || null,
      coverCredit: body.coverCredit || null
    }
    
    // Create the publication
    const publication = await prisma.publication.create({
      data,
      include: {
        authors: true,
        categories: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: publication,
      message: 'Publication created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating publication:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create publication'
    }, { status: 500 })
  }
} 