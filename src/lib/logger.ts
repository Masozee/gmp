
// Define log levels and error severity types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Interface for structured log events
export interface LogEvent {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  stack?: string;
}

// Interface for error log entries stored in the database
export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  severity: ErrorSeverity;
  message: string;
  context: string;
  stack?: string;
}

// Store logs in memory during development if DB is not available
const memoryLogs: LogEvent[] = [];

// Prevent excessive logging through throttling
const MIN_LOG_INTERVAL = 1000; // 1 second
const logThrottleMap = new Map<string, number>();

class Logger {
  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const combinedContext = {
      ...context,
      errorName: error?.name
    };
    this.log('error', message, combinedContext, error?.stack);
    
    // Save error to database
    this.saveErrorToDatabase('medium', message, combinedContext, error?.stack);
  }

  /**
   * Log a fatal error message
   */
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    const combinedContext = {
      ...context,
      errorName: error?.name
    };
    this.log('fatal', message, combinedContext, error?.stack);
    
    // Save critical error to database
    this.saveErrorToDatabase('critical', message, combinedContext, error?.stack);
  }

  /**
   * Generic log method that handles all log levels
   */
  log(level: LogLevel, message: string, context?: Record<string, unknown>, stack?: string): void {
    // Create log event
    const logEvent: LogEvent = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      stack
    };

    // Apply throttling to prevent log flooding
    const key = `${level}:${message}`;
    const now = Date.now();
    const lastLogTime = logThrottleMap.get(key) || 0;
    
    if (now - lastLogTime < MIN_LOG_INTERVAL) {
      return; // Skip this log entry
    }
    
    logThrottleMap.set(key, now);
    
    // Store in memory for development
    if (process.env.NODE_ENV === 'development') {
      memoryLogs.push(logEvent);
      if (memoryLogs.length > 1000) {
        memoryLogs.shift(); // Remove oldest log if we store too many
      }
    }
    
    // Format log for console
    let consoleMessage = `[${level.toUpperCase()}] ${message}`;
    if (context) {
      consoleMessage += ` ${JSON.stringify(context)}`;
    }
    
    // Output to console with appropriate level
    switch (level) {
      case 'debug':
        console.debug(consoleMessage);
        break;
      case 'info':
        console.info(consoleMessage);
        break;
      case 'warn':
        console.warn(consoleMessage);
        break;
      case 'error':
      case 'fatal':
        console.error(consoleMessage);
        if (stack) {
          console.error(stack);
        }
        break;
    }
  }
  
  /**
   * Save an error to the database for persistent storage
   */
  async saveErrorToDatabase(
    severity: ErrorSeverity,
    message: string,
    context?: Record<string, unknown>,
    stack?: string
  ): Promise<void> {
    try {
      // Don't persist logs in development mode unless explicitly configured
      if (process.env.NODE_ENV === 'development' && !process.env.PERSIST_DEV_LOGS) {
        return;
      }
      
      // Import dynamically to avoid circular dependencies
      const { default: sqlite } = await import('./sqlite');
      
      await sqlite.run(`
        INSERT INTO error_logs (
          userId, severity, message, context, stack, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        context?.userId || null,
        severity,
        message,
        JSON.stringify(context || {}),
        stack || null,
        new Date().toISOString()
      ]);
    } catch (error) {
      // Don't use the logger here to avoid potential infinite loops
      console.error('Failed to save error log to database:', error);
    }
  }
}

// Create a singleton instance
export const logger = new Logger();

/**
 * Get error logs from the API with filtering options
 */
export async function getErrorLogs(options?: {
  userId?: string
  severity?: ErrorSeverity
  limit?: number
  offset?: number
}) {
  const params = new URLSearchParams();
  if (options?.severity) params.set('severity', options.severity);
  if (options?.userId) params.set('userId', options.userId);
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.offset) params.set('offset', options.offset.toString());

  try {
    const response = await fetch(`/api/logs?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch error logs');
    }

    return response.json();
  } catch (error) {
    logger.error('Failed to fetch error logs', error instanceof Error ? error : new Error(String(error)));
    return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
}

// Default export
export default logger; 