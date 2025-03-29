"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Users, Target, History, Award, BookOpen, MapPin } from "lucide-react";
import { FadeIn } from "@/components/animation/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function AboutPage() {
  // Timeline data for the organization's journey
  const timeline = [
    {
      year: "2020",
      title: "Pendirian",
      description: "Generasi Melek Politik didirikan oleh sekelompok mahasiswa di Jakarta dengan visi menciptakan generasi muda yang melek politik."
    },
    {
      year: "2021",
      title: "Ekspansi Nasional",
      description: "GMP berkembang ke 10 kota besar di Indonesia, menjalankan program pendidikan politik di kampus-kampus utama."
    },
    {
      year: "2022",
      title: "Peluncuran Platform Digital",
      description: "Meluncurkan platform edukasi politik digital yang dapat diakses oleh pemuda di seluruh Indonesia."
    },
    {
      year: "2023",
      title: "Kolaborasi Internasional",
      description: "Memulai kolaborasi dengan organisasi pemuda internasional untuk berbagi praktik terbaik."
    },
  ];

  // Core values of the organization
  const coreValues = [
    {
      icon: <BookOpen className="h-8 w-8 text-emerald-500" />,
      title: "Pendidikan Politik",
      description: "Memberdayakan pemuda melalui literasi dan edukasi politik yang inklusif dan faktual."
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      title: "Inklusivitas",
      description: "Memastikan semua kelompok pemuda dapat berpartisipasi tanpa memandang latar belakang."
    },
    {
      icon: <Award className="h-8 w-8 text-emerald-500" />,
      title: "Integritas",
      description: "Menjunjung tinggi kejujuran dan transparansi dalam semua kegiatan dan komunikasi."
    },
    {
      icon: <Target className="h-8 w-8 text-emerald-500" />,
      title: "Aksi Nyata",
      description: "Mendorong partisipasi aktif dalam proses demokratis dan pengambilan keputusan."
    },
  ];

  // Team leaders data
  const teamLeaders = [
    {
      name: "Budi Santoso",
      role: "Pendiri & Ketua",
      photo: "/team/budi-santoso.jpg",
      quote: "Pemuda harus menjadi pendorong perubahan, bukan hanya penonton."
    },
    {
      name: "Siti Nurhayati",
      role: "Direktur Program",
      photo: "/team/siti-nurhayati.jpg",
      quote: "Pendidikan politik adalah kunci untuk demokrasi yang berkelanjutan."
    },
    {
      name: "Arief Wibowo",
      role: "Kepala Divisi Digital",
      photo: "/team/arief-wibowo.jpg",
      quote: "Teknologi harus dimanfaatkan untuk memperluas jangkauan edukasi politik."
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('/images/pattern-dots.svg')] bg-repeat"></div>
        </div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn delay={100} direction="up" duration={800}>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Tentang <span className="text-emerald-300">Generasi Melek Politik</span>
              </h1>
              <p className="font-body text-lg md:text-xl text-emerald-50 mb-8 max-w-xl">
                Membangun generasi muda Indonesia yang kritis, sadar politik, dan aktif berpartisipasi dalam demokratisasi negara.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">
                  Visi & Misi
                </Button>
                <Button variant="secondary" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                  Lihat Video Perkenalan
                </Button>
              </div>
            </FadeIn>
            
            <FadeIn delay={300} direction="up" duration={800} className="hidden lg:block">
              <AspectRatio ratio={4/3} className="bg-white/10 rounded-xl overflow-hidden backdrop-blur-sm border border-white/20">
                <Image 
                  src="/images/muska-create-K5OIYotY9GA-unsplash.png" 
                  alt="Tentang Generasi Melek Politik" 
                  fill
                  className="object-cover rounded-xl"
                />
              </AspectRatio>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Visi & Misi Kami
              </h2>
              <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
              <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                Menggerakkan dan mengembangkan kapasitas generasi muda Indonesia untuk aktif berpartisipasi dalam kehidupan politik negara.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <FadeIn delay={150} direction="right" duration={800}>
              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <h3 className="font-heading text-2xl font-bold mb-3 text-emerald-700 dark:text-emerald-400">Visi</h3>
                  <p className="font-body text-gray-700 dark:text-gray-300">
                    Menjadi katalisator utama dalam menciptakan generasi muda Indonesia yang melek politik, kritis, dan berpartisipasi aktif dalam mewujudkan demokrasi yang sehat.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h3 className="font-heading text-2xl font-bold mb-3 text-gray-900 dark:text-white">Misi</h3>
                  <ul className="font-body text-gray-700 dark:text-gray-300 space-y-3 pl-6">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-1 text-emerald-500">•</span>
                      <span>Mengedukasi pemuda tentang sistem politik, hak-hak demokratis, dan proses pengambilan keputusan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-1 text-emerald-500">•</span>
                      <span>Menciptakan platform dialog politik yang inklusif dan berdasarkan fakta</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-1 text-emerald-500">•</span>
                      <span>Memfasilitasi partisipasi pemuda dalam proses kebijakan publik</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-1 text-emerald-500">•</span>
                      <span>Membangun jaringan kolaborasi antara pemuda, politisi, dan pembuat kebijakan</span>
                    </li>
                  </ul>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={300} direction="left" duration={800}>
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
                <Image 
                  src="/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg" 
                  alt="Diskusi politik pemuda" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                  <div>
                    <h4 className="font-heading text-xl text-white font-bold mb-2">Workshop Politik Daerah</h4>
                    <p className="font-body text-white/80 text-sm">
                      Salah satu program unggulan kami untuk meningkatkan kesadaran politik di tingkat lokal
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Nilai-Nilai Inti
              </h2>
              <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
              <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                Prinsip-prinsip yang menjadi fondasi setiap kegiatan dan program kami
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full inline-block mb-4">
                      {value.icon}
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="font-body text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      
      {/* Timeline */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Perjalanan Kami
              </h2>
              <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
              <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                Momen-momen penting dalam perjalanan Generasi Melek Politik sejak didirikan
              </p>
            </div>
          </FadeIn>
          
          <div className="relative border-l-2 border-emerald-500 ml-6 md:ml-0 md:mx-auto md:max-w-3xl pl-6 space-y-12">
            {timeline.map((item, index) => (
              <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                <div className="relative">
                  <div className="absolute -left-[34px] md:-left-[34px] flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white border-4 border-white dark:border-gray-900">
                    <History className="h-3 w-3" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="font-body text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={600} direction="up" duration={800}>
            <div className="text-center mt-12">
              <Link href="/about/perjalanan">
                <Button variant="outline" className="gap-2">
                  <History className="h-4 w-4" />
                  Selengkapnya tentang perjalanan kami
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Tim Kami
              </h2>
              <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
              <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                Bertemu dengan individu-individu berdedikasi yang menggerakkan misi kami
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamLeaders.map((leader, index) => (
              <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-80">
                    <Image 
                      src={leader.photo} 
                      alt={leader.name} 
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="font-heading text-xl font-bold text-white mb-1">
                        {leader.name}
                      </h3>
                      <p className="font-body text-emerald-300 text-sm">
                        {leader.role}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="font-body text-gray-600 dark:text-gray-300 italic">
                      "{leader.quote}"
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={600} direction="up" duration={800}>
            <div className="text-center mt-12">
              <Link href="/about/pengurus">
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Lihat semua pengurus
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* Location/Contact Section */}
      <section className="py-16 bg-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/dotted-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn delay={100} direction="right" duration={800}>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                Bergabunglah dalam Gerakan
              </h2>
              <p className="font-body text-emerald-50 mb-8 max-w-lg">
                Kami selalu mencari individu bersemangat yang ingin berkontribusi dalam misi kami. Mari bergabung dan menjadi bagian dari perubahan!
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="h-6 w-6 text-emerald-300 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Kantor Pusat</h3>
                    <p className="font-body text-emerald-50">Jl. Demokrasi No. 45, Jakarta Pusat, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-6 w-6 text-emerald-300 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Jam Operasional</h3>
                    <p className="font-body text-emerald-50">Senin - Jumat: 09.00 - 17.00 WIB</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
                  Hubungi Kami
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Jadi Relawan
                </Button>
              </div>
            </FadeIn>
            
            <FadeIn delay={300} direction="left" duration={800}>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <iframe
                  title="Lokasi Kantor GMP"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6664672948935!2d106.8230576!3d-6.1750125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonumen%20Nasional!5e0!3m2!1sen!2sid!4v1653516641000!5m2!1sen!2sid"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale invert"
                ></iframe>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Siap Berkontribusi?
              </h2>
              <p className="font-body text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Bersama-sama, kita dapat membangun masa depan politik Indonesia yang lebih inklusif, transparan, dan berpusat pada kepentingan rakyat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Jadi Bagian dari Gerakan
                </Button>
                <Button variant="outline">
                  Pelajari Program Kami
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
} 