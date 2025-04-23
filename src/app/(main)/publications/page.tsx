"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";
import { Button } from "@/components/ui/button";
import { CompanyButton } from "@/components/ui/company-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  FileText, 
  Filter, 
  X,
  ChevronDown 
} from "lucide-react";
import { COLORS } from "@/styles/colors";

// Publication data
const publications = [
  {
    id: "1",
    title: "Memahami Sistem Pemilu Indonesia",
    excerpt: "Panduan komprehensif tentang sistem pemilihan umum di Indonesia, struktur, dan proses penyelenggaraannya.",
    content: "Panduan komprehensif tentang sistem pemilihan umum di Indonesia, struktur, dan proses penyelenggaraannya. Dalam publikasi ini, kami mengulas secara mendalam tentang berbagai aspek sistem pemilu di Indonesia, termasuk sejarah perkembangannya, struktur organisasi, dan proses penyelenggaraan pemilu yang demokratis.",
    image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
    date: "15 Mei 2023",
    author: "Tim Riset GMP",
    category: "Pemilu",
    tags: ["pemilu", "demokrasi", "edukasi"],
    type: "E-Book",
    views: 1520
  },
  {
    id: "2",
    title: "Partisipasi Politik Generasi Muda",
    excerpt: "Analisis mendalam tentang peran dan potensi generasi muda Indonesia dalam lanskap politik di era digital.",
    content: "Analisis mendalam tentang peran dan potensi generasi muda Indonesia dalam lanskap politik di era digital. Publikasi ini mengkaji data statistik terbaru tentang partisipasi politik pemuda, faktor-faktor yang mempengaruhi tingkat partisipasi, serta strategi untuk meningkatkan keterlibatan generasi muda dalam proses demokrasi.",
    image: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg",
    date: "22 Juni 2023",
    author: "Dr. Siti Nurhayati",
    category: "Partisipasi Politik",
    tags: ["generasi muda", "partisipasi", "politik"],
    type: "Jurnal",
    views: 2400
  },
  {
    id: "3",
    title: "Aktivisme Digital dalam Demokrasi Modern",
    excerpt: "Eksplorasi tentang bagaimana media sosial dan teknologi digital membentuk aktivisme politik kontemporer.",
    content: "Eksplorasi tentang bagaimana media sosial dan teknologi digital membentuk aktivisme politik kontemporer. Publikasi ini membahas transformasi gerakan sosial-politik di era digital, strategi kampanye online yang efektif, tantangan misinformasi, serta studi kasus gerakan aktivisme digital yang berhasil menciptakan perubahan nyata di Indonesia.",
    image: "/images/muska-create-5MvNlQENWDM-unsplash.png",
    date: "10 Agustus 2023",
    author: "Arief Wibowo",
    category: "Media Digital",
    tags: ["aktivisme", "digital", "media sosial"],
    type: "Laporan Penelitian",
    views: 3150
  },
  {
    id: "4",
    title: "Literasi Politik untuk Pemilih Pemula",
    excerpt: "Panduan praktis bagi pemilih pemula untuk memahami hak dan tanggung jawab politik mereka.",
    content: "Panduan praktis bagi pemilih pemula untuk memahami hak dan tanggung jawab politik mereka. Publikasi ini dirancang khusus untuk anak muda yang baru pertama kali menggunakan hak pilihnya, mencakup pengetahuan dasar tentang sistem politik, cara kerja pemilu, serta tips untuk menjadi pemilih yang kritis dan bertanggung jawab.",
    image: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg",
    date: "5 September 2023",
    author: "Tim Edukasi GMP",
    category: "Literasi Politik",
    tags: ["pemilih pemula", "literasi", "edukasi"],
    type: "Modul Edukasi",
    views: 4280
  },
  {
    id: "5",
    title: "Analisis Kebijakan Publik: Pendekatan Praktis",
    excerpt: "Metode dan kerangka untuk menganalisis kebijakan publik dengan pendekatan berbasis bukti.",
    content: "Metode dan kerangka untuk menganalisis kebijakan publik dengan pendekatan berbasis bukti. Publikasi ini menyajikan pendekatan sistematis dalam menganalisis kebijakan publik, termasuk metodologi penelitian, teknik pengumpulan data, analisis dampak, dan evaluasi efektivitas kebijakan. Dilengkapi dengan contoh kasus dari berbagai sektor kebijakan di Indonesia.",
    image: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg",
    date: "18 Oktober 2023",
    author: "Dr. Budi Santoso",
    category: "Kebijakan Publik",
    tags: ["kebijakan", "analisis", "pemerintahan"],
    type: "Buku",
    views: 1860
  },
  {
    id: "6",
    title: "Politik Lokal dan Pemilihan Kepala Daerah",
    excerpt: "Dinamika politik lokal dan pengaruhnya terhadap proses pemilihan kepala daerah di Indonesia.",
    content: "Dinamika politik lokal dan pengaruhnya terhadap proses pemilihan kepala daerah di Indonesia. Publikasi ini menganalisis kompleksitas politik lokal, patronase, dinamika elit, serta pengaruhnya terhadap kualitas demokrasi di tingkat daerah. Kajian ini juga membahas tantangan dan peluang reformasi sistem pilkada untuk memperkuat demokrasi lokal.",
    image: "/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg",
    date: "7 November 2023",
    author: "Tim Riset Politik Lokal",
    category: "Politik Lokal",
    tags: ["pilkada", "daerah", "demokrasi lokal"],
    type: "Jurnal",
    views: 2150
  },
  {
    id: "7",
    title: "Perempuan dalam Politik Indonesia",
    excerpt: "Kajian tentang representasi, tantangan, dan peluang bagi perempuan dalam politik di Indonesia.",
    content: "Kajian tentang representasi, tantangan, dan peluang bagi perempuan dalam politik di Indonesia. Publikasi ini mengeksplorasi perkembangan partisipasi perempuan dalam politik Indonesia, kebijakan afirmasi, hambatan struktural dan kultural, serta strategi untuk meningkatkan keterwakilan perempuan dalam lembaga-lembaga politik formal.",
    image: "/images/heather-green-bQTzJzwQfJE-unsplash.png",
    date: "12 Desember 2023",
    author: "Dr. Maya Anggraini",
    category: "Gender dan Politik",
    tags: ["perempuan", "keterwakilan", "gender"],
    type: "Laporan Penelitian",
    views: 3420
  },
  {
    id: "8",
    title: "Peran Media dalam Pembentukan Opini Politik",
    excerpt: "Analisis pengaruh media dalam membentuk persepsi dan opini publik tentang isu-isu politik.",
    content: "Analisis pengaruh media dalam membentuk persepsi dan opini publik tentang isu-isu politik. Publikasi ini mengkaji peran media massa dan media sosial dalam konstruksi realitas politik, pola konsumsi informasi, dan dampaknya terhadap preferensi politik masyarakat. Studi ini juga membahas fenomena polarisasi dan echo chamber dalam lanskap media kontemporer Indonesia.",
    image: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg",
    date: "20 Januari 2024",
    author: "Tim Media GMP",
    category: "Media dan Politik",
    tags: ["media massa", "opini publik", "komunikasi politik"],
    type: "E-Book",
    views: 1980
  }
];

// Categories for filter
const categories = [
  "Pemilu",
  "Partisipasi Politik",
  "Media Digital",
  "Literasi Politik",
  "Kebijakan Publik",
  "Politik Lokal",
  "Gender dan Politik",
  "Media dan Politik"
];

// Publication types
const types = [
  "Buku",
  "E-Book",
  "Jurnal",
  "Laporan Penelitian",
  "Modul Edukasi",
  "Infografis"
];

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  // Filter publications
  const filteredPublications = publications.filter(pub => {
    // Search filter
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         pub.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pub.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
                          selectedCategories.includes(pub.category);
    
    // Type filter
    const matchesType = selectedTypes.length === 0 || 
                       selectedTypes.includes(pub.type);
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTypes([]);
  };

  return (
    <PublicPageLayout>
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#3cb1dc] to-[#3cb1dc]/80 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[url('/images/pattern-dots.svg')] bg-repeat"></div>
          </div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <FadeIn delay={100} direction="up" duration={800}>
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Publikasi <span className="text-[#e5b546]">& Riset</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-blue-100 mb-8">
                  Temukan berbagai publikasi, penelitian, dan sumber belajar dari Generasi Melek Politik untuk meningkatkan pemahaman tentang dunia politik Indonesia.
                </p>
                <div className="flex justify-center">
                  <div className="relative max-w-md w-full">
                    <Input
                      type="text"
                      placeholder="Cari publikasi..."
                      className="pl-10 pr-4 py-3 w-full bg-white/90 border-transparent focus:border-[#e5b546] focus:bg-white focus:ring-2 focus:ring-[#e5b546] text-gray-900"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden w-full mb-4">
                <CompanyButton 
                  variant="outline" 
                  colorVariant="green"
                  className="w-full flex items-center justify-between gap-2"
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilter ? 'transform rotate-180' : ''}`} />
                </CompanyButton>
              </div>
              
              {/* Sidebar Filter (Desktop) */}
              <aside className={`lg:w-1/4 ${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <Filter className="h-5 w-5 text-[#5d992a]" />
                      Filter
                    </h2>
                    
                    {(selectedCategories.length > 0 || selectedTypes.length > 0 || searchQuery) && (
                      <CompanyButton 
                        variant="outline" 
                        colorVariant="blue"
                        size="sm" 
                        onClick={clearFilters}
                        className="flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="text-xs">Reset</span>
                      </CompanyButton>
                    )}
                  </div>
                  
                  {/* Category Filter */}
                  <div className="mb-6">
                    <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-3">
                      Kategori
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Type Filter */}
                  <div className="mb-6">
                    <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-3">
                      Jenis Publikasi
                    </h3>
                    <div className="space-y-2">
                      {types.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`type-${type}`} 
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="mt-6">
                    <CompanyButton 
                      variant="solid" 
                      colorVariant="green"
                      className="w-full"
                      onClick={() => setShowMobileFilter(false)}
                    >
                      Terapkan Filter
                    </CompanyButton>
                  </div>
                </div>
              </aside>
              
              {/* Main Content */}
              <div className={`lg:w-3/4 ${showMobileFilter ? 'hidden' : 'block'} lg:block`}>
                {/* Publication Count & Sort */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                    Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{filteredPublications.length}</span> publikasi
                  </p>
                  
                  {filteredPublications.length === 0 && (
                    <CompanyButton 
                      variant="outline" 
                      colorVariant="blue"
                      size="sm" 
                      onClick={clearFilters}
                      className="flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reset Filter</span>
                    </CompanyButton>
                  )}
                </div>
                
                {/* Publications Grid */}
                {filteredPublications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredPublications.map((pub, index) => (
                      <FadeIn key={pub.id} delay={150 * index} direction="up" duration={800}>
                        <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300">
                          <Link href={`/publications/${pub.id}`} className="block h-48 relative overflow-hidden">
                            <Image 
                              src={pub.image} 
                              alt={pub.title} 
                              fill
                              className="object-cover transition-transform hover:scale-105 duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-24"></div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                              <Badge className="bg-[#5d992a] hover:bg-[#5d992a]/90">
                                {pub.type}
                              </Badge>
                              {selectedCategories.length === 0 && (
                                <Badge variant="outline" className="bg-black/50 text-white border-transparent hover:bg-black/60 hover:border-transparent">
                                  {pub.category}
                                </Badge>
                              )}
                            </div>
                          </Link>
                          
                          <CardContent className="p-5">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{pub.date}</span>
                            </div>
                            
                            <Link href={`/publications/${pub.id}`}>
                              <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-[#5d992a] dark:hover:text-[#5d992a] transition-colors">
                                {pub.title}
                              </h3>
                            </Link>
                            
                            <p className="font-body text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-2">
                              {pub.excerpt}
                            </p>
                            
                            <p className="font-body text-gray-500 dark:text-gray-400 text-sm">
                              Oleh: <span className="font-medium text-gray-700 dark:text-gray-300">{pub.author}</span>
                            </p>
                          </CardContent>
                          
                          <CardFooter className="pt-0 px-5 pb-5">
                            <Link 
                              href={`/publications/${pub.id}`}
                              className="text-[#5d992a] hover:text-[#5d992a]/80 dark:text-[#5d992a] dark:hover:text-[#5d992a]/80 font-medium text-sm flex items-center gap-1 transition-colors"
                            >
                              Baca selengkapnya
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </CardFooter>
                        </Card>
                      </FadeIn>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg">
                    <FadeIn direction="up" duration={800}>
                      <div className="flex flex-col items-center">
                        <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          Tidak ada publikasi yang ditemukan
                        </h3>
                        <p className="font-body text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                          Kami tidak dapat menemukan publikasi yang sesuai dengan filter yang Anda pilih. Coba ubah kriteria pencarian Anda.
                        </p>
                        <CompanyButton onClick={clearFilters} variant="outline" colorVariant="blue" className="gap-2">
                          <X className="h-4 w-4" />
                          Reset Filter
                        </CompanyButton>
                      </div>
                    </FadeIn>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Submit Research CTA */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="bg-gradient-to-r from-[#5d992a] to-[#5d992a]/90 text-white rounded-xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-2/3">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                      Punya Penelitian atau Artikel Politik?
                    </h2>
                    <p className="font-body text-[#e5b546] mb-6">
                      Kami mendorong kontribusi akademik dan non-akademik dari berbagai kalangan. Ajukan penelitian, artikel, atau karya tulis Anda untuk dipublikasikan di platform GMP.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <CompanyButton variant="solid" colorVariant="yellow" className="bg-white gap-2">
                        <FileText className="h-4 w-4" />
                        Ajukan Naskah Anda
                      </CompanyButton>
                      <CompanyButton variant="outline" className="border-white text-white hover:bg-white/10">
                        Pelajari Panduan Penulisan
                      </CompanyButton>
                    </div>
                  </div>
                  <div className="md:w-1/3 flex justify-center">
                    <div className="relative w-64 h-64">
                      <div className="absolute top-0 left-0 w-full h-full bg-[#5d992a]/60 backdrop-blur-sm rounded-full animate-pulse"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <BookOpen className="h-20 w-20 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
} 