import { NextRequest, NextResponse } from 'next/server';
import sqlite from './sqlite';

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
    transform = (data: any) => data as T,
  }: {
    request: NextRequest;
    tableName: string;
    searchFields?: string[];
    defaultSort?: string;
    defaultOrder?: 'asc' | 'desc';
    customQuery?: string | null;
    customParams?: any[];
    transform?: (data: any) => T;
  }) {
    try {
      // Parse query parameters
      const searchParams = new URL(request.url).searchParams;
      
      // Pagination
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10')));
      const { offset } = sqlite.paginate(page, limit);
      
      // Search
      const search = searchParams.get('search');
      
      // Filtering and sorting
      const sort = searchParams.get('sort') || defaultSort;
      const order = (searchParams.get('order') || defaultOrder).toLowerCase() as 'asc' | 'desc';
      
      // Build WHERE clause for search
      let whereClause = '';
      const params: any[] = [...customParams];
      
      if (search && searchFields.length > 0) {
        const searchClauses = searchFields.map(field => `${field} LIKE ?`);
        whereClause = ` WHERE (${searchClauses.join(' OR ')})`;
        
        // Add search parameters for each field
        searchFields.forEach(() => params.push(`%${search}%`));
      }
      
      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM ${tableName}${whereClause}`;
      const countResult = sqlite.get<{ total: number }>(countQuery, params);
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
      const data = sqlite.all(query, allParams);
      
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
    transform = (data: any) => data,
    beforeInsert = async (data: any) => data,
    afterInsert = async (id: number, data: any) => ({ id, ...data }),
  }: {
    request: NextRequest;
    tableName: string;
    requiredFields?: string[];
    transform?: (data: any) => any;
    beforeInsert?: (data: any) => Promise<any>;
    afterInsert?: (id: number, data: any) => Promise<T>;
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
      const processedData = await beforeInsert(transformedData);
      
      // Use a transaction for the insert
      return sqlite.transaction(async () => {
        // Get the fields and values for the insert
        const fields = Object.keys(processedData);
        const placeholders = fields.map(() => '?').join(', ');
        const values = fields.map(field => processedData[field]);
        
        // Prepare the statement for better performance
        const stmt = sqlite.prepareStatement(`
          INSERT INTO ${tableName} (${fields.join(', ')})
          VALUES (${placeholders})
        `);
        
        // Execute the insert
        const result = stmt.run(...values);
        
        // Process after insert - convert bigint to number if needed
        const rowId = typeof result.lastInsertRowid === 'bigint' 
          ? Number(result.lastInsertRowid) 
          : result.lastInsertRowid as number;
        
        const finalData = await afterInsert(rowId, processedData);
        
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
    transform = (data: any) => data as T,
    notFoundMessage = 'Resource not found',
  }: {
    id: string;
    tableName: string;
    idField?: string;
    customQuery?: string | null;
    transform?: (data: any) => T;
    notFoundMessage?: string;
  }) {
    try {
      let query;
      if (customQuery) {
        query = customQuery;
      } else {
        query = `SELECT * FROM ${tableName} WHERE ${idField} = ?`;
      }
      
      // Prepare and execute the statement
      const stmt = sqlite.prepareStatement(query);
      const data = stmt.get(id);
      
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
    transform = (data: any) => data,
    beforeUpdate = async (data: any) => data,
    afterUpdate = async (id: string, data: any) => ({ id, ...data }),
    notFoundMessage = 'Resource not found',
  }: {
    id: string;
    request: NextRequest;
    tableName: string;
    idField?: string;
    requiredFields?: string[];
    transform?: (data: any) => any;
    beforeUpdate?: (data: any) => Promise<any>;
    afterUpdate?: (id: string, data: any) => Promise<T>;
    notFoundMessage?: string;
  }) {
    try {
      // Check if record exists
      const checkStmt = sqlite.prepareStatement(`SELECT ${idField} FROM ${tableName} WHERE ${idField} = ?`);
      const existingRecord = checkStmt.get(id);
      
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
      const processedData = await beforeUpdate(transformedData);
      
      // Use a transaction for the update
      return sqlite.transaction(async () => {
        // Get the fields and values for the update
        const fields = Object.keys(processedData);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = [...fields.map(field => processedData[field]), id];
        
        // Prepare the statement
        const stmt = sqlite.prepareStatement(`
          UPDATE ${tableName}
          SET ${setClause}
          WHERE ${idField} = ?
        `);
        
        // Execute the update
        stmt.run(...values);
        
        // Process after update
        const finalData = await afterUpdate(id, processedData);
        
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
    afterDelete = async () => ({}),
    notFoundMessage = 'Resource not found',
  }: {
    id: string;
    tableName: string;
    idField?: string;
    beforeDelete?: () => Promise<boolean>;
    afterDelete?: () => Promise<any>;
    notFoundMessage?: string;
  }) {
    try {
      // Check if record exists
      const checkStmt = sqlite.prepareStatement(`SELECT ${idField} FROM ${tableName} WHERE ${idField} = ?`);
      const existingRecord = checkStmt.get(id);
      
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
      return sqlite.transaction(async () => {
        // Prepare the statement
        const stmt = sqlite.prepareStatement(`DELETE FROM ${tableName} WHERE ${idField} = ?`);
        
        // Execute the delete
        stmt.run(id);
        
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