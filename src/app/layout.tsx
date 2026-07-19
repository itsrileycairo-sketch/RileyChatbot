import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import InteractiveBackground from "@/components/InteractiveBackground";
import { ThemeProvider } from "@/components/ThemeProvider";
import VisitorTracker from "@/components/VisitorTracker";
import AuthProvider from "@/components/AuthProvider"; // 🔥 IMPORT AUTH PROVIDER

const inter = Inter({ subsets: ["latin"] });

// 🔥 PENGATURAN SEO & DYNAMIC OPEN GRAPH (GAMBAR WHATSAPP/TWITTER)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const metadata: Metadata = {
  title: "Nolan Portfolio | Full Stack Developer",
  description: "Mahakarya digital oleh Nolan Fortino",
  openGraph: {
    title: "Nolan Portfolio | Full Stack Developer",
    description: "Jelajahi mahakarya digital dan pengalaman profesional saya.",
    // Mengarahkan gambar ke API OG Generator kita
    images: [`${baseUrl}/api/og?title=Nolan%20Portfolio&desc=Full-Stack%20Web%20Developer`],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${baseUrl}/api/og?title=Nolan%20Portfolio&desc=Full-Stack%20Web%20Developer`],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-[#050510] text-slate-800 dark:text-slate-300 transition-colors duration-500 selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <AuthProvider> {/* 🔥 BUNGKUS DENGAN SISTEM KEAMANAN */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <VisitorTracker />
            <InteractiveBackground />
            <Navbar />
            
            {/* 🔥 pt-20 DIHAPUS DARI SINI SUPAYA ADMIN TIDAK KOSONG DI ATAS */}
            <div className="relative z-10">
              {children}
            </div>
            
            <Chatbot />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}