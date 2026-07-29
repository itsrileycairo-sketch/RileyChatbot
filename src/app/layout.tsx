import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import InteractiveBackground from "@/components/InteractiveBackground";
import { ThemeProvider } from "@/components/ThemeProvider";
import VisitorTracker from "@/components/VisitorTracker";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

// 🔥 JURUS 1: GEMBOK ZOOMING DI HP (Viewport Lock)
// Ini bakal maksa HP lu buat mentok di ukuran layar, gak bisa di-zoom out / zoom in!
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, 
};

// 🔥 JURUS METADATA SAKTI (Biar Thumbnail WA Nongol!)
export const metadata: Metadata = {
  title: "Nolan Portfolio | Full Stack Developer",
  description: "Mahakarya digital oleh Nolan Fortino",
  // PENTING: Ganti URL ini otomatis ngebimbing WhatsApp ke alamat asli lu!
  metadataBase: new URL("https://riley-chatbot.vercel.app"), 
  openGraph: {
    title: "Nolan Portfolio | Full Stack Developer",
    description: "Jelajahi mahakarya digital dan pengalaman profesional saya.",
    url: "https://riley-chatbot.vercel.app",
    siteName: "Nolan Portfolio",
    images: [
      {
        url: "/api/og?title=Nolan%20Portfolio&desc=Full-Stack%20Web%20Developer",
        width: 1200,
        height: 630,
        alt: "Nolan Portfolio Thumbnail",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nolan Portfolio | Full Stack Developer",
    description: "Jelajahi mahakarya digital dan pengalaman profesional saya.",
    images: ["/api/og?title=Nolan%20Portfolio&desc=Full-Stack%20Web%20Developer"],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      {/* Hapus overflow dari body, karena di HP sering dicuekin */}
      <body className={`${inter.className} bg-slate-50 dark:bg-[#050510] text-slate-800 dark:text-slate-300 transition-colors duration-500 selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            
            {/* 🔥 JURUS 2: KANDANG MASTER ANTI-BOCOR (Master Wrapper) */}
            {/* Sekarang Background, Navbar, Page, Chatbot DIBUNGKUS di dalam satu Div yang ketat! */}
            <div className="relative flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden">
              
              <VisitorTracker />
              <InteractiveBackground />
              <Navbar />
              
              {/* Tempat Page.tsx lu dirender */}
              <div className="relative z-10 w-full flex-grow">
                {children}
              </div>
              
              <Chatbot />
              
            </div>
            {/* 🔥 KANDANG MASTER SELESAI */}

          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}