'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-black text-2xl text-blue-700 flex items-center gap-2">
          <Code2 size={28} /> Riley.
        </Link>
        <div className="flex gap-6 font-semibold text-gray-600">
          <Link href="/" className={`hover:text-blue-600 transition ${pathname === '/' ? 'text-blue-700' : ''}`}>Beranda</Link>
          <Link href="/about" className={`hover:text-blue-600 transition ${pathname === '/about' ? 'text-blue-700' : ''}`}>Tentang</Link>
          <Link href="/portfolio" className={`hover:text-blue-600 transition ${pathname === '/portfolio' ? 'text-blue-700' : ''}`}>Karya</Link>
          <Link href="/contact" className={`hover:text-blue-600 transition ${pathname === '/contact' ? 'text-blue-700' : ''}`}>Kontak</Link>
        </div>
      </div>
    </nav>
  );
}