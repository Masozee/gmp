"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Calendar,
  Share2,
  Download,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Eye,
  ArrowRight,
  FileText,
  BookOpen
} from "lucide-react";

// Publication data - this would normally come from API/database
// Using the same array as the list page for demo purposes
const publications = [
  {
    id: "1",
    title: "Memahami Sistem Pemilu Indonesia",
    excerpt: "Panduan komprehensif tentang sistem pemilihan umum di Indonesia, struktur, dan proses penyelenggaraannya.",
    content: "Panduan komprehensif tentang sistem pemilihan umum di Indonesia, struktur, dan proses penyelenggaraannya. Dalam publikasi ini, kami mengulas secara mendalam tentang berbagai aspek sistem pemilu di Indonesia, termasuk sejarah perkembangannya, struktur organisasi, dan proses penyelenggaraan pemilu yang demokratis.\n\nDalam bab pertama, kita akan mempelajari tentang sejarah Pemilu di Indonesia sejak tahun 1955 hingga era reformasi, dan bagaimana sistem pemilu berevolusi seiring dengan perubahan politik di tanah air. Kita akan menelaah tentang latar belakang dan konteks historis yang melandasi perkembangan sistem pemilu Indonesia.\n\nBab kedua akan fokus pada kerangka hukum dan regulasi pemilu. Kita akan membahas tentang UU Pemilu dan berbagai peraturan turunannya, termasuk peran lembaga-lembaga pengawas seperti Bawaslu dalam menjamin integritas pemilu.\n\nSelanjutnya, bab ketiga akan mengupas tentang sistem proporsional terbuka yang digunakan dalam pemilihan legislatif di Indonesia. Kita akan menganalisis kelebihan dan kelemahan sistem ini, serta membandingkannya dengan sistem-sistem lain yang digunakan di berbagai negara.\n\nDalam bab keempat, kita akan berfokus pada pemilihan presiden dan pilkada, termasuk mekanisme pemilihan langsung dan threshold yang ditetapkan. Kita juga akan membahas dinamika politik yang muncul dalam kontestasi elektoral di tingkat nasional dan daerah.\n\nPada bab kelima, kami akan mengulas tentang partisipasi pemilih dan inklusi elektoral. Kita akan membahas tantangan dalam meningkatkan partisipasi pemilih, khususnya di kalangan pemilih pemula, serta upaya-upaya untuk memastikan akses yang setara bagi semua kelompok masyarakat dalam proses pemilu.\n\nTerakhir, bab penutup akan memberikan refleksi tentang masa depan sistem pemilu Indonesia, termasuk potensi reformasi dan inovasi yang dapat meningkatkan kualitas demokrasi elektoral di Indonesia.",
    image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
    date: "15 Mei 2023",
    author: "Tim Riset GMP",
    category: "Pemilu",
    tags: ["pemilu", "demokrasi", "edukasi"],
    type: "E-Book",
    views: 1520,
    likes: 342,
    comments: 57,
    relatedPublications: ["2", "4", "8"]
  },
  {
    id: "2",
    title: "Partisipasi Politik Generasi Muda",
    excerpt: "Analisis mendalam tentang peran dan potensi generasi muda Indonesia dalam lanskap politik di era digital.",
    content: "Analisis mendalam tentang peran dan potensi generasi muda Indonesia dalam lanskap politik di era digital. Publikasi ini mengkaji data statistik terbaru tentang partisipasi politik pemuda, faktor-faktor yang mempengaruhi tingkat partisipasi, serta strategi untuk meningkatkan keterlibatan generasi muda dalam proses demokrasi.\n\nBagian pertama dari publikasi ini menyajikan data komprehensif tentang demografi pemilih muda di Indonesia, termasuk profil sosial-ekonomi, tingkat pendidikan, dan distribusi geografis. Data ini menjadi pijakan penting untuk memahami potensi dan tantangan partisipasi politik generasi muda.\n\nPada bagian kedua, kami mengeksplorasi berbagai bentuk partisipasi politik pemuda yang melampaui kerangka pemilu konvensional. Ini mencakup aktivisme digital, gerakan sosial, dan bentuk-bentuk partisipasi non-elektoral lainnya yang semakin populer di kalangan anak muda.\n\nBagian ketiga menganalisis faktor-faktor yang mendorong dan menghambat partisipasi politik pemuda. Kami membahas pengaruh pendidikan politik, akses informasi, peran media sosial, serta faktor sosial-ekonomi yang membentuk pola partisipasi politik generasi muda.\n\nDalam bagian keempat, kami menyajikan studi kasus terkait inisiatif-inisiatif yang berhasil meningkatkan partisipasi politik pemuda di berbagai daerah. Ini mencakup program pendidikan pemilih, kampanye kreatif, dan platform digital yang dirancang khusus untuk melibatkan generasi muda dalam proses politik.\n\nBagian kelima membahas implikasi kebijakan dari temuan-temuan penelitian ini. Kami mengajukan rekomendasi konkret untuk berbagai pemangku kepentingan, termasuk pemerintah, partai politik, organisasi masyarakat sipil, dan lembaga pendidikan, untuk mendorong partisipasi politik yang lebih aktif dan bermakna dari generasi muda.\n\nKesimpulan publikasi ini menekankan pentingnya memahami aspirasi dan cara berpikir generasi muda dalam upaya memperkuat demokrasi Indonesia. Dengan melibatkan pemuda secara substantif dalam proses politik, kita dapat membangun fondasi yang lebih kuat untuk masa depan demokrasi yang inklusif dan responsif.",
    image: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg",
    date: "22 Juni 2023",
    author: "Dr. Siti Nurhayati",
    category: "Partisipasi Politik",
    tags: ["generasi muda", "partisipasi", "politik"],
    type: "Jurnal",
    views: 2400,
    likes: 520,
    comments: 83,
    relatedPublications: ["1", "3", "7"]
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
    views: 3150,
    likes: 678,
    comments: 124,
    relatedPublications: ["2", "8", "4"]
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
    views: 4280,
    likes: 892,
    comments: 165,
    relatedPublications: ["1", "2", "5"]
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
    views: 1860,
    likes: 405,
    comments: 72,
    relatedPublications: ["4", "6", "8"]
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
    views: 2150,
    likes: 327,
    comments: 58,
    relatedPublications: ["1", "5", "7"]
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
    views: 3420,
    likes: 715,
    comments: 128,
    relatedPublications: ["2", "6", "8"]
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
    views: 1980,
    likes: 437,
    comments: 81,
    relatedPublications: ["3", "5", "7"]
  }
];

export default function PublicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params object using React.use()
  const resolvedParams = React.use(params);
  const publicationId = resolvedParams.id;

  const [publication, setPublication] = useState<typeof publications[0] | null>(null);
  const [relatedPubs, setRelatedPubs] = useState<typeof publications>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    // Find the publication by ID
    const pub = publications.find(p => p.id === publicationId);
    setPublication(pub || null);
    
    // Find related publications
    if (pub && pub.relatedPublications) {
      const related = publications.filter(p => pub.relatedPublications.includes(p.id));
      setRelatedPubs(related);
    }
  }, [publicationId]);
  
  // Format the content with paragraphs
  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-6 font-body leading-relaxed text-gray-700 dark:text-gray-300">
        {paragraph}
      </p>
    ));
  };
  
  if (!publication) {
    return (
      <PublicPageLayout>
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h1 className="font-heading text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Publikasi tidak ditemukan
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Publikasi yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <Link href="/publications">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke daftar publikasi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

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
              <div className="flex flex-col items-center text-center">
                <Link 
                  href="/publications" 
                  className="flex items-center gap-2 text-[#e5b546] hover:text-[#e5b546]/80 mb-6 self-center"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali ke daftar publikasi</span>
                </Link>
                <Badge className="mb-4 bg-[#5d992a] hover:bg-[#5d992a]/90">
                  {publication.type}
                </Badge>
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-4xl">
                  {publication.title}
                </h1>
                <div className="flex items-center gap-3 text-blue-100 mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {publication.date}
                  </span>
                  <span>•</span>
                  <span>Oleh: {publication.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {publication.views} kali dibaca
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-[#e5b546] text-white hover:bg-[#e5b546]/10 gap-2">
                    <Share2 className="h-4 w-4" />
                    Bagikan
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#e5b546] text-white hover:bg-[#e5b546]/10 gap-2">
                    <Download className="h-4 w-4" />
                    Unduh
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
        
        {/* Featured Image */}
        <div className="container mx-auto px-6 max-w-7xl relative -mt-16 mb-16">
          <FadeIn delay={200} direction="up" duration={800}>
            <div className="relative h-96 md:h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
              <Image 
                src={publication.image} 
                alt={publication.title} 
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
        
        {/* Content Section */}
        <section className="py-10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <FadeIn delay={300} direction="up" duration={800}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-p:text-gray-700 dark:prose-p:text-gray-300">
                      {formatContent(publication.content)}
                    </div>
                    
                    <Separator className="my-8" />
                    
                    {/* Tags */}
                    <div className="mb-8">
                      <h3 className="font-heading text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Tag
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {publication.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="bg-[#e5b546]/20 text-[#5d992a] hover:bg-[#e5b546]/30 dark:bg-[#e5b546]/10 dark:text-[#e5b546] dark:hover:bg-[#e5b546]/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Engagement */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`gap-2 ${isLiked ? 'bg-[#d45484]/10 text-[#d45484] border-[#d45484]/50 dark:bg-[#d45484]/30 dark:text-[#d45484]/90 dark:border-[#d45484]/80' : ''}`}
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {isLiked ? publication.likes + 1 : publication.likes} Suka
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {publication.comments} Komentar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`gap-2 ${isBookmarked ? 'bg-[#3cb1dc]/10 text-[#3cb1dc] border-[#3cb1dc]/50 dark:bg-[#3cb1dc]/30 dark:text-[#3cb1dc]/90 dark:border-[#3cb1dc]/80' : ''}`}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                      >
                        <Bookmark className="h-4 w-4" />
                        {isBookmarked ? 'Tersimpan' : 'Simpan'}
                      </Button>
                    </div>
                  </div>
                </FadeIn>
                
                {/* Author Info */}
                <FadeIn delay={400} direction="up" duration={800}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mt-8">
                    <h3 className="font-heading text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                      Tentang Penulis
                    </h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-[#5d992a]/20 text-[#5d992a] text-lg font-medium">
                          {publication.author.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-heading font-semibold text-gray-900 dark:text-white mb-1">
                          {publication.author}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {publication.category === "Gender dan Politik" ? "Pakar Politik Gender" : 
                           publication.category === "Kebijakan Publik" ? "Analis Kebijakan Publik" :
                           "Peneliti Politik"}
                        </p>
                        <Link 
                          href="#" 
                          className="text-[#5d992a] hover:text-[#5d992a]/80 dark:text-[#5d992a] dark:hover:text-[#5d992a]/80 text-sm font-medium"
                        >
                          Lihat semua publikasi
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3">
                {/* Related Publications */}
                <FadeIn delay={300} direction="up" duration={800}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-24">
                    <h3 className="font-heading text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                      Publikasi Terkait
                    </h3>
                    <div className="space-y-6">
                      {relatedPubs.map((pub) => (
                        <div key={pub.id} className="flex gap-4">
                          <div className="w-24 h-20 relative flex-shrink-0 rounded-md overflow-hidden">
                            <Image 
                              src={pub.image} 
                              alt={pub.title} 
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Link href={`/publications/${pub.id}`}>
                              <h4 className="font-heading font-semibold text-sm mb-1 text-gray-900 dark:text-white hover:text-[#5d992a] dark:hover:text-[#5d992a] line-clamp-2">
                                {pub.title}
                              </h4>
                            </Link>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{pub.date}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {pub.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <Link href="/publications">
                        <Button variant="outline" className="w-full gap-2 hover:text-[#5d992a] hover:border-[#5d992a]">
                          Lihat semua publikasi
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
                
                {/* Category Info */}
                <FadeIn delay={400} direction="up" duration={800}>
                  <div className="bg-gradient-to-r from-[#5d992a] to-[#5d992a]/90 text-white rounded-xl p-6 mt-6">
                    <h3 className="font-heading text-lg font-semibold mb-4">
                      Kategori: {publication.category}
                    </h3>
                    <p className="text-[#e5b546] text-sm mb-6">
                      Telusuri publikasi lainnya dalam kategori {publication.category.toLowerCase()} untuk memperdalam pemahaman Anda.
                    </p>
                    <Link href={`/publications?category=${publication.category}`}>
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 gap-2">
                        <FileText className="h-4 w-4" />
                        Lihat Kategori
                      </Button>
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
} 