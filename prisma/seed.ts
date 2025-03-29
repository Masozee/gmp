import { PrismaClient, EventStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

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

async function main() {
  console.log('Starting seeding...');

  // Create 5 event categories
  const categories = [];
  const categoryNames = [
    'Conference', 
    'Workshop', 
    'Seminar', 
    'Webinar', 
    'Meetup'
  ];

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await prisma.event_categories.upsert({
      where: { slug },
      update: {},
      create: {
        id: faker.string.uuid(),
        name,
        slug,
        description: faker.lorem.sentence(),
        updatedAt: new Date(),
      },
    });
    categories.push(category);
    console.log(`Created event category: ${category.name}`);
  }

  // Create 10 tags
  const tags = [];
  const tagNames = [
    'Technology', 
    'Business', 
    'Design', 
    'Marketing', 
    'Development',
    'AI', 
    'Data Science', 
    'UX', 
    'Product Management', 
    'Leadership'
  ];

  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
      },
    });
    tags.push(tag);
    console.log(`Created tag: ${tag.name}`);
  }

  // Create 20 speakers
  const speakers = [];
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    const speaker = await prisma.speaker.create({
      data: {
        firstName,
        lastName,
        email,
        bio: faker.lorem.paragraph(),
        photoUrl: faker.image.avatar(),
        organization: faker.company.name(),
        position: faker.person.jobTitle(),
      },
    });
    speakers.push(speaker);
    console.log(`Created speaker: ${speaker.firstName} ${speaker.lastName}`);
  }

  // Create 20 events
  const events = [];
  const eventStatuses = Object.values(EventStatus);
  
  for (let i = 0; i < 20; i++) {
    const title = faker.company.catchPhrase();
    const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    
    // Generate random dates
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + faker.number.int({ min: 1, max: 72 }));
    
    const status = eventStatuses[faker.number.int({ min: 0, max: eventStatuses.length - 1 })];
    const categoryId = categories[faker.number.int({ min: 0, max: categories.length - 1 })].id;
    
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description: faker.lorem.paragraph(),
        content: faker.lorem.paragraphs(3),
        location: faker.location.city() + ', ' + faker.location.country(),
        venue: faker.company.name() + ' ' + faker.location.buildingNumber(),
        startDate,
        endDate,
        status,
        categoryId,
        posterImage: `https://picsum.photos/seed/${i}/800/600`,
        posterCredit: faker.person.fullName(),
        published: faker.datatype.boolean(0.8), // 80% chance of being published
      },
    });
    events.push(event);
    console.log(`Created event: ${event.title}`);
    
    // Add 1-3 random tags to each event
    const numTags = faker.number.int({ min: 1, max: 3 });
    const selectedTagIndexes = new Set<number>();
    
    while (selectedTagIndexes.size < numTags) {
      selectedTagIndexes.add(faker.number.int({ min: 0, max: tags.length - 1 }));
    }
    
    for (const tagIndex of selectedTagIndexes) {
      await prisma.tagsOnEvents.create({
        data: {
          eventId: event.id,
          tagId: tags[tagIndex].id,
        },
      });
    }
    
    // Add 2-5 speakers to each event
    const numSpeakers = faker.number.int({ min: 2, max: 5 });
    const selectedSpeakerIndexes = new Set<number>();
    
    while (selectedSpeakerIndexes.size < numSpeakers) {
      selectedSpeakerIndexes.add(faker.number.int({ min: 0, max: speakers.length - 1 }));
    }
    
    let order = 1;
    for (const speakerIndex of selectedSpeakerIndexes) {
      await prisma.eventSpeaker.create({
        data: {
          eventId: event.id,
          speakerId: speakers[speakerIndex].id,
          order: order++,
          role: faker.helpers.arrayElement(['Speaker', 'Panelist', 'Moderator', 'Keynote']),
        },
      });
      
      // Create 1-2 presentations for each speaker at this event
      const numPresentations = faker.number.int({ min: 1, max: 2 });
      
      for (let j = 0; j < numPresentations; j++) {
        // Create presentation start time within event duration
        const eventDuration = endDate.getTime() - startDate.getTime();
        const presentationStartOffset = faker.number.int({ min: 0, max: eventDuration * 0.7 });
        const presentationStart = new Date(startDate.getTime() + presentationStartOffset);
        
        // Presentation duration between 30 minutes and 2 hours
        const presentationDuration = faker.number.int({ min: 30, max: 120 }) * 60 * 1000;
        const presentationEnd = new Date(presentationStart.getTime() + presentationDuration);
        
        // Ensure presentation end time doesn't exceed event end time
        if (presentationEnd > endDate) {
          presentationEnd.setTime(endDate.getTime());
        }
        
        await prisma.presentation.create({
          data: {
            title: faker.company.catchPhrase(),
            abstract: faker.lorem.paragraph(),
            slides: faker.helpers.maybe(() => `https://slideshare.com/slides-${faker.string.uuid()}`),
            videoUrl: faker.helpers.maybe(() => `https://youtube.com/watch?v=${faker.string.alphanumeric(11)}`),
            duration: faker.number.int({ min: 15, max: 90 }),
            startTime: presentationStart,
            endTime: presentationEnd,
            eventId: event.id,
            speakerId: speakers[speakerIndex].id,
          },
        });
      }
    }
  }

  console.log('Starting mail seed...');

  // Create mail categories
  const mailCategories = [
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
  ];

  console.log('Creating mail categories...');
  
  // Create all categories
  for (const category of mailCategories) {
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
  const allCategories = await prisma.$queryRaw<any[]>`
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
  const counterResult = await prisma.$queryRaw<any[]>`
    SELECT counter FROM mail_counters WHERE year = ${currentYear}
  `
  
  if (!counterResult || counterResult.length === 0) {
    throw new Error(`No counter found for year ${currentYear}`)
  }
  
  let currentCounter = counterResult[0].counter

  for (const mail of mails) {
    try {
      // Find category by code
      const category = allCategories.find((c: any) => c.code === mail.categoryCode)
      
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
      const existingMailResult = await prisma.$queryRaw<any[]>`
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

  console.log('Mail seed completed successfully!');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 