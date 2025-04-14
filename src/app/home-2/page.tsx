"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Calendar, Users, BookOpen, TrendingUp } from "lucide-react";

// Define the corporate-oriented color palette
const CORPORATE_COLORS = {
  primary: "#3b82f6",  // blue
  secondary: "#6366f1", // indigo
  accent: "#0ea5e9",   // sky
  neutral: "#64748b"   // slate
};

export default function Home2() {
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
      carouselRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // For testimonials carousel
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    if (testimonialIndex < testimonials.length - 1) {
      setTestimonialIndex(testimonialIndex + 1);
    }
  };

  const prevTestimonial = () => {
    if (testimonialIndex > 0) {
      setTestimonialIndex(testimonialIndex - 1);
    }
  };

  // Sample data for partners
  const partners = [
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

  // Sample data for publications
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

  // Sample data for testimonials
  const testimonials = [
    {
      text: "Joining Academia Politica Kalimantan has fueled my motivation to explore and understand Indonesia's current political landscape.",
      author: "Kristina Dina Osok",
      title: "Purna Prakarya Muda Indonesia, Papua Barat Daya",
      image: "/kristina.png"
    },
    {
      text: "The Council of Gen-Z sparked dynamic discussions on South Sulawesi's environmental challenges, linking them to politics and policymaking—giving me a deeper understanding of the climate-politics connection.",
      author: "Adriansyah",
      title: "International Relations Student, UIN Alauddin Makassar",
      image: "/adriansyah.png"
    },
    {
      text: "I gained a lot of knowledge, get lots of experience, and meet people from different backgrounds.",
      author: "Muhammad Ridho Aprihadi",
      title: "SMA SahabatQu, Yogyakarta",
      image: "/ridho.png"
    },
    {
      text: "COGZ delivered powerful insights on climate change, Gen Z's role, and advocacy, with diverse voices shaping the discussion—especially on Gen Z's voice impact in Nusantara Capital City (IKN) development.",
      author: "Jumpa Perdana Putra",
      title: "Universitas Mulawarman, Samarinda, Kalimantan Timur",
      image: "/jumpa.png"
    },
    {
      text: "Today's activity was both fun and eye-opening! I learned that creating regulations isn't just about drafting them—it involves approvals, debates, and trade-offs. As someone new to politics, I'm now eager to learn more!",
      author: "Alya Rivana Ananditri",
      title: "Universitas Pakuan, Bogor, Jawa Barat",
      image: "/alya.png"
    }
  ];

  // Sample data for services/initiatives
  const services = [
    {
      title: "Political Education",
      description: "Tailored educational programs and workshops for youth to understand Indonesia's political landscape and processes.",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Youth Engagement",
      description: "Creating platforms for young Indonesians to actively participate in political discourse and decision-making.",
      icon: <Users className="h-6 w-6" />,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
    },
    {
      title: "Research & Analysis",
      description: "Conducting research on youth political behaviors and publishing findings to inform policy development.",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300",
    },
    {
      title: "Events & Workshops",
      description: "Organizing engaging events, seminars, and workshops that bridge the gap between youth and political institutions.",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    },
  ];

  return (
    <PublicPageLayout>
      {/* Hero Section - More corporate style */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/creative-christians-HN6uXG7GzTE-unsplash.jpg" 
            alt="Hero Background" 
            fill
            priority
            className="object-cover w-full"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="max-w-3xl">
            <FadeIn delay={300} direction="up" duration={800}>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Empowering Youth Through <span style={{ color: CORPORATE_COLORS.accent }}>Political Education</span>
              </h1>
            </FadeIn>
            <FadeIn delay={600} direction="up" duration={800}>
              <p className="font-body text-lg md:text-xl max-w-2xl mb-8 text-slate-200">
                Building Indonesia&apos;s future through informed civic engagement and democratic participation.
              </p>
            </FadeIn>
            <FadeIn delay={900} direction="up" duration={800}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" style={{ backgroundColor: CORPORATE_COLORS.primary }} className="hover:bg-blue-700 text-white">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/join">
                    Join Our Network
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services/Initiatives Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="text-center mb-16">
              <Badge className="mb-3 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 py-1.5 px-4 text-sm font-medium rounded-full">
                Our Initiatives
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Empowering Tomorrow&apos;s Leaders
              </h2>
              <p className="font-body text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                A comprehensive approach to political education and youth engagement
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <FadeIn 
                key={index}
                direction="up"
                delay={300 + index * 100}
                duration={800}
              >
                <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-6`}>
                    {service.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="font-body text-slate-600 dark:text-slate-300 flex-1">
                    {service.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn direction="up" delay={600} duration={800}>
            <div className="mt-12 text-center">
              <Button variant="link" style={{ color: CORPORATE_COLORS.primary }} className="hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 gap-2">
                <Link href="/programs" className="flex items-center">
                  View all programs
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section - Corporate style */}
      <section className="py-24 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <FadeIn className="lg:w-1/2" direction="right" duration={800}>
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-xl">
                <Image 
                  src="/Picture_bg.png" 
                  alt="Generasi Melek Politik" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              </div>
            </FadeIn>
            <FadeIn className="lg:w-1/2" direction="left" duration={800}>
              <Badge className="mb-3 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 py-1.5 px-4 text-sm font-medium rounded-full">
                About Us
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                Building Indonesia&apos;s Democratic Future
              </h2>
              <div className="font-body text-lg text-slate-600 dark:text-slate-300 space-y-4">
                <p>
                  Founded in 2020, Generasi Melek Politik (GMP) is a professional network dedicated to elevating political literacy among Indonesian youth.
                </p>
                <p>
                  We bridge the gap between complex political systems and young citizens through research-backed education, strategic collaborations, and innovative engagement programs.
                </p>
                
                <div className="space-y-3 mt-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle style={{ color: CORPORATE_COLORS.primary }} className="h-6 w-6 mt-0.5 shrink-0" />
                    <p className="text-base">Research-driven educational content and programs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle style={{ color: CORPORATE_COLORS.primary }} className="h-6 w-6 mt-0.5 shrink-0" />
                    <p className="text-base">Strategic partnerships with government and civic organizations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle style={{ color: CORPORATE_COLORS.primary }} className="h-6 w-6 mt-0.5 shrink-0" />
                    <p className="text-base">Professional development for emerging political leaders</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button style={{ backgroundColor: CORPORATE_COLORS.primary }} className="hover:bg-blue-700 text-white">
                    <Link href="/about">
                      Learn more about us
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Publications Section - Corporate style */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="flex justify-between items-center mb-12">
              <div>
                <Badge className="mb-3 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 py-1.5 px-4 text-sm font-medium rounded-full">
                  Publications
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                  Latest Research & Insights
                </h2>
                <p className="font-body text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                  Evidence-based research and analysis on Indonesian politics and civic engagement.
                </p>
              </div>
              
              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <Button 
                  onClick={scrollPrev}
                  variant="outline"
                  size="icon"
                  className={`rounded-full bg-white dark:bg-slate-800 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                  disabled={currentIndex === 0}
                  aria-label="Previous publications"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={scrollNext}
                  variant="outline"
                  size="icon"
                  className={`rounded-full bg-white dark:bg-slate-800 ${currentIndex >= publications.length - 3 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                  disabled={currentIndex >= publications.length - 3}
                  aria-label="Next publications"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
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
                     marginLeft: '0'
                   }}>
                {publications.map((pub, index) => (
                  <FadeIn 
                    key={index} 
                    direction="up" 
                    delay={300 + index * 150}
                    duration={800}
                    className="px-4 w-1/3"
                  >
                    <Card className="h-full flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48 w-full">
                        <Image 
                          src={pub.image} 
                          alt={pub.title} 
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <p style={{ color: CORPORATE_COLORS.primary }} className="text-sm dark:text-blue-400 mb-2">{pub.date}</p>
                        <h3 className="font-heading text-xl font-bold mb-2 text-slate-900 dark:text-white">{pub.title}</h3>
                        <p className="font-body text-slate-600 dark:text-slate-300 mb-4 flex-1">{pub.excerpt}</p>
                        <Button variant="link" style={{ color: CORPORATE_COLORS.primary }} className="px-0 hover:text-blue-700 dark:text-blue-400 mt-auto justify-start">
                          <Link href={pub.url} className="inline-flex items-center gap-1">
                            Read more
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6"></path>
                            </svg>
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Pagination Indicator */}
            <div className="flex justify-center mt-8 gap-2">
              {publications.map((_, index) => index < publications.length - 2 && (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-8 rounded-full transition-all ${currentIndex === index ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                  aria-label={`Go to publication ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <FadeIn direction="up" delay={600} duration={800}>
            <div className="mt-12 text-center">
              <Button style={{ backgroundColor: CORPORATE_COLORS.primary }} className="hover:bg-blue-700 text-white">
                <Link href="/publications">
                  View all publications
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonial Section - Corporate style */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <FadeIn direction="up" duration={800}>
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-white/20 text-white py-1.5 px-4 text-sm font-medium rounded-full backdrop-blur-sm">
                Testimonials
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                What Our Community Says
              </h2>
              <p className="font-body text-lg text-blue-100 max-w-2xl mx-auto">
                The impact of our programs on Indonesia&apos;s emerging leaders
              </p>
            </div>
          </FadeIn>

          <div className="flex justify-end mb-8">
            {/* Navigation Arrows for testimonials */}
            <div className="flex gap-2">
              <Button 
                onClick={prevTestimonial}
                variant="outline"
                size="icon"
                className={`bg-white/10 text-white hover:bg-white/20 border-white/20 ${testimonialIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                disabled={testimonialIndex === 0}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                onClick={nextTestimonial}
                variant="outline"
                size="icon"
                className={`bg-white/10 text-white hover:bg-white/20 border-white/20 ${testimonialIndex === testimonials.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                disabled={testimonialIndex === testimonials.length - 1}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Current Testimonial */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-none p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Author Image */}
                <div className="w-24 h-24 md:w-28 md:h-28 shrink-0">
                  <div className="w-full h-full relative overflow-hidden rounded-full border-2 border-white/50">
                    <Image 
                      src={testimonials[testimonialIndex].image} 
                      alt={testimonials[testimonialIndex].author}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Quote Content */}
                <div className="text-center md:text-left">
                  <blockquote className="font-body text-xl md:text-2xl mb-6 leading-relaxed text-white">
                    &quot;{testimonials[testimonialIndex].text}&quot;
                  </blockquote>
                  
                  <div className="font-heading font-medium">
                    <p className="text-white text-lg">{testimonials[testimonialIndex].author}</p>
                    <p className="text-blue-200 text-sm">{testimonials[testimonialIndex].title}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Pagination Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setTestimonialIndex(index)}
                className={`h-2 w-8 rounded-full transition-all ${testimonialIndex === index ? 'bg-white' : 'bg-white/30'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section - Corporate style */}
      <section className="py-24 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <div className="text-center mb-16">
              <Badge className="mb-3 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 py-1.5 px-4 text-sm font-medium rounded-full">
                Our Network
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Strategic Partners
              </h2>
              <p className="font-body text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Collaborating with leading institutions to enhance our impact across Indonesia.
              </p>
            </div>
          </FadeIn>
          
          <FadeIn direction="up" delay={300} duration={800}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {partners.map((partner, index) => (
                <div 
                  key={index} 
                  className="w-full max-w-[150px] h-24 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
                >
                  <Image 
                    src={partner.logo} 
                    alt={partner.name} 
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
              <Button variant="outline" style={{ borderColor: CORPORATE_COLORS.primary, color: CORPORATE_COLORS.primary }} className="hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950">
                <Link href="/partners">
                  Learn more about our partnerships
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn direction="up" duration={800}>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-white">
                  Ready to Make a Difference?
                </h2>
                <p className="font-body text-lg text-blue-100 mb-8">
                  Join our network of politically engaged youth and help shape Indonesia&apos;s democratic future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Link href="/join">
                      Join Our Network
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href="/contact">
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
} 