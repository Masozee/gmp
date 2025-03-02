import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Get a specific publication
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const publication = await prisma.publication.findUnique({
      where: { id },
      include: {
        authors: true,
        categories: true,
        files: true,
        images: true,
        tags: true
      }
    })

    if (!publication) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Publication not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: publication,
      message: 'Publication retrieved successfully'
    })
  } catch (error) {
    console.error("Error fetching publication:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch publication'
    }, { status: 500 })
  }
}

// Update a publication
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    // Verify publication exists
    const existingPublication = await prisma.publication.findUnique({
      where: { id }
    })
    
    if (!existingPublication) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Publication not found'
      }, { status: 404 })
    }
    
    // Prepare update data (only include fields that are provided)
    const updateData: any = {}
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.content !== undefined) updateData.content = body.content
    if (body.status !== undefined) updateData.status = body.status
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage
    if (body.coverCredit !== undefined) updateData.coverCredit = body.coverCredit
    
    // Update the publication
    const updatedPublication = await prisma.publication.update({
      where: { id },
      data: updateData,
      include: {
        authors: true,
        categories: true,
        files: true,
        images: true,
        tags: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedPublication,
      message: 'Publication updated successfully'
    })
  } catch (error) {
    console.error("Error updating publication:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update publication'
    }, { status: 500 })
  }
}

// Delete a publication
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Verify publication exists
    const existingPublication = await prisma.publication.findUnique({
      where: { id }
    })
    
    if (!existingPublication) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Publication not found'
      }, { status: 404 })
    }
    
    // Delete the publication
    const deletedPublication = await prisma.publication.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      data: deletedPublication,
      message: 'Publication deleted successfully'
    })
  } catch (error) {
    console.error("Error deleting publication:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to delete publication'
    }, { status: 500 })
  }
} 