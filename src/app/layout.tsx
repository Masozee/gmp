import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "./components/ConditionalNavbar";
import ConditionalFooter from "./components/ConditionalFooter";
import ConditionalAccessibilityButton from "./components/ConditionalAccessibilityButton";
import ConditionalSkipLink from "./components/ConditionalSkipLink";
import { AccessibilityProvider } from "@/lib/accessibility-context";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

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
    icon: [{ url: '/images/logo/favicon.png' }],
    apple: [{ url: '/images/logo/favicon.png' }],
    shortcut: [{ url: '/images/logo/favicon.png' }],
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
        {/* Favicon is now handled by metadata config */}
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Ancizar+Serif:ital,wght@0,300..900;1,300..900&family=Figtree:ital,wght@0,300..900;1,300..900&family=Inter:wght@100..900&display=swap');`}
        </style>
      </head>
      <body
        className={`${figtree.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AccessibilityProvider>
          <ConditionalSkipLink />
        <ConditionalNavbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <ConditionalAccessibilityButton />
        <ConditionalFooter />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
