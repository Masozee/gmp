"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, Building, Award, HandHelping, ArrowUpRight, ExternalLink } from "lucide-react";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";
import { CompanyButton } from "@/components/ui/company-button";

// Major partners data
const majorPartners = [
  {
    name: "Komisi Pemilihan Umum",
    logo: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
    description: "Kolaborasi untuk meningkatkan literasi politik pemuda dan mendorong partisipasi dalam pemilu.",
    website: "https://kpu.go.id",
    category: "Pemerintah",
  },
  {
    name: "Bawaslu RI",
    logo: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg",
    description: "Kerjasama dalam program pendidikan politik dan pelatihan pemantau pemilu muda.",
    website: "https://bawaslu.go.id",
    category: "Pemerintah",
  },
  {
    name: "Kementerian Pemuda dan Olahraga",
    logo: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg",
    description: "Kolaborasi dalam pemberdayaan pemuda untuk aktif dalam konteks politik dan kewarganegaraan.",
    website: "https://kemenpora.go.id",
    category: "Pemerintah",
  },
  {
    name: "UNICEF Indonesia",
    logo: "/images/muska-create-5MvNlQENWDM-unsplash.png",
    description: "Kemitraan untuk mendukung inisiatif partisipasi politik generasi muda dan pendidikan kewarganegaraan.",
    website: "https://unicef.org/indonesia",
    category: "Organisasi Internasional",
  },
];

// NGO partners data
const ngoPartners = [
  {
    name: "Indonesia Corruption Watch",
    logo: "/images/muska-create-5MvNlQENWDM-unsplash.png",
    description: "Kolaborasi dalam program pengawasan publik dan transparansi politik.",
    website: "https://icw.or.id",
    featured: true,
  },
  {
    name: "Perludem",
    logo: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
    description: "Kemitraan dalam program pendidikan pemilih dan penelitian kepemiluan.",
    website: "https://perludem.org",
    featured: true,
  },
  {
    name: "YLBHI",
    logo: "/images/frank-mouland-e4mYPf_JUIk-unsplash.png",
    description: "Kerjasama dalam edukasi hak-hak konstitusional dan bantuan hukum bagi aktivis muda.",
    website: "https://ylbhi.or.id",
    featured: false,
  },
  {
    name: "Transparency International Indonesia",
    logo: "/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png",
    description: "Kolaborasi dalam pelatihan anti-korupsi untuk pemuda dan pengawasan anggaran publik.",
    website: "https://ti.or.id",
    featured: false,
  },
  {
    name: "Forum Indonesia untuk Transparansi Anggaran",
    logo: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg",
    description: "Kerjasama dalam program pemahaman anggaran negara dan pengawasan publik.",
    website: "https://fitra.or.id",
    featured: false,
  },
  {
    name: "Wahid Foundation",
    logo: "/images/heather-green-bQTzJzwQfJE-unsplash.png",
    description: "Kemitraan dalam program pendidikan toleransi dan keberagaman dalam konteks politik.",
    website: "https://wahidfoundation.org",
    featured: true,
  },
];

// Academic partners data
const academicPartners = [
  {
    name: "Universitas Indonesia",
    logo: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg",
    description: "Kerjasama dalam pengembangan kurikulum pendidikan politik dan program magang mahasiswa.",
    department: "Fakultas Ilmu Sosial dan Politik",
    location: "Jakarta"
  },
  {
    name: "Universitas Gadjah Mada",
    logo: "/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg",
    description: "Kolaborasi penelitian tentang partisipasi politik pemuda dan pengembangan modul pendidikan.",
    department: "Departemen Politik dan Pemerintahan",
    location: "Yogyakarta"
  },
  {
    name: "Institut Teknologi Bandung",
    logo: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg",
    description: "Kemitraan dalam pengembangan platform digital untuk pendidikan politik dan analisis data.",
    department: "School of Business and Management",
    location: "Bandung"
  },
  {
    name: "Universitas Hasanuddin",
    logo: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg",
    description: "Kerjasama dalam program pendidikan politik untuk wilayah Indonesia Timur.",
    department: "Fakultas Ilmu Sosial dan Politik",
    location: "Makassar"
  },
  {
    name: "Universitas Airlangga",
    logo: "/images/muska-create-K5OIYotY9GA-unsplash.png",
    description: "Kolaborasi dalam penelitian dan pelatihan kepemimpinan politik bagi pemuda.",
    department: "Departemen Ilmu Politik",
    location: "Surabaya"
  },
  {
    name: "Universitas Padjadjaran",
    logo: "/images/heather-green-bQTzJzwQfJE-unsplash.png",
    description: "Kemitraan dalam program magang politik dan pengembangan kurikulum pendidikan kewarganegaraan.",
    department: "Fakultas Ilmu Sosial dan Politik",
    location: "Bandung"
  },
];

// Media partners data
const mediaPartners = [
  {
    name: "Kompas.com",
    logo: "/images/frank-mouland-e4mYPf_JUIk-unsplash.png",
    type: "Media Online"
  },
  {
    name: "Detik.com",
    logo: "/images/muska-create-5MvNlQENWDM-unsplash.png",
    type: "Media Online"
  },
  {
    name: "Tempo",
    logo: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg",
    type: "Media Cetak & Online"
  },
  {
    name: "Metro TV",
    logo: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
    type: "Televisi"
  },
  {
    name: "Radio Republik Indonesia",
    logo: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg",
    type: "Radio"
  },
  {
    name: "Narasi TV",
    logo: "/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg",
    type: "Media Online"
  },
  {
    name: "The Jakarta Post",
    logo: "/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png",
    type: "Media Cetak & Online"
  },
  {
    name: "KBR",
    logo: "/images/heather-green-bQTzJzwQfJE-unsplash.png",
    type: "Radio"
  },
];

// Collaboration highlights
const collaborationHighlights = [
  {
    title: "Democracy Festival 2023",
    partners: ["Komisi Pemilihan Umum", "Universitas Indonesia", "Kompas"],
    image: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg",
    description: "Festival tahunan yang diselenggarakan bersama KPU, UI, dan didukung oleh Kompas untuk merayakan demokrasi Indonesia dengan berbagai kegiatan edukatif dan interaktif.",
  },
  {
    title: "Politik Digital Initiative",
    partners: ["Perludem", "Universitas Gadjah Mada", "Narasi TV"],
    image: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg",
    description: "Program pemanfaatan teknologi digital untuk meningkatkan partisipasi politik pemuda, bekerjasama dengan Perludem dan UGM, serta liputan khusus dari Narasi TV.",
  },
  {
    title: "Youth Observer Academy",
    partners: ["Bawaslu RI", "Indonesia Corruption Watch", "Metro TV"],
    image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
    description: "Program pelatihan pemantau pemilu muda yang berkolaborasi dengan Bawaslu dan ICW untuk menyiapkan generasi pemantau pemilu yang kompeten dan berintegritas.",
  },
];

export default function PartnersPage() {
  return (
    <PublicPageLayout>
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="py-20 relative bg-green-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-2/3">
                <FadeIn direction="up" duration={800}>
                  <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                    Mitra Strategis Kami
                  </h1>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl">
                    Generasi Melek Politik berkolaborasi dengan berbagai pihak untuk memperluas dampak dan memperkuat inisiatif pendidikan politik bagi generasi muda Indonesia.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <CompanyButton variant="solid" colorVariant="yellow" className="bg-white text-green-800 hover:bg-white/90">
                      Jadi Mitra Kami
                    </CompanyButton>
                    <CompanyButton variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      Pelajari Program Kami
                    </CompanyButton>
                  </div>
                </FadeIn>
              </div>
              <div className="md:w-1/3">
                <FadeIn direction="left" duration={800}>
                  <div className="relative h-80 w-full">
                    <Image
                      src="/images/partnership-illustration.svg"
                      alt="Partnership Illustration"
                      fill
                      className="object-contain"
                    />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Major Partners Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Mitra Utama
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Kami bekerjasama dengan institusi-institusi terkemuka untuk memperkuat pendidikan politik di Indonesia
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {majorPartners.map((partner, index) => (
                <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                  <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className="h-16 w-48 relative">
                          <Image 
                            src={partner.logo} 
                            alt={partner.name} 
                            fill
                            className="object-contain object-left"
                          />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {partner.category}
                        </Badge>
                      </div>
                      
                      <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {partner.name}
                      </h3>
                      
                      <p className="font-body text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow">
                        {partner.description}
                      </p>
                      
                      <Link 
                        href={partner.website} 
                        target="_blank" 
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium text-sm flex items-center gap-1.5 group-hover:gap-2 transition-all"
                      >
                        Kunjungi Website
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Categories Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Jaringan Mitra
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Eksplorasi mitra-mitra kami berdasarkan kategori
                </p>
              </div>
            </FadeIn>
            
            <Tabs defaultValue="ngo" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white dark:bg-gray-900 p-1">
                  <TabsTrigger 
                    value="ngo"
                    className="flex items-center gap-1.5 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-300"
                  >
                    <Building className="h-4 w-4" />
                    Organisasi Non-Pemerintah
                  </TabsTrigger>
                  <TabsTrigger 
                    value="academic"
                    className="flex items-center gap-1.5 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-300"
                  >
                    <Award className="h-4 w-4" />
                    Institusi Akademik
                  </TabsTrigger>
                  <TabsTrigger 
                    value="media"
                    className="flex items-center gap-1.5 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-300"
                  >
                    <Globe className="h-4 w-4" />
                    Media
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* NGO Partners Tab */}
              <TabsContent value="ngo">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ngoPartners.map((partner, index) => (
                    <FadeIn key={index} delay={100 * index} direction="up" duration={800}>
                      <Card className={`h-full overflow-hidden hover:shadow-md transition-all duration-300 ${partner.featured ? 'border-purple-200 dark:border-purple-800' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="h-14 w-40 relative">
                              <Image 
                                src={partner.logo} 
                                alt={partner.name} 
                                fill
                                className="object-contain object-left"
                              />
                            </div>
                            {partner.featured && (
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800">
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-3">
                            {partner.name}
                          </h3>
                          
                          <p className="font-body text-gray-600 dark:text-gray-300 text-sm mb-4">
                            {partner.description}
                          </p>
                          
                          <Link 
                            href={partner.website} 
                            target="_blank" 
                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm flex items-center gap-1.5 hover:gap-2 transition-all"
                          >
                            Kunjungi Website
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>
              
              {/* Academic Partners Tab */}
              <TabsContent value="academic">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {academicPartners.map((partner, index) => (
                    <FadeIn key={index} delay={100 * index} direction="up" duration={800}>
                      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-6">
                            <div className="h-16 w-16 relative mr-3 flex-shrink-0">
                              <Image 
                                src={partner.logo} 
                                alt={partner.name} 
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">
                                {partner.name}
                              </h3>
                              <p className="text-purple-600 dark:text-purple-400 text-sm">
                                {partner.department}
                              </p>
                            </div>
                          </div>
                          
                          <p className="font-body text-gray-600 dark:text-gray-300 text-sm mb-4">
                            {partner.description}
                          </p>
                          
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <Globe className="h-4 w-4 mr-1.5" />
                            {partner.location}
                          </div>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>
              
              {/* Media Partners Tab */}
              <TabsContent value="media">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {mediaPartners.map((partner, index) => (
                    <FadeIn key={index} delay={50 * index} direction="up" duration={800}>
                      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center p-6 group">
                        <div className="h-12 w-full relative mb-4">
                          <Image 
                            src={partner.logo} 
                            alt={partner.name} 
                            fill
                            className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                        <p className="text-center text-gray-600 dark:text-gray-400 text-sm font-medium">
                          {partner.name}
                        </p>
                        <p className="text-center text-gray-500 dark:text-gray-500 text-xs">
                          {partner.type}
                        </p>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Collaboration Highlights */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Kolaborasi Unggulan
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Beberapa program kolaborasi terbesar yang telah kami lakukan bersama mitra strategis
                </p>
              </div>
            </FadeIn>
            
            <div className="space-y-12">
              {collaborationHighlights.map((collab, index) => (
                <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                  <Card className="overflow-hidden border-none shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                      <div className="lg:col-span-2 relative h-64 lg:h-auto">
                        <Image 
                          src={collab.image} 
                          alt={collab.title} 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent lg:bg-gradient-to-t lg:from-black/60 lg:via-black/30 lg:to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 lg:p-8 z-10">
                          <h3 className="font-heading text-2xl font-bold text-white mb-2">
                            {collab.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-3 p-6 lg:p-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {collab.partners.map((partner, i) => (
                            <Badge key={i} variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                              {partner}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="font-body text-gray-600 dark:text-gray-300 mb-6">
                          {collab.description}
                        </p>
                        
                        <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30">
                          Lihat Detail Kolaborasi
                        </Button>
                      </div>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Stats Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              <FadeIn delay={100} direction="up" duration={800}>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm text-center">
                  <h3 className="font-heading text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">25+</h3>
                  <p className="font-body text-gray-600 dark:text-gray-400 text-sm">Mitra Pemerintah</p>
                </div>
              </FadeIn>
              <FadeIn delay={200} direction="up" duration={800}>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm text-center">
                  <h3 className="font-heading text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">40+</h3>
                  <p className="font-body text-gray-600 dark:text-gray-400 text-sm">NGO Mitra</p>
                </div>
              </FadeIn>
              <FadeIn delay={300} direction="up" duration={800}>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm text-center">
                  <h3 className="font-heading text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">15+</h3>
                  <p className="font-body text-gray-600 dark:text-gray-400 text-sm">Universitas Mitra</p>
                </div>
              </FadeIn>
              <FadeIn delay={400} direction="up" duration={800}>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm text-center">
                  <h3 className="font-heading text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">30+</h3>
                  <p className="font-body text-gray-600 dark:text-gray-400 text-sm">Media Partner</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Become a Partner CTA */}
        <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                  Bergabunglah sebagai Mitra Strategis
                </h2>
                <p className="font-body text-lg text-white/90 mb-8">
                  Kami terbuka untuk kolaborasi dengan berbagai organisasi, institusi, dan pihak yang memiliki komitmen terhadap penguatan demokrasi dan partisipasi politik generasi muda.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <CompanyButton variant="solid" colorVariant="yellow" className="bg-white text-purple-700 hover:bg-purple-50">
                    Ajukan Kemitraan
                  </CompanyButton>
                  <CompanyButton variant="outline" className="border-white text-white hover:bg-white/10">
                    Pelajari Persyaratan
                  </CompanyButton>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* View All Partners button */}
        <FadeIn direction="up" delay={300} duration={800}>
          <div className="mt-10 text-center">
            <CompanyButton 
              variant="outline" 
              colorVariant="blue" 
              className="gap-2"
            >
              Lihat Semua Mitra
              <ExternalLink className="h-4 w-4" />
            </CompanyButton>
          </div>
        </FadeIn>
      </div>
    </PublicPageLayout>
  );
} 