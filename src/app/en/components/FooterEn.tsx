'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface SocialMediaSetting {
  id: number;
  platform: string;
  url: string;
  displayName: string;
  order: number;
}

const FooterEn = () => {
  const [socialMediaSettings, setSocialMediaSettings] = useState<SocialMediaSetting[]>([]);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch('/api/social-media');
        const data = await response.json();
        
        if (data.success) {
          setSocialMediaSettings(data.data);
        }
      } catch (error) {
        console.error('Error fetching social media settings:', error);
      }
    };

    fetchSocialMedia();
  }, []);

  // Get SVG icon for social media platform
  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    
    switch (platformLower) {
      case 'facebook':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 715.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 712.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 712 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  return (
    <footer className="bg-[#f06d98] text-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src="/logo/logowhite.png"
                alt="Partisipasi Muda Logo"
                width={160}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>
            <p className="text-white mb-4">
              Partisipasi Muda Foundation is a dynamic and dedicated non-profit organization committed to transforming Indonesia's democratic culture so that young voices are heard and impactful.
            </p>
            <div className="flex space-x-4">
              {socialMediaSettings.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-primary transition"
                  aria-label={social.displayName}
                  title={social.displayName}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/en/about-us/goals"
                  className="text-white hover:text-primary transition"
                >
                  Our Goals
                </Link>
              </li>
              <li>
                <Link
                  href="/en/about-us/journey"
                  className="text-white hover:text-primary transition"
                >
                  Our Journey
                </Link>
              </li>
              <li>
                <Link
                  href="/en/about-us/board-management"
                  className="text-white hover:text-primary transition"
                >
                  Board & Management
                </Link>
              </li>
              <li>
                <Link
                  href="/en/programs/discussions"
                  className="text-white hover:text-primary transition"
                >
                  Public Discussions
                </Link>
              </li>
              <li>
                <Link
                  href="/en/programs/candidate-meetings"
                  className="text-white hover:text-primary transition"
                >
                  Candidate Meetings
                </Link>
              </li>
              <li>
                <Link
                  href="/en/publications"
                  className="text-white hover:text-primary transition"
                >
                  Publications
                </Link>
              </li>
              <li>
                <Link
                  href="/en/events"
                  className="text-white hover:text-primary transition"
                >
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              Get Involved
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/en/donate"
                  className="text-white hover:text-primary transition"
                >
                  Donate & Collaborate
                </Link>
              </li>
              <li>
                <Link
                  href="/en/careers"
                  className="text-white hover:text-primary transition"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/en/strategic-partners"
                  className="text-white hover:text-primary transition"
                >
                  Strategic Partners
                </Link>
              </li>
            </ul>
            
            {/* Language Switcher */}
            <div className="mt-6">
              <h3 className="text-lg font-heading font-semibold mb-4 text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                Language
              </h3>
              <div className="flex flex-col space-y-2">
                <span className="text-left text-white font-bold">
                  English
                </span>
                <Link 
                  href="/"
                  className="text-left text-white hover:text-primary transition"
                >
                  Bahasa Indonesia
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              Yayasan Partisipasi Muda
            </h3>
            <address className="not-italic text-white">
              <p className="mb-2 text-white">
                Bintaro Business Center, 4th Floor, Unit 410, Jl. RC. Veteran
                Raya No.1i RT.1/RW.3, Bintaro, Kec. Pesanggrahan, Kota Jakarta
                Selatan 12330
              </p>
              <p className="mb-2 text-white">
                Email:{" "}
                <a
                  href="mailto:admin@partisipasimuda.org"
                  className="text-white hover:text-primary transition"
                >
                  admin@partisipasimuda.org
                </a>
              </p>
              <p className="text-white">
                Phone:{" "}
                <a
                  href="https://wa.me/6281292310996"
                  target="_blank"
                  className="text-white hover:text-primary transition"
                >
                  +62 812 9231 0996
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-white">
          <p className="text-white">
            &copy; {new Date().getFullYear()} Yayasan Partisipasi Muda. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterEn; 