"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Facebook, Instagram, Youtube, Search, ChevronUp } from "lucide-react";
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
    { name: "Publikasi", href: "/publications" },
    { name: "Acara", href: "/events" },
    { name: "Mitra Strategis", href: "/partners" },
  ];

  // Social media links
  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "YouTube", href: "#", icon: Youtube },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80"
            : "bg-white/60 backdrop-blur-sm dark:bg-gray-900/60"
        }`}
      >
        {/* Top Navigation Bar */}
        <div className="container mx-auto px-6 max-w-7xl border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image 
                src="/logos/Logo-name-stack.png" 
                alt="Generasi Melek Politik" 
                width={120} 
                height={28}
                className="h-6 md:h-7 w-auto transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Right section: Donate, Collaborate, Social Media, Dark Mode */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Link 
                  href="/donate" 
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400 transition-colors hover:scale-105 transform duration-200"
                >
                  Donasi & Kolaborasi
                </Link>
                
              </div>
              
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-125"
                    aria-label={link.name}
                  >
                    <link.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              
              <ModeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-4 md:hidden">
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
          <div className="flex items-center justify-between h-16">
            {/* Left aligned menu items */}
            <div className="flex items-center gap-8">
              {mainNavItems.map((item) => (
                item.hasDropdown ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className="flex items-center gap-1 font-heading font-semibold text-base transition-all duration-200 focus:outline-none group hover:text-emerald-600 dark:hover:text-emerald-400 text-gray-700 dark:text-gray-200">
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {item.name}
                      </span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                      {item.dropdownItems.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.name} asChild>
                          <Link 
                            href={dropdownItem.href} 
                            className="cursor-pointer font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            {dropdownItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="font-heading font-semibold text-base text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400 transition-all duration-200 hover:translate-x-0.5"
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
                  className="pl-10 pr-4 h-10 rounded-full border-gray-200 focus:border-emerald-300 dark:border-gray-700 dark:focus:border-emerald-700 transition-all duration-300 group-hover:shadow-md"
                />
                <Search className="absolute left-3 h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300" />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-300"
                >
                  <span className="sr-only">Search</span>
                  <ChevronDown className="h-4 w-4 -rotate-90 transition-transform duration-300 group-hover:scale-110" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100 py-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col space-y-4 pb-6">
              {/* Mobile Search */}
              <div className="relative w-full mb-4">
                <Input
                  type="search"
                  placeholder="Cari artikel..."
                  className="pl-10 pr-4 h-10 w-full rounded-full border-gray-200 focus:border-emerald-300 dark:border-gray-700 dark:focus:border-emerald-700"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              
              {/* Main Nav Items */}
              {mainNavItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div className="space-y-2">
                      <div className="font-heading font-semibold py-2 text-base text-gray-700 dark:text-gray-200">
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-2 border-l-2 border-emerald-200 dark:border-emerald-800">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            onClick={() => setIsOpen(false)}
                            className="block font-heading text-sm py-1 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="font-heading font-semibold py-2 text-base text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400 transition-colors duration-200 block"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Separator */}
              <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-2"></div>

              {/* Secondary Nav Items */}
              <div className="flex space-x-4">
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200"
                >
                  Donasi
                </Link>
                <Link
                  href="/collaborate"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200"
                >
                  Kolaborasi
                </Link>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4 items-center">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors duration-200"
                    aria-label={link.name}
                  >
                    <link.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-emerald-500 text-white shadow-lg transition-all duration-300 z-50 hover:bg-emerald-600 transform hover:scale-110 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
        }`}
        aria-label="Return to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
} 