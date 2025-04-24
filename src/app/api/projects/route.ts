import { NextResponse } from 'next/server';
import * as z from 'zod';
import sqlite from '@/lib/sqlite';
import { v4 as uuidv4 } from 'uuid';
import { verifyJwtHeader } from '@/lib/jwt-server';
import type { UserPayload } from '@/lib/jwt-server';
import { apiResponse } from '@/lib/api-helpers';

// Project schema
export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().optional(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']),
  ownerId: z.string().optional(),
  deleted: z.number().default(0),
});

export type Project = z.infer<typeof projectSchema>;

// GET handler - List all projects
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const userIdParam = searchParams.get('userId');

  try {
    const userPayload: UserPayload | null = await verifyJwtHeader(request);
    if (!userPayload || !userPayload.id) {
      console.log('Authentication failed: No valid token');
      return apiResponse.unauthorized('Authentication required');
    }
    
    console.log('Authenticated user ID:', userPayload.id);

    // Use the authenticated user ID - handle both numeric and string formats
    const userId = userPayload.id;
    
    // Convert numeric ID to string format to match database entries
    // The database uses format: "user-001" while JWT uses numeric IDs
    // Need to format user ID with leading zeros to match exactly
    const stringUserId = `user-${userId.toString().padStart(3, '0')}`;
    console.log('Using string user ID for DB query:', stringUserId);

    // TEMPORARY TESTING MODE: Show all projects regardless of ownership
    let query = `
      SELECT p.* FROM projects p
      WHERE p.deleted = 0
    `;
    
    // Empty params for now - showing all projects
    const params: any[] = [];
    console.log('⚠️ TESTING MODE: Showing all projects regardless of ownership');
    
    /* Original query with user ID filtering
    let query = `
      SELECT p.* FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.projectId
      WHERE p.deleted = 0 AND (p.ownerId = ? OR pm.userId = ?)
    `;
    const params: any[] = [stringUserId, stringUserId];
    console.log('Query params:', params);
    */
    
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    query += ' GROUP BY p.id'; // Prevent duplicates
    query += ' ORDER BY p.createdAt DESC';

    console.log('Executing query:', query);
    console.log('With params:', params);
    
    const projects = await sqlite.all(query, params);
    console.log('Raw projects result:', projects);
    
    // Get member counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project: any) => {
        // Get member count
        const memberCountResult = await sqlite.get(
          'SELECT COUNT(*) as count FROM project_members WHERE projectId = ?',
          [project.id]
        ) as { count: number };
        const memberCount = memberCountResult?.count || 0;

        // Get task counts
        const taskCountResult = await sqlite.get(
          'SELECT COUNT(*) as count FROM tasks WHERE projectId = ? AND deleted = 0',
          [project.id]
        ) as { count: number };
        const taskCount = taskCountResult?.count || 0;

        const completedTaskCountResult = await sqlite.get(
          'SELECT COUNT(*) as count FROM tasks WHERE projectId = ? AND status = ? AND deleted = 0',
          [project.id, 'COMPLETED']
        ) as { count: number };
        const completedTaskCount = completedTaskCountResult?.count || 0;

        // Calculate progress
        const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

        return {
          ...project,
          memberCount,
          taskCount,
          completedTaskCount,
          progress
        };
      })
    );

    return apiResponse.success(projectsWithCounts, undefined, 'Projects fetched successfully');
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return apiResponse.error(`Error fetching projects: ${error.message}`);
  }
}

// POST handler - Create a new project
export async function POST(request: Request) {
  let userId: string | number | null = null; // Match UserPayload ID type

  try {
    const userPayload: UserPayload | null = await verifyJwtHeader(request);
    if (!userPayload || !userPayload.id) {
      console.log('Authentication failed: No valid token in POST handler');
      return apiResponse.unauthorized('Authentication required');
    }
    userId = userPayload.id;

    if (!userId) {
      // This check is redundant now due to the check above, but keep for safety
      return apiResponse.badRequest('User ID not found after verification');
    }

    const body = await request.json();
    const validationResult = projectSchema.safeParse(body);

    if (!validationResult.success) {
      return apiResponse.badRequest(
        `Invalid project data: ${validationResult.error.message}`
      );
    }

    const projectData = validationResult.data;
    const now = new Date().toISOString();
    const projectId = uuidv4();

    const project = {
      id: projectId,
      title: projectData.title,
      description: projectData.description || null,
      startDate: projectData.startDate || null,
      dueDate: projectData.dueDate || null,
      status: projectData.status || 'ACTIVE',
      ownerId: userId,
      deleted: 0,
      createdAt: now,
      updatedAt: now,
    };

    console.log('Project to insert:', project);

    // Insert project
    await sqlite.run(
      `INSERT INTO projects (
        id, title, description, startDate, dueDate, status, ownerId, deleted, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project.id,
        project.title,
        project.description,
        project.startDate,
        project.dueDate,
        project.status,
        project.ownerId,
        project.deleted,
        project.createdAt,
        project.updatedAt,
      ]
    );

    // Add the creator as admin member
    await sqlite.run(
      `INSERT INTO project_members (
        id, projectId, userId, role, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        projectId,
        userId,
        'ADMIN',
        now,
        now,
      ]
    );

    return apiResponse.created(project, 'Project created successfully');
  } catch (error: any) {
    console.error('Error creating project:', error);
    return apiResponse.error(`Error creating project: ${error.message}`);
  }
}
