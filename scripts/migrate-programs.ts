import { db } from '../src/lib/db';
import { programs } from '../src/lib/db/content-schema';

async function migratePrograms() {
  try {
    console.log('Creating programs table...');
    
    await db.run(`
      CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        title_en TEXT,
        subtitle TEXT,
        subtitle_en TEXT,
        description TEXT NOT NULL,
        description_en TEXT,
        hero_image TEXT,
        content TEXT NOT NULL,
        content_en TEXT,
        is_active INTEGER DEFAULT 1,
        "order" INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Programs table created successfully');
    
    // Add some sample data
    console.log('Adding sample programs...');
    
    const samplePrograms = [
      {
        slug: 'diskusi-publik',
        title: 'Diskusi Publik',
        titleEn: 'Public Discussions',
        subtitle: 'Wadah diskusi terbuka untuk isu politik terkini',
        subtitleEn: 'Open discussion forum for current political issues',
        description: 'Wadah diskusi terbuka membahas isu-isu politik terkini yang relevan bagi anak muda.',
        descriptionEn: 'Open discussion forum addressing current political issues relevant to young people.',
        heroImage: '/images/program/DSC08852-a.jpg',
        content: JSON.stringify([
          {
            id: '1',
            title: 'Tentang Diskusi Publik',
            content: 'Program Diskusi Publik adalah wadah bagi anak muda untuk membahas berbagai isu politik dan sosial yang sedang berkembang. Melalui forum ini, peserta dapat berbagi pandangan, berdiskusi secara konstruktif, dan membangun pemahaman yang lebih mendalam tentang dinamika politik Indonesia.',
            imagePosition: 'left',
            backgroundColor: 'white',
            image: '/images/program/DSC08852-a.jpg'
          }
        ]),
        contentEn: JSON.stringify([
          {
            id: '1',
            title: 'About Public Discussions',
            content: 'The Public Discussion program is a platform for young people to discuss various political and social issues that are developing. Through this forum, participants can share views, discuss constructively, and build a deeper understanding of Indonesia\'s political dynamics.',
            imagePosition: 'left',
            backgroundColor: 'white',
            image: '/images/program/DSC08852-a.jpg'
          }
        ]),
        isActive: true,
        order: 1
      },
      {
        slug: 'academia-politica',
        title: 'Academia Politica',
        titleEn: 'Academia Politica',
        subtitle: 'Menciptakan Pemimpin Muda Peduli Iklim Melalui Workshop Interaktif',
        subtitleEn: 'Creating Climate-Conscious Young Leaders Through Interactive Workshops',
        description: 'Program pendidikan politik mendalam bekerja sama dengan institusi pendidikan.',
        descriptionEn: 'In-depth political education program in collaboration with educational institutions.',
        heroImage: '/images/program/DSC08852-a.jpg',
        content: JSON.stringify([
          {
            id: '1',
            title: 'Pendidikan Politik yang Menyenangkan',
            content: 'Yayasan Partisipasi Muda, melalui gerakan Generasi Melek Politik, berkomitmen menghadirkan pendidikan politik yang menyenangkan bagi generasi muda. Salah satu inisiatifnya adalah "Academia Politica," sebuah lokakarya berbasis role-playing yang membekali peserta dengan pemahaman mendalam tentang kepemimpinan, pembuatan kebijakan, dan advokasi iklim.',
            imagePosition: 'left',
            backgroundColor: 'white',
            image: '/images/program/DSC08852-a.jpg'
          }
        ]),
        contentEn: JSON.stringify([
          {
            id: '1',
            title: 'Fun Political Education',
            content: 'Partisipasi Muda Foundation, through the Generasi Melek Politik movement, is committed to providing fun political education for young people. One of its initiatives is "Academia Politica," a role-playing-based workshop that equips participants with in-depth understanding of leadership, policy making, and climate advocacy.',
            imagePosition: 'left',
            backgroundColor: 'white',
            image: '/images/program/DSC08852-a.jpg'
          }
        ]),
        isActive: true,
        order: 2
      }
    ];
    
    for (const program of samplePrograms) {
      await db.insert(programs).values({
        slug: program.slug,
        title: program.title,
        titleEn: program.titleEn,
        subtitle: program.subtitle,
        subtitleEn: program.subtitleEn,
        description: program.description,
        descriptionEn: program.descriptionEn,
        heroImage: program.heroImage,
        content: program.content,
        contentEn: program.contentEn,
        isActive: program.isActive,
        order: program.order
      }).onConflictDoNothing();
    }
    
    console.log('Sample programs added successfully');
    console.log('Programs migration completed!');
    
  } catch (error) {
    console.error('Error during programs migration:', error);
    process.exit(1);
  }
}

migratePrograms(); 