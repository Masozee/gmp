import { NextRequest, NextResponse } from "next/server";
import sqlite from "@/lib/sqlite";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt-server";
import type { Task } from "../route";

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify token
    let user: { id: string | number; email: string; role: string } | null = null;
    try {
      const decoded = await verifyToken(token);
      user = decoded as { id: string | number; email: string; role: string };
    } catch (error) {
      console.error("verifyToken error:", error);
      return NextResponse.json({ error: "Invalid token", details: String(error) }, { status: 401 });
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    // Required fields
    if (!body.taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    if (!body.reviewStatus) {
      return NextResponse.json({ error: "Review status is required" }, { status: 400 });
    }

    // Validate review status values
    if (!["NEEDS_UPDATE", "ACCEPTED"].includes(body.reviewStatus)) {
      return NextResponse.json({ error: "Invalid review status. Must be 'NEEDS_UPDATE' or 'ACCEPTED'" }, { status: 400 });
    }

    const userId = user?.id ? String(user.id) : null;
    const now = new Date().toISOString();

    // Check if the user is the delegator of the task (only A can review)
    const task = await sqlite.get<Task>(
      "SELECT * FROM tasks WHERE id = ?", 
      [body.taskId]
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.delegatedBy !== userId) {
      return NextResponse.json({ 
        error: "Only the task delegator can review this task" 
      }, { status: 403 });
    }

    // Update the task review status
    await sqlite.run(
      `UPDATE tasks 
       SET reviewStatus = ?, reviewComment = ?, reviewDate = ?, updatedAt = ? 
       WHERE id = ?`,
      [
        body.reviewStatus,
        body.reviewComment || null,
        now,
        now,
        body.taskId
      ]
    );

    // Update task status when accepting the task
    if (body.reviewStatus === "ACCEPTED") {
      await sqlite.run(
        "UPDATE tasks SET status = 'COMPLETED' WHERE id = ?",
        [body.taskId]
      );
    }

    return NextResponse.json({
      message: "Task review updated successfully",
      reviewStatus: body.reviewStatus
    });

  } catch (error) {
    console.error("Error updating task review:", error);
    return NextResponse.json({
      error: "Failed to update task review",
      details: String(error)
    }, { status: 500 });
  }
}
