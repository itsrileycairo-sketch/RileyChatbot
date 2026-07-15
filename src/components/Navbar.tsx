'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Download } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efek transparan saat discroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-3xl font-black tracking-tighter text-gray-900 flex items-center gap-1 hover:scale-105 transition-transform">
            <span className="text-blue-600">&lt;/&gt;</span> Riley<span className="text-blue-600">.</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#beranda" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Beranda</Link>
            <Link href="#tentang" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Tentang</Link>
            <Link href="#keahlian" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Keahlian</Link>
            <Link href="#karya" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">Karya</Link>
            <a href="#kontak" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-blue-200 flex items-center gap-2">
              Hubungi Saya
            </a>
          </div>

          {/* Tombol Hamburger Mobile */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-800 hover:text-blue-600 focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu Mobile */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-4 px-6 flex flex-col space-y-4">
          <Link href="#beranda" onClick={() => setIsOpen(false)} className="text-gray-700 font-bold hover:text-blue-600">Beranda</Link>
          <Link href="#tentang" onClick={() => setIsOpen(false)} className="text-gray-700 font-bold hover:text-blue-600">Tentang</Link>
          <Link href="#keahlian" onClick={() => setIsOpen(false)} className="text-gray-700 font-bold hover:text-blue-600">Keahlian</Link>
          <Link href="#karya" onClick={() => setIsOpen(false)} className="text-gray-700 font-bold hover:text-blue-600">Karya</Link>
          <a href="#kontak" onClick={() => setIsOpen(false)} className="bg-blue-600 text-center text-white px-5 py-3 rounded-xl font-bold">Hubungi Saya</a>
        </div>
      )}
    </nav>
  );
}