"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  CalendarDays, 
  CalendarClock, 
  Sparkles
} from "lucide-react";
import { FadeIn } from "@/components/animation/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";

// Featured events
const featuredEvents = [
  {
    id: 1,
    title: "Democracy Festival 2023",
    description: "Festival tahunan yang merayakan demokrasi dengan berbagai kegiatan interaktif, pameran, dan diskusi untuk semua kalangan masyarakat.",
    date: "15-17 Agustus 2023",
    time: "09:00 - 21:00",
    location: "JCC, Jakarta",
    image: "/events/democracy-festival.jpg",
    category: "Festival",
    isPremium: true,
    isPopular: true,
    attendees: 2500,
  },
  {
    id: 2,
    title: "Workshop Pemantau Pemilu",
    description: "Pelatihan intensif untuk menjadi pemantau pemilu yang berkompeten dalam mendukung pelaksanaan proses pemilu yang demokratis dan transparan.",
    date: "23-24 Juli 2023",
    time: "09:00 - 16:00",
    location: "Hotel Mulia, Makassar",
    image: "/events/election-observer.jpg",
    category: "Workshop",
    isPremium: false,
    isPopular: true,
    attendees: 150,
  },
  {
    id: 3,
    title: "Seminar: Politik di Era Digital",
    description: "Diskusi mendalam tentang transformasi politik di era digital dan bagaimana media sosial mempengaruhi partisipasi politik generasi muda.",
    date: "5 Juli 2023",
    time: "13:00 - 17:00",
    location: "Universitas Gadjah Mada, Yogyakarta",
    image: "/events/digital-politics.jpg",
    category: "Seminar",
    isPremium: false,
    isPopular: false,
    attendees: 300,
  },
];

// Upcoming events
const upcomingEvents = [
  {
    id: 4,
    title: "Workshop Politik Daerah",
    description: "Workshop tentang dinamika politik lokal dan peran pemuda dalam pemerintahan daerah.",
    date: "15 Juni 2023",
    time: "09:00 - 16:00",
    location: "Balai Kota, Yogyakarta",
    image: "/events/workshop.jpg",
    category: "Workshop",
    isPremium: false,
    isUpcoming: true,
    remainingDays: 12,
  },
  {
    id: 5,
    title: "Peluncuran Digital Democracy Initiative",
    description: "Acara peluncuran program inovatif untuk meningkatkan partisipasi politik melalui teknologi digital.",
    date: "20 Juni 2023",
    time: "10:00 - 12:00",
    location: "Hotel Indonesia Kempinski, Jakarta",
    image: "/events/digital-launch.jpg",
    category: "Peluncuran",
    isPremium: true,
    isUpcoming: true,
    remainingDays: 17,
  },
  {
    id: 6,
    title: "Seminar: Pemuda dan Kebijakan Publik",
    description: "Diskusi tentang peran pemuda dalam proses pengambilan kebijakan publik dan cara efektif menyuarakan aspirasi.",
    date: "2 Juli 2023",
    time: "13:00 - 16:00",
    location: "Universitas Airlangga, Surabaya",
    image: "/events/seminar.jpg",
    category: "Seminar",
    isPremium: false,
    isUpcoming: true,
    remainingDays: 29,
  },
  {
    id: 7,
    title: "Politik dan Seni: Pameran Fotografi",
    description: "Pameran fotografi yang menampilkan potret perjalanan politik Indonesia melalui lensa para fotografer muda.",
    date: "10-15 Juli 2023",
    time: "10:00 - 20:00",
    location: "Galeri Nasional Indonesia, Jakarta",
    image: "/events/photography.jpg",
    category: "Pameran",
    isPremium: false,
    isUpcoming: true,
    remainingDays: 37,
  },
  {
    id: 8,
    title: "Youth Parliament Simulation",
    description: "Simulasi parlemen yang memberikan pengalaman langsung tentang proses legislatif dan pembuatan kebijakan.",
    date: "25-26 Juli 2023",
    time: "08:00 - 17:00",
    location: "Gedung DPR/MPR, Jakarta",
    image: "/events/youth-parliament.jpg",
    category: "Simulasi",
    isPremium: true,
    isUpcoming: true,
    remainingDays: 52,
  },
];

// Past events
const pastEvents = [
  {
    id: 9,
    title: "Diskusi Politik & Kopi",
    description: "Diskusi santai tentang isu-isu politik terkini sambil menikmati kopi dari berbagai daerah Indonesia.",
    date: "5 Mei 2023",
    location: "Filosofi Kopi, Jakarta",
    image: "/events/coffee-discussion.jpg",
    category: "Diskusi",
  },
  {
    id: 10,
    title: "Workshop Komunikasi Politik",
    description: "Pelatihan tentang komunikasi politik efektif untuk aktivis dan pemimpin muda.",
    date: "15 April 2023",
    location: "Hotel Santika, Bandung",
    image: "/events/communication-workshop.jpg",
    category: "Workshop",
  },
  {
    id: 11,
    title: "Politik dalam Film: Pemutaran & Diskusi",
    description: "Pemutaran film politik diikuti dengan diskusi mendalam tentang representasi isu sosial-politik dalam sinema.",
    date: "25 Maret 2023",
    location: "Kinosaurus, Jakarta",
    image: "/events/film-screening.jpg",
    category: "Pemutaran Film",
  },
  {
    id: 12,
    title: "Seminar Kepemimpinan Muda",
    description: "Seminar tentang pengembangan kepemimpinan politik bagi generasi muda Indonesia.",
    date: "10 Maret 2023",
    location: "Universitas Indonesia, Depok",
    image: "/events/leadership-seminar.jpg",
    category: "Seminar",
  },
  {
    id: 13,
    title: "Konferensi Politik Luar Negeri",
    description: "Konferensi tentang dinamika politik internasional dan peran Indonesia dalam kancah global.",
    date: "20-21 Februari 2023",
    location: "Hotel Borobudur, Jakarta",
    image: "/events/international-conference.jpg",
    category: "Konferensi",
  },
  {
    id: 14,
    title: "Lokakarya Advokasi Kebijakan",
    description: "Pelatihan praktis tentang teknik advokasi kebijakan untuk mendorong perubahan sistemik.",
    date: "5 Februari 2023",
    location: "Hotel Aston, Makassar",
    image: "/events/advocacy-workshop.jpg",
    category: "Lokakarya",
  },
];

// Event categories
const eventCategories = [
  "Semua",
  "Seminar",
  "Workshop",
  "Diskusi",
  "Konferensi",
  "Festival",
  "Pameran",
  "Simulasi",
  "Peluncuran",
];

// Event locations
const eventLocations = [
  "Semua Lokasi",
  "Jakarta",
  "Yogyakarta",
  "Surabaya",
  "Bandung",
  "Makassar",
  "Medan",
  "Bali",
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <PublicPageLayout>
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[url('/images/pattern-dots.svg')] bg-repeat"></div>
          </div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn delay={100} direction="up" duration={800}>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Acara <span className="text-emerald-300">& Kegiatan</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-blue-50 mb-8 max-w-xl">
                  Ikuti berbagai acara edukatif dan inspiratif yang kami selenggarakan untuk meningkatkan partisipasi politik generasi muda.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Acara Mendatang
                  </Button>
                  <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white/30 text-white">
                    Daftar Event
                  </Button>
                </div>
              </FadeIn>
              
              <FadeIn delay={300} direction="up" duration={800} className="hidden lg:block">
                <div className="relative h-60 lg:h-96 w-full rounded-xl overflow-hidden">
                  <Image 
                    src="/images/getty-images-C3gjLSgTKNw-unsplash.jpg" 
                    alt="Events Collage" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                      Acara & <span className="text-emerald-400">Kegiatan</span>
                    </h2>
                    <p className="font-body text-white/80 text-sm sm:text-base md:text-lg max-w-2xl">
                      Temukan dan ikuti berbagai kegiatan Generasi Melek Politik di seluruh Indonesia
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search events..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
              
              <div className="flex gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category, index) => (
                      <SelectItem key={index} value={category.toLowerCase().replace(/\s+/g, '-')}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all-locations">
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {eventLocations.map((location, index) => (
                      <SelectItem key={index} value={location.toLowerCase().replace(/\s+/g, '-')}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Events Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    Featured Events
                  </h2>
                  <p className="font-body text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                    Acara-acara unggulan kami yang dirancang untuk memberikan pengalaman dan pengetahuan politik yang mendalam
                  </p>
                </div>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event, index) => (
                <FadeIn key={index} delay={150 * index} direction="up" duration={800}>
                  <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <AspectRatio ratio={16/9}>
                        <Image 
                          src={event.image} 
                          alt={event.title} 
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                      {event.isPremium && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium">
                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                            Premium
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-transparent">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                          {event.title}
                        </h3>
                        {event.isPopular && (
                          <Badge variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-400">
                            Popular
                          </Badge>
                        )}
                      </div>
                      
                      <p className="font-body text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">{event.attendees}+ peserta terdaftar</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                              <DialogTitle>{event.title}</DialogTitle>
                              <DialogDescription>
                                {event.category} • {event.date}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="relative h-[200px] w-full my-4 rounded-md overflow-hidden">
                              <Image 
                                src={event.image} 
                                alt={event.title} 
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-4">
                              <p className="text-gray-600 dark:text-gray-300">
                                {event.description}
                              </p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <Calendar className="h-4 w-4 text-emerald-500" />
                                  <span className="text-sm">{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <Clock className="h-4 w-4 text-emerald-500" />
                                  <span className="text-sm">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <MapPin className="h-4 w-4 text-emerald-500" />
                                  <span className="text-sm">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <Users className="h-4 w-4 text-emerald-500" />
                                  <span className="text-sm">{event.attendees}+ peserta terdaftar</span>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button className="w-full">Daftar Event</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                          Daftar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* All Events Tab Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Upcoming & Past Events
                </h2>
                <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300">
                  Jelajahi acara-acara kami yang akan datang dan yang telah diselenggarakan sebelumnya
                </p>
              </div>
            </FadeIn>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white dark:bg-gray-900 p-1">
                  <TabsTrigger 
                    value="upcoming"
                    className="flex items-center gap-1.5 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-300"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Upcoming Events
                  </TabsTrigger>
                  <TabsTrigger 
                    value="past"
                    className="flex items-center gap-1.5 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-300"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Past Events
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {upcomingEvents
                    .filter(event => 
                      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      event.location.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((event, index) => (
                      <FadeIn key={index} delay={100 * index} direction="up" duration={800}>
                        <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300">
                          <div className="relative">
                            <AspectRatio ratio={3/2}>
                              <Image 
                                src={event.image} 
                                alt={event.title} 
                                fill
                                className="object-cover"
                              />
                            </AspectRatio>
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                                {event.remainingDays} days left
                              </Badge>
                            </div>
                            <div className="absolute top-3 left-3">
                              <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-transparent">
                                {event.category}
                              </Badge>
                            </div>
                            {event.isPremium && (
                              <div className="absolute bottom-3 right-3">
                                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium">
                                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                                  Premium
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          <CardContent className="p-5">
                            <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-2">
                              {event.title}
                            </h3>
                            
                            <p className="font-body text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm">{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm">{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm">{event.location}</span>
                              </div>
                            </div>
                            
                            <Button variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                              Detail & Registration
                            </Button>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pastEvents
                    .filter(event => 
                      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      event.location.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((event, index) => (
                      <FadeIn key={index} delay={100 * index} direction="up" duration={800}>
                        <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 group">
                          <div className="relative">
                            <AspectRatio ratio={16/9}>
                              <Image 
                                src={event.image} 
                                alt={event.title} 
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              />
                            </AspectRatio>
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                            <div className="absolute top-3 left-3">
                              <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-transparent">
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <CardContent className="p-5">
                            <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-2">
                              {event.title}
                            </h3>
                            
                            <p className="font-body text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm">{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm">{event.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <FadeIn direction="up" duration={800}>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                  Organize an Event with Us
                </h2>
                <p className="font-body text-lg text-white/90 mb-8">
                  Interested in organizing a political education event with Generasi Melek Politik? We collaborate with various organizations, universities, and communities.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Propose an Event
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Become a Volunteer
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
} 