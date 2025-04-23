"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";

// Board members data
const boardMembers = [
  {
    name: "Budi Santoso",
    role: "Pendiri & Ketua Umum",
    bio: "Budi adalah pendiri GMP dengan latar belakang di bidang ilmu politik dari Universitas Indonesia. Sebelumnya, ia aktif di berbagai organisasi mahasiswa dan gerakan sosial.",
    photo: "/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png",
    socials: {
      twitter: "https://twitter.com/budisantoso",
      linkedin: "https://linkedin.com/in/budisantoso",
      instagram: "https://instagram.com/budisantoso",
    }
  },
  {
    name: "Siti Nurhayati",
    role: "Wakil Ketua",
    bio: "Siti memiliki pengalaman lebih dari 5 tahun dalam organisasi kepemudaan dan advokasi kebijakan publik. Alumnus Universitas Gadjah Mada jurusan Hubungan Internasional.",
    photo: "/images/heather-green-bQTzJzwQfJE-unsplash.png",
    socials: {
      twitter: "https://twitter.com/sitinurhayati",
      linkedin: "https://linkedin.com/in/sitinurhayati",
      instagram: "https://instagram.com/sitinurhayati",
    }
  },
  {
    name: "Ahmad Fadhli",
    role: "Sekretaris Jenderal",
    bio: "Ahmad adalah ahli komunikasi politik dengan latar belakang jurnalistik. Ia memiliki misi untuk meningkatkan transparansi dalam komunikasi politik kepada generasi muda.",
    photo: "/images/muska-create-5MvNlQENWDM-unsplash.png",
    socials: {
      twitter: "https://twitter.com/ahmadfadhli",
      linkedin: "https://linkedin.com/in/ahmadfadhli",
      instagram: "https://instagram.com/ahmadfadhli",
    }
  },
  {
    name: "Ratna Dewi",
    role: "Bendahara",
    bio: "Ratna memiliki latar belakang di bidang ekonomi dan keuangan. Ia bertanggung jawab untuk memastikan transparansi dan akuntabilitas keuangan dalam semua kegiatan GMP.",
    photo: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg",
    socials: {
      twitter: "https://twitter.com/ratnadewi",
      linkedin: "https://linkedin.com/in/ratnadewi",
      instagram: "https://instagram.com/ratnadewi",
    }
  },
  {
    name: "Arief Wibowo",
    role: "Kepala Divisi Digital",
    bio: "Arief adalah pakar teknologi dengan fokus pada pemanfaatan media digital untuk pendidikan politik. Ia memimpin strategi digital GMP dan pengembangan konten online.",
    photo: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg",
    socials: {
      twitter: "https://twitter.com/ariefwibowo",
      linkedin: "https://linkedin.com/in/ariefwibowo",
      instagram: "https://instagram.com/ariefwibowo",
    }
  },
];

// Management team data
const managementTeam = [
  {
    name: "Dian Pratiwi",
    role: "Manajer Program",
    bio: "Dian mengkoordinasikan program-program edukasi politik GMP di seluruh Indonesia, dengan fokus pada desain program yang inklusif dan berdampak.",
    photo: "/images/muska-create-K5OIYotY9GA-unsplash.png",
  },
  {
    name: "Reza Fauzi",
    role: "Manajer Hubungan Eksternal",
    bio: "Reza bertanggung jawab untuk mengembangkan kemitraan strategis dengan organisasi, lembaga pemerintah, dan pemangku kepentingan lainnya.",
    photo: "/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg",
  },
  {
    name: "Maya Anggraini",
    role: "Manajer Komunikasi",
    bio: "Maya memimpin strategi komunikasi GMP, termasuk hubungan media, kampanye digital, dan pengembangan materi komunikasi.",
    photo: "/images/frank-mouland-e4mYPf_JUIk-unsplash.png",
  },
  {
    name: "Fajar Nugroho",
    role: "Manajer Penelitian",
    bio: "Fajar mengepalai divisi riset GMP yang menghasilkan analisis dan publikasi tentang tren politik, partisipasi pemuda, dan kebijakan publik.",
    photo: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
  },
  {
    name: "Laila Hasan",
    role: "Manajer Regional Jawa",
    bio: "Laila mengkoordinasikan aktivitas GMP di wilayah Jawa, memastikan program-program berjalan efektif dan menjangkau pemuda di berbagai daerah.",
    photo: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg",
  },
  {
    name: "Rizki Pratama",
    role: "Manajer Regional Sumatera",
    bio: "Rizki mengkoordinasikan aktivitas GMP di wilayah Sumatera, dengan fokus pada pengembangan jaringan relawan dan program-program lokal.",
    photo: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg",
  },
];

// Regional coordinators data
const regionalCoordinators = [
  {
    region: "Jawa",
    coordinators: [
      { name: "Dodi Supriyadi", area: "Jakarta", photo: "/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png" },
      { name: "Rina Wulandari", area: "Jawa Barat", photo: "/images/muska-create-5MvNlQENWDM-unsplash.png" },
      { name: "Joko Prasetyo", area: "Jawa Tengah", photo: "/images/heather-green-bQTzJzwQfJE-unsplash.png" },
      { name: "Sari Indah", area: "Jawa Timur", photo: "/images/muska-create-K5OIYotY9GA-unsplash.png" },
      { name: "Deni Sutrisno", area: "Yogyakarta", photo: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg" },
    ]
  },
  {
    region: "Sumatera",
    coordinators: [
      { name: "Rahman Hakim", area: "Sumatera Utara", photo: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg" },
      { name: "Yuni Soraya", area: "Sumatera Barat", photo: "/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg" },
      { name: "Taufik Hidayat", area: "Riau", photo: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg" },
      { name: "Intan Permata", area: "Sumatera Selatan", photo: "/images/frank-mouland-e4mYPf_JUIk-unsplash.png" },
    ]
  },
  {
    region: "Kalimantan",
    coordinators: [
      { name: "Agus Harianto", area: "Kalimantan Barat", photo: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg" },
      { name: "Putri Handayani", area: "Kalimantan Timur", photo: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg" },
      { name: "Bima Sakti", area: "Kalimantan Selatan", photo: "/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png" },
    ]
  },
  {
    region: "Sulawesi",
    coordinators: [
      { name: "Dewi Lestari", area: "Sulawesi Selatan", photo: "/images/heather-green-bQTzJzwQfJE-unsplash.png" },
      { name: "Hendra Kusuma", area: "Sulawesi Utara", photo: "/images/muska-create-5MvNlQENWDM-unsplash.png" },
    ]
  },
  {
    region: "Indonesia Timur",
    coordinators: [
      { name: "Maria Laksmi", area: "Bali", photo: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg" },
      { name: "Robert Simbolon", area: "NTT", photo: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg" },
      { name: "Amir Hussein", area: "Maluku", photo: "/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg" },
      { name: "Grace Tanumihardja", area: "Papua", photo: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg" },
    ]
  },
];

// FAQs about the organization structure
const faqs = [
  {
    question: "Bagaimana struktur organisasi GMP?",
    answer: "GMP memiliki struktur yang terdiri dari Dewan Pengurus yang dipimpin oleh Ketua Umum, Tim Manajemen yang mengoperasikan program harian, dan jaringan Koordinator Regional yang tersebar di seluruh Indonesia. Kami juga didukung oleh relawan-relawan yang berkomitmen di seluruh negeri."
  },
  {
    question: "Apa peran Dewan Pengurus?",
    answer: "Dewan Pengurus bertugas menetapkan arah strategis organisasi, mengawasi jalannya program, dan memastikan organisasi berjalan sesuai dengan visi, misi, dan nilai-nilai yang ditetapkan. Mereka juga bertanggung jawab untuk pengembangan kebijakan internal dan eksternal GMP."
  },
  {
    question: "Bagaimana proses pemilihan pengurus GMP?",
    answer: "Pengurus GMP dipilih melalui proses yang demokratis dan transparan dalam Kongres Nasional yang diadakan setiap 3 tahun sekali. Semua anggota berhak mengajukan diri dan memberikan suara dalam proses pemilihan, memastikan representasi yang inklusif dari berbagai latar belakang."
  },
  {
    question: "Bagaimana cara bergabung dengan tim GMP?",
    answer: "Kami secara berkala membuka perekrutan untuk berbagai posisi, baik sebagai pengurus, staf, maupun relawan. Semua lowongan akan diumumkan di website dan media sosial kami. Selain itu, kami juga memiliki program magang untuk mahasiswa dan pemuda yang tertarik untuk belajar lebih banyak tentang pendidikan politik."
  },
  {
    question: "Apa saja komitmen yang diharapkan dari pengurus GMP?",
    answer: "Pengurus GMP diharapkan memiliki komitmen terhadap visi dan misi organisasi, berintegritas tinggi, mampu bekerja dalam tim, dan berdedikasi untuk memberdayakan pemuda Indonesia dalam politik. Kami juga mengharapkan pengurus untuk terus mengembangkan diri dan berkontribusi secara aktif dalam berbagai program GMP."
  },
];

export default function PengurusPage() {
  return (
    <PublicPageLayout>
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[url('/images/pattern-dots.svg')] bg-repeat"></div>
          </div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <FadeIn delay={100} direction="up" duration={800}>
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Board & <span className="text-emerald-400">Pengurus</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-gray-300 mb-8">
                  Kenali lebih dekat para pemimpin di balik Generasi Melek Politik yang berdedikasi untuk memberdayakan pemuda Indonesia dalam demokrasi.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Board Members Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Dewan Pengurus
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Individu-individu berdedikasi yang memimpin dan menetapkan arah strategis organisasi
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers.map((member, index) => (
                <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                  <Card className="overflow-hidden h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                    <div className="relative h-72">
                      <Image 
                        src={member.photo} 
                        alt={member.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="pt-6 pb-6">
                      <h3 className="font-heading text-xl font-bold mb-1 text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="font-body text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="font-body text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        {member.bio}
                      </p>
                      <div className="flex gap-3">
                        {member.socials.twitter && (
                          <Link 
                            href={member.socials.twitter} 
                            target="_blank" 
                            className="text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                          >
                            <Twitter className="h-5 w-5" />
                          </Link>
                        )}
                        {member.socials.linkedin && (
                          <Link 
                            href={member.socials.linkedin} 
                            target="_blank" 
                            className="text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-700 transition-colors"
                          >
                            <Linkedin className="h-5 w-5" />
                          </Link>
                        )}
                        {member.socials.instagram && (
                          <Link 
                            href={member.socials.instagram} 
                            target="_blank" 
                            className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-600 transition-colors"
                          >
                            <Instagram className="h-5 w-5" />
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Management Team Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Tim Manajemen
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Tim yang mengoperasikan program-program harian dan implementasi strategi organisasi
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {managementTeam.map((member, index) => (
                <FadeIn key={index} delay={100 * index} direction="up" duration={800}>
                  <Card className="flex flex-row items-center gap-4 p-4 h-full border-none shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src={member.photo} 
                        alt={member.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="font-body text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">
                        {member.role}
                      </p>
                      <p className="font-body text-gray-600 dark:text-gray-300 text-xs">
                        {member.bio}
                      </p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Network */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Jaringan Regional
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Koordinator yang tersebar di berbagai wilayah Indonesia untuk memperluas jangkauan program
                </p>
              </div>
            </FadeIn>
            
            <Tabs defaultValue={regionalCoordinators[0].region} className="w-full">
              <TabsList className="w-full flex flex-wrap justify-center mb-8">
                {regionalCoordinators.map((region) => (
                  <TabsTrigger 
                    key={region.region} 
                    value={region.region}
                    className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 dark:data-[state=active]:bg-emerald-800/30 dark:data-[state=active]:text-emerald-300"
                  >
                    {region.region}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {regionalCoordinators.map((region) => (
                <TabsContent key={region.region} value={region.region}>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {region.coordinators.map((coordinator, idx) => (
                      <FadeIn key={idx} delay={100 * idx} direction="up" duration={800}>
                        <div className="text-center">
                          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 border-2 border-emerald-200 dark:border-emerald-800">
                            <Image 
                              src={coordinator.photo} 
                              alt={coordinator.name} 
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h4 className="font-heading font-bold text-gray-900 dark:text-white">
                            {coordinator.name}
                          </h4>
                          <p className="font-body text-emerald-600 dark:text-emerald-400 text-sm">
                            {coordinator.area}
                          </p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Struktur Organisasi
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Berikut adalah struktur organisasi yang memastikan GMP berjalan efektif dalam mewujudkan misinya
                </p>
              </div>
            </FadeIn>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-bl-full"></div>
                
                <div className="relative z-10">
                  {/* Organization chart - simplified representation */}
                  <div className="flex flex-col items-center">
                    <div className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold text-center mb-6 w-64">
                      Ketua Umum
                    </div>
                    
                    <div className="w-px h-8 bg-emerald-400"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full">
                      <div className="bg-emerald-500 text-white px-3 py-2 rounded-lg font-bold text-center">
                        Wakil Ketua
                      </div>
                      <div className="bg-emerald-500 text-white px-3 py-2 rounded-lg font-bold text-center">
                        Sekretaris Jenderal
                      </div>
                      <div className="bg-emerald-500 text-white px-3 py-2 rounded-lg font-bold text-center">
                        Bendahara
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-emerald-400 mb-6"></div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                      <div className="bg-emerald-400 text-white px-3 py-2 rounded-lg font-bold text-center text-sm">
                        Divisi Edukasi
                      </div>
                      <div className="bg-emerald-400 text-white px-3 py-2 rounded-lg font-bold text-center text-sm">
                        Divisi Digital
                      </div>
                      <div className="bg-emerald-400 text-white px-3 py-2 rounded-lg font-bold text-center text-sm">
                        Divisi Kampanye
                      </div>
                      <div className="bg-emerald-400 text-white px-3 py-2 rounded-lg font-bold text-center text-sm">
                        Divisi Penelitian
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-emerald-400 my-6"></div>
                    
                    <div className="bg-emerald-300 dark:bg-emerald-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-bold text-center w-full">
                      Koordinator Regional
                    </div>
                  </div>
                </div>
              </div>
              
              <FadeIn direction="up" delay={300} duration={800}>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="font-heading font-semibold text-base sm:text-lg text-left text-gray-900 dark:text-white">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Join the Team CTA */}
        <section className="py-20 bg-emerald-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-50"></div>
          <div className="absolute inset-0 bg-[url('/images/dotted-pattern.png')] opacity-10"></div>
          
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                  Bergabunglah dengan Tim Kami
                </h2>
                <p className="font-body text-lg text-white/90 mb-8">
                  Kami selalu mencari individu bertalenta dan berdedikasi yang ingin berkontribusi dalam meningkatkan literasi politik generasi muda Indonesia.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/volunteer" className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-md font-bold transition-colors inline-block">
                    Jadi Relawan
                  </Link>
                  <Link href="/careers" className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-bold transition-colors inline-block">
                    Lihat Lowongan
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
} 