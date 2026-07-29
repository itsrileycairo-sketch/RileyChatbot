'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// @ts-ignore: Abaikan error TS karena library ini tidak memiliki file deklarasi bawaan
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

export default function GithubGlobe() {
  const [mounted, setMounted] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null); 
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State untuk nyimpen ukuran dinamis biar responsif
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  // Data dummy lokasi kontribusi
  const arcData = [
    { startLat: -6.2088, startLng: 106.8456, endLat: 37.7749, endLng: -122.4194, color: ['#06b6d4', '#a855f7'] },
    { startLat: -6.2088, startLng: 106.8456, endLat: 51.5074, endLng: -0.1278, color: ['#06b6d4', '#ec4899'] },
    { startLat: -6.2088, startLng: 106.8456, endLat: 35.6895, endLng: 139.6917, color: ['#06b6d4', '#3b82f6'] },
  ];

  useEffect(() => {
    setMounted(true);
    
    // Kasih delay dikit biar Globe ke-render sempurna
    setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 1.5;
        // 🔥 FIX: Matiin zoom biar gak nyangkut pas di-scroll di HP
        globeRef.current.controls().enableZoom = false; 
      }
    }, 200);

    // Fungsi buat ngukur ulang ukuran div parent-nya secara otomatis
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Bikin aspect ratio 1:1 (kotak sempurna) berdasarkan lebar parent
        setDimensions({ width, height: width }); 
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize(); // Panggil saat pertama kali load

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!mounted) return <div className="h-[300px] w-full flex items-center justify-center animate-pulse bg-slate-800/20 rounded-3xl" />;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full" ref={containerRef}>
      <div 
        className="relative cursor-grab active:cursor-grabbing flex items-center justify-center"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* @ts-ignore */}
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height} // Otomatis menyesuaikan ukuran kotak
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          arcsData={arcData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1500}
          arcStroke={1.5}
        />
      </div>
      <p className="mt-4 text-xs sm:text-sm text-cyan-500/70 font-mono tracking-widest text-center">GLOBAL CONTRIBUTIONS</p>
    </div>
  );
}