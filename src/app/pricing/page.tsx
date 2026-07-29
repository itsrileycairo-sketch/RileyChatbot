'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import CyberpunkLoading from '@/components/CyberpunkLoading';

export default function Pricing() {
  const [data, setData] = useState<any>(null);

  useEffect(() => { fetch('/api/portfolio').then(res => res.json()).then(setData); }, []);

  if (!data) return <CyberpunkLoading text="Loading Service Packages..." />;

  const pricingList = data.pricing || [];

  return (
    <main className="min-h-screen relative z-10 text-slate-800 dark:text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 transition-colors">
      <div className="pt-32 pb-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">
             <span className="w-8 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span> INVESTMENT <span className="w-8 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white transition-colors">
            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Pricing</span>
          </h1>
        </div>

        {pricingList.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {pricingList.map((paket: any, index: number) => (
              <div 
                key={paket.id} 
                style={{ animationDelay: `${index * 200}ms` }}
                className={`bg-white/60 dark:bg-[#0c0c1d]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border transition-all duration-500 shadow-xl animate-fade-in-up hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(6,182,212,0.2)] ${
                  paket.is_popular 
                    ? 'border-cyan-500 relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(34,211,238,0.2)] ring-1 ring-cyan-400/50' 
                    : 'border-white/50 dark:border-slate-800 hover:border-cyan-400/50'
                }`}
              >
                {paket.is_popular === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest shadow-lg shadow-cyan-500/30 animate-pulse">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{paket.nama_paket}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 h-10 line-clamp-2 transition-colors font-light">{paket.deskripsi}</p>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 mb-8">{paket.harga}</div>
                
                <ul className="space-y-4 mb-8">
                  {paket.fitur?.split(',').map((fiturItem: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 transition-colors font-light">
                      <Check size={18} className="text-cyan-500 flex-shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" /> 
                      <span>{fiturItem.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 dark:bg-[#0c0c1d]/60 backdrop-blur-md border border-white/50 dark:border-slate-800 rounded-3xl transition-colors">
            <p className="text-slate-500">Belum ada paket harga yang ditambahkan dari Admin.</p>
          </div>
        )}
      </div>
    </main>
  );
}