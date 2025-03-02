import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Create response that clears the token cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    })

    // Delete the token cookie
    response.cookies.delete({
      name: "token",
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    )
  }
} 