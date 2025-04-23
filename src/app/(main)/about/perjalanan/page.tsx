"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Users, Award, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";

// Timeline data with detailed milestones
const timelineData = [
  {
    year: "2020",
    events: [
      {
        title: "Pembentukan Awal",
        date: "Maret 2020",
        description: "Budi Santoso bersama lima mahasiswa dari berbagai universitas di Jakarta menginisiasi Generasi Melek Politik sebagai grup diskusi informal.",
        image: "/images/muska-create-5MvNlQENWDM-unsplash.png",
        highlight: true
      },
      {
        title: "Pendaftaran Organisasi",
        date: "Juni 2020",
        description: "GMP resmi terdaftar sebagai organisasi non-profit dengan fokus pada pendidikan politik bagi pemuda.",
        image: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg"
      },
      {
        title: "Webinar Perdana",
        date: "Agustus 2020",
        description: "Menyelenggarakan webinar perdana bertema 'Peran Pemuda dalam Transformasi Politik Indonesia' dengan 500 peserta.",
        image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg"
      },
      {
        title: "Peluncuran Website",
        date: "November 2020",
        description: "Meluncurkan website resmi sebagai platform informasi dan edukasi politik untuk pemuda Indonesia.",
        image: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg"
      }
    ]
  },
  {
    year: "2021",
    events: [
      {
        title: "Ekspansi ke 5 Kota",
        date: "Februari 2021",
        description: "Membuka cabang di 5 kota besar: Bandung, Surabaya, Medan, Makassar, dan Yogyakarta.",
        image: "/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png",
        highlight: true
      },
      {
        title: "Program Sekolah Politik Pemuda",
        date: "April 2021",
        description: "Menginisiasi program Sekolah Politik Pemuda, kurikulum 3 bulan untuk pemuda usia 17-25 tahun.",
        image: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg"
      },
      {
        title: "Kolaborasi dengan KPU",
        date: "Juli 2021",
        description: "Menjalin kerjasama dengan Komisi Pemilihan Umum untuk program sosialisasi pemilu di kalangan pemula.",
        image: "/images/heather-green-bQTzJzwQfJE-unsplash.png"
      },
      {
        title: "Konferensi Nasional Pertama",
        date: "Oktober 2021",
        description: "Menyelenggarakan Konferensi Nasional Pemuda dan Politik dengan 1.000 peserta dari seluruh Indonesia.",
        image: "/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg",
        highlight: true
      }
    ]
  },
  {
    year: "2022",
    events: [
      {
        title: "Peluncuran Aplikasi Mobile",
        date: "Januari 2022",
        description: "Meluncurkan aplikasi mobile 'Politik Cerdas' yang memberikan informasi politik terverifikasi dan interaktif.",
        image: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg",
        highlight: true
      },
      {
        title: "Ekspansi ke 10 Kota Tambahan",
        date: "Maret 2022",
        description: "Memperluas jangkauan ke 10 kota tambahan termasuk kota-kota menengah seperti Palembang, Banjarmasin, dan Manado.",
        image: "/images/muska-create-K5OIYotY9GA-unsplash.png"
      },
      {
        title: "Program Magang Politik",
        date: "Juni 2022",
        description: "Meluncurkan program magang yang menempatkan 100 pemuda di kantor legislatif dan eksekutif.",
        image: "/images/frank-mouland-e4mYPf_JUIk-unsplash.png"
      },
      {
        title: "Publikasi Buku Pertama",
        date: "September 2022",
        description: "Menerbitkan buku 'Panduan Politik untuk Generasi Z' yang terjual 10.000 kopi dalam 3 bulan.",
        image: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg",
        highlight: true
      }
    ]
  },
  {
    year: "2023",
    events: [
      {
        title: "Kolaborasi Internasional",
        date: "Februari 2023",
        description: "Menjalin kerjasama dengan organisasi pemuda dari 5 negara Asia Tenggara untuk berbagi praktik terbaik pendidikan politik.",
        image: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg",
        highlight: true
      },
      {
        title: "Penghargaan Nasional",
        date: "Mei 2023",
        description: "Menerima penghargaan 'Organisasi Pemuda Inspiratif' dari Kementerian Pemuda dan Olahraga.",
        image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg"
      },
      {
        title: "Peluncuran Podcast",
        date: "Juli 2023",
        description: "Meluncurkan podcast 'Ngobrol Politik' yang membahas isu-isu politik terkini dengan bahasa yang mudah dipahami.",
        image: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg"
      },
      {
        title: "Konvensi Pemuda Nasional",
        date: "November 2023",
        description: "Menyelenggarakan Konvensi Pemuda Nasional dengan tema 'Pemuda untuk Indonesia Maju' dihadiri 3.000 pemuda.",
        image: "/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png",
        highlight: true
      }
    ]
  }
];

// Key achievements data
const achievements = [
  {
    icon: <Users className="h-8 w-8 text-emerald-500" />,
    title: "1 Juta+ Pemuda",
    description: "Telah mengedukasi lebih dari 1 juta pemuda Indonesia melalui berbagai program online dan offline."
  },
  {
    icon: <History className="h-8 w-8 text-emerald-500" />,
    title: "25 Kota",
    description: "Hadir di 25 kota di Indonesia dengan jaringan relawan dan pengurus yang terus berkembang."
  },
  {
    icon: <Award className="h-8 w-8 text-emerald-500" />,
    title: "15 Penghargaan",
    description: "Telah menerima 15 penghargaan nasional dan internasional atas kontribusi di bidang pendidikan politik."
  }
];

// News coverage data
const mediaHighlights = [
  {
    title: "Generasi Melek Politik: Penggerak Kesadaran Politik di Kalangan Milenial dan Gen Z",
    source: "Kompas",
    date: "Desember 2022",
    link: "#"
  },
  {
    title: "Aplikasi 'Politik Cerdas' Karya Anak Bangsa Sukses Edukasi 500 Ribu Pemuda",
    source: "Detik",
    date: "Februari 2023",
    link: "#"
  },
  {
    title: "Budi Santoso: Dari Diskusi Kampus ke Gerakan Nasional",
    source: "Tempo",
    date: "Juli 2023",
    link: "#"
  },
  {
    title: "GMP Raih Penghargaan 'Most Impactful Youth Organization' di ASEAN Youth Forum",
    source: "Republika",
    date: "Oktober 2023",
    link: "#"
  }
];

export default function PerjalananPage() {
  return (
    <PublicPageLayout>
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[url('/images/pattern-dots.svg')] bg-repeat"></div>
          </div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn delay={100} direction="up" duration={800}>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Perjalanan <span className="text-emerald-300">Kami</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-emerald-50 mb-8 max-w-xl">
                  Jejak langkah Generasi Melek Politik sejak didirikan hingga saat ini
                  dalam membangun gerakan pemuda untuk demokrasi Indonesia yang lebih baik.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="#timeline">
                    <Button variant="secondary" className="bg-white hover:bg-gray-100 text-emerald-700">
                      Linimasa
                    </Button>
                  </Link>
                  <Link href="#achievements">
                    <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white/30 text-white">
                      Pencapaian
                    </Button>
                  </Link>
                </div>
              </FadeIn>
              
              <FadeIn delay={300} direction="up" duration={800} className="hidden lg:block">
                <div className="relative rounded-xl overflow-hidden">
                  <AspectRatio ratio={4/3}>
                    <Image 
                      src="/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg" 
                      alt="Perjalanan Generasi Melek Politik" 
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 mb-2">Est. 2020</Badge>
                      <h3 className="text-lg font-bold text-white">
                        Membangun Literasi Politik Generasi Muda Indonesia
                      </h3>
                    </div>
                  </AspectRatio>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        
        {/* Origin Story Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <FadeIn delay={100} direction="right" duration={800}>
                <div className="relative rounded-xl overflow-hidden">
                  <AspectRatio ratio={4/3}>
                    <Image 
                      src="/images/muska-create-K5OIYotY9GA-unsplash.png" 
                      alt="Awal mula Generasi Melek Politik" 
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="h-5 w-5 text-emerald-300" />
                        <p className="font-medium">Maret 2020</p>
                      </div>
                      <p className="text-white/80 text-sm">Pertemuan perdana para pendiri GMP di Jakarta</p>
                    </div>
                  </AspectRatio>
                </div>
              </FadeIn>
              
              <FadeIn delay={300} direction="left" duration={800}>
                <div className="space-y-6">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                    Awal Mula <span className="text-emerald-600 dark:text-emerald-400">Pergerakan</span>
                  </h2>
                  <div className="w-20 h-1 bg-emerald-500 mb-6"></div>
                  <div className="font-body text-gray-700 dark:text-gray-300 space-y-4">
                    <p>
                      Generasi Melek Politik bermula dari keprihatinan sekelompok mahasiswa terhadap rendahnya tingkat 
                      kesadaran dan partisipasi politik di kalangan pemuda Indonesia. Di tengah pandemi COVID-19 pada 
                      Maret 2020, Budi Santoso bersama lima rekannya dari berbagai universitas di Jakarta mulai rutin 
                      mengadakan diskusi virtual tentang isu-isu politik nasional.
                    </p>
                    <p>
                      Dengan semangat #PemudaBersuara, kelompok kecil ini bertransformasi menjadi komunitas yang lebih 
                      terstruktur. Pada Juni 2020, mereka resmi mendaftarkan Generasi Melek Politik sebagai organisasi 
                      non-profit dengan visi menciptakan generasi muda Indonesia yang melek politik, kritis, dan 
                      berpartisipasi aktif dalam mewujudkan demokrasi yang sehat.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Link href="/about/pengurus">
                      <Button variant="outline" className="gap-2">
                        <Users className="h-4 w-4" />
                        Kenali para pendiri kami
                      </Button>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section id="timeline" className="py-16 bg-gray-50 dark:bg-gray-800 scroll-mt-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Linimasa Perjalanan
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Tonggak-tonggak penting dalam perjalanan Generasi Melek Politik
                </p>
              </div>
            </FadeIn>
            
            <Tabs defaultValue="2023" className="w-full">
              <div className="flex justify-center mb-8 overflow-x-auto pb-2">
                <TabsList>
                  {timelineData.map((year) => (
                    <TabsTrigger 
                      key={year.year} 
                      value={year.year}
                      className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-300"
                    >
                      {year.year}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {timelineData.map((yearData) => (
                <TabsContent key={yearData.year} value={yearData.year} className="mt-0">
                  <div className="space-y-16">
                    {yearData.events.map((event, index) => (
                      <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                          <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                            <div className="relative rounded-xl overflow-hidden">
                              <AspectRatio ratio={16/9}>
                                <Image 
                                  src={event.image} 
                                  alt={event.title} 
                                  fill
                                  className="object-cover"
                                />
                                {event.highlight && (
                                  <div className="absolute top-4 right-4 z-10">
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                      Highlight
                                    </Badge>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                              </AspectRatio>
                            </div>
                          </div>
                          
                          <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                            <div className="flex items-center gap-2 mb-3">
                              <Calendar className="h-5 w-5 text-emerald-500" />
                              <span className="font-heading text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                {event.date}
                              </span>
                            </div>
                            
                            <h3 className="font-heading text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            
                            <p className="font-body text-gray-600 dark:text-gray-300">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* Key Achievements Section */}
        <section id="achievements" className="py-16 bg-white dark:bg-gray-900 scroll-mt-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Pencapaian Utama
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Hasil yang telah kami capai dalam perjalanan mengedukasi generasi muda Indonesia
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                  <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow text-center">
                    <CardContent className="pt-6 p-6 flex flex-col items-center">
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-full inline-block mb-4">
                        {achievement.icon}
                      </div>
                      <h3 className="font-heading text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                        {achievement.title}
                      </h3>
                      <p className="font-body text-gray-600 dark:text-gray-300">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
        
        {/* Media Coverage Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Sorotan Media
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Generasi Melek Politik dalam liputan media nasional
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaHighlights.map((media, index) => (
                <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-heading text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              {media.source}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {media.date}
                            </span>
                          </div>
                          
                          <h3 className="font-heading text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {media.title}
                          </h3>
                          
                          <Link href={media.link} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium">
                            Baca artikel
                            <ExternalLink className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
            
            <FadeIn delay={600} direction="up" duration={800}>
              <div className="text-center mt-12">
                <Link href="/publications">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Lihat semua publikasi media
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
        
        {/* Vision for Future Section */}
        <section className="py-16 bg-emerald-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-50"></div>
          <div className="absolute inset-0 bg-[url('/images/dotted-pattern.png')] opacity-10"></div>
          
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                  Visi ke Depan
                </h2>
                <p className="font-body text-lg text-white/90 mb-8">
                  Perjalanan kami baru dimulai. Dalam 5 tahun ke depan, kami berkomitmen untuk menjangkau 10 juta pemuda, membangun pusat studi politik, dan menjadi pelopor revolusi pendidikan politik digital.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/about/tujuan">
                    <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                      Pelajari Tujuan Kami
                    </Button>
                  </Link>
                  <Link href="/join">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      Bergabung dengan Kami
                    </Button>
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