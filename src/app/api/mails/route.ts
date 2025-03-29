import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

// Function to convert month to Roman numerals
function monthToRoman(month: number): string {
  const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
  return romanMonths[month - 1]
}

// Function to generate a mail number
async function generateMailNumber(categoryCode: string, date: Date): Promise<string> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // JavaScript months are 0-indexed
  
  // Get or create counter for the current year
  let counter = await db.MailCounter.findUnique({
    where: { year },
  })
  
  if (!counter) {
    counter = await db.MailCounter.create({
      data: {
        year,
        counter: 0,
      },
    })
  }
  
  // Increment counter
  counter = await db.MailCounter.update({
    where: { year },
    data: {
      counter: {
        increment: 1,
      },
    },
  })
  
  // Format: {counter}/{category code}/{month in roman}/{year}
  // Example: 0090/SK/III/2025
  const paddedCounter = counter.counter.toString().padStart(4, '0')
  const romanMonth = monthToRoman(month)
  
  return `${paddedCounter}/${categoryCode}/${romanMonth}/${year}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const skip = (page - 1) * pageSize
    
    // Parse filter parameters
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || undefined
    const status = searchParams.get("status") || undefined
    
    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { mailNumber: { contains: search, mode: "insensitive" } },
        { sender: { contains: search, mode: "insensitive" } },
        { recipient: { contains: search, mode: "insensitive" } },
      ]
    }
    
    if (type) {
      where.type = type
    }
    
    if (status) {
      where.status = status
    }
    
    // Get total count for pagination
    const totalItems = await db.Mail.count({ where })
    const totalPages = Math.ceil(totalItems / pageSize)
    
    // Get mails with pagination and filters
    const mails = await db.Mail.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      skip,
      take: pageSize,
    })
    
    return NextResponse.json({
      items: mails,
      page,
      pageSize,
      totalItems,
      totalPages,
    })
  } catch (error) {
    console.error("Error fetching mails:", error)
    return NextResponse.json(
      { error: "Failed to fetch mails" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.subject || !body.type || !body.date || !body.sender || !body.recipient || !body.categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Get the category to use its code
    const category = await db.MailCategory.findUnique({
      where: {
        id: body.categoryId,
      },
    })
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }
    
    // Generate mail number
    const date = new Date(body.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // JavaScript months are 0-indexed
    
    // Get or create counter for the current year
    let counter = await db.MailCounter.findUnique({
      where: {
        year,
      },
    })
    
    if (!counter) {
      counter = await db.MailCounter.create({
        data: {
          year,
          counter: 0,
        },
      })
    }
    
    // Increment counter
    counter = await db.MailCounter.update({
      where: {
        id: counter.id,
      },
      data: {
        counter: {
          increment: 1,
        },
      },
    })
    
    // Convert month to Roman numeral
    const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
    const romanMonth = romanMonths[month - 1]
    
    // Format: {counter}/{category code}/{month in roman}/{year}
    const mailNumber = `${counter.counter.toString().padStart(4, "0")}/${category.code}/${romanMonth}/${year}`
    
    // Create mail
    const mail = await db.Mail.create({
      data: {
        mailNumber,
        subject: body.subject,
        description: body.description || null,
        content: body.content || null,
        type: body.type,
        status: body.status || "DRAFT",
        date: new Date(body.date),
        referenceNumber: body.referenceNumber || null,
        sender: body.sender,
        recipient: body.recipient,
        categoryId: body.categoryId,
      },
      include: {
        category: true,
      },
    })
    
    return NextResponse.json(mail)
  } catch (error) {
    console.error("Error creating mail:", error)
    return NextResponse.json(
      { error: "Failed to create mail" },
      { status: 500 }
    )
  }
} 