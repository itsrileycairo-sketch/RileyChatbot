'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null; // Mencegah error render

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 transition-colors duration-500">
      {/* 🔥 FIX: Background Dasar Otomatis (Putih di Light Mode, Hitam di Dark Mode) */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#050510] transition-colors duration-500"></div>
      
      {/* Efek Bintang Titik-Titik */}
      <div 
        className="absolute inset-0 transition-opacity duration-500" 
        style={{ 
          // Titik abu-abu muda di Light, titik cyan di Dark
          backgroundImage: `radial-gradient(circle at center, ${isDark ? '#22d3ee' : '#cbd5e1'} 1px, transparent 1px)`, 
          backgroundSize: '40px 40px',
          opacity: isDark ? 0.3 : 0.4
        }}
      ></div>
      
      {/* Orb 1 Bergerak 3D */}
      <div 
        className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000 ease-out ${isDark ? 'bg-cyan-600/15' : 'bg-cyan-200/40'}`}
        style={{ 
          top: '10%', left: '20%',
          transform: `translate(${mousePosition.x * -60}px, ${mousePosition.y * -60}px)` 
        }}
      ></div>

      {/* Orb 2 Bergerak 3D */}
      <div 
        className={`absolute w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000 ease-out ${isDark ? 'bg-purple-600/15' : 'bg-purple-200/40'}`}
        style={{ 
          bottom: '10%', right: '10%',
          transform: `translate(${mousePosition.x * 80}px, ${mousePosition.y * 80}px)` 
        }}
      ></div>
    </div>
  );
}