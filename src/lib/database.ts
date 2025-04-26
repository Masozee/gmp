import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Check if we're using Supabase
const useSupabase = process.env.USE_SUPABASE === 'true' || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined;

// Initialize Supabase client if using Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = useSupabase ? createClient(supabaseUrl, supabaseKey) : null;

// Define type for SQLite module
interface SQLiteModule {
  run: (sql: string, params: unknown[]) => Promise<RunResult>;
  get: <T>(sql: string, params: unknown[]) => Promise<T | undefined>;
  all: <T>(sql: string, params: unknown[]) => Promise<T[]>;
  transaction: <T>(callback: () => Promise<T> | T) => Promise<T>;
}

// SQLite is only available in Node.js environment
let sqlite: SQLiteModule | null = null;

// Dynamically import SQLite in Node.js environment
if (!useSupabase && typeof window === 'undefined') {
  import('./sqlite').then((module) => {
    sqlite = module.default;
  }).catch((err) => {
    console.error('Failed to import SQLite:', err);
  });
}

// Result from run operation
interface RunResult {
  lastInsertRowid: number | string;
  changes: number;
}

// Error type for database errors
interface DatabaseError {
  code?: string;
  message: string;
}

// Interface for SQL parsing result
interface ParsedSql {
  tableName: string;
  operation: string;
  fields: string[];
  conditions: Record<string, unknown>;
  values: Record<string, unknown>;
}

// Database abstraction layer
const database = {
  // Check if using Supabase
  isUsingSupabase(): boolean {
    return useSupabase;
  },
  
  // Get Supabase client directly if needed
  getSupabaseClient() {
    if (!useSupabase) {
      throw new Error('Supabase is not configured');
    }
    return supabase!; // Non-null assertion as we checked useSupabase
  },
  
  // Run a query that modifies data
  async run(sql: string, params: unknown[] = []): Promise<RunResult> {
    if (useSupabase) {
      // Convert SQL to Supabase operations
      // This is a simplified implementation
      try {
        const { tableName, operation, conditions, values } = this.parseSql(sql, params);
        
        if (operation === 'INSERT') {
          const { data, error } = await supabase!
            .from(tableName)
            .insert(values)
            .select('id')
            .single();
          
          if (error) throw error;
          
          return {
            lastInsertRowid: data.id,
            changes: 1
          };
        } else if (operation === 'UPDATE') {
          const { data, error } = await supabase!
            .from(tableName)
            .update(values)
            .match(conditions);
          
          if (error) throw error;
          
          return {
            lastInsertRowid: 0,
            changes: data && Array.isArray(data) ? (data as any[]).length : 0
          };
        } else if (operation === 'DELETE') {
          const { data, error } = await supabase!
            .from(tableName)
            .delete()
            .match(conditions);
          
          if (error) throw error;
          
          return {
            lastInsertRowid: 0,
            changes: data && Array.isArray(data) ? (data as any[]).length : 0
          };
        } else {
          throw new Error(`Unsupported operation: ${operation}`);
        }
      } catch (error) {
        console.error('Error in Supabase operation:', error);
        throw error;
      }
    } else {
      // Use SQLite if not using Supabase
      if (!sqlite) {
        throw new Error('SQLite is not initialized');
      }
      return sqlite.run(sql, params);
    }
  },
  
  // Get a single row
  async get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    if (useSupabase) {
      try {
        const { tableName, operation, conditions, fields } = this.parseSql(sql, params);
        
        if (operation === 'SELECT') {
          const { data, error } = await supabase!
            .from(tableName)
            .select(fields.join(','))
            .match(conditions)
            .limit(1)
            .single();
          
          if (error && error.code !== 'PGRST116') { // Not Found is ok
            throw error;
          }
          
          return data as T | undefined;
        } else {
          throw new Error(`Unsupported operation: ${operation}`);
        }
      } catch (error) {
        console.error('Error in Supabase get operation:', error);
        if ((error as DatabaseError).code === 'PGRST116') { // Not Found
          return undefined;
        }
        throw error;
      }
    } else {
      // Use SQLite
      if (!sqlite) {
        throw new Error('SQLite is not initialized');
      }
      return sqlite.get(sql, params) as Promise<T | undefined>;
    }
  },
  
  // Get all rows
  async all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (useSupabase) {
      try {
        const { tableName, operation, conditions, fields } = this.parseSql(sql, params);
        
        if (operation === 'SELECT') {
          const { data, error } = await supabase!
            .from(tableName)
            .select(fields.join(','))
            .match(conditions);
          
          if (error) throw error;
          
          return (data || []) as T[];
        } else {
          throw new Error(`Unsupported operation: ${operation}`);
        }
      } catch (error) {
        console.error('Error in Supabase all operation:', error);
        throw error;
      }
    } else {
      // Use SQLite
      if (!sqlite) {
        throw new Error('SQLite is not initialized');
      }
      return sqlite.all(sql, params) as Promise<T[]>;
    }
  },
  
  // Execute a transaction
  async transaction<T>(callback: () => Promise<T> | T): Promise<T> {
    if (useSupabase) {
      // Supabase doesn't have direct transaction support in the client
      // We'll do a basic implementation
      try {
        return await Promise.resolve(callback());
      } catch (error) {
        console.error('Transaction error:', error);
        throw error;
      }
    } else {
      // Use SQLite
      if (!sqlite) {
        throw new Error('SQLite is not initialized');
      }
      return sqlite.transaction(callback) as Promise<T>;
    }
  },
  
  // Generate a unique ID
  generateId(): string {
    return randomUUID();
  },
  
  // Simple SQL parser (very basic implementation)
  parseSql(sql: string, params: unknown[] = []): ParsedSql {
    // This is a very simplified parser and will only work for basic queries
    sql = sql.trim();
    
    // Extract operation type
    const operation = sql.split(' ')[0].toUpperCase();
    
    // Extract table name
    let tableName = '';
    if (operation === 'SELECT') {
      const fromIndex = sql.toUpperCase().indexOf(' FROM ');
      if (fromIndex > -1) {
        const afterFrom = sql.substring(fromIndex + 6).trim();
        tableName = afterFrom.split(' ')[0].replace(/`/g, '');
      }
    } else if (operation === 'INSERT') {
      const intoIndex = sql.toUpperCase().indexOf(' INTO ');
      if (intoIndex > -1) {
        const afterInto = sql.substring(intoIndex + 6).trim();
        tableName = afterInto.split(' ')[0].replace(/`/g, '');
      }
    } else if (operation === 'UPDATE') {
      tableName = sql.split(' ')[1].replace(/`/g, '');
    } else if (operation === 'DELETE') {
      const fromIndex = sql.toUpperCase().indexOf(' FROM ');
      if (fromIndex > -1) {
        const afterFrom = sql.substring(fromIndex + 6).trim();
        tableName = afterFrom.split(' ')[0].replace(/`/g, '');
      }
    }
    
    // Extract fields for SELECT or initialize with '*' for other operations
    let fields: string[] = ['*'];
    if (operation === 'SELECT') {
      const fieldsPart = sql.substring(7, sql.toUpperCase().indexOf(' FROM ')).trim();
      if (fieldsPart !== '*') {
        // Create a new array instead of modifying in place
        fields = fieldsPart.split(',').map(field => field.trim().replace(/`/g, ''));
      }
    }
    
    // Extract conditions
    const conditions: Record<string, unknown> = {};
    const whereIndex = sql.toUpperCase().indexOf(' WHERE ');
    if (whereIndex > -1) {
      const wherePart = sql.substring(whereIndex + 7).trim();
      // This is extremely simplified and will only work for basic conditions
      const conditionParts = wherePart.split(' AND ');
      
      conditionParts.forEach((part, index) => {
        // Handle "=" condition
        if (part.includes('=')) {
          const [field] = part.split('=');
          const fieldName = field.trim().replace(/`/g, '');
          // Assume the param is at the same index
          conditions[fieldName] = params[index];
        }
      });
    }
    
    // Extract values for INSERT/UPDATE
    const values: Record<string, unknown> = {};
    if (operation === 'INSERT') {
      // Extract column names
      const columnsStart = sql.indexOf('(');
      const columnsEnd = sql.indexOf(')');
      if (columnsStart > -1 && columnsEnd > -1) {
        const columnsPart = sql.substring(columnsStart + 1, columnsEnd);
        const columns = columnsPart.split(',').map(c => c.trim().replace(/`/g, ''));
        
        // Match with params
        columns.forEach((column, index) => {
          values[column] = params[index];
        });
      }
    } else if (operation === 'UPDATE') {
      // Extract SET part
      const setIndex = sql.toUpperCase().indexOf(' SET ');
      const whereIndex = sql.toUpperCase().indexOf(' WHERE ');
      if (setIndex > -1) {
        const setPart = sql.substring(
          setIndex + 5, 
          whereIndex > -1 ? whereIndex : undefined
        ).trim();
        
        // Split by commas
        const setParts = setPart.split(',');
        setParts.forEach((part, index) => {
          if (part.includes('=')) {
            const [field] = part.split('=');
            const fieldName = field.trim().replace(/`/g, '');
            values[fieldName] = params[index];
          }
        });
      }
    }
    
    return {
      tableName,
      operation,
      fields,
      conditions,
      values
    };
  }
};

export default database; 