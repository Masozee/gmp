import { db } from '../src/lib/db';
import { pageContent } from '../src/lib/db/content-schema';

async function addPageContentTable() {
  try {
    // Create the page_content table using raw SQL
    await db.run(`
      CREATE TABLE IF NOT EXISTS page_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_key TEXT NOT NULL UNIQUE,
        page_name TEXT NOT NULL,
        page_url TEXT NOT NULL,
        hero_title TEXT,
        hero_subtitle TEXT,
        hero_background_color TEXT DEFAULT '#f06d98',
        hero_background_image TEXT,
        sections TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ page_content table created successfully');

    // Insert sample data for the tentang-kami/tujuan page
    const sampleSections = [
      {
        id: '1',
        type: 'text',
        title: '',
        content: 'Yayasan Partisipasi Muda (YPM), yang dikenal luas sebagai "Generasi Melek Politik", adalah organisasi nirlaba yang dinamis dengan tujuan membangun generasi pembawa perubahan melalui pemberdayaan orang muda Indonesia umur 17-25 tahun untuk berpartisipasi dalam demokrasi dan perumusan kebijakan publik. Kami tidak terafiliasi dengan partai atau tokoh politik manapun.'
      },
      {
        id: '2',
        type: 'text',
        title: '👉🏼Cara Kami Memberdayakan Orang Muda Indonesia👈🏼',
        content: ''
      },
      {
        id: '3',
        type: 'list',
        title: '',
        content: '',
        items: [
          'Mengedukasi anak muda Indonesia tentang politik dan demokrasi dengan cara yang seru dan menarik melalui @generasimelekpolitik.',
          'Membekali anak muda dengan pemahaman kebijakan publik dan keterampilan lunak demokrasi yang penting—agar mereka percaya diri menyuarakan hak, aspirasi, dan kegelisahannya kepada pemerintah.',
          'Membangun ruang demokrasi yang inklusif di mana suara anak muda didengar, serta menjembatani hubungan yang bermakna antara pemuda dan pembuat kebijakan.',
          'Menginspirasi dan mendampingi generasi pemimpin muda berikutnya untuk membawa perubahan nyata di komunitasnya.'
        ]
      },
      {
        id: '4',
        type: 'slideshow',
        title: '',
        content: '',
        slides: [
          {
            image: "/images/bg/about.jpg",
            description: "Mengedukasi anak muda Indonesia tentang politik dan demokrasi dengan cara yang seru dan menarik melalui @generasimelekpolitik.",
            alt: "Edukasi Politik Muda"
          },
          {
            image: "/images/bg/about.jpg",
            description: "Membekali anak muda dengan pemahaman kebijakan publik dan keterampilan lunak demokrasi yang penting.",
            alt: "Pembekalan Kebijakan Publik"
          },
          {
            image: "/images/bg/about.jpg",
            description: "Membangun ruang demokrasi yang inklusif di mana suara anak muda didengar.",
            alt: "Ruang Demokrasi Inklusif"
          },
          {
            image: "/images/bg/about.jpg",
            description: "Menjembatani hubungan yang bermakna antara pemuda dan pembuat kebijakan.",
            alt: "Jembatan Pemuda dan Pembuat Kebijakan"
          },
          {
            image: "/images/bg/about.jpg",
            description: "Menginspirasi dan mendampingi generasi pemimpin muda berikutnya untuk membawa perubahan nyata di komunitasnya.",
            alt: "Inspirasi Pemimpin Muda"
          }
        ]
      }
    ];

    // Insert using Drizzle ORM
    await db.insert(pageContent).values({
      pageKey: 'tentang-kami-tujuan',
      pageName: 'Tentang Kami - Tujuan',
      pageUrl: '/tentang-kami/tujuan',
      heroTitle: 'Tujuan Kami',
      heroSubtitle: 'Memberdayakan anak muda Indonesia untuk berpartisipasi dalam demokrasi dan perumusan kebijakan publik.',
      heroBackgroundColor: '#f06d98',
      sections: JSON.stringify(sampleSections),
    });

    console.log('✅ Sample page content inserted successfully');
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
addPageContentTable(); 