import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- IMPORT NAVBAR DI SINI

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portofolio Riley", // Judul tab browser sudah disesuaikan
  description: "Digital portofolio milik Nolan Fortino Ramadhany",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id" // Ubah ke 'id' karena kontennya bahasa Indonesia
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      {/* Tambahkan pt-16 agar konten tidak tertabrak Navbar */}
      <body className="min-h-full flex flex-col pt-16" suppressHydrationWarning={true}>
        <Navbar /> {/* <-- PASANG KOMPONEN NAVBAR DI SINI */}
        {children}
      </body>
    </html>
  );
}