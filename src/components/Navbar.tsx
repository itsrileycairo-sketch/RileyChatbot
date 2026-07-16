'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Download } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-white/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Logo dengan animasi hover */}
          <Link
            href="/"
            className="text-3xl font-black tracking-tighter text-gray-900 flex items-center gap-1 group"
          >
            <span className="text-blue-600 transition-transform duration-300 group-hover:rotate-12 inline-block">
              &lt;/&gt;
            </span>{' '}
            Riley
            <span className="text-blue-600 transition-all duration-300 group-hover:ml-1">.</span>
          </Link>

          {/* Menu Desktop - Link dengan underline animasi */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-8">
            {[
              { href: '#beranda', label: 'Beranda' },
              { href: '#tentang', label: 'Tentang' },
              { href: '#keahlian', label: 'Keahlian' },
              { href: '#karya', label: 'Karya' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </Link>
            ))}
            <a
              href="#kontak"
              className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              Hubungi Saya
            </a>
          </div>

          {/* Tombol Hamburger Mobile dengan animasi */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-800 hover:text-blue-600 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </div>
          </button>
        </div>
      </div>

      {/* Dropdown Menu Mobile - Desain Futuristik */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-2xl shadow-2xl border-t border-white/30 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="py-6 px-6 flex flex-col space-y-5">
          {[
            { href: '#beranda', label: 'Beranda' },
            { href: '#tentang', label: 'Tentang' },
            { href: '#keahlian', label: 'Keahlian' },
            { href: '#karya', label: 'Karya' },
          ].map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-800 font-bold text-lg hover:text-blue-600 transition-all transform hover:translate-x-2 flex items-center gap-3 group"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
              {item.label}
            </Link>
          ))}
          <a
            href="#kontak"
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white px-6 py-3.5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95"
          >
            Hubungi Saya
          </a>
        </div>
      </div>

      {/* CSS tambahan untuk animasi kustom */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-link-anim {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </nav>
  );
}