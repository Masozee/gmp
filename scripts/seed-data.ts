import { initializeDatabase, db } from '../src/lib/db';
import { 
  events, publications, partners, careers, testimonials, 
  discussions, boardMembers, organizationStaff, homepageSlides
} from '../src/lib/db/content-schema';

// Import JSON data
import eventsData from '../src/data/events.json';
import publicationsData from '../src/data/publikasi.json';
import partnersData from '../src/data/partners.json';
import careersData from '../src/data/karir.json';
import testimonialsData from '../src/data/testimoni.json';
import discussionsData from '../src/data/diskusi.json';
import boardData from '../src/data/board.json';
import staffData from '../src/data/pengurus-gmp.json';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  // Initialize database first
  initializeDatabase();
  
  try {
    // Seed Events
    console.log('Seeding events...');
    for (const event of eventsData) {
      const slug = generateSlug(event.title);
      await db.insert(events).values({
        slug,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        address: event.address,
        description: event.description,
        enDescription: event.en_description,
        image: event.image,
        category: event.category,
        isPaid: false,
        price: null,
        isRegistrationOpen: event.isRegistrationOpen,
        capacity: 100, // Default capacity
        registeredCount: 0,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${eventsData.length} events`);

    // Seed Publications
    console.log('Seeding publications...');
    for (const pub of publicationsData) {
      // Use existing URL as slug, or generate from title if URL doesn't exist
      const slug = pub.url || generateSlug(pub.title);
      await db.insert(publications).values({
        slug,
        title: pub.title,
        date: pub.date,
        count: pub.count,
        image_url: pub.image,
        type: pub.type as 'riset' | 'artikel' | 'dampak',
        pdf_url: pub.pdf_url,
        author: pub.author,
        description: pub.content.substring(0, 200) + '...', // Use first 200 chars as description
        order: pub.order,
        content: pub.content,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${publicationsData.length} publications`);

    // Seed Partners
    console.log('Seeding partners...');
    for (const partner of partnersData.partners) {
      await db.insert(partners).values({
        order: partner.order,
        name: partner.name,
        logo: partner.logo,
        url: partner.url,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${partnersData.partners.length} partners`);

    // Seed Careers
    console.log('Seeding careers...');
    for (const career of careersData) {
      const slug = generateSlug(career.title);
      await db.insert(careers).values({
        slug,
        title: career.title,
        type: career.type as 'internship' | 'full-time' | 'part-time' | 'contract' | 'volunteer',
        location: career.location,
        duration: career.duration,
        deadline: career.deadline,
        postedDate: career.posted_date,
        poster: career.poster,
        description: career.description,
        responsibilities: career.responsibilities,
        requirements: career.requirements,
        benefits: career.benefits,
        applyUrl: career.apply_url,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${careersData.length} careers`);

    // Seed Testimonials
    console.log('Seeding testimonials...');
    for (const testimonial of testimonialsData) {
      await db.insert(testimonials).values({
        name: testimonial.name,
        age: testimonial.age,
        school: testimonial.school,
        image: testimonial.image,
        quote: testimonial.quote,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${testimonialsData.length} testimonials`);

    // Seed Discussions
    console.log('Seeding discussions...');
    for (const discussion of discussionsData) {
      await db.insert(discussions).values({
        title: discussion.title,
        slug: discussion.slug,
        image: discussion.image,
        date: discussion.date,
        description: discussion.description,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${discussionsData.length} discussions`);

    // Seed Board Members
    console.log('Seeding board members...');
    for (let i = 0; i < boardData.length; i++) {
      const member = boardData[i];
      await db.insert(boardMembers).values({
        photo: member.photo,
        name: member.name,
        position: member.position,
        order: i + 1,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${boardData.length} board members`);

    // Seed Organization Staff
    console.log('Seeding organization staff...');
    for (let i = 0; i < staffData.length; i++) {
      const staff = staffData[i];
      await db.insert(organizationStaff).values({
        photo: staff.photo,
        name: staff.name,
        position: staff.position,
        order: i + 1,
      }).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${staffData.length} organization staff`);

    // Seed Homepage Slides
    console.log('Seeding homepage slides...');
    const initialSlides = [
      {
        type: 'map' as const,
        order: 1,
        title: null,
        subtitle: null,
        description: null,
        image: null,
        buttonText: null,
        buttonLink: null,
        isActive: true,
      },
      {
        type: 'image' as const,
        order: 2,
        title: 'Membangun Generasi Pembawa Perubahan',
        subtitle: 'Yayasan Partisipasi Muda',
        description: 'Memberdayakan anak muda Indonesia untuk berpartisipasi aktif dalam demokrasi dan perumusan kebijakan publik melalui pendidikan politik yang menyenangkan dan relevan.',
        image: '/images/bg/creative-christians-HN6uXG7GzTE-unsplash.jpg',
        buttonText: 'Pelajari Lebih Lanjut',
        buttonLink: '/tentang-kami/tujuan',
        isActive: true,
      },
      {
        type: 'image' as const,
        order: 3,
        title: 'Academia Politica',
        subtitle: 'Generasi Melek Politik',
        description: 'Sebuah lokakarya berbasis role-playing yang membekali peserta dengan pemahaman mendalam tentang kepemimpinan, pembuatan kebijakan, dan advokasi iklim.',
        image: '/images/bg/duy-pham-Cecb0_8Hx-o-unsplash.jpg',
        buttonText: 'Lihat Program Kami',
        buttonLink: '/program/academia-politica',
        isActive: true,
      },
    ];

    for (const slide of initialSlides) {
      await db.insert(homepageSlides).values(slide).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${initialSlides.length} homepage slides`);

    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding
seedDatabase().catch(console.error); 