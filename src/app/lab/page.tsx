'use client';

import { useState, useEffect } from 'react';
import { Sliders, Copy, CheckCircle2, FlaskConical, Sparkles } from 'lucide-react';

export default function ComponentLab() {
  const [mounted, setMounted] = useState(false);
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(40);
  const [border, setBorder] = useState(20);
  const [color, setColor] = useState('#06b6d4');
  const [copied, setCopied] = useState(false);

  // Mencegah error render sebelum klien siap
  useEffect(() => {
    setMounted(true);
  }, []);

  const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  const generatedCode = `
.glass-card {
  background: ${hexToRGBA(color, opacity)};
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: 1px solid ${hexToRGBA('#ffffff', border)};
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Jangan render apa-apa sampai browser siap (menghindari error merah di konsol)
  if (!mounted) return null;

  return (
    <div className="min-h-screen relative w-full bg-slate-50 dark:bg-[#050510] pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
      
      {/* Latar Belakang Pola Grid Otomatis (Tanpa Komponen Eksternal biar gak bentrok) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER LAB */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-semibold text-sm mb-6">
            <FlaskConical size={16} /> Experimental Zone
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            UI/UX <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">Component Lab</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Selamat datang di simulasi laboratorium kode. Geser slider di bawah ini untuk mendesain komponen "Glassmorphism" sesuka hati, dan salin kode CSS-nya secara real-time!
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* PANEL KONTROL (KIRI) */}
          <div className="lg:col-span-5 bg-white/60 dark:bg-[#0c0c1d]/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl z-20">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-8 flex items-center gap-3">
              <Sliders className="text-cyan-500" /> Kontrol Panel
            </h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Blur Intensity</label>
                  <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">{blur}px</span>
                </div>
                <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Background Opacity</label>
                  <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">{opacity}%</span>
                </div>
                <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Border Visibility</label>
                  <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">{border}%</span>
                </div>
                <input type="range" min="0" max="100" value={border} onChange={(e) => setBorder(Number(e.target.value))} className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 block">Theme Color</label>
                <div className="flex gap-3">
                  {['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#0f172a'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-white scale-125 shadow-lg' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Change color to ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PANEL PREVIEW & KODE (KANAN) */}
          <div className="lg:col-span-7 flex flex-col gap-8 z-20">
            
            <div className="relative w-full h-[300px] sm:h-[400px] rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050510] overflow-hidden flex items-center justify-center p-6"
                 style={{ backgroundImage: `radial-gradient(circle at center, ${hexToRGBA(color, 20)} 0%, transparent 70%)` }}>
              
              <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

              <div 
                className="relative z-10 w-full max-w-sm p-8 rounded-[24px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col items-center text-center transition-all duration-300"
                style={{
                  background: hexToRGBA(color, opacity),
                  backdropFilter: `blur(${blur}px)`,
                  WebkitBackdropFilter: `blur(${blur}px)`,
                  border: `1px solid ${hexToRGBA('#ffffff', border)}`
                }}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-inner border border-white/30">
                  <Sparkles className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">Glassmorphism</h3>
                <p className="text-white/80 text-sm font-medium">Ini adalah preview dari desain yang Anda buat.</p>
              </div>
            </div>

            <div className="relative w-full rounded-[2rem] bg-[#0f172a] border border-slate-700 p-6 overflow-hidden group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Generated CSS</span>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />} 
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="text-sm font-mono text-cyan-300 overflow-x-auto custom-scrollbar pb-2">
                <code>{generatedCode}</code>
              </pre>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}