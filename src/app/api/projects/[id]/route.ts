import { NextResponse } from 'next/server';
import sqlite from '@/lib/sqlite';
import { verifyJwtHeader } from '@/lib/jwt-server';
import type { UserPayload } from '@/lib/jwt-server';
import { apiResponse } from '@/lib/api-helpers';
import { projectSchema } from '../route';

// GET handler - Fetch a specific project
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Safely extract the ID from the context
    const { id } = context.params;

    const userPayload: UserPayload | null = await verifyJwtHeader(request);
    if (!userPayload || !userPayload.id) {
      return apiResponse.unauthorized('Authentication required');
    }
    
    const userId = userPayload.id;
    
    // Convert numeric ID to string format to match database entries
    // The database uses format: "user-001" while JWT uses numeric IDs
    const stringUserId = `user-${userId.toString().padStart(3, '0')}`;
    console.log('Using string user ID for DB query:', stringUserId);
    
    // Use the extracted ID
    const projectId = id;

    // Get project details
    interface DbProject {
      id: string;
      title: string;
      description?: string;
      startDate?: string;
      dueDate?: string;
      status: string;
      ownerId: string;
      deleted: number;
      createdAt: string;
      updatedAt: string;
    }
    
    const project = await sqlite.get(
      'SELECT * FROM projects WHERE id = ? AND deleted = 0',
      [projectId]
    ) as DbProject | undefined;

    if (!project) {
      return apiResponse.notFound('Project not found');
    }

    // Check if user has access to this project
    const member = await sqlite.get(
      'SELECT * FROM project_members WHERE projectId = ? AND userId = ?',
      [projectId, stringUserId]
    );

    // For debugging
    console.log('Project owner ID:', project.ownerId, 'User ID (string format):', stringUserId);
    
    if (!member && project.ownerId !== stringUserId) {
      return apiResponse.forbidden('You do not have access to this project');
    }

    // Get project members with user details
    const members = await sqlite.all(`
      SELECT pm.*, u.name, u.email, u.profileImage 
      FROM project_members pm
      JOIN users u ON pm.userId = u.id
      WHERE pm.projectId = ?
    `, [projectId]);

    // Get tasks for this project
    const tasks = await sqlite.all(
      'SELECT * FROM tasks WHERE projectId = ? AND deleted = 0 ORDER BY createdAt DESC',
      [projectId]
    );

    // Get milestones
    const milestones = await sqlite.all(
      'SELECT * FROM milestones WHERE projectId = ? ORDER BY dueDate ASC',
      [projectId]
    );

    // Calculate project progress
    const taskCount = tasks.length;
    const completedTaskCount = tasks.filter((task: any) => task.status === 'COMPLETED').length;
    const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

    // Return combined project data
    const projectData = {
      ...project,
      members,
      tasks,
      milestones,
      taskCount,
      completedTaskCount,
      progress
    };

    return apiResponse.success(projectData, undefined, 'Project fetched successfully');
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return apiResponse.error(`Error fetching project: ${error.message}`);
  }
}

// PUT handler - Update a project
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Safely extract the ID from the context
    const { id } = context.params;
    
    const userPayload: UserPayload | null = await verifyJwtHeader(request);
    if (!userPayload || !userPayload.id) {
      return apiResponse.unauthorized('Authentication required');
    }
    
    const userId = userPayload.id;
    
    // Convert numeric ID to string format to match database entries
    const stringUserId = `user-${userId.toString().padStart(3, '0')}`;
    console.log('PUT: Using string user ID for DB query:', stringUserId);
    
    const projectId = id;
    const body = await request.json();
    
    // Validate input
    const validationResult = projectSchema.safeParse(body);
    if (!validationResult.success) {
      return apiResponse.badRequest(
        `Invalid project data: ${validationResult.error.message}`
      );
    }
    
    // Check if project exists
    interface DbProject {
      id: string;
      title: string;
      description?: string;
      startDate?: string;
      dueDate?: string;
      status: string;
      ownerId: string;
      deleted: number;
      createdAt: string;
      updatedAt: string;
    }
    
    const project = await sqlite.get(
      'SELECT * FROM projects WHERE id = ? AND deleted = 0',
      [projectId]
    ) as DbProject | undefined;

    if (!project) {
      return apiResponse.notFound('Project not found');
    }

    // Check if user is the owner or an admin
    const member = await sqlite.get(
      'SELECT * FROM project_members WHERE projectId = ? AND userId = ? AND role = ?',
      [projectId, userId, 'ADMIN']
    );

    if (project.ownerId !== userId && !member) {
      return apiResponse.forbidden('You do not have permission to update this project');
    }

    const projectData = validationResult.data;
    const now = new Date().toISOString();

    // Update project
    await sqlite.run(
      `UPDATE projects SET 
        title = ?, 
        description = ?, 
        startDate = ?, 
        dueDate = ?, 
        status = ?, 
        updatedAt = ? 
       WHERE id = ?`,
      [
        projectData.title,
        projectData.description || null,
        projectData.startDate || null,
        projectData.dueDate || null,
        projectData.status,
        now,
        projectId
      ]
    );

    // Get updated project
    const updatedProject = await sqlite.get(
      'SELECT * FROM projects WHERE id = ?',
      [projectId]
    );

    return apiResponse.success(updatedProject, undefined, 'Project updated successfully');
  } catch (error: any) {
    console.error('Error updating project:', error);
    return apiResponse.error(`Error updating project: ${error.message}`);
  }
}

// DELETE handler - Soft delete a project
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Safely extract the ID from the context
    const { id } = context.params;
    
    const userPayload: UserPayload | null = await verifyJwtHeader(request);
    if (!userPayload || !userPayload.id) {
      return apiResponse.unauthorized('Authentication required');
    }
    
    const userId = userPayload.id;
    
    // Convert numeric ID to string format to match database entries
    const stringUserId = `user-${userId.toString().padStart(3, '0')}`;
    console.log('DELETE: Using string user ID for DB query:', stringUserId);
    
    const projectId = id;

    // Check if project exists
    interface DbProject {
      id: string;
      title: string;
      description?: string;
      startDate?: string;
      dueDate?: string;
      status: string;
      ownerId: string;
      deleted: number;
      createdAt: string;
      updatedAt: string;
    }
    
    const project = await sqlite.get(
      'SELECT * FROM projects WHERE id = ? AND deleted = 0',
      [projectId]
    ) as DbProject | undefined;

    if (!project) {
      return apiResponse.notFound('Project not found');
    }

    // Check if user has permission to delete (must be owner)
    console.log('Delete - Project owner:', project.ownerId, 'User ID (string):', stringUserId);
    if (project.ownerId !== stringUserId) {
      return apiResponse.forbidden('Only the project owner can delete the project');
    }

    const now = new Date().toISOString();

    // Soft delete the project
    await sqlite.run(
      'UPDATE projects SET deleted = 1, updatedAt = ? WHERE id = ?',
      [now, projectId]
    );

    return apiResponse.success(undefined, undefined, 'Project deleted successfully');
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return apiResponse.error(`Error deleting project: ${error.message}`);
  }
}
