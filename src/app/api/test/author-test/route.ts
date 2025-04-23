import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Test data for author creation
    const testAuthor = {
      firstName: "Test",
      lastName: "Author",
      email: `test.author.${Date.now()}@example.com`, // Using timestamp to avoid unique constraint issues
      phoneNumber: "+1234567890",
      organization: "Test Organization",
      bio: "This is a test author created for diagnostic purposes",
      category: "AUTHOR"
    }
    
    // Send POST request to the authors API
    const response = await fetch(new URL('/api/authors', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Copy the authorization headers from the original request
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify(testAuthor)
    })
    
    // Get the response data
    const responseData = await response.json()
    
    // Add additional diagnostic information
    return NextResponse.json({
      testSent: true,
      authorData: testAuthor,
      apiResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      },
      testResult: response.ok ? 'SUCCESS' : 'FAILED',
      nextSteps: response.ok 
        ? 'The API is working correctly. The issue may be with the form submission.' 
        : 'The API returned an error. Check the response for details.'
    })
  } catch (error) {
    console.error("Author API test failed:", error)
    return NextResponse.json({
      testSent: false,
      error: String(error),
      message: "Failed to test author API",
      possibleIssue: "There might be a network or server issue preventing the API call."
    }, { status: 500 })
  }
} 