import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
        tasks: {
          where: { parentTaskId: null },
          include: {
            subtasks: true,
            assignees: true,
          },
        },
        budgetItems: {
          include: {
            expenses: true,
          },
        },
        goals: true,
        reports: true,
      },
    })

    if (!project) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Project not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project retrieved successfully'
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch project'
    }, { status: 500 })
  }
}

// Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    // Verify project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })
    
    if (!existingProject) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Project not found'
      }, { status: 404 })
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        status: body.status,
        managedBy: body.managedBy,
      },
    })

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update project'
    }, { status: 500 })
  }
}

// Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Verify project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })
    
    if (!existingProject) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Project not found'
      }, { status: 404 })
    }
    
    const deletedProject = await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      data: deletedProject,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to delete project'
    }, { status: 500 })
  }
} 