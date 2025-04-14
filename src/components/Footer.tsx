"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  // Social media links
  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "YouTube", href: "#", icon: Youtube },
  ];

  // Quick links
  const quickLinks = [
    { name: "Tentang Kami", href: "/about" },
    { name: "Program", href: "/programs" },
    { name: "Publikasi", href: "/publications" },
    { name: "Acara", href: "/events" },
    { name: "Mitra Strategis", href: "/partners" },
  ];

  // Programs
  const programs = [
    { name: "Diskusi", href: "/programs#diskusi" },
    { name: "Temu Kandidat", href: "/program#temu-kandidat" },
    { name: "Academia Politica", href: "/programs#academia-politica" },
    { name: "Council of Gen Z", href: "/programs#council-of-gen-z" },
  ];

  return (
    <footer className="relative bg-gradient-to-br bg-brand-yellow from-brand-yellow/90 via-brand-yellow/80 to-brand-yellow/70 text-black pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('/images/pattern-dots.svg')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo and About */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/logos/Logo-white.png" 
                alt="Generasi Melek Politik" 
                width={180} 
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-black/80 text-sm">
            Generasi Melek Politik (GMP) adalah sebuah organisasi non-profit yang bergerak untuk memberikan pendidikan politik untuk anak muda (17-25 tahun) dengan cara yang menyenangkan!
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-black/70 hover:text-brand-pink transition-all duration-300 hover:scale-110"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-black">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-black/80 hover:text-brand-blue transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="h-1 w-1 bg-brand-pink rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Programs */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-black">Programs</h3>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program.name}>
                  <Link 
                    href={program.href}
                    className="text-black/80 hover:text-brand-blue transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="h-1 w-1 bg-brand-pink rounded-full"></span>
                    <span>{program.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-black">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-pink flex-shrink-0 mt-0.5" />
                <span className="text-black/80">
                Menara Sentraya 18th Floor Unit B2 Jl. Iskandarsyah Raya No. 1A Blok M, Kebayoran Baru, Jakarta Selatan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-pink flex-shrink-0" />
                <span className="text-black/80">+62 812-9231-0996</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-pink flex-shrink-0" />
                <a 
                  href="mailto:admin@partisipasimuda.org" 
                  className="text-black/80 hover:text-brand-blue transition-colors duration-200"
                >
                  admin@partisipasimuda.org
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-black/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-black/70 text-sm">
              © {new Date().getFullYear()} Generasi Melek Politik. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy-policy" className="text-black/70 hover:text-brand-blue transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-black/70 hover:text-brand-blue transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 