import { NextRequest, NextResponse } from 'next/server';
import sqlite from './sqlite';

/**
 * Standardized API response type for better type safety across the application
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Utility functions for creating consistent API responses
 */
export const apiResponse = {
  /**
   * Create a successful response with optional data and pagination
   */
  success<T>(data?: T, pagination?: ApiResponse['pagination'], message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message,
      pagination
    });
  },

  /**
   * Create a success response with status 201 (Created) for resource creation
   */
  created<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message: message || 'Resource created successfully'
    }, { status: 201 });
  },

  /**
   * Create an error response with custom status code
   */
  error(message: string, status: number = 500): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      error: message
    }, { status });
  },

  /**
   * Create a 400 Bad Request response
   */
  badRequest(message: string = 'Bad request'): NextResponse<ApiResponse> {
    return this.error(message, 400);
  },

  /**
   * Create a 401 Unauthorized response
   */
  unauthorized(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
    return this.error(message, 401);
  },

  /**
   * Create a 403 Forbidden response
   */
  forbidden(message: string = 'Forbidden'): NextResponse<ApiResponse> {
    return this.error(message, 403);
  },

  /**
   * Create a 404 Not Found response
   */
  notFound(message: string = 'Resource not found'): NextResponse<ApiResponse> {
    return this.error(message, 404);
  },

  /**
   * Create a 204 No Content response for successful deletion
   */
  noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }
};

/**
 * API response utility that handles common operations for API routes
 */
export const apiHandler = {
  /**
   * Handle GET requests with common operations like pagination, filtering, and sorting
   */
  async handleGetRequest<T>({
    request,
    tableName,
    searchFields = [],
    defaultSort = 'createdAt',
    defaultOrder = 'desc',
    customQuery = null,
    customParams = [],
    transform = (data: unknown) => data as T,
  }: {
    request: NextRequest;
    tableName: string;
    searchFields?: string[];
    defaultSort?: string;
    defaultOrder?: 'asc' | 'desc';
    customQuery?: string | null;
    customParams?: unknown[];
    transform?: (data: unknown) => T;
  }) {
    try {
      // Parse query parameters
      const searchParams = new URL(request.url).searchParams;
      
      // Pagination
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10')));
      const { offset } = await sqlite.paginate(page, limit);
      
      // Search
      const search = searchParams.get('search');
      
      // Filtering and sorting
      const sort = searchParams.get('sort') || defaultSort;
      const order = (searchParams.get('order') || defaultOrder).toLowerCase() as 'asc' | 'desc';
      
      // Build WHERE clause for search
      let whereClause = '';
      const params: unknown[] = [...customParams];
      
      if (search && searchFields.length > 0) {
        const searchClauses = searchFields.map(field => `${field} LIKE ?`);
        whereClause = ` WHERE (${searchClauses.join(' OR ')})`;
        
        // Add search parameters for each field
        searchFields.forEach(() => params.push(`%${search}%`));
      }
      
      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM ${tableName}${whereClause}`;
      const countResult = await sqlite.get<{ total: number }>(countQuery, params);
      const total = countResult?.total || 0;
      
      // Build the query
      let query;
      if (customQuery) {
        query = customQuery;
      } else {
        // Sanitize sort field to prevent SQL injection
        const validSort = sort.replace(/[^a-zA-Z0-9_]/g, '');
        const validOrder = order === 'asc' ? 'asc' : 'desc';
        
        query = `
          SELECT * FROM ${tableName}
          ${whereClause}
          ORDER BY ${validSort} ${validOrder}
          LIMIT ? OFFSET ?
        `;
      }
      
      // Add pagination parameters
      const allParams = [...params, limit, offset];
      
      // Get data
      const data = await sqlite.all(query, allParams);
      
      // Transform data if needed
      const transformedData = data.map(transform);
      
      return NextResponse.json({
        data: transformedData,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error(`Error in API handler for ${tableName}:`, error);
      return NextResponse.json(
        { error: `Failed to fetch ${tableName}` },
        { status: 500 }
      );
    }
  },

  /**
   * Handle POST requests to create new records
   */
  async handlePostRequest<T>({
    request,
    tableName,
    requiredFields = [],
    transform = (data: unknown) => data as T,
    beforeInsert = async (data: Record<string, unknown>) => data,
    afterInsert = async (id: number, data: Record<string, unknown>) => ({ id, ...data } as T),
  }: {
    request: NextRequest;
    tableName: string;
    requiredFields?: string[];
    transform?: (data: unknown) => T;
    beforeInsert?: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
    afterInsert?: (id: number, data: Record<string, unknown>) => Promise<T>;
  }) {
    try {
      const body = await request.json();
      
      // Validate required fields
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }
      
      // Transform data if needed
      const transformedData = transform(body);
      
      // Additional processing before insert
      const processedData = await beforeInsert(transformedData as Record<string, unknown>);
      
      // Use a transaction for the insert
      return sqlite.transaction(async () => {
        // Get the fields and values for the insert
        const fields = Object.keys(processedData);
        const placeholders = fields.map(() => '?').join(', ');
        const values = fields.map(field => (processedData as Record<string, unknown>)[field]);
        
        // Use direct query instead of prepared statement
        const insertQuery = `
          INSERT INTO ${tableName} (${fields.join(', ')})
          VALUES (${placeholders})
        `;
        
        // Execute the insert directly
        const result = await sqlite.run(insertQuery, values);
        
        // Process after insert - convert bigint to number if needed
        const rowId = typeof result.lastInsertRowid === 'bigint' 
          ? Number(result.lastInsertRowid) 
          : result.lastInsertRowid as number;
        
        const finalData = await afterInsert(rowId, processedData as Record<string, unknown>);
        
        return NextResponse.json(finalData, { status: 201 });
      });
    } catch (error) {
      console.error(`Error in API handler for ${tableName}:`, error);
      return NextResponse.json(
        { error: `Failed to create ${tableName}` },
        { status: 500 }
      );
    }
  },

  /**
   * Handle GET requests for a single record by ID
   */
  async handleGetByIdRequest<T>({
    id,
    tableName,
    idField = 'id',
    customQuery = null,
    transform = (data: unknown) => data as T,
    notFoundMessage = 'Resource not found',
  }: {
    id: string;
    tableName: string;
    idField?: string;
    customQuery?: string | null;
    transform?: (data: unknown) => T;
    notFoundMessage?: string;
  }) {
    try {
      let query;
      if (customQuery) {
        query = customQuery;
      } else {
        query = `SELECT * FROM ${tableName} WHERE ${idField} = ?`;
      }
      
      // Execute the query directly instead of using a prepared statement
      const data = await sqlite.get(query, [id]);
      
      if (!data) {
        return NextResponse.json(
          { error: notFoundMessage },
          { status: 404 }
        );
      }
      
      const transformedData = transform(data);
      
      return NextResponse.json(transformedData);
    } catch (error) {
      console.error(`Error in API handler for ${tableName}:`, error);
      return NextResponse.json(
        { error: `Failed to fetch ${tableName}` },
        { status: 500 }
      );
    }
  },

  /**
   * Handle PUT requests to update a record
   */
  async handlePutRequest<T>({
    id,
    request,
    tableName,
    idField = 'id',
    requiredFields = [],
    transform = (data: unknown) => data as T,
    beforeUpdate = async (data: Record<string, unknown>) => data,
    afterUpdate = async (id: string, data: Record<string, unknown>) => ({ id, ...data } as T),
    notFoundMessage = 'Resource not found',
  }: {
    id: string;
    request: NextRequest;
    tableName: string;
    idField?: string;
    requiredFields?: string[];
    transform?: (data: unknown) => T;
    beforeUpdate?: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
    afterUpdate?: (id: string, data: Record<string, unknown>) => Promise<T>;
    notFoundMessage?: string;
  }) {
    try {
      // Check if record exists
      const existingRecord = await sqlite.get(`SELECT ${idField} FROM ${tableName} WHERE ${idField} = ?`, [id]);
      
      if (!existingRecord) {
        return NextResponse.json(
          { error: notFoundMessage },
          { status: 404 }
        );
      }
      
      const body = await request.json();
      
      // Validate required fields
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }
      
      // Transform data if needed
      const transformedData = transform(body);
      
      // Additional processing before update
      const processedData = await beforeUpdate(transformedData as Record<string, unknown>);
      
      // Use a transaction for the update
      return await sqlite.transaction(async () => {
        // Get the fields and values for the update
        const fields = Object.keys(processedData);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = [...fields.map(field => processedData[field]), id];
        
        // Execute the update directly
        const updateQuery = `
          UPDATE ${tableName}
          SET ${setClause}
          WHERE ${idField} = ?
        `;
        await sqlite.run(updateQuery, values);
        
        // Process after update
        const finalData = await afterUpdate(id, processedData as Record<string, unknown>);
        
        return NextResponse.json(finalData);
      });
    } catch (error) {
      console.error(`Error in API handler for ${tableName}:`, error);
      return NextResponse.json(
        { error: `Failed to update ${tableName}` },
        { status: 500 }
      );
    }
  },

  /**
   * Handle DELETE requests
   */
  async handleDeleteRequest({
    id,
    tableName,
    idField = 'id',
    beforeDelete = async () => true,
    afterDelete = async (): Promise<unknown> => ({}),
    notFoundMessage = 'Resource not found',
  }: {
    id: string;
    tableName: string;
    idField?: string;
    beforeDelete?: () => Promise<boolean>;
    afterDelete?: () => Promise<unknown>;
    notFoundMessage?: string;
  }) {
    try {
      // Check if record exists
      const existingRecord = await sqlite.get(`SELECT ${idField} FROM ${tableName} WHERE ${idField} = ?`, [id]);
      
      if (!existingRecord) {
        return NextResponse.json(
          { error: notFoundMessage },
          { status: 404 }
        );
      }
      
      // Additional processing before delete
      const shouldProceed = await beforeDelete();
      
      if (!shouldProceed) {
        return NextResponse.json(
          { error: 'Delete operation cancelled' },
          { status: 400 }
        );
      }
      
      // Use a transaction for the delete
      return await sqlite.transaction(async () => {
        // Execute the delete directly
        await sqlite.run(`DELETE FROM ${tableName} WHERE ${idField} = ?`, [id]);
        
        // Process after delete
        const result = await afterDelete();
        
        return NextResponse.json(result);
      });
    } catch (error) {
      console.error(`Error in API handler for ${tableName}:`, error);
      return NextResponse.json(
        { error: `Failed to delete ${tableName}` },
        { status: 500 }
      );
    }
  },
};

export default apiHandler; 