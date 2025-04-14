"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Facebook, Instagram, Youtube, Search, ChevronUp, Globe, Mail } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define the youth-oriented color palette
const YOUTH_COLORS = {
  yellow: "rgb(247, 203, 87)",
  pink: "rgb(237, 109, 148)",
  blue: "rgb(90, 202, 244)",
  green: "#7baf3f"
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll effect   
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Show scroll to top button when user scrolls down 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Main navigation items
  const mainNavItems = [
    { 
      name: "Tentang Kami", 
      href: "/about",
      hasDropdown: true,
      dropdownItems: [
        { name: "Tujuan Kami", href: "/about/tujuan" },
        { name: "Perjalanan Kami", href: "/about/perjalanan" },
        { name: "Board & Pengurus", href: "/about/pengurus" },
      ]
    },
    { name: "Program", href: "/programs" },
    { 
      name: "Publikasi", 
      href: "/publications",
      hasDropdown: true,
      hasMegaMenu: true,
      dropdownItems: []
    },
    { name: "Acara", href: "/events" },
    { name: "Mitra Strategis", href: "/partners" },
  ];

  // Latest publications for the mega menu
  const latestPublications = [
    {
      id: "1",
      title: "Memahami Sistem Pemilu Indonesia",
      excerpt: "Panduan komprehensif tentang sistem pemilihan umum di Indonesia...",
      image: "/images/boston-public-library-4yPHCb1SPR4-unsplash.jpg",
      date: "15 Mei 2023",
      category: "Pemilu",
    },
    {
      id: "8",
      title: "Peran Media dalam Pembentukan Opini Politik",
      excerpt: "Analisis pengaruh media dalam membentuk persepsi dan opini publik...",
      image: "/images/shubham-dhage-PACWvLRNzj8-unsplash.jpg",
      date: "20 Januari 2024",
      category: "Media dan Politik",
    },
  ];

  // Publication categories
  const publicationCategories = [
    "Pemilu",
    "Partisipasi Politik",
    "Media Digital",
    "Literasi Politik",
    "Kebijakan Publik",
    "Politik Lokal",
    "Gender dan Politik",
    "Media dan Politik"
  ];

  // Language options
  const languages = [
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const [currentLang, setCurrentLang] = useState('id');

  return (
    <>
      {/* Single Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80"
            : "bg-white/60 backdrop-blur-sm dark:bg-gray-900/60"
        }`}
      >
        {/* Top Navigation Bar */}
        <div className="container mx-auto px-6 max-w-7xl border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Email as logo replacement */}
            <div className="flex items-center">
              <Link href="mailto:info@generasimelek.org" className="flex items-center gap-2 text-gray-700 hover:text-brand-blue dark:text-gray-200 dark:hover:text-brand-blue transition-colors group">
                <Mail className="h-5 w-5 transition-all duration-300 group-hover:scale-105" />
                <span className="text-sm font-medium hidden sm:inline">info@generasimelek.org</span>
              </Link>
            </div>

            {/* Right section: Donate, Language, Dark Mode */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Link 
                  href="/donate" 
                  className="text-sm font-medium text-gray-700 hover:text-brand-blue dark:text-gray-200 dark:hover:text-brand-blue transition-colors hover:scale-105 transform duration-200"
                >
                  Donasi & Kolaborasi
                </Link>
              </div>
              
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-gray-700 hover:text-brand-blue dark:text-gray-200 dark:hover:text-brand-blue transition-colors h-8">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {languages.find(lang => lang.code === currentLang)?.flag}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="mt-1">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setCurrentLang(lang.code)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              
              <ModeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-4 md:hidden">
              {/* Language Selector for Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-brand-blue dark:text-gray-200 dark:hover:text-brand-blue transition-colors h-8">
                  <Globe className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="mt-1">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setCurrentLang(lang.code)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <ModeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Toggle menu</span>
                {isOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="hidden md:block container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16 relative">
            {/* Logo moved to bottom nav and made bigger */}
            <div className="flex items-center mr-8">
              <Link href="/" className="flex items-center group">
                <div className="flex items-center">
                  <Image 
                    src="/logos/Logo-name-stack.png" 
                    alt="Generasi Melek Politik" 
                    width={140} 
                    height={35}
                    className="h-9 w-auto transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>
            
            {/* Left aligned menu items */}
            <div className="flex items-center gap-8 flex-1">
              {mainNavItems.map((item) => (
                item.hasDropdown ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className="flex items-center gap-1 font-heading font-semibold text-base transition-all duration-200 focus:outline-none group hover:text-brand-blue dark:hover:text-brand-blue text-gray-700 dark:text-gray-200">
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {item.name}
                      </span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    </DropdownMenuTrigger>
                    {item.hasMegaMenu ? (
                      <DropdownMenuContent 
                        align="center" 
                        className="animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 w-[800px] p-0"
                      >
                        <div className="flex w-full">
                          {/* Left column: Categories */}
                          <div className="w-1/3 bg-gray-50 dark:bg-gray-800 p-4">
                            <h3 className="font-heading font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">
                              Kategori
                            </h3>
                            <div className="flex flex-col space-y-2">
                              {publicationCategories.map((category) => (
                                <Link 
                                  key={category}
                                  href={`/publications?category=${encodeURIComponent(category)}`}
                                  className="text-sm text-gray-700 hover:text-brand-blue dark:text-gray-300 dark:hover:text-brand-blue transition-colors"
                                >
                                  {category}
                                </Link>
                              ))}
                              <Link 
                                href="/publications"
                                className="text-sm font-medium text-brand-yellow hover:text-brand-pink dark:text-brand-yellow dark:hover:text-brand-pink transition-colors mt-2"
                              >
                                Lihat Semua Publikasi
                              </Link>
                            </div>
                          </div>
                          
                          {/* Right columns: Latest publications (2 columns) */}
                          <div className="w-2/3 grid grid-cols-2 gap-4 p-4">
                            <h3 className="col-span-2 font-heading font-semibold text-base mb-2 text-gray-800 dark:text-gray-200">
                              Publikasi Terbaru
                            </h3>
                            {latestPublications.map((publication) => (
                              <Link 
                                key={publication.id}
                                href={`/publications/${publication.id}`}
                                className="block group"
                              >
                                <div className="overflow-hidden rounded-md mb-2 aspect-[4/3] relative">
                                  <Image
                                    src={publication.image}
                                    alt={publication.title}
                                    fill
                                    className="object-cover transition-all duration-300 group-hover:scale-105"
                                  />
                                </div>
                                <span className="text-xs font-medium text-brand-yellow dark:text-brand-yellow">
                                  {publication.category}
                                </span>
                                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-brand-blue dark:group-hover:text-brand-blue transition-colors">
                                  {publication.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {publication.date}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </DropdownMenuContent>
                    ) : (
                      <DropdownMenuContent align="center" className="animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <DropdownMenuItem key={dropdownItem.name} asChild>
                            <Link 
                              href={dropdownItem.href} 
                              className="cursor-pointer font-medium transition-colors hover:text-brand-blue dark:hover:text-brand-blue"
                            >
                              {dropdownItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="font-heading font-semibold text-base text-gray-700 hover:text-brand-blue dark:text-gray-200 dark:hover:text-brand-blue transition-all duration-200 hover:translate-x-0.5"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
            
            {/* Right aligned search form */}
            <div className="relative w-64 max-w-sm">
              <div className="relative flex items-center group">
                <Input
                  type="search"
                  placeholder="Cari artikel..."
                  className="pl-10 pr-4 h-10 rounded-full border-gray-200 focus:border-brand-yellow dark:border-gray-700 dark:focus:border-brand-yellow transition-all duration-300 group-hover:shadow-md"
                />
                <Search className="absolute left-3 h-4 w-4 text-gray-400 group-hover:text-brand-yellow transition-colors duration-300" />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 rounded-full hover:bg-brand-yellow/10 dark:hover:bg-brand-yellow/20 transition-colors duration-300"
                >
                  <span className="sr-only">Search</span>
                  <ChevronDown className="h-4 w-4 -rotate-90 transition-transform duration-300 group-hover:scale-110" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu for default navbar */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100 py-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col space-y-4 pb-6">
              {/* Navigation */}
              <div className="flex flex-col space-y-4">
                {mainNavItems.map((item) => 
                  item.hasDropdown ? (
                    <div key={item.name}>
                      <div className="flex items-center justify-between border-b pb-1 border-gray-100 dark:border-gray-700">
                        <Link 
                          href={item.href} 
                          onClick={() => setIsOpen(false)}
                          className="font-heading text-lg font-semibold text-gray-900 dark:text-white"
                        >
                          {item.name}
                        </Link>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                      {item.hasMegaMenu ? (
                        <div className="mt-2 ml-4 flex flex-col space-y-2">
                          <h3 className="font-heading text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            Kategori
                          </h3>
                          {publicationCategories.map((category) => (
                            <Link
                              key={category}
                              href={`/publications?category=${encodeURIComponent(category)}`}
                              onClick={() => setIsOpen(false)}
                              className="font-body text-gray-600 dark:text-gray-300"
                            >
                              {category}
                            </Link>
                          ))}
                          <Link
                            href="/publications"
                            onClick={() => setIsOpen(false)}
                            className="font-body text-sm font-medium text-gray-600 dark:text-gray-300"
                          >
                            Lihat Semua Publikasi
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-2 ml-4 flex flex-col space-y-2">
                          {item.dropdownItems?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className="font-body text-gray-600 dark:text-gray-300"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="font-heading text-lg font-semibold text-gray-900 dark:text-white border-b pb-1 border-gray-100 dark:border-gray-700"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>

              {/* Donate Link */}
              <div className="pt-2">
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="inline-block text-brand-yellow dark:text-brand-yellow font-heading font-semibold"
                >
                  Donasi & Kolaborasi
                </Link>
              </div>

              {/* Email Link */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                <Link
                  href="mailto:info@generasimelek.org"
                  className="flex items-center gap-2 text-gray-700 hover:text-brand-blue dark:text-gray-200 dark:hover:text-brand-blue transition-colors mt-2"
                >
                  <Mail className="h-5 w-5" />
                  <span className="font-medium">info@generasimelek.org</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-brand-pink text-white shadow-lg transition-all duration-300 z-50 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
}