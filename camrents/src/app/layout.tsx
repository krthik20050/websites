import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "CamRents Thrissur: Premium Camera Rentals in Kerala",
    template: "%s | CamRents Thrissur",
  },
  description:
    "Rent premium cameras, lenses, and accessories in Thrissur, Kerala. Sony, Canon, and Nikon gear available for daily, weekly, and monthly rentals. Safe local shop pickup.",
  openGraph: {
    title: "CamRents Thrissur",
    description: "Premium camera rentals in Thrissur, Kerala.",
    locale: "en_IN",
    siteName: "CamRents Thrissur",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans antialiased dark", geist.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || !theme) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-surface text-foreground">
        <div className="noise-overlay" aria-hidden="true" />
        <div className="mesh-gradient" aria-hidden="true" />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
