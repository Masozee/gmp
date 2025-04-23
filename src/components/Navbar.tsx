"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Facebook, Instagram, Youtube, Search, ChevronUp, Globe } from "lucide-react";
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
import { debounce } from "@/lib/utils";

// Define the youth-oriented color palette
const YOUTH_COLORS = {
  yellow: "#fece5f",
  pink: "#eb6d93",
  blue: "#59c9f5",
  green: "#7baf3f"
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollState, setScrollState] = useState({
    scrolled: false,
    showScrollTop: false,
    deepScroll: false
  });

  // Memoize the debounced scroll handler
  const handleScroll = useCallback(
    debounce(() => {
      const scrollY = window.scrollY;
      setScrollState({
        scrolled: scrollY > 10,
        deepScroll: scrollY > 100,
        showScrollTop: scrollY > 300
      });
    }, 10),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Memoize derived values
  const { scrolled, showScrollTop, deepScroll } = scrollState;

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

  // Clean navigation for compact mode (like the image)
  const compactNavItems = [
    { name: "Products", href: "#", hasDropdown: true },
    { name: "Initiatives", href: "#", hasDropdown: true },
    { name: "Community", href: "#" },
    { name: "Stories", href: "#" },
    { name: "Newsletter", href: "#", isNew: true },
    { name: "About", href: "#", hasDropdown: true },
  ];

  // Language options
  const languages = [
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const [currentLang, setCurrentLang] = useState('id');

  return (
    <>
      {/* Default Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80"
            : "bg-white/60 backdrop-blur-sm dark:bg-gray-900/60"
        } ${deepScroll ? "transform -translate-y-full opacity-0" : "transform translate-y-0 opacity-100"}`}
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

            {/* Right section: Donate, Language, Dark Mode */}
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
              
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400 transition-colors">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {languages.find(lang => lang.code === currentLang)?.flag}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400 transition-colors">
                  <Globe className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                      <div className="mt-2 ml-4 flex flex-col space-y-2">
                        {item.dropdownItems.map((subItem) => (
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
                  className="inline-block text-emerald-600 dark:text-emerald-400 font-heading font-semibold"
                >
                  Donasi & Kolaborasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Compact Navbar (Like the image - appears on scroll) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          deepScroll ? "transform translate-y-0 opacity-100" : "transform -translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 pt-4 max-w-7xl">
          <div className="bg-[#7baf3f] dark:bg-[#7baf3f] rounded-full shadow-md flex items-center justify-between h-14 px-5">
            {/* Logo on left */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex items-center">
                  <Image 
                    src="/logos/logo.png" 
                    alt="GMP Icon" 
                    width={40} 
                    height={40}
                    className="h-8 w-8"
                  />
                </div>
              </Link>
            </div>

            {/* Centered navigation for desktop */}
            <div className="hidden md:flex items-center justify-center space-x-6 flex-1">
              {mainNavItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 font-heading font-semibold text-sm transition-all duration-200 focus:outline-none group hover:text-white/80 text-white">
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                          {item.name}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
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
                      href={item.href}
                      className="flex items-center font-semibold text-sm py-2 transition-colors duration-200 hover:text-white/80 text-white"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right side search and buttons */}
            <div className="flex items-center gap-4">
              {/* Search input */}
              <div className="relative hidden md:flex items-center mr-2">
                <Input
                  type="search"
                  placeholder="Cari artikel..."
                  className="pl-8 pr-4 h-8 w-40 rounded-full border-transparent focus:border-white dark:border-transparent dark:focus:border-white text-sm bg-white/20 text-white placeholder:text-white/70"
                />
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-white" />
              </div>

              {/* Language and dark mode */}
              <div className="hidden md:flex items-center space-x-3">
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-white hover:text-white/80 transition-colors">
                    <Globe className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-md text-white hover:bg-white/10 transition-colors md:hidden"
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

        {/* Mobile menu for compact navbar */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100 py-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="container mx-auto px-6 max-w-7xl bg-[#7baf3f] dark:bg-[#7baf3f] rounded-b-lg shadow-md">
            <div className="flex flex-col space-y-4 pb-6 pt-2">
              {/* Navigation */}
              <div className="flex flex-col space-y-2">
                {mainNavItems.map((item) => 
                  item.hasDropdown ? (
                    <div key={item.name}>
                      <div className="flex items-center justify-between pb-1 border-b border-white/20">
                        <Link 
                          href={item.href} 
                          onClick={() => setIsOpen(false)}
                          className="font-heading text-base font-semibold text-white"
                        >
                          {item.name}
                        </Link>
                        <ChevronDown className="h-4 w-4 text-white" />
                      </div>
                      <div className="mt-2 ml-4 flex flex-col space-y-2">
                        {item.dropdownItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className="font-body text-sm text-white/80"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="font-heading text-base font-semibold text-white pb-1 border-b border-white/20"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>

              {/* Search */}
              <div className="relative pt-2">
                <Input
                  type="search"
                  placeholder="Cari artikel..."
                  className="pl-9 pr-4 h-9 w-full rounded-full border-transparent focus:border-white text-sm bg-white/20 text-white placeholder:text-white/70"
                />
                <Search className="absolute left-3 top-[1.15rem] h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 z-50 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
}