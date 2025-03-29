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
  ArrowRight, 
  Mail, 
  Filter, 
  X,
  ChevronDown 
} from "lucide-react";
import { COLORS } from "@/styles/colors";

// News data
const newsData = [
  {
    id: "1",
    title: "GMP Sukses Gelar Seminar Nasional Melek Politik",
    excerpt: "Lebih dari 500 peserta menghadiri seminar nasional tentang melek politik yang diselenggarakan oleh GMP di Jakarta.",
    content: "Generasi Melek Politik (GMP) berhasil menyelenggarakan Seminar Nasional Melek Politik di Jakarta pada Sabtu (12/2) yang dihadiri lebih dari 500 peserta dari berbagai kalangan. Seminar yang mengangkat tema 'Peran Generasi Muda dalam Perbaikan Demokrasi Indonesia' ini menghadirkan sejumlah pembicara ternama seperti Prof. Dr. Maswadi Rauf (Pakar Politik UI), Dr. Djayadi Hanan (Direktur Eksekutif Saiful Mujani Research & Consulting), dan Titi Anggraini (Direktur Eksekutif Perludem).",
    image: "/images/josh-appel-0nkFvdcM-X4-unsplash.jpg",
    date: "15 Februari 2024",
    category: "Event",
    author: "Tim GMP",
    views: 1250
  },
  {
    id: "2",
    title: "Aplikasi 'Politik Cerdas' Versi 2.0 Resmi Diluncurkan",
    excerpt: "GMP meluncurkan pembaruan besar untuk aplikasi Politik Cerdas dengan fitur-fitur baru.",
    content: "Generasi Melek Politik (GMP) resmi meluncurkan Aplikasi 'Politik Cerdas' versi 2.0 pada Rabu (25/1). Aplikasi yang dikembangkan sejak tahun 2021 ini mengalami pembaruan signifikan dengan penambahan fitur-fitur baru seperti forum diskusi, analisis kandidat, dan pemantauan kinerja wakil rakyat. Aplikasi ini merupakan inovasi digital GMP untuk memudahkan masyarakat, khususnya pemilih pemula, dalam mengakses informasi politik yang faktual dan berimbang.",
    image: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg",
    date: "27 Januari 2024",
    category: "Teknologi",
    author: "Divisi Teknologi GMP",
    views: 978
  },
  {
    id: "3",
    title: "Kolaborasi GMP dengan KPU untuk Edukasi Pemilu 2024",
    excerpt: "GMP menjalin kerja sama dengan KPU untuk program edukasi pemilu bagi pemilih pemula.",
    content: "Generasi Melek Politik (GMP) resmi menjalin kerja sama dengan Komisi Pemilihan Umum (KPU) dalam rangka edukasi pemilu 2024 bagi pemilih pemula. Penandatanganan nota kesepahaman (MoU) dilakukan pada Senin (15/1) di Kantor KPU Pusat, Jakarta. Program kerja sama ini akan berfokus pada sosialisasi tahapan pemilu, simulasi pemungutan suara, dan kampanye anti-hoaks yang akan menyasar siswa SMA, mahasiswa, dan komunitas pemuda di seluruh Indonesia.",
    image: "/images/joshua-hoehne-Js8uYasqbBE-unsplash.jpg",
    date: "17 Januari 2024",
    category: "Kemitraan",
    author: "Divisi Kemitraan GMP",
    views: 843
  },
  {
    id: "4",
    title: "GMP Raih Penghargaan NGO Terbaik 2023",
    excerpt: "Komitmen dan dedikasi GMP dalam pendidikan politik berbuah penghargaan bergengsi.",
    content: "Generasi Melek Politik (GMP) berhasil meraih penghargaan sebagai NGO Terbaik kategori Pendidikan Politik dalam ajang Civil Society Award 2023 yang diselenggarakan oleh Kementerian Dalam Negeri bekerjasama dengan United Nations Development Programme (UNDP). Penghargaan ini diberikan atas kontribusi GMP dalam mengembangkan model pendidikan politik yang inovatif dan inklusif untuk generasi muda Indonesia selama lima tahun terakhir.",
    image: "/images/isaac-smith-AT77Q0Njnt0-unsplash.jpg",
    date: "20 Desember 2023",
    category: "Penghargaan",
    author: "Tim Komunikasi GMP",
    views: 1120
  },
  {
    id: "5",
    title: "Survei: 65% Pemuda Indonesia Tertarik Politik tapi Minim Pengetahuan",
    excerpt: "GMP rilis hasil survei tentang literasi politik di kalangan pemuda Indonesia.",
    content: "Generasi Melek Politik (GMP) merilis hasil survei nasional tentang literasi politik di kalangan pemuda Indonesia (18-30 tahun). Survei yang melibatkan 2.500 responden dari 34 provinsi ini menunjukkan bahwa 65% pemuda Indonesia sebenarnya tertarik dengan isu-isu politik, namun 72% di antaranya mengaku memiliki pengetahuan politik yang terbatas. Faktor utama yang menyebabkan minimnya literasi politik adalah kurangnya pendidikan politik di sekolah (42%), informasi politik yang rumit (35%), dan polarisasi di media sosial (23%).",
    image: "/images/christina-wocintechchat-com-LQ1t-8Ms5PY-unsplash.jpg",
    date: "5 Desember 2023",
    category: "Riset",
    author: "Divisi Riset GMP",
    views: 876
  },
  {
    id: "6",
    title: "Direktur GMP Diundang sebagai Pembicara di Forum PBB",
    excerpt: "Dr. Budi Santoso berbagi pengalaman GMP dalam forum internasional.",
    content: "Direktur Eksekutif Generasi Melek Politik (GMP), Dr. Budi Santoso, diundang sebagai salah satu pembicara utama dalam United Nations Youth Forum 2023 di New York, Amerika Serikat pada 28-30 November 2023. Dalam forum bertema 'Youth Participation in Democratic Processes' tersebut, Dr. Santoso membagikan pengalaman dan best practices GMP dalam meningkatkan partisipasi politik pemuda Indonesia. Menurutnya, pendekatan pendidikan politik yang mengkombinasikan metode online dan offline telah terbukti efektif menjangkau lebih dari 1 juta pemuda Indonesia dalam tiga tahun terakhir.",
    image: "/images/scott-graham-5fNmWej4tAA-unsplash.jpg",
    date: "2 Desember 2023",
    category: "Internasional",
    author: "Tim Komunikasi GMP",
    views: 732
  }
];

// Categories for filter
const categories = [
  "Event",
  "Teknologi",
  "Kemitraan",
  "Penghargaan",
  "Riset",
  "Internasional"
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  // Filter news
  const filteredNews = newsData.filter(news => {
    // Search filter
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
                          selectedCategories.includes(news.category);
    
    return matchesSearch && matchesCategory;
  });
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };
  
  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Berita & Updates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Dapatkan informasi terbaru seputar kegiatan, program, dan pencapaian Generasi Melek Politik dalam misi meningkatkan literasi politik di Indonesia.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                className="pl-10 py-6 text-base" 
                placeholder="Cari berita..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
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
                  
                  {(selectedCategories.length > 0 || searchQuery) && (
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
              {/* News Count & Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                  Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{filteredNews.length}</span> berita
                </p>
                
                {filteredNews.length === 0 && (
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
              
              {/* News Grid */}
              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredNews.map((news, index) => (
                    <FadeIn key={news.id} delay={150 * index} direction="up" duration={800}>
                      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300">
                        <Link href={`/news/${news.id}`} className="block h-48 relative overflow-hidden">
                          <Image 
                            src={news.image} 
                            alt={news.title} 
                            fill
                            className="object-cover transition-transform hover:scale-105 duration-300"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-24"></div>
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <Badge className="bg-[#5d992a] hover:bg-[#5d992a]/90">
                              {news.category}
                            </Badge>
                            <Badge variant="outline" className="bg-black/30 text-white border-transparent backdrop-blur-sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              {news.date}
                            </Badge>
                          </div>
                        </Link>
                        <CardContent className="p-4">
                          <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2">
                            {news.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                            {news.excerpt}
                          </p>
                          <CardFooter className="p-0 flex justify-between items-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {news.author} • {news.views} views
                            </div>
                            <CompanyButton asChild variant="ghost" colorVariant="green" className="h-8 px-2">
                              <Link href={`/news/${news.id}`} className="flex items-center gap-1">
                                Baca Selengkapnya
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </CompanyButton>
                          </CardFooter>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              ) : (
                <FadeIn>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-10 text-center">
                    <div className="flex flex-col items-center max-w-md mx-auto">
                      <X className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white mb-2">
                        Tidak Ada Berita
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Kami tidak dapat menemukan berita yang sesuai dengan filter yang Anda pilih. Coba ubah kriteria pencarian Anda.
                      </p>
                      <CompanyButton onClick={clearFilters} variant="outline" colorVariant="blue" className="gap-2">
                        <X className="h-4 w-4" />
                        Reset Filter
                      </CompanyButton>
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#5d992a]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Dapatkan Update Terbaru
              </h2>
              <p className="text-white/80 mb-6">
                Berlangganan newsletter kami untuk mendapatkan informasi terbaru tentang kegiatan dan program Generasi Melek Politik.
              </p>
              <div className="flex flex-wrap gap-4">
                <CompanyButton variant="solid" colorVariant="yellow" className="bg-white gap-2">
                  <Mail className="h-4 w-4" />
                  Berlangganan
                </CompanyButton>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <Image 
                src="/images/newsletter-illustration.svg" 
                alt="Newsletter Illustration" 
                width={300} 
                height={300}
                className="max-w-[250px] md:max-w-[300px]"
              />
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
} 