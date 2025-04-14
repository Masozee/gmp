"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";
import { CompanyButton } from "@/components/ui/company-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the youth-oriented color palette
const YOUTH_COLORS = {
  yellow: "#fece5f",
  pink: "#eb6d93",
  blue: "#59c9f5",
  green: "#7baf3f"
};

export default function Home() {
  // For publications carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    if (currentIndex < publications.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const scrollPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Apply smooth scrolling when the index changes
  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / 3;
      // Start with the first visible card fully shown
      carouselRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // For quotes carousel
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Add navigation functions for quotes carousel
  const nextQuote = () => {
    if (quoteIndex < quotes.length - 1) {
      setQuoteIndex(quoteIndex + 1);
    }
  };

  const prevQuote = () => {
    if (quoteIndex > 0) {
      setQuoteIndex(quoteIndex - 1);
    }
  };

  // Sample data for organizations
  const organizations = [
    {
      name: "Indonesian Youth Organization",
      logo: "/logos/org1.svg",
    },
    {
      name: "Electoral Commission",
      logo: "/logos/org2.svg",
    },
    {
      name: "Ministry of Youth",
      logo: "/logos/org3.svg",
    },
    {
      name: "Democracy Initiative",
      logo: "/logos/org4.svg",
    },
  ];

  // Sample data for publications (adding a fifth publication)
  const publications = [
    {
      title: "Political Education for Youth",
      excerpt: "Essential political education topics every young Indonesian should understand.",
      image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
      date: "April 12, 2023",
      url: "#",
    },
    {
      title: "Understanding Indonesian Electoral Systems",
      excerpt: "A comprehensive guide to how elections work in Indonesia.",
      image: "/images/getty-images-AoJ2_pyNoYc-unsplash.jpg",
      date: "May 15, 2023",
      url: "#",
    },
    {
      title: "Youth Participation in Politics",
      excerpt: "How young Indonesians can make a difference in the political landscape.",
      image: "/images/shubham-dhage-mjl0yIdSi18-unsplash.jpg",
      date: "June 22, 2023",
      url: "#",
    },
    {
      title: "Digital Activism in Modern Democracy",
      excerpt: "Leveraging social media for political awareness and change.",
      image: "/images/getty-images-C3gjLSgTKNw-unsplash.jpg",
      date: "August 10, 2023",
      url: "#",
    },
    {
      title: "Civic Engagement Strategies",
      excerpt: "Practical ways for youth to become politically active in their communities.",
      image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
      date: "September 5, 2023",
      url: "#",
    },
  ];

  // Sample data for quotes
  const quotes = [
    {
      text: "Joining Academia Politica Kalimantan has fueled my motivation to explore and understand Indonesia's current political landscape.",
      author: "Kristina Dina Osok",
      title: "Purna Prakarya Muda Indonesia, Papua Barat Daya",
      age: "24",
      image: "/kristina.png"
    },
    {
      text: "The Council of Gen-Z sparked dynamic discussions on South Sulawesi's environmental challenges, linking them to politics and policymaking—giving me a deeper understanding of the climate-politics connection.",
      author: "Adriansyah",
      title: "International Relations Student, UIN Alauddin Makassar",
      age: "20",
      image: "/adriansyah.png"
    },
    {
      text: "I gained a lot of knowledge, get lots of experience, and meet people from different backgrounds.",
      author: "Muhammad Ridho Aprihadi",
      title: "SMA SahabatQu, Yogyakarta",
      age: "15",
      image: "/ridho.png"
    },
    {
      text: "COGZ delivered powerful insights on climate change, Gen Z's role, and advocacy, with diverse voices shaping the discussion—especially on Gen Z's voice impact in Nusantara Capital City (IKN) development.",
      author: "Jumpa Perdana Putra",
      title: "Universitas Mulawarman, Samarinda, Kalimantan Timur",
      age: "18",
      image: "/jumpa.png"
    },
    {
      text: "Today's activity was both fun and eye-opening! I learned that creating regulations isn't just about drafting them—it involves approvals, debates, and trade-offs. As someone new to politics, I'm now eager to learn more!",
      author: "Alya Rivana Ananditri",
      title: "Universitas Pakuan, Bogor, Jawa Barat",
      age: "18",
      image: "/alya.png"
    }
  ];

  const issues = [
    {
      title: "Climate Change",
      description: "Advocating for environmental policies and youth involvement in climate action.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v19" /><path d="M5 12h14" /><path d="M12 7a5 5 0 0 0-5 5c0 2.76 2.24 5 5 5s5-2.24 5-5a5 5 0 0 0-5-5z" />
        </svg>
      ),
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Unemployment",
      description: "Supporting youth employment initiatives and economic empowerment programs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Shrinking Civic Space",
      description: "Protecting and expanding democratic spaces for youth participation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
        </svg>
      ),
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Lack of Political Representation",
      description: "Empowering youth to participate in political processes and decision-making.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" /><path d="M2 12h20" /><path d="m12 2 4 4" /><path d="m12 2-4 4" /><path d="m12 22-4-4" /><path d="m12 22 4-4" />
        </svg>
      ),
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/creative-christians-HN6uXG7GzTE-unsplash.jpg" 
            alt="Hero Background" 
            fill
            priority
            className="object-cover w-full"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 max-w-7xl pb-16 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-5xl">
            <FadeIn delay={300} direction="up" duration={800}>
              <h1 className="font-heading text-4xl md:text-6xl font-bold mb-3 leading-tight">
                <span style={{ color: YOUTH_COLORS.yellow }}>Generasi</span>{" "}
                <span style={{ color: YOUTH_COLORS.blue }}>Melek</span>{" "}
                <span style={{ color: YOUTH_COLORS.pink }}>Politik</span>
              </h1>
            </FadeIn>
            <FadeIn delay={600} direction="up" duration={800}>
              <p className="font-body text-lg md:text-xl max-w-2xl mb-6 text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                Empowering Indonesian youth through political education, awareness, and engagement.
              </p>
            </FadeIn>
            <FadeIn delay={900} direction="up" duration={800}>
              <div className="flex flex-col sm:flex-row gap-4">
                <CompanyButton asChild variant="solid" colorVariant="green">
                  <Link href="/about" className="px-6 py-2.5 font-heading font-medium text-base">
                    Learn More
                  </Link>
                </CompanyButton>
                <CompanyButton asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/join" className="px-6 py-2.5 font-heading font-medium text-base">
                    Join Our Movement
                  </Link>
                </CompanyButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Issues Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: YOUTH_COLORS.blue }}>
              Key Issues We Address
            </h2>
            <p className="font-body text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Our movement focuses on critical challenges facing Indonesian youth today
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {issues.map((issue, index) => (
              <FadeIn 
                key={index}
                direction="up"
                delay={300 + index * 100}
                duration={800}
              >
                <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow border-2" style={{ borderColor: index === 0 ? YOUTH_COLORS.green : index === 1 ? YOUTH_COLORS.blue : index === 2 ? YOUTH_COLORS.pink : YOUTH_COLORS.yellow, borderRadius: '16px' }}>
                  <div className={`w-12 h-12 rounded-lg ${issue.color} flex items-center justify-center mb-4`}>
                    {issue.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2" style={{ 
                    color: index === 0 ? YOUTH_COLORS.green : index === 1 ? YOUTH_COLORS.blue : index === 2 ? YOUTH_COLORS.pink : YOUTH_COLORS.yellow 
                  }}>
                    {issue.title}
                  </h3>
                  <p className="font-body text-gray-600 dark:text-gray-300 flex-1">
                    {issue.description}
                  </p>
                  <Badge variant="outline" className="mt-4 w-fit" style={{ 
                    borderColor: index === 0 ? YOUTH_COLORS.green : index === 1 ? YOUTH_COLORS.blue : index === 2 ? YOUTH_COLORS.pink : YOUTH_COLORS.yellow,
                    color: index === 0 ? YOUTH_COLORS.green : index === 1 ? YOUTH_COLORS.blue : index === 2 ? YOUTH_COLORS.pink : YOUTH_COLORS.yellow
                  }}>
                    Learn more
                  </Badge>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Image 1 */}
      <div className="absolute top-[60vh] right-10 w-48 h-48 md:w-64 md:h-64 z-10 opacity-90 transform rotate-3">
        <Image
          src="/Picture1.png"
          alt="Decorative Image 1"
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      {/* About Section */}
      <section className="py-20 relative overflow-hidden rounded-3xl" style={{ backgroundColor: YOUTH_COLORS.pink }}>
        {/* Floating Image 2 */}
        <div className="absolute -left-10 top-40 w-32 h-32 md:w-48 md:h-48 opacity-80 transform -rotate-3">
          <Image
            src="/Picture2.png"
            alt="Decorative Image 2"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <FadeIn className="md:w-1/2" direction="right" duration={800}>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                  About Generasi Melek Politik
                </h2>
                <div className="font-body text-lg text-white space-y-4">
                  <p>
                    Founded in 2020, Generasi Melek Politik (GMP) is a youth-led initiative aimed at increasing political literacy among Indonesian youth.
                  </p>
                  <p>
                    We believe that an informed citizenry is the foundation of a healthy democracy. Through educational programs, workshops, and digital content, we empower young people to understand political processes, become critical thinkers, and actively participate in civic life.
                  </p>
                  <p>
                    Our diverse team of volunteers across Indonesia works tirelessly to simplify complex political concepts and promote inclusive, fact-based political discourse.
                  </p>
                </div>
                <div className="mt-8">
                  <CompanyButton asChild variant="ghost" colorVariant="green" className="px-0">
                    <Link href="/about" className="font-heading font-medium flex items-center gap-2 text-white">
                      Read our full story
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Link>
                  </CompanyButton>
                </div>
              </FadeIn>
              <FadeIn className="md:w-1/2 relative h-80 md:h-96 w-full overflow-hidden" direction="left" duration={800}>
                <div className="h-full relative overflow-hidden" style={{ borderRadius: '24px', border: `6px solid ${YOUTH_COLORS.blue}`, transform: 'rotate(2deg)' }}>
                  <Image 
                    src="/Picture_bg.png" 
                    alt="Generasi Melek Politik" 
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 relative">
        {/* Floating Image 3 */}
        <div className="absolute right-0 bottom-20 w-40 h-40 md:w-56 md:h-56 opacity-70 transform rotate-6">
          <Image
            src="/Picture1.png"
            alt="Decorative Image 3"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2" style={{ color: YOUTH_COLORS.yellow }}>
                  Our Publications
                </h2>
                <p className="font-body text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  Explore our latest research, articles, and educational resources on Indonesian politics and civic engagement.
                </p>
              </div>
              
              {/* Navigation Arrows moved to top */}
              <div className="flex gap-2">
                <button 
                  onClick={scrollPrev}
                  className={`bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-all transform hover:scale-110 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                  disabled={currentIndex === 0}
                  aria-label="Previous publications"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={scrollNext}
                  className={`bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-all transform hover:scale-110 ${currentIndex >= publications.length - 3 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                  disabled={currentIndex >= publications.length - 3}
                  aria-label="Next publications"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </FadeIn>
          
          <div className="relative">
            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="overflow-hidden"
            >
              <div className="flex transition-all duration-300" 
                   style={{ 
                     width: `${publications.length * 33.33}%`, 
                     marginLeft: '0' // Start with the first card fully visible
                   }}>
                {publications.map((pub, index) => (
                  <FadeIn 
                    key={index} 
                    direction="up" 
                    delay={300 + index * 150}
                    duration={800}
                    className="px-4 w-1/3"
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col" style={{ 
                      borderRadius: '16px', 
                      border: `3px solid ${
                        index % 5 === 0 ? YOUTH_COLORS.blue : 
                        index % 5 === 1 ? YOUTH_COLORS.pink : 
                        index % 5 === 2 ? YOUTH_COLORS.yellow :
                        index % 5 === 3 ? YOUTH_COLORS.green :
                        YOUTH_COLORS.blue
                      }`,
                      transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)'
                    }}>
                      <div className="relative h-48 w-full">
                        <Image 
                          src={pub.image} 
                          alt={pub.title} 
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <p style={{ 
                          color: index % 5 === 0 ? YOUTH_COLORS.blue : 
                                 index % 5 === 1 ? YOUTH_COLORS.pink : 
                                 index % 5 === 2 ? YOUTH_COLORS.yellow :
                                 index % 5 === 3 ? YOUTH_COLORS.green :
                                 YOUTH_COLORS.blue
                        }} className="font-body text-sm mb-2">{pub.date}</p>
                        <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 dark:text-white">{pub.title}</h3>
                        <p className="font-body text-gray-700 dark:text-gray-300 mb-4 flex-1">{pub.excerpt}</p>
                        <CompanyButton asChild variant="ghost" colorVariant="green" className="px-0 mt-auto">
                          <Link href={pub.url} className="font-heading font-medium inline-flex items-center gap-1" style={{ 
                            color: index % 5 === 0 ? YOUTH_COLORS.blue : 
                                   index % 5 === 1 ? YOUTH_COLORS.pink : 
                                   index % 5 === 2 ? YOUTH_COLORS.yellow :
                                   index % 5 === 3 ? YOUTH_COLORS.green :
                                   YOUTH_COLORS.blue
                          }}>
                            Read more
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6"></path>
                            </svg>
                          </Link>
                        </CompanyButton>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Pagination Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {publications.map((_, index) => index < publications.length - 2 && (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-8 rounded-full transition-all ${currentIndex === index ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  aria-label={`Go to publication ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <FadeIn direction="up" delay={600} duration={800}>
            <div className="mt-12 text-center">
              <CompanyButton asChild variant="solid" colorVariant="green">
                <Link href="/publications" className="font-heading inline-flex items-center gap-2 px-6 py-3 font-medium">
                  View all publications
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </CompanyButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quotation Section */}
      <section className="py-24 bg-emerald-600 text-white relative overflow-hidden">
        {/* Floating Image 4 */}
        <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-36 h-36 md:w-52 md:h-52 opacity-60 rotate-6">
          <Image
            src="/Picture2.png"
            alt="Decorative Image 4"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('/images/dotted-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex justify-end mb-8">
            {/* Navigation Arrows for quotes */}
            <div className="flex gap-2">
              <button 
                onClick={prevQuote}
                className={`bg-white/10 backdrop-blur-sm rounded-full p-2 shadow-md text-white hover:text-yellow-300 transition-all transform hover:scale-110 ${quoteIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                disabled={quoteIndex === 0}
                aria-label="Previous quote"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextQuote}
                className={`bg-white/10 backdrop-blur-sm rounded-full p-2 shadow-md text-white hover:text-yellow-300 transition-all transform hover:scale-110 ${quoteIndex === quotes.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                disabled={quoteIndex === quotes.length - 1}
                aria-label="Next quote"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Current Quote (using state instead of carousel) */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Author Image */}
              <div className="w-32 h-32 md:w-40 md:h-40 shrink-0">
                <div className="w-full h-full relative overflow-hidden rounded-2xl border-4" style={{ borderColor: YOUTH_COLORS.yellow }}>
                  <Image 
                    src={quotes[quoteIndex].image} 
                    alt={quotes[quoteIndex].author}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Quote Content */}
              <div className="text-left md:text-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-6 opacity-80" style={{ color: YOUTH_COLORS.yellow }}>
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
                
                <blockquote className="font-body text-xl md:text-2xl italic mb-6 leading-relaxed" style={{ color: YOUTH_COLORS.yellow }}>
                  &quot;{quotes[quoteIndex].text}&quot;
                </blockquote>
                
                <div className="font-heading font-medium text-lg">
                  <p className="text-white/90">{quotes[quoteIndex].author} ({quotes[quoteIndex].age})</p>
                  <p className="text-white/70 text-sm">{quotes[quoteIndex].title}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setQuoteIndex(index)}
                className={`h-2 w-8 rounded-full transition-all ${quoteIndex === index ? 'bg-yellow-400' : 'bg-white/30'}`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative">
        {/* Floating Image 5 */}
        <div className="absolute right-10 top-10 w-44 h-44 md:w-60 md:h-60 opacity-75 -rotate-3">
          <Image
            src="/Picture1.png"
            alt="Decorative Image 5"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 text-center" style={{ color: YOUTH_COLORS.green }}>
              Our Partners
            </h2>
            <p className="font-body text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              We collaborate with leading organizations to enhance our impact and reach.
            </p>
          </FadeIn>
          
          <FadeIn direction="up" delay={300} duration={800}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {organizations.map((org, index) => (
                <div 
                  key={index} 
                  className="w-full max-w-[150px] h-24 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                  style={{ 
                    transform: index % 2 === 0 ? 'rotate(2deg)' : 'rotate(-2deg)',
                  }}
                >
                  <Image 
                    src={org.logo} 
                    alt={org.name} 
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
          
          <FadeIn direction="up" delay={600} duration={800}>
            <div className="mt-16 text-center">
              <CompanyButton asChild variant="ghost" colorVariant="green" className="px-0">
                <Link 
                  href="/partners" 
                  className="font-heading font-medium flex items-center gap-2 justify-center transition-colors"
                  style={{ color: YOUTH_COLORS.pink }}
                >
                  Learn more about our partnerships
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </CompanyButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </PublicPageLayout>
  );
}