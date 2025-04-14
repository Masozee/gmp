import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeContextProvider } from "@/components/theme-context";
import "./globals.css";
import { cn } from "@/lib/utils";
import { sora } from "@/lib/fonts";

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generasi Melek Politik",
  description: "Official website of Generasi Melek Politik",
  icons: {
    icon: "/logos/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          sora.variable,
          ptSerif.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeContextProvider>
            {children}
          </ThemeContextProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
