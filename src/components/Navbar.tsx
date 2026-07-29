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
    { name: 'Uses', path: '/uses' },
    { name: 'Lab 🧪', path: '/lab' }, // 🔥 TAMBAHAN MENU LAB
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-40 transition-all duration-500 border-b ${
          scrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl shadow-lg shadow-cyan-500/5 border-slate-200/50 dark:border-cyan-500/10'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 group">
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-300 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] transition-all duration-300">
              Nolan
            </span>
            <span className="bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
              Portfolio
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative px-4 lg:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-300 bg-cyan-50/80 dark:bg-cyan-950/50 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.2)]'
                      : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span
                    className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-5 bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]'
                        : 'w-0 bg-cyan-400 group-hover:w-5 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                    }`}
                  />
                </Link>
              );
            })}

            <div className="ml-2 pl-4 border-l border-slate-200/60 dark:border-slate-700/50">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 rounded-full text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-cyan-400 transition-all duration-300 hover:scale-110 active:scale-95 bg-transparent hover:bg-slate-100/50 dark:hover:bg-white/5"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-cyan-400 transition-all duration-300 hover:scale-110 active:scale-95 bg-transparent hover:bg-slate-100/50 dark:hover:bg-white/5"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 flex items-center justify-center text-slate-700 dark:text-cyan-400 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90 scale-110' : 'rotate-0'}`}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </div>
            </button>
          </div>
        </div>

        {/* 🔥 FIX: Menu Mobile Diperbaiki (Bisa Di-Scroll & Anti Kepotong) */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl shadow-2xl border-t border-slate-200/70 dark:border-white/5 overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[calc(100dvh-80px)] opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'
          }`}
        >
          <div className="pt-6 px-6 flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-bold text-lg px-5 py-3.5 rounded-2xl transition-all flex items-center gap-3 backdrop-blur-sm ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-300 bg-gradient-to-r from-cyan-50/90 to-purple-50/90 dark:from-cyan-950/60 dark:to-purple-950/40 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]'
                      : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                        : 'bg-transparent border border-slate-300 dark:border-slate-600'
                    }`}
                  />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="h-20 w-full" aria-hidden="true"></div>
    </>
  );
}