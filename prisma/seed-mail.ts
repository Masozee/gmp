import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define enums to match the Prisma schema
enum MailType {
  INCOMING = "INCOMING",
  OUTGOING = "OUTGOING"
}

enum MailStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED"
}

// Function to convert month to Roman numerals
function monthToRoman(month: number): string {
  const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
  return romanMonths[month - 1]
}

// Function to generate a mail number
function generateMailNumber(counter: number, categoryCode: string, date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // JavaScript months are 0-indexed
  
  // Format: {counter}/{category code}/{month in roman}/{year}
  // Example: 0090/SK/III/2025
  const paddedCounter = counter.toString().padStart(4, '0')
  const romanMonth = monthToRoman(month)
  
  return `${paddedCounter}/${categoryCode}/${romanMonth}/${year}`
}

interface Category {
  id: string
  name: string
  code: string
  description: string | null
}

async function main() {
  console.log('Starting mail seed...')

  // Create mail categories
  const categories = [
    {
      name: "Surat Keterangan",
      code: "SK",
      description: "Surat yang berisi keterangan resmi dari instansi"
    },
    {
      name: "Undangan Meeting",
      code: "UM",
      description: "Surat undangan untuk rapat atau pertemuan"
    },
    {
      name: "Surat Pemberitahuan",
      code: "SP",
      description: "Surat yang berisi pemberitahuan atau pengumuman"
    },
    {
      name: "Surat Permohonan",
      code: "SPM",
      description: "Surat yang berisi permohonan atau permintaan"
    },
    {
      name: "Surat Keputusan",
      code: "SKP",
      description: "Surat yang berisi keputusan resmi"
    },
    {
      name: "Nota Dinas",
      code: "ND",
      description: "Nota internal untuk komunikasi antar departemen"
    },
    {
      name: "Lain-lain",
      code: "LN",
      description: "Kategori untuk surat yang tidak termasuk dalam kategori lain"
    }
  ]

  console.log('Creating mail categories...')
  
  // Create all categories
  for (const category of categories) {
    try {
      // Try to create the category
      await prisma.$executeRaw`
        INSERT INTO mail_categories (id, name, code, description, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${category.name}, ${category.code}, ${category.description}, NOW(), NOW())
        ON CONFLICT (code) DO NOTHING
      `
      console.log(`Created or skipped category: ${category.name} (${category.code})`)
    } catch (error) {
      console.error(`Error creating category ${category.code}:`, error)
    }
  }

  // Create mail counter for current year
  const currentYear = new Date().getFullYear()
  
  console.log('Creating mail counter...')
  try {
    await prisma.$executeRaw`
      INSERT INTO mail_counters (id, year, counter, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${currentYear}, 0, NOW(), NOW())
      ON CONFLICT (year) DO NOTHING
    `
    console.log(`Created or skipped mail counter for year ${currentYear}`)
  } catch (error) {
    console.error(`Error creating mail counter for year ${currentYear}:`, error)
  }

  // Get all categories for reference
  const allCategories = await prisma.$queryRaw<Category[]>`
    SELECT id, name, code, description FROM mail_categories
  `
  
  // Create mail records
  const mails = [
    // Outgoing mails
    {
      subject: "Official Statement - Department of Finance",
      description: "Official statement regarding the annual budget allocation",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      type: "OUTGOING",
      status: "PUBLISHED",
      date: new Date(currentYear, 2, 15), // March 15
      sender: "Finance Department",
      recipient: "All Departments",
      categoryCode: "SK"
    },
    {
      subject: "Invitation to Annual Meeting",
      description: "Invitation for the annual board meeting",
      content: "You are cordially invited to attend our annual board meeting that will be held on April 10th.",
      type: "OUTGOING",
      status: "PUBLISHED",
      date: new Date(currentYear, 2, 14), // March 14
      sender: "Board Secretary",
      recipient: "Board Members",
      categoryCode: "UM"
    },
    {
      subject: "Notification of Policy Changes",
      description: "Notification regarding updates to company policies",
      content: "Please be informed that the following company policies have been updated effective immediately.",
      type: "OUTGOING",
      status: "PUBLISHED",
      date: new Date(currentYear, 2, 10), // March 10
      sender: "HR Department",
      recipient: "All Employees",
      categoryCode: "SP"
    },
    {
      subject: "Request for Budget Approval",
      description: "Request for approval of the Q2 budget",
      content: "We are requesting approval for the Q2 budget as detailed in the attached document.",
      type: "OUTGOING",
      status: "DRAFT",
      date: new Date(currentYear, 2, 8), // March 8
      sender: "Finance Manager",
      recipient: "CEO",
      categoryCode: "SPM"
    },
    {
      subject: "Appointment of New Department Head",
      description: "Official appointment letter for the new IT Department Head",
      content: "We are pleased to announce the appointment of John Doe as the new Head of IT Department.",
      type: "OUTGOING",
      status: "PUBLISHED",
      date: new Date(currentYear, 2, 5), // March 5
      sender: "HR Director",
      recipient: "All Departments",
      categoryCode: "SKP"
    },
    
    // Incoming mails
    {
      subject: "Budget Approval Request",
      description: "Request from external vendor for budget approval",
      content: "We are submitting our budget proposal for the upcoming project as discussed.",
      type: "INCOMING",
      status: "DRAFT",
      date: new Date(currentYear, 2, 12), // March 12
      sender: "ABC Vendors Ltd.",
      recipient: "Finance Department",
      referenceNumber: "REF-2025/032",
      categoryCode: "SPM"
    },
    {
      subject: "Vendor Contract Renewal",
      description: "Notification about upcoming contract renewal",
      content: "This is to inform you that our service contract is due for renewal on April 15th.",
      type: "INCOMING",
      status: "ARCHIVED",
      date: new Date(currentYear, 2, 8), // March 8
      sender: "XYZ Services Inc.",
      recipient: "Procurement Department",
      referenceNumber: "REF-2025/031",
      categoryCode: "SP"
    },
    {
      subject: "Partnership Proposal",
      description: "Proposal for strategic partnership",
      content: "We would like to propose a strategic partnership between our organizations.",
      type: "INCOMING",
      status: "PUBLISHED",
      date: new Date(currentYear, 2, 3), // March 3
      sender: "Global Partners Co.",
      recipient: "Business Development",
      referenceNumber: "REF-2025/030",
      categoryCode: "LN"
    },
    {
      subject: "Invitation to Industry Conference",
      description: "Invitation to speak at industry conference",
      content: "We would be honored to have you as a keynote speaker at our upcoming industry conference.",
      type: "INCOMING",
      status: "PUBLISHED",
      date: new Date(currentYear, 1, 28), // February 28
      sender: "Industry Association",
      recipient: "CEO Office",
      referenceNumber: "REF-2025/029",
      categoryCode: "UM"
    },
    {
      subject: "Audit Notification",
      description: "Notification of upcoming external audit",
      content: "This is to inform you that we will be conducting an external audit of your financial records.",
      type: "INCOMING",
      status: "PUBLISHED",
      date: new Date(currentYear, 1, 25), // February 25
      sender: "Audit & Compliance Authority",
      recipient: "Finance Department",
      referenceNumber: "REF-2025/028",
      categoryCode: "SP"
    }
  ]

  console.log('Creating mail records...')
  
  // Get current counter value
  const counterResult = await prisma.$queryRaw<{ counter: number }[]>`
    SELECT counter FROM mail_counters WHERE year = ${currentYear}
  `
  
  if (!counterResult || counterResult.length === 0) {
    throw new Error(`No counter found for year ${currentYear}`)
  }
  
  let currentCounter = counterResult[0].counter

  for (const mail of mails) {
    try {
      // Find category by code
      const category = allCategories.find((c: Category) => c.code === mail.categoryCode)
      
      if (!category) {
        console.log(`Category with code ${mail.categoryCode} not found, skipping mail: ${mail.subject}`)
        continue
      }
      
      // For outgoing mails, generate mail number and increment counter
      let mailNumber = mail.referenceNumber
      
      if (mail.type === "OUTGOING") {
        currentCounter++
        mailNumber = generateMailNumber(currentCounter, mail.categoryCode, mail.date)
      }
      
      // Check if mail already exists
      const existingMailResult = await prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*) as count FROM mails WHERE "mailNumber" = ${mailNumber}
      `
      
      if (existingMailResult[0].count === 0) {
        await prisma.$executeRaw`
          INSERT INTO mails (
            id, "mailNumber", subject, description, content, type, status, date, 
            "referenceNumber", sender, recipient, "categoryId", "createdAt", "updatedAt"
          )
          VALUES (
            gen_random_uuid(), ${mailNumber}, ${mail.subject}, ${mail.description}, ${mail.content},
            ${mail.type}::text::"MailType", ${mail.status}::text::"MailStatus", ${mail.date},
            ${mail.referenceNumber}, ${mail.sender}, ${mail.recipient}, ${category.id},
            NOW(), NOW()
          )
        `
        console.log(`Created mail: ${mailNumber} - ${mail.subject}`)
      } else {
        console.log(`Mail already exists: ${mailNumber} - ${mail.subject}`)
      }
    } catch (error) {
      console.error(`Error creating mail ${mail.subject}:`, error)
    }
  }
  
  // Update counter in database
  if (currentCounter > counterResult[0].counter) {
    await prisma.$executeRaw`
      UPDATE mail_counters 
      SET counter = ${currentCounter}, "updatedAt" = NOW()
      WHERE year = ${currentYear}
    `
    console.log(`Updated mail counter for year ${currentYear} to ${currentCounter}`)
  }

  console.log('Mail seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during mail seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 