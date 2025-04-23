import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Log all headers for debugging
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    // Try to parse body based on content type
    let body: Record<string, any> = {}
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      body = await request.json()
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      formData.forEach((value, key) => {
        body[key] = value
      })
    } else {
      body = { rawText: await request.text() }
    }
    
    return NextResponse.json({
      receivedRequest: {
        method: request.method,
        url: request.url,
        headers,
        contentType,
        body
      },
      diagnosis: "This shows exactly what data is being received by the server from your form submission"
    })
  } catch (error) {
    console.error("Form test failed:", error)
    return NextResponse.json({
      error: String(error),
      message: "Failed to process form data"
    }, { status: 500 })
  }
} 