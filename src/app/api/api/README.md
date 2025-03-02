# Hono API Implementation for Next.js

This directory contains API routes implemented using Hono, a lightweight web framework for edge environments and Node.js. This README explains the structure, design patterns, and best practices used in the implementation.

## Key Features

- Modern API architecture using Hono
- Consistent response format for all endpoints
- Comprehensive error handling
- Null and empty data handling to prevent errors
- Type safety with TypeScript
- Middleware for logging and CORS
- Route organization with Hono's built-in router

## Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;   // Whether the request was successful
  data: T | null;     // The actual data (null on error)
  error?: string;     // Error message (only present on error)
  message?: string;   // Success message (only present on success)
}
```

### Success Response Example

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example Project",
    "description": "This is an example project"
  },
  "message": "Project retrieved successfully"
}
```

### Error Response Example

```json
{
  "success": false,
  "data": null,
  "error": "Project not found"
}
```

## Null and Empty Handling

The API uses helper functions to handle null and empty data safely:

- `handleEmptyResults<T>(results: T[], entityName: string): T[]`
  - Returns an empty array when no results are found, rather than throwing an error
  - Used for list endpoints like `/api/projects`

- `handleSingleResult<T>(result: T | null, entityName: string, notFoundStatus = 404): T`
  - Provides proper error handling when a specific entity is not found
  - Used for detail endpoints like `/api/projects/[id]`

## API Structure

The API is organized into the following routes:

- `/api/projects` - Project management
  - `GET /api/projects` - List all projects
  - `POST /api/projects` - Create a new project
  - `GET /api/projects/count` - Get project count
  - `GET /api/projects/:id` - Get a specific project
  - `PATCH /api/projects/:id` - Update a project
  - `DELETE /api/projects/:id` - Delete a project

- `/api/publications` - Publication management
  - `GET /api/publications` - List all publications
  - `POST /api/publications` - Create a new publication
  - `GET /api/publications/count` - Get publication count
  - `GET /api/publications/:id` - Get a specific publication
  - `PATCH /api/publications/:id` - Update a publication
  - `DELETE /api/publications/:id` - Delete a publication

- `/api/auth` - Authentication endpoints
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `GET /api/auth/session` - Get current session

- `/api/status` - System status information
  - `GET /api/status` - Get system status, database connection, and counts

### Implementation Pattern

Each API endpoint follows a consistent implementation pattern:

1. **Create Hono App Instance**:
   ```typescript
   const app = createApiApp()
   ```

2. **Define Routes with HTTP Methods**:
   ```typescript
   app.get("/", async (c) => { /* ... */ })
   app.post("/", async (c) => { /* ... */ })
   app.get("/:id", async (c) => { /* ... */ })
   ```

3. **Implement Route Handlers with Error Handling**:
   ```typescript
   try {
     // Validate input
     // Process request
     // Return success response
     return c.json(successResponse(data, "Success message"))
   } catch (error) {
     // Handle errors
     throw errorResponse("Error message", statusCode)
   }
   ```

4. **Export Next.js Handler Functions**:
   ```typescript
   export async function GET(request: NextRequest) {
     return createNextJsHandler(app, request)
   }
   
   export async function POST(request: NextRequest) {
     return createNextJsHandler(app, request)
   }
   ```

## Example Implementation

```typescript
// src/app/api/projects/route.ts
import { NextRequest } from 'next/server'
import { createApiApp, prisma, successResponse, errorResponse, handleEmptyResults } from '@/lib/api'

const app = createApiApp()

// List all projects
app.get('/', async (c) => {
  try {
    const projects = await prisma.project.findMany()
    return c.json(successResponse(handleEmptyResults(projects, 'Projects')))
  } catch (error) {
    throw errorResponse('Failed to fetch projects', 500)
  }
})

// Handler for Next.js
export async function GET(request: NextRequest) {
  try {
    return app.fetch(request)
  } catch (error) {
    console.error("Error handling GET request:", error)
    return new Response(
      JSON.stringify({
        success: false,
        data: null,
        error: "Failed to process request"
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
```

## Error Handling

All API routes use try/catch blocks with consistent error handling:

1. Specific validation errors return 400 Bad Request
2. Not found errors return 404 Not Found
3. Server errors return 500 Internal Server Error

## How to Test the API

You can test the API endpoints using tools like curl, Postman, or directly from your browser for GET requests.

### Example Requests

```bash
# Get all projects
curl http://localhost:3000/api/projects

# Get a specific project
curl http://localhost:3000/api/projects/your-project-id

# Create a new project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"New Project","startDate":"2023-06-01","createdBy":"user-id","managedBy":"user-id"}'

# Update a project
curl -X PATCH http://localhost:3000/api/projects/your-project-id \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Project Name"}'

# Delete a project
curl -X DELETE http://localhost:3000/api/projects/your-project-id
```

## Integration with Next.js App Router

This implementation integrates Hono with Next.js App Router by:

1. Creating Hono app instances for each API route
2. Defining routes and handlers using Hono's API
3. Using Next.js route handlers to delegate requests to the Hono app
4. For dynamic routes, modifying the request URL to include the path parameters

### Handling Dynamic Routes

For dynamic routes like `[id]`, we need to modify the request URL to include the path parameter:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Add the id param to the request
    const url = new URL(request.url)
    url.pathname = `/${params.id}`
    const newRequest = new Request(url, request)
    
    return app.fetch(newRequest)
  } catch (error) {
    console.error("Error handling GET request:", error)
    return new Response(
      JSON.stringify({
        success: false,
        data: null,
        error: "Failed to process request"
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
```

## Benefits

- Consistent response format improves developer experience
- Proper error handling makes debugging easier
- Null/empty handling prevents client-side errors
- TypeScript integration ensures type safety
- Hono's lightweight design improves performance 