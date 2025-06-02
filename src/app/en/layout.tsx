import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partisipasi Muda Foundation - Political Education for Indonesian Youth",
  description: "Empowering Indonesian youth aged 17-25 with political education and civic engagement opportunities.",
  keywords: ["political education", "Indonesian youth", "civic engagement", "Partisipasi Muda", "democracy", "youth empowerment"],
  authors: [{ name: "Partisipasi Muda Foundation" }],
  icons: {
    icon: '/images/logo/favicon.png',
    apple: '/images/logo/favicon.png',
  },
  openGraph: {
    title: "Partisipasi Muda Foundation",
    description: "Empowering Indonesian youth with political education",
    url: "https://partisipasimuda.org/en",
    siteName: "Partisipasi Muda Foundation",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partisipasi Muda Foundation",
    description: "Empowering Indonesian youth with political education",
    creator: "@partisipasimuda",
  },
};

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
} 