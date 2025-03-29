import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animation/FadeIn";
import { PublicPageLayout } from "@/components/layouts/public-page-layout";
import { CompanyButton } from "@/components/ui/company-button";
import { COLORS } from "@/styles/colors";

export default function Home() {
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

  // Sample data for publications
  const publications = [
    {
      title: "Understanding Indonesian Electoral Systems",
      excerpt: "A comprehensive guide to how elections work in Indonesia.",
      image: "/publications/pub1.jpg",
      date: "May 15, 2023",
      url: "#",
    },
    {
      title: "Youth Participation in Politics",
      excerpt: "How young Indonesians can make a difference in the political landscape.",
      image: "/publications/pub2.jpg",
      date: "June 22, 2023",
      url: "#",
    },
    {
      title: "Digital Activism in Modern Democracy",
      excerpt: "Leveraging social media for political awareness and change.",
      image: "/publications/pub3.jpg",
      date: "August 10, 2023",
      url: "#",
    },
  ];

  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-black to-slate-900 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="relative h-full w-full">
            <Image 
              src="/images/getty-images-C3gjLSgTKNw-unsplash.jpg" 
              alt="Hero Background" 
              fill
              priority
              className="object-cover brightness-[0.65]"
            />
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="max-w-5xl">
            <FadeIn delay={300} direction="up" duration={800}>
              <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 leading-tight">
                <span className="text-emerald-400">Generasi</span> Melek Politik
              </h1>
            </FadeIn>
            <FadeIn delay={600} direction="up" duration={800}>
              <p className="font-body text-xl md:text-2xl max-w-2xl mb-8 text-gray-200">
                Empowering Indonesian youth through political education, awareness, and engagement.
              </p>
            </FadeIn>
            <FadeIn delay={900} direction="up" duration={800}>
              <div className="flex flex-col sm:flex-row gap-4">
                <CompanyButton asChild variant="solid" colorVariant="green">
                  <Link href="/about" className="px-8 py-3 font-heading font-medium text-lg">
                    Learn More
                  </Link>
                </CompanyButton>
                <CompanyButton asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/join" className="px-8 py-3 font-heading font-medium text-lg">
                    Join Our Movement
                  </Link>
                </CompanyButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <FadeIn className="md:w-1/2" direction="right" duration={800}>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                About <span className="text-emerald-600 dark:text-emerald-400">Generasi Melek Politik</span>
              </h2>
              <div className="font-body text-lg text-gray-700 dark:text-gray-300 space-y-4">
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
                  <Link href="/about" className="font-heading font-medium flex items-center gap-2">
                    Read our full story
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </CompanyButton>
              </div>
            </FadeIn>
            <FadeIn className="md:w-1/2 relative h-80 md:h-96 w-full rounded-xl overflow-hidden" direction="left" duration={800}>
              <div className="h-full relative rounded-xl overflow-hidden shadow-xl">
                <Image 
                  src="/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg" 
                  alt="Generasi Melek Politik" 
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 text-center text-gray-900 dark:text-white">
              Our Publications
            </h2>
            <p className="font-body text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Explore our latest research, articles, and educational resources on Indonesian politics and civic engagement.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publications.map((pub, index) => (
              <FadeIn 
                key={index} 
                direction="up" 
                delay={300 + index * 150}
                duration={800}
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image 
                      src={pub.image} 
                      alt={pub.title} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-emerald-600 dark:text-emerald-400 font-body text-sm mb-2">{pub.date}</p>
                    <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 dark:text-white">{pub.title}</h3>
                    <p className="font-body text-gray-700 dark:text-gray-300 mb-4 flex-1">{pub.excerpt}</p>
                    <CompanyButton asChild variant="ghost" colorVariant="green" className="px-0 mt-auto">
                      <Link href={pub.url} className="font-heading font-medium inline-flex items-center gap-1">
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
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('/images/dotted-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up" duration={800}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 opacity-80">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
              </svg>
              
              <blockquote className="font-body text-2xl md:text-3xl italic mb-6 leading-relaxed">
                Democracy requires an active and informed citizenry. The future of our nation depends on young people who understand the power of their voice and the significance of their vote.
              </blockquote>
              
              <div className="font-heading font-medium text-lg">
                <p className="text-white/90">Budi Santoso</p>
                <p className="text-white/70 text-sm">Founder, Generasi Melek Politik</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn direction="up" duration={800}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 text-center text-gray-900 dark:text-white">
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
                <Link href="/partners" className="font-heading text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-2 justify-center transition-colors">
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
