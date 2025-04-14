"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";
import { CompanyButton } from "@/components/ui/company-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

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
      name: "Universitas Bakrie",
      logo: "/logos/partner/bakrie.png",
    },
    {
      name: "Climate and Land Use Alliance",
      logo: "/logos/partner/climate.png",
    },
    {
      name: "Greenpeace",
      logo: "/logos/partner/greenpeace.png",
    },
    {
      name: "International Republican Institute",
      logo: "/logos/partner/iri.png",
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
      title: "Support a Campaign",
      description: "Pick a cause that speaks to you and contribute to making a difference. Every dollar counts in bringing about change.",
      icon: "🫶",
      link: "/campaigns"
    },
    {
      title: "General Donation",
      description: "Your donations help fund various initiatives and sustain our organization's efforts to make a positive impact.",
      icon: "🌱",
      link: "/donate"
    },
    {
      title: "Become a Volunteer",
      description: "Lend your time and skills to our cause. Join our volunteer program and be part of the change you want to see.",
      icon: "🧑‍🤝‍🧑",
      link: "/volunteer"
    },
    {
      title: "Take Part in Event",
      description: "Attend our events to learn, network, and contribute to meaningful discussions about political education.",
      icon: "🌐",
      link: "/events"
    }
  ];

  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/academia.png" 
            alt="Hero Background" 
            fill
            priority
            className="object-cover w-full"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 max-w-7xl pb-16  from-black/80 to-transparent">
          <div className="max-w-5xl">
            <FadeIn delay={300} direction="up" duration={800}>
              <h1 className="font-['PT_Serif'] text-4xl md:text-6xl font-bold mb-3 leading-tight">
                <span className="text-brand-yellow">Generasi</span>{" "}
                <span className="text-brand-blue">Melek</span>{" "}
                <span className="text-brand-pink">Politik</span>
              </h1>
            </FadeIn>
            <FadeIn delay={600} direction="up" duration={800}>
              <p className="font-['Sora'] text-lg md:text-xl max-w-2xl mb-6 text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                Empowering Indonesian youth through political education, awareness, and engagement.
              </p>
            </FadeIn>
            <FadeIn delay={900} direction="up" duration={800}>
              <div className="flex flex-col sm:flex-row gap-4">
                <CompanyButton asChild variant="solid" className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
                  <Link href="/about" className="px-6 py-2.5 font-['PT_Serif'] font-medium text-base">
                    Learn More
                  </Link>
                </CompanyButton>
                <CompanyButton asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/join" className="px-6 py-2.5 font-['PT_Serif'] font-medium text-base">
                    Join Our Movement
                  </Link>
                </CompanyButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* About Section with Partners added below (moved up and background removed) */}
      <section className="py-20 relative overflow-hidden bg-white dark:bg-gray-900">
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
                <h2 className="font-['PT_Serif'] text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  About Generasi Melek Politik
                </h2>
                <div className="font-['Sora'] text-lg text-gray-700 dark:text-gray-300 space-y-4">
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
                  <CompanyButton asChild variant="solid" className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
                    <Link href="/about" className="font-['PT_Serif'] px-6 py-2.5 font-medium text-black flex items-center gap-2">
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
                <div className="h-full relative overflow-hidden" style={{ borderRadius: '24px', border: '6px solid rgb(90, 202, 244)', transform: 'rotate(2deg)' }}>
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
          
          {/* Partners Section (moved here from below) */}
          <div className="mt-16">
            <FadeIn direction="up" duration={800}>
              <h2 className="font-['PT_Serif'] text-3xl md:text-4xl font-bold mb-2 text-center">
                Our Partners
              </h2>
              <p className="font-['Sora'] text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
                We collaborate with leading organizations to enhance our impact and reach.
              </p>
            </FadeIn>
            
            <FadeIn direction="up" delay={300} duration={800}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-stretch">
                {organizations.map((org, index) => (
                  <div 
                    key={index} 
                    className="h-40 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
                    style={{ 
                      transform: index % 2 === 0 ? 'rotate(2deg)' : 'rotate(-2deg)',
                    }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image 
                        src={org.logo} 
                        alt={org.name} 
                        width={120}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <p className="mt-2 text-center text-sm font-['Sora'] text-gray-600 dark:text-gray-400">{org.name}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Issues Section (moved down) */}
      <section className="py-20 bg-brand-yellow dark:bg-gray-800 rounded-3xl from-brand-yellow/90 to-brand-yellow/70 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Inspirational Message (made sticky) */}
            <div className="flex flex-col justify-center lg:sticky lg:top-32 lg:self-start h-fit">
              <FadeIn direction="up" duration={800}>
                <h2 className="font-['PT_Serif'] text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
                  You Have the Power Today to Change Tomorrow!
                </h2>
                <p className="font-['Sora'] text-lg text-black dark:text-gray-300 mb-6">
                  Every action, no matter how small, has the power to create ripples of change in our society. Start now and be the difference.
                </p>
                <p className="font-['Sora'] text-md text-black/80 dark:text-gray-400 mb-8">
                  Join us today as we build a more politically-aware youth movement ready to take on tomorrow's challenges.
                </p>
                <div className="flex gap-4">
                  <Link href="/about" className="inline-flex items-center text-black dark:text-gray-300 border-b border-black/30 dark:border-gray-600 pb-1 hover:text-brand-blue dark:hover:text-brand-blue hover:border-brand-blue dark:hover:border-brand-blue transition-colors">
                    Read More
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                  <Link href="/join" className="font-['PT_Serif'] font-semibold bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 transition-colors">
                    Join Now
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right Column - Ways to Get Involved (changed to vertical list with image) */}
            <div className="flex flex-col space-y-6">
              {issues.map((issue, index) => (
                <FadeIn 
                  key={index}
                  direction="up"
                  delay={300 + index * 100}
                  duration={800}
                >
                  <Link href={issue.link}>
                    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                      {/* Image side */}
                      <div className="w-full md:w-1/3 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-6">
                        <div className="text-5xl">{issue.icon}</div>
                      </div>
                      {/* Content side */}
                      <div className="w-full md:w-2/3 p-6">
                        <h3 className="font-['PT_Serif'] text-lg font-bold mb-2 text-gray-900 dark:text-white">
                          {issue.title}
                        </h3>
                        <p className="font-['Sora'] text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {issue.description}
                        </p>
                        <span className={`text-xs font-medium ${
                          index === 0 ? "text-brand-pink" :
                          index === 1 ? "text-brand-blue" :
                          index === 2 ? "text-brand-pink" :
                          "text-brand-blue"
                        }`}>
                          Learn more
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
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
                <h2 className="font-['PT_Serif'] text-3xl md:text-4xl font-bold mb-2">
                  Our Publications
                </h2>
                <p className="font-['Sora'] text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  Explore our latest research, articles, and educational resources on Indonesian politics and civic engagement.
                </p>
              </div>
              
              {/* Navigation Arrows moved to top */}
              <div className="flex gap-2">
                <button 
                  onClick={scrollPrev}
                  className={`bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-200 hover:text-brand-blue dark:hover:text-brand-blue transition-all transform hover:scale-110 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                  disabled={currentIndex === 0}
                  aria-label="Previous publications"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={scrollNext}
                  className={`bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-200 hover:text-brand-blue dark:hover:text-brand-blue transition-all transform hover:scale-110 ${currentIndex >= publications.length - 3 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
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
                        index % 3 === 0 ? "rgb(90, 202, 244)" : 
                        index % 3 === 1 ? "rgb(237, 109, 148)" : 
                        "rgb(247, 203, 87)"
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
                          color: index % 3 === 0 ? "rgb(90, 202, 244)" : 
                                 index % 3 === 1 ? "rgb(237, 109, 148)" : 
                                 "rgb(247, 203, 87)"
                        }} className="font-['Sora'] text-sm mb-2">{pub.date}</p>
                        <h3 className="font-['PT_Serif'] text-xl font-bold mb-2 text-gray-900 dark:text-white">{pub.title}</h3>
                        <p className="font-['Sora'] text-gray-700 dark:text-gray-300 mb-4 flex-1">{pub.excerpt}</p>
                        <CompanyButton asChild variant="ghost" colorVariant="green" className="px-0 mt-auto">
                          <Link href={pub.url} className="font-['PT_Serif'] font-medium inline-flex items-center gap-1" style={{ 
                            color: index % 3 === 0 ? "rgb(90, 202, 244)" : 
                                   index % 3 === 1 ? "rgb(237, 109, 148)" : 
                                   "rgb(247, 203, 87)"
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
                  className={`h-2 w-8 rounded-full transition-all ${currentIndex === index ? 'bg-brand-blue' : 'bg-gray-300 dark:bg-gray-600'}`}
                  aria-label={`Go to publication ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <FadeIn direction="up" delay={600} duration={800}>
            <div className="mt-12 text-center">
              <CompanyButton asChild variant="solid" className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
                <Link href="/publications" className="font-['PT_Serif'] inline-flex items-center gap-2 px-6 py-3 font-medium">
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
      <section className="py-24 bg-brand-yellow text-white relative overflow-hidden">
        {/* Floating Image 4 */}
        <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-36 h-36 md:w-52 md:h-52 opacity-60 rotate-6">
          <Image
            src="/Picture2.png"
            alt="Decorative Image 4"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/90 to-brand-yellow/70 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('/images/dotted-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex justify-end mb-8">
            {/* Navigation Arrows for quotes */}
            <div className="flex gap-2">
              <button 
                onClick={prevQuote}
                className={`bg-white/10 backdrop-blur-sm rounded-full p-2 shadow-md text-white hover:text-brand-pink transition-all transform hover:scale-110 ${quoteIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                disabled={quoteIndex === 0}
                aria-label="Previous quote"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextQuote}
                className={`bg-white/10 backdrop-blur-sm rounded-full p-2 shadow-md text-white hover:text-brand-pink transition-all transform hover:scale-110 ${quoteIndex === quotes.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
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
                <div className="w-full h-full relative overflow-hidden rounded-2xl border-4 border-brand-pink">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-6 opacity-80 text-brand-pink">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
                
                <blockquote className="font-['Sora'] text-xl md:text-2xl italic mb-6 leading-relaxed text-black">
                  &quot;{quotes[quoteIndex].text}&quot;
                </blockquote>
                
                <div className="font-['PT_Serif'] font-medium text-lg">
                  <p className="text-black/90">{quotes[quoteIndex].author} ({quotes[quoteIndex].age})</p>
                  <p className="text-black/70 text-sm">{quotes[quoteIndex].title}</p>
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
                className={`h-2 w-8 rounded-full transition-all ${quoteIndex === index ? 'bg-brand-pink' : 'bg-black/30'}`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section - New */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <h2 className="font-['PT_Serif'] text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              Explore Our Interactive Dashboard
            </h2>
            <p className="font-['Sora'] text-lg text-gray-700 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Visualize political participation and education metrics across Indonesia with our comprehensive data tools.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={300} duration={800}>
            <div className="bg-brand-yellow rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Map Image */}
                <div className="relative h-64 md:h-96 lg:h-full overflow-hidden">
                  <Image 
                    src="/images/map.png" 
                    alt="Interactive Political Education Dashboard" 
                    fill
                    className="object-cover"
                  />
                  
                </div>

                {/* Info Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="font-['PT_Serif'] text-2xl md:text-3xl font-bold mb-4 text-black">
                    Youth Political Engagement Map
                  </h3>
                  <p className="font-['Sora'] text-black/80 mb-6">
                    Our interactive dashboard visualizes youth political participation across Indonesia. Track engagement levels, education initiatives, and impact metrics in real-time.
                  </p>
                  <ul className="font-['Sora'] space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <div className="bg-black rounded-full p-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                      <span className="text-black/80">Regional participation statistics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-black rounded-full p-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                      <span className="text-black/80">Education program effectiveness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-black rounded-full p-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                      <span className="text-black/80">Interactive data filters and trends</span>
                    </li>
                  </ul>
                  <Link 
                    href="/dashboard" 
                    className="font-['PT_Serif'] font-medium bg-black text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-black/90 transition-all self-start"
                  >
                    Explore the Dashboard
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      
    </PublicPageLayout>
  );
}