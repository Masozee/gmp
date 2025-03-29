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
    { name: "Sekolah Politik Muda", href: "/programs#sekolah-politik" },
    { name: "Digital Democracy Initiative", href: "/programs#digital-democracy" },
    { name: "Lokalitas: Politik Daerah", href: "/programs#lokalitas" },
    { name: "Youth Parliament", href: "/programs#youth-parliament" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('/images/pattern-dots.svg')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo and About */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/logos/Logo-name-stack-white.png" 
                alt="Generasi Melek Politik" 
                width={180} 
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-300 text-sm">
              Meningkatkan kesadaran dan partisipasi politik generasi muda Indonesia melalui edukasi, advokasi, dan aksi nyata.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-110"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="h-1 w-1 bg-emerald-500 rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Programs */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-white">Programs</h3>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program.name}>
                  <Link 
                    href={program.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="h-1 w-1 bg-emerald-500 rounded-full"></span>
                    <span>{program.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Jl. Tebet Raya No. 45, Jakarta Selatan, DKI Jakarta 12810
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-300">+62 21 5678 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <a 
                  href="mailto:info@generasimelek.id" 
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  info@generasimelek.id
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Generasi Melek Politik. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 