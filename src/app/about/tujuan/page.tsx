"use client";

import Image from "next/image";
import Link from "next/link";
import { Target, Compass, CheckCircle2, MapPin, Clock, Users, Flag, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animation/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";

// Core values data
const coreValues = [
  {
    title: "Integritas",
    description: "Kami menjunjung tinggi kejujuran, transparansi, dan konsistensi dalam setiap tindakan dan program yang kami jalankan.",
    icon: <CheckCircle2 className="h-8 w-8 text-emerald-500" />,
  },
  {
    title: "Inklusivitas",
    description: "Kami berkomitmen untuk melibatkan semua pemuda dari berbagai latar belakang, tanpa diskriminasi, dalam pendidikan dan partisipasi politik.",
    icon: <Users className="h-8 w-8 text-emerald-500" />,
  },
  {
    title: "Independensi",
    description: "Kami menjaga kemandirian dari kepentingan politik partisan, fokus pada penguatan kapasitas pemuda dalam berpolitik secara kritis.",
    icon: <Flag className="h-8 w-8 text-emerald-500" />,
  },
  {
    title: "Inovasi",
    description: "Kami terus mengembangkan metode dan pendekatan baru untuk pendidikan politik yang relevan dengan generasi digital saat ini.",
    icon: <Compass className="h-8 w-8 text-emerald-500" />,
  },
];

// Strategic objectives data
const strategicObjectives = [
  {
    title: "Meningkatkan Literasi Politik Pemuda",
    description: "Menciptakan generasi muda yang memahami sistem politik, proses demokratis, dan hak-kewajiban sebagai warga negara melalui pendidikan politik yang inklusif dan faktual.",
    metrics: [
      "Meningkatkan pengetahuan politik dasar sebesar 40% pada peserta program",
      "Menjangkau 100.000 pemuda melalui program edukasi online dan offline",
      "Mengembangkan 15 modul pendidikan politik yang komprehensif"
    ],
    timeline: "2023-2025",
    image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
  },
  {
    title: "Memperkuat Partisipasi Politik Aktif",
    description: "Mendorong keterlibatan pemuda dalam proses politik formal maupun informal, termasuk pemilu, pengawasan kebijakan, dan advokasi isu-isu publik.",
    metrics: [
      "Meningkatkan tingkat partisipasi pemilih muda di 15 provinsi target",
      "Melatih 5.000 pemuda sebagai pemantau pemilu dan proses politik",
      "Memfasilitasi 200 inisiatif advokasi yang dipimpin oleh pemuda"
    ],
    timeline: "2023-2026",
    image: "/images/muska-create-5MvNlQENWDM-unsplash.png",
  },
  {
    title: "Membangun Jaringan Pemuda Politik Berkualitas",
    description: "Menciptakan ekosistem yang mendukung pemuda untuk terlibat dalam kepemimpinan politik yang berintegritas, kritis, dan berwawasan luas.",
    metrics: [
      "Membentuk jaringan 500 pemimpin muda politik di 34 provinsi",
      "Mengembangkan platform kolaborasi antar pemuda politik",
      "Memfasilitasi 50 program pertukaran pengalaman politik antar daerah"
    ],
    timeline: "2024-2027",
    image: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg",
  },
];

// Target audience data
const targetAudiences = [
  {
    category: "Pelajar SMA dan Mahasiswa",
    description: "Usia 16-22 tahun yang baru mulai mengenal politik dan akan menjadi pemilih pemula.",
    focus: "Pendidikan politik dasar, pemahaman tentang sistem demokrasi, dan pengenalan isu-isu publik.",
    programs: ["Sekolah Politik Pemula", "Simulasi Pemilu", "Diskusi Politik Kampus"],
    image: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg",
  },
  {
    category: "Aktivis Muda",
    description: "Usia 18-30 tahun yang sudah aktif dalam organisasi kemahasiswaan, sosial, atau komunitas.",
    focus: "Penguatan kapasitas advokasi, analisis kebijakan, dan strategi kampanye isu.",
    programs: ["Workshop Advokasi Kebijakan", "Bootcamp Analisis Politik", "Jaringan Aktivis Muda"],
    image: "/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg",
  },
  {
    category: "Pemuda Pedesaan dan Daerah Terpencil",
    description: "Pemuda di daerah dengan akses terbatas terhadap informasi dan pendidikan politik.",
    focus: "Penjangkauan pendidikan politik lokal dan penguatan kepemimpinan komunitas.",
    programs: ["Politik Desa", "Pelatihan Kepemimpinan Lokal", "Radio Politik Desa"],
    image: "/images/heather-green-bQTzJzwQfJE-unsplash.png",
  },
  {
    category: "Calon Pemimpin Politik Muda",
    description: "Usia 25-40 tahun yang berminat atau sudah terlibat dalam politik formal.",
    focus: "Pengembangan integritas, kepemimpinan berbasis nilai, dan keterampilan politik praktis.",
    programs: ["Political Leadership Academy", "Mentoring Politik", "Forum Politisi Muda"],
    image: "/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png",
  },
];

export default function TujuanPage() {
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
                  Tujuan <span className="text-emerald-300">Kami</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-emerald-50 mb-8 max-w-xl">
                  Visi, misi, dan nilai-nilai yang menggerakkan kami untuk meningkatkan literasi politik generasi muda Indonesia.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="#strategic-objectives" scroll={false}>
                    <Button variant="secondary" className="bg-white hover:bg-gray-100 text-emerald-700">
                      Tujuan Strategis
                    </Button>
                  </Link>
                  <Link href="#values" scroll={false}>
                    <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white/30 text-white">
                      Nilai-Nilai Kami
                    </Button>
                  </Link>
                </div>
              </FadeIn>
              
              <FadeIn delay={300} direction="up" duration={800} className="hidden lg:block">
                <div className="relative rounded-xl overflow-hidden">
                  <Image 
                    src="/images/getty-images-AoJ2_pyNoYc-unsplash.jpg" 
                    alt="Visi dan misi Generasi Melek Politik" 
                    width={600}
                    height={400}
                    className="object-cover w-full rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                      <Target className="h-8 w-8 text-emerald-300 mb-2" />
                      <h3 className="text-lg font-bold text-white">
                        Menuju Indonesia yang Demokratis dan Bermartabat
                      </h3>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Vision Mission Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn delay={150} direction="right" duration={800}>
                <div className="space-y-8">
                  <div>
                    <h2 className="font-heading text-3xl font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                        <Target className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      Visi Kami
                    </h2>
                    <div className="pl-14">
                      <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                        Menjadi katalisator utama dalam menciptakan generasi muda Indonesia yang melek politik, kritis, dan berpartisipasi aktif dalam mewujudkan demokrasi yang sehat dan bermartabat.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="font-heading text-3xl font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                        <Compass className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      Misi Kami
                    </h2>
                    <div className="pl-14">
                      <ul className="font-body text-gray-600 dark:text-gray-300 space-y-4">
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">1.</span>
                          <span>Mengedukasi pemuda tentang sistem politik, hak-hak demokratis, dan proses pengambilan keputusan</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">2.</span>
                          <span>Menciptakan platform dialog politik yang inklusif dan berdasarkan fakta</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">3.</span>
                          <span>Memfasilitasi partisipasi pemuda dalam proses kebijakan publik</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">4.</span>
                          <span>Membangun jaringan kolaborasi antara pemuda, politisi, dan pembuat kebijakan</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">5.</span>
                          <span>Mengembangkan kepemimpinan politik yang berintegritas di kalangan generasi muda</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={300} direction="left" duration={800}>
                <div className="relative rounded-lg overflow-hidden h-full">
                  <AspectRatio ratio={4/3} className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/20 dark:to-gray-800/50 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                    <div className="absolute top-8 left-8 right-8 bottom-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                      <h3 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Sasaran Utama 2023-2025
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">1</span>
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-1">
                              Menjangkau 1 Juta Pemuda
                            </h4>
                            <p className="font-body text-gray-600 dark:text-gray-300 text-sm">
                              Melalui program pendidikan politik online dan offline di seluruh Indonesia
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">2</span>
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-1">
                              Meningkatkan Partisipasi Pemilih Muda
                            </h4>
                            <p className="font-body text-gray-600 dark:text-gray-300 text-sm">
                              Mendorong peningkatan partisipasi pemilih muda sebesar 30% pada pemilu mendatang
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">3</span>
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-1">
                              Membangun Jaringan 10.000 Relawan
                            </h4>
                            <p className="font-body text-gray-600 dark:text-gray-300 text-sm">
                              Mengembangkan jaringan relawan pendidikan politik di 34 provinsi Indonesia
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AspectRatio>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section id="values" className="py-16 bg-gray-50 dark:bg-gray-800">
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
                    <CardContent className="pt-6 p-6 flex flex-col h-full">
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full inline-block mb-4 w-fit">
                        {value.icon}
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 dark:text-white">
                        {value.title}
                      </h3>
                      <p className="font-body text-gray-600 dark:text-gray-300 flex-grow">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
        
        {/* Strategic Objectives Section */}
        <section id="strategic-objectives" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Tujuan Strategis
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Sasaran strategis untuk mewujudkan visi dan misi organisasi
                </p>
              </div>
            </FadeIn>
            
            <div className="space-y-16">
              {strategicObjectives.map((objective, index) => (
                <FadeIn key={index} delay={200} direction="up" duration={800}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className={`lg:col-span-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div className="relative rounded-xl overflow-hidden">
                        <AspectRatio ratio={3/4}>
                          <Image 
                            src={objective.image} 
                            alt={objective.title} 
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/40 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-emerald-300" />
                              <span className="text-sm font-medium text-emerald-300">{objective.timeline}</span>
                            </div>
                          </div>
                        </AspectRatio>
                      </div>
                    </div>
                    
                    <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <h3 className="font-heading text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        {objective.title}
                      </h3>
                      <p className="font-body text-gray-600 dark:text-gray-300 mb-6">
                        {objective.description}
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                        <h4 className="font-heading font-bold text-gray-900 dark:text-white mb-3">
                          Target Capaian:
                        </h4>
                        <ul className="space-y-2">
                          {objective.metrics.map((metric, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link href={`/programs`} className="inline-flex items-center font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                        Lihat program terkait
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
        
        {/* Target Audience Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Kelompok Sasaran
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Berbagai kelompok pemuda yang menjadi fokus program-program kami
                </p>
              </div>
            </FadeIn>
            
            <Tabs defaultValue={targetAudiences[0].category.toLowerCase().replace(/\s+/g, '-')} className="w-full">
              <div className="flex justify-center mb-10 overflow-x-auto pb-2">
                <TabsList className="bg-white dark:bg-gray-900 p-1">
                  {targetAudiences.map((audience) => (
                    <TabsTrigger 
                      key={audience.category} 
                      value={audience.category.toLowerCase().replace(/\s+/g, '-')}
                      className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-300"
                    >
                      {audience.category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {targetAudiences.map((audience) => (
                <TabsContent key={audience.category} value={audience.category.toLowerCase().replace(/\s+/g, '-')}>
                  <FadeIn direction="up" duration={800}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="relative rounded-lg overflow-hidden">
                        <AspectRatio ratio={16/9}>
                          <Image 
                            src={audience.image} 
                            alt={audience.category} 
                            fill
                            className="object-cover"
                          />
                        </AspectRatio>
                      </div>
                      
                      <div>
                        <h3 className="font-heading text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                          {audience.category}
                        </h3>
                        <p className="font-body text-gray-600 dark:text-gray-300 mb-6">
                          {audience.description}
                        </p>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                              <Target className="h-5 w-5 text-emerald-500" />
                              Fokus Program
                            </h4>
                            <p className="font-body text-gray-600 dark:text-gray-300 pl-7">
                              {audience.focus}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                              <Compass className="h-5 w-5 text-emerald-500" />
                              Program Unggulan
                            </h4>
                            <ul className="space-y-2 pl-7">
                              {audience.programs.map((program, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span>{program}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="py-16 bg-emerald-700 text-white">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                  Bergabunglah dalam Misi Kami
                </h2>
                <p className="font-body text-lg text-white/90 mb-8">
                  Mari bersama-sama mewujudkan visi Indonesia dengan generasi muda yang melek politik dan aktif berpartisipasi dalam proses demokrasi.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/join">
                    <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                      Bergabung Sekarang
                    </Button>
                  </Link>
                  <Link href="/volunteer">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      Jadi Relawan
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