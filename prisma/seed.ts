import { PrismaClient, EventStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

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