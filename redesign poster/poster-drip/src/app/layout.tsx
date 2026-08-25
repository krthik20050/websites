import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import LenisProvider from "@/components/LenisProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "Poster Drip - Premium Posters & Wall Art",
    template: "%s | Poster Drip",
  },
  description: "Premium posters & wall art delivered to your door. Anime, Sports, Aesthetic, Tamil Cinema, Custom & Bulk orders.",
  metadataBase: new URL("https://posterdrip.in"),
  openGraph: { type: "website", title: "Poster Drip" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white px-3 py-2 rounded text-sm z-50">Skip to content</a>
        <ThemeProvider>
          <CartProvider>
            <LenisProvider>
              <Header />
              <main id="main" className="flex-1 flex flex-col bg-white dark:bg-zinc-950">
                {children}
              </main>
              <Footer />
            </LenisProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
