import { initializeDatabase, db } from '../src/lib/db';
import { homepageSlides } from '../src/lib/db/content-schema';

// Initialize database
initializeDatabase();

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

async function seedHomepageSlides() {
  console.log('Starting homepage slides seeding...');
  
  try {
    // Check if slides already exist
    const existingSlides = await db.select().from(homepageSlides);
    
    if (existingSlides.length > 0) {
      console.log('Homepage slides already exist. Skipping seeding.');
      return;
    }

    // Insert initial slides
    for (const slide of initialSlides) {
      await db.insert(homepageSlides).values(slide);
      console.log(`✅ Seeded slide: ${slide.type === 'map' ? 'Interactive Map' : slide.title}`);
    }

    console.log(`✅ Successfully seeded ${initialSlides.length} homepage slides`);
  } catch (error) {
    console.error('❌ Error seeding homepage slides:', error);
    process.exit(1);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedHomepageSlides()
    .then(() => {
      console.log('Homepage slides seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Homepage slides seeding failed:', error);
      process.exit(1);
    });
}

export { seedHomepageSlides };
