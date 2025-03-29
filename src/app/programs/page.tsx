"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Users, Globe, Filter, Clock, MapPin, ArrowRight, Layers, BookOpen, School, HandHelping, PenTool } from "lucide-react";
import { FadeIn } from "@/components/animation/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";

// Featured programs data
const featuredPrograms = [
  {
    title: "Sekolah Politik Muda",
    description: "Program pelatihan intensif 3 bulan untuk pemuda yang ingin memahami sistem politik dan berpartisipasi aktif dalam proses demokrasi.",
    image: "/programs/sekolah-politik.jpg",
    category: "Edukasi",
    status: "Sedang Berjalan",
    participants: 250,
    locations: ["Jakarta", "Surabaya", "Bandung", "Makassar", "Medan"],
    progress: 75,
    icon: <School className="h-6 w-6" />,
  },
  {
    title: "Digital Democracy Initiative",
    description: "Program yang fokus pada penggunaan teknologi digital untuk meningkatkan partisipasi politik dan kesadaran demokrasi di era digital.",
    image: "/programs/digital-democracy.jpg",
    category: "Digital",
    status: "Sedang Berjalan",
    participants: 1200,
    locations: ["Online", "Seluruh Indonesia"],
    progress: 60,
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "Lokalitas: Politik Daerah",
    description: "Workshop dan diskusi tentang isu-isu politik lokal dan pentingnya partisipasi pemuda dalam pemerintahan daerah.",
    image: "/programs/lokalitas.jpg",
    category: "Workshop",
    status: "Pendaftaran Dibuka",
    participants: 500,
    locations: ["15 Kota di Indonesia"],
    progress: 40,
    icon: <MapPin className="h-6 w-6" />,
  },
];

// Program categories
const programCategories = [
  {
    name: "Semua",
    value: "all",
    count: 12,
  },
  {
    name: "Edukasi",
    value: "education",
    count: 5,
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    name: "Workshop",
    value: "workshop",
    count: 3,
    icon: <Users className="h-4 w-4" />,
  },
  {
    name: "Digital",
    value: "digital",
    count: 2,
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "Advokasi",
    value: "advocacy",
    count: 2,
    icon: <HandHelping className="h-4 w-4" />,
  },
];

// All programs data
const allPrograms = [
  {
    title: "Sekolah Politik Muda",
    description: "Program pelatihan intensif 3 bulan untuk pemuda yang ingin memahami sistem politik dan berpartisipasi aktif dalam proses demokrasi.",
    image: "/programs/sekolah-politik.jpg",
    category: "Edukasi",
    status: "Sedang Berjalan",
    icon: <School className="h-5 w-5" />,
  },
  {
    title: "Digital Democracy Initiative",
    description: "Program yang fokus pada penggunaan teknologi digital untuk meningkatkan partisipasi politik dan kesadaran demokrasi di era digital.",
    image: "/programs/digital-democracy.jpg",
    category: "Digital",
    status: "Sedang Berjalan",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    title: "Lokalitas: Politik Daerah",
    description: "Workshop dan diskusi tentang isu-isu politik lokal dan pentingnya partisipasi pemuda dalam pemerintahan daerah.",
    image: "/programs/lokalitas.jpg",
    category: "Workshop",
    status: "Pendaftaran Dibuka",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Policy Writing Academy",
    description: "Pelatihan penulisan kebijakan publik untuk pemuda, dengan fokus pada analisis kebijakan dan rekomendasi berbasis data.",
    image: "/programs/policy-writing.jpg",
    category: "Edukasi",
    status: "Akan Datang",
    icon: <PenTool className="h-5 w-5" />,
  },
  {
    title: "Election Observer Training",
    description: "Pelatihan untuk menjadi pemantau pemilu yang kompeten dan berintegritas dalam mendukung proses pemilu yang demokratis.",
    image: "/programs/election-observer.jpg",
    category: "Edukasi",
    status: "Pendaftaran Dibuka",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Youth Parliament",
    description: "Simulasi parlemen yang memberikan kesempatan bagi pemuda untuk memahami proses legislatif dan pengambilan kebijakan.",
    image: "/programs/youth-parliament.jpg",
    category: "Workshop",
    status: "Akan Datang",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: "Democracy Festival",
    description: "Festival tahunan yang menampilkan panel diskusi, pameran, dan aktivitas interaktif tentang demokrasi dan politik.",
    image: "/programs/democracy-festival.jpg",
    category: "Digital",
    status: "Akan Datang",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Political Literacy Campaign",
    description: "Kampanye digital untuk meningkatkan literasi politik di kalangan pemuda melalui konten edukatif di berbagai platform.",
    image: "/programs/political-literacy.jpg",
    category: "Digital",
    status: "Sedang Berjalan",
    icon: <BookOpen className="h-5 w-5" />,
  },
];

// Program statistics
const programStats = [
  {
    label: "Program Aktif",
    value: "12",
    icon: <Layers className="h-7 w-7 text-emerald-500" />,
  },
  {
    label: "Peserta Terdaftar",
    value: "5,000+",
    icon: <Users className="h-7 w-7 text-emerald-500" />,
  },
  {
    label: "Cakupan Daerah",
    value: "34",
    sub: "Provinsi",
    icon: <MapPin className="h-7 w-7 text-emerald-500" />,
  },
  {
    label: "Mitra Program",
    value: "50+",
    icon: <HandHelping className="h-7 w-7 text-emerald-500" />,
  },
];

// Upcoming events
const upcomingEvents = [
  {
    title: "Workshop Politik Daerah",
    location: "Yogyakarta",
    date: "15 Juni 2023",
    image: "/events/workshop.jpg",
  },
  {
    title: "Peluncuran Digital Democracy Initiative",
    location: "Jakarta",
    date: "20 Juni 2023",
    image: "/events/digital-launch.jpg",
  },
  {
    title: "Seminar: Pemuda dan Kebijakan Publik",
    location: "Surabaya",
    date: "2 Juli 2023",
    image: "/events/seminar.jpg",
  },
];

export default function ProgramsPage() {
  return (
    <PublicPageLayout>
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="relative w-full rounded-xl overflow-hidden">
              <Image 
                src="/images/frank-mouland-e4mYPf_JUIk-unsplash.png" 
                alt="Program Background" 
                width={600}
                height={300}
                className="object-cover w-full h-60"
              />
            </div>
          </div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn delay={100} direction="up" duration={800}>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Program <span className="text-emerald-300">Yang Berdampak</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-emerald-50 mb-8 max-w-xl">
                  Mendorong generasi muda Indonesia untuk terlibat aktif dalam politik melalui program-program edukatif dan transformatif.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary" className="bg-white hover:bg-gray-100 text-emerald-700">
                    Jelajahi Program
                  </Button>
                  <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white/30 text-white">
                    Cara Bergabung
                  </Button>
                </div>
              </FadeIn>
              
              <FadeIn delay={300} direction="up" duration={800} className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                      <Image 
                        src="/images/getty-images-C3gjLSgTKNw-unsplash.jpg" 
                        alt="Banner program Sekolah Politik Pemuda" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-56 rounded-lg overflow-hidden">
                      <Image 
                        src="/images/planet-volumes-iPxknAs9h3Y-unsplash.jpg" 
                        alt="Workshop Politik" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-10">
                    <div className="relative h-56 rounded-lg overflow-hidden">
                      <Image 
                        src="/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg" 
                        alt="Digital Democracy" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <Image 
                        src="/images/wildan-kurniawan-m0JLVP04Heo-unsplash.png" 
                        alt="Youth Parliament" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Featured Programs */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    Program Unggulan
                  </h2>
                  <p className="font-body text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                    Program-program kami dirancang untuk meningkatkan kesadaran politik dan mendorong partisipasi aktif pemuda dalam demokrasi.
                  </p>
                </div>
                <Link href="#all-programs" className="mt-4 md:mt-0 font-heading text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-2 transition-colors">
                  Lihat Semua Program
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPrograms.map((program, index) => (
                <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                  <Card className="overflow-hidden h-full shadow-md hover:shadow-xl transition-all duration-300 border-none bg-white dark:bg-gray-800">
                    <div className="relative h-56 w-full">
                      <Image 
                        src={program.image} 
                        alt={program.title} 
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/80 text-emerald-700 hover:bg-white dark:bg-gray-800/80 dark:text-emerald-400 dark:hover:bg-gray-800">
                          {program.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-full bg-emerald-100/80 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {program.icon}
                        </div>
                        <Badge variant={program.status === "Sedang Berjalan" ? "default" : program.status === "Pendaftaran Dibuka" ? "outline" : "secondary"} 
                          className={program.status === "Sedang Berjalan" ? "bg-emerald-500 hover:bg-emerald-600" : 
                                    program.status === "Pendaftaran Dibuka" ? "border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20" : 
                                    "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}>
                          {program.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {program.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <p className="font-body text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {program.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Kemajuan Program</p>
                          <div className="flex items-center gap-2">
                            <Progress value={program.progress} className="h-2" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{program.progress}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">{program.participants}</span> peserta terdaftar
                          </p>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {program.locations.join(', ')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-4">
                      <Link href={`/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}`} className="w-full">
                        <Button variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                          Detail Program
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Program Statistics */}
        <section className="py-16 bg-emerald-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
                {programStats.map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                    <div className="mb-4">
                      {stat.icon}
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="font-body text-gray-600 dark:text-gray-400 text-sm">
                      {stat.label}
                    </p>
                    {stat.sub && (
                      <p className="font-body text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                        {stat.sub}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* All Programs */}
        <section id="all-programs" className="py-16 bg-white dark:bg-gray-900 scroll-mt-32">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Semua Program Kami
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Jelajahi berbagai program yang kami tawarkan untuk meningkatkan literasi politik generasi muda
                </p>
              </div>
            </FadeIn>
            
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="flex flex-wrap bg-gray-100 dark:bg-gray-800 p-1">
                  {programCategories.map((category) => (
                    <TabsTrigger 
                      key={category.value} 
                      value={category.value}
                      className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                      {category.icon && category.icon}
                      {category.name}
                      <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-600 rounded-full px-1.5 py-0.5">
                        {category.count}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allPrograms.map((program, index) => (
                    <FadeIn key={index} delay={100 * index} direction="up" duration={800}>
                      <Link href={`/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-800 cursor-pointer">
                          <div className="relative h-48 w-full">
                            <Image 
                              src={program.image} 
                              alt={program.title} 
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                              <Badge variant="outline" className="bg-black/50 text-white border-transparent backdrop-blur-sm">
                                {program.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                {program.icon}
                              </div>
                              <Badge variant={program.status === "Sedang Berjalan" ? "default" : program.status === "Pendaftaran Dibuka" ? "outline" : "secondary"} 
                                className={`text-xs ${program.status === "Sedang Berjalan" ? "bg-emerald-500 hover:bg-emerald-600" : 
                                          program.status === "Pendaftaran Dibuka" ? "border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20" : 
                                          "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`}>
                                {program.status}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                              {program.title}
                            </CardTitle>
                          </CardHeader>
                          
                          <CardContent>
                            <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                              {program.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>
              
              {/* Add filter tabs for other categories */}
              {programCategories.slice(1).map((category) => (
                <TabsContent key={category.value} value={category.value}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allPrograms
                      .filter(program => program.category.toLowerCase() === category.name.toLowerCase())
                      .map((program, index) => (
                        <FadeIn key={index} delay={100 * index} direction="up" duration={800}>
                          <Link href={`/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-800 cursor-pointer">
                              <div className="relative h-48 w-full">
                                <Image 
                                  src={program.image} 
                                  alt={program.title} 
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                  <Badge variant="outline" className="bg-black/50 text-white border-transparent backdrop-blur-sm">
                                    {program.category}
                                  </Badge>
                                </div>
                              </div>
                              
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    {program.icon}
                                  </div>
                                  <Badge variant={program.status === "Sedang Berjalan" ? "default" : program.status === "Pendaftaran Dibuka" ? "outline" : "secondary"} 
                                    className={`text-xs ${program.status === "Sedang Berjalan" ? "bg-emerald-500 hover:bg-emerald-600" : 
                                              program.status === "Pendaftaran Dibuka" ? "border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20" : 
                                              "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`}>
                                    {program.status}
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                  {program.title}
                                </CardTitle>
                              </CardHeader>
                              
                              <CardContent>
                                <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                  {program.description}
                                </CardDescription>
                              </CardContent>
                            </Card>
                          </Link>
                        </FadeIn>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    Acara Mendatang
                  </h2>
                  <p className="font-body text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                    Bergabunglah dengan kami di berbagai acara dan kegiatan edukatif yang akan datang
                  </p>
                </div>
                <Link href="/events" className="mt-4 md:mt-0 font-heading text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-2 transition-colors">
                  Lihat Semua Acara
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                  <Link href="/events" className="block group">
                    <div className="relative h-60 rounded-xl overflow-hidden">
                      <Image 
                        src={event.image} 
                        alt={event.title} 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <p className="text-emerald-300 flex items-center gap-2 mb-2 text-sm">
                          <CalendarClock className="h-4 w-4" />
                          {event.date}
                        </p>
                        <h3 className="font-heading text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-white/80 text-sm flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Join Program CTA */}
        <section className="py-20 bg-gradient-to-br from-emerald-800 to-emerald-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 mix-blend-overlay opacity-10">
            <Image 
              src="/images/pattern-bg.jpg" 
              alt="Background pattern" 
              fill
              className="object-cover"
            />
          </div>
          
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                  Bergabunglah dalam Program Kami
                </h2>
                <p className="font-body text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Jadilah bagian dari perubahan. Tingkatkan pengetahuan dan keterampilan politik Anda bersama Generasi Melek Politik.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
                    Daftar Sekarang
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Pelajari Persyaratan
                  </Button>
                </div>
                <p className="mt-6 text-white/70 text-sm">
                  Pendaftaran untuk program Sekolah Politik Muda dan Digital Democracy Initiative sedang dibuka
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
} 