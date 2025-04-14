import { NextRequest, NextResponse } from "next/server";
import "@/lib/db-init"; // Import database initializer for Vercel

// This file serves to ensure the database initializer is imported
// for all API routes, as Next.js loads all API routes once a request
// to any API route is made
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    message: "API ready",
    environment: process.env.VERCEL ? "Vercel" : "Development",
  });
} 