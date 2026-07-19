'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ];

  // 🔥 Navbar otomatis HILANG di halaman admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-40 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-white/90 dark:bg-[#050510]/90 backdrop-blur-md shadow-lg border-slate-200 dark:border-cyan-900/20' 
            : 'bg-white dark:bg-[#050510] border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-wide flex items-center gap-2">
            <span className="text-cyan-600 dark:text-cyan-400">Nolan</span> 
            <span className="text-purple-600 dark:text-purple-500">Portfolio</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></span>
                  )}
                </Link>
              );
            })}

            {/* SAKELAR MATAHARI & BULAN (DESKTOP) */}
            <div className="ml-2 pl-4 border-l border-slate-200 dark:border-slate-700">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 rounded-full text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-cyan-400 bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 transition-all duration-300"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Header Buttons */}
          <div className="flex md:hidden items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-cyan-400 bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 flex items-center justify-center text-slate-700 dark:text-cyan-400 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </div>
            </button>
          </div>
        </div>

        {/* Dropdown Menu Mobile */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-[#050510]/95 backdrop-blur-2xl shadow-2xl border-t border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-6 px-6 flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-bold text-lg px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    isActive 
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-transparent'}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 🔥 INI RUANG KOSONG PENGGANTI pt-20 DI LAYOUT */}
      {/* Dia hanya akan muncul kalau Navbar muncul! */}
      <div className="h-20 w-full" aria-hidden="true"></div>
    </>
  );
}