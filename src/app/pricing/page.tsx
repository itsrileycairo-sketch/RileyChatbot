'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import { Check } from 'lucide-react';

export default function Pricing() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_#22d3ee]"></div>
      <p className="text-cyan-600 dark:text-cyan-400 font-medium animate-pulse tracking-widest">LOADING PRICING...</p>
    </div>
  );

  const pricingList = data.pricing || [];

  return (
    <main className="min-h-screen bg-transparent text-slate-800 dark:text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 transition-colors">
      <Navbar />

      <div className="relative z-10 pt-32 pb-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">INVESTMENT</p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white transition-colors">
            Service <span className="text-cyan-500">Pricing</span>
          </h1>
        </div>

        {pricingList.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {pricingList.map((paket: any) => (
              <div 
                key={paket.id} 
                className={`bg-white dark:bg-[#0c0c1d] rounded-3xl p-8 border transition-all duration-300 shadow-lg ${
                  paket.is_popular 
                    ? 'border-cyan-500 relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-600'
                }`}
              >
                {paket.is_popular === 1 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{paket.nama_paket}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 h-10 line-clamp-2 transition-colors">{paket.deskripsi}</p>
                <div className="text-4xl font-black text-cyan-600 dark:text-cyan-400 mb-8 transition-colors">{paket.harga}</div>
                
                <ul className="space-y-4 mb-8">
                  {paket.fitur?.split(',').map((fiturItem: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                      <Check size={18} className="text-cyan-500 flex-shrink-0 mt-0.5" /> 
                      <span>{fiturItem.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#0c0c1d] border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors">
            <p className="text-slate-500">Belum ada paket harga yang ditambahkan dari Admin.</p>
          </div>
        )}
      </div>

      <Chatbot />
    </main>
  );
}