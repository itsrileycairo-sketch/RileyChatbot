'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Sembunyiin kursor bawaan sistem
    document.body.style.cursor = 'none';

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // Titik utama ngikutin mouse secara instan
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(calc(${clientX}px - 50%), calc(${clientY}px - 50%), 0)`;
      }

      // Lingkaran luar ngikutin dengan sedikit delay (efek jelly)
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.animate(
          {
            transform: `translate3d(calc(${clientX}px - 50%), calc(${clientY}px - 50%), 0)`,
          },
          { duration: 500, fill: 'forwards' }
        );
      }
    };

    // Deteksi kalau mouse lagi di atas tombol/link
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Titik Inti Kursor */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference shadow-[0_0_10px_#22d3ee]"
      />
      {/* Lingkaran Luar (Glow & Hover Effect) */}
      <div
        ref={cursorOutlineRef}
        className={`fixed top-0 left-0 border border-cyan-500/50 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out shadow-[0_0_20px_rgba(6,182,212,0.4)] ${
          isHovering ? 'w-16 h-16 bg-cyan-500/10' : 'w-8 h-8 bg-transparent'
        }`}
      />
    </>
  );
}