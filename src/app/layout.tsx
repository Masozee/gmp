import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AccessibilityButton from "./components/AccessibilityButton";
import { AccessibilityProvider } from "@/lib/accessibility-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yayasan Partisipasi Muda - Political Education for Indonesian Youth",
  description: "Empowering Indonesian youth aged 17-25 with political education and civic engagement opportunities.",
  keywords: ["political education", "Indonesian youth", "civic engagement", "Partisipasi Muda", "democracy", "youth empowerment"],
  authors: [{ name: "Yayasan Partisipasi Muda" }],
  icons: {
    icon: '/images/logo/favicon.png',
    apple: '/images/logo/favicon.png',
  },
  openGraph: {
    title: "Yayasan Partisipasi Muda",
    description: "Empowering Indonesian youth with political education",
    url: "https://partisipasimuda.org",
    siteName: "Yayasan Partisipasi Muda",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yayasan Partisipasi Muda",
    description: "Empowering Indonesian youth with political education",
    creator: "@partisipasimuda",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/images/logo/favicon.png" />
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Annapurna+SIL:wght@400;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap&apos;);
        </style>
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <AccessibilityProvider>
          <a href="#main-content" className="skip-to-content">
            Loncat ke konten utama
          </a>
        <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <AccessibilityButton />
        <Footer />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
