"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { CompanyButton } from "@/components/ui/company-button";
import { Button } from "@/components/ui/button";
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

export default function HomePage() {
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
    <>
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
        <div className="relative z-10 mb-16 flex flex-col items-center">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-bold text-white text-center drop-shadow-lg mb-6">
              Empowering Indonesian Youth<br />
              for a Brighter Tomorrow
            </h1>
            <p className="text-xl md:text-2xl text-white text-center drop-shadow mb-8">
              Political education, civic engagement, and climate action for the next generation.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#fece5f] text-black font-bold hover:bg-[#eb6d93]">
                <Link href="/about">Learn More</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Link href="/dashboard/projects">Our Projects</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Our Partners</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {organizations.map((org) => (
              <div key={org.name} className="w-32 h-16 flex items-center justify-center">
                <Image src={org.logo} alt={org.name} width={128} height={64} className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Carousel */}
      <section className="py-16 bg-[#f6f6f6]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Latest Publications</h2>
          <div className="relative">
            <button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 disabled:opacity-50" disabled={currentIndex === 0} aria-label="Previous">
              <ChevronLeft />
            </button>
            <div ref={carouselRef} className="overflow-x-hidden">
              <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}>
                {publications.map((pub, idx) => (
                  <Card key={pub.title} className="min-w-[300px] max-w-[300px] mx-2 flex-shrink-0">
                    <Image src={pub.image} alt={pub.title} width={300} height={180} className="rounded-t-lg object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{pub.title}</h3>
                      <p className="text-gray-600 mb-2">{pub.excerpt}</p>
                      <span className="text-xs text-gray-400">{pub.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 disabled:opacity-50" disabled={currentIndex >= publications.length - 3} aria-label="Next">
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Quotes Carousel */}
      <section className="py-16 bg-gradient-to-r from-[#fece5f] via-[#eb6d93] to-[#59c9f5]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">What Our Youth Say</h2>
          <div className="relative max-w-2xl mx-auto">
            <button onClick={prevQuote} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 disabled:opacity-50" disabled={quoteIndex === 0} aria-label="Previous">
              <ChevronLeft />
            </button>
            <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
              <Image src={quotes[quoteIndex].image} alt={quotes[quoteIndex].author} width={80} height={80} className="rounded-full mb-4" />
              <p className="text-lg italic mb-2">"{quotes[quoteIndex].text}"</p>
              <span className="font-bold">{quotes[quoteIndex].author}</span>
              <span className="text-sm text-gray-600">{quotes[quoteIndex].title}, Age {quotes[quoteIndex].age}</span>
            </div>
            <button onClick={nextQuote} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 disabled:opacity-50" disabled={quoteIndex === quotes.length - 1} aria-label="Next">
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Issues Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Get Involved</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {issues.map((issue) => (
              <Card key={issue.title} className="flex flex-col items-center p-8">
                <span className="text-4xl mb-4">{issue.icon}</span>
                <h3 className="font-bold text-lg mb-2 text-center">{issue.title}</h3>
                <p className="text-gray-600 text-center mb-4">{issue.description}</p>
                <Button asChild variant="outline">
                  <Link href={issue.link}>Learn More</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 