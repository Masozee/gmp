import { NextRequest, NextResponse } from "next/server";
import sqlite from "@/lib/sqlite";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt-server";

// Define user interface
interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

/**
 * Endpoint to fetch a list of users for assignment
 * For use in task assignment dropdown
 */
export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify token
    try {
      const decoded = await verifyToken(token);
    } catch (error) {
      console.error("verifyToken error:", error);
      return NextResponse.json({ error: "Invalid token", details: String(error) }, { status: 401 });
    }

    // Get query parameters for search
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    
    // Build query
    let query = `
      SELECT id, name, email, role
      FROM users
      WHERE 1=1
    `;
    
    const params: string[] = [];
    
    // Add search filter if provided
    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY name ASC`;
    
    // Execute query
    const users = await sqlite.all<User>(query, params);
    
    return NextResponse.json({
      users: users.map((user: User) => ({
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        role: user.role
      }))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      error: "Failed to fetch users",
      details: String(error)
    }, { status: 500 });
  }
}
