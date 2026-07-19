'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';

export default function Blog() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_#22d3ee]"></div>
      <p className="text-cyan-600 dark:text-cyan-400 font-medium animate-pulse tracking-widest">LOADING ARTICLES...</p>
    </div>
  );

  const blogsList = data.blogs || [];

  return (
    <main className="min-h-screen bg-transparent text-slate-800 dark:text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 transition-colors">
      <Navbar />

      <div className="relative z-10 pt-32 pb-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-cyan-600 dark:text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">INSIGHTS</p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white transition-colors">
            Tech <span className="text-cyan-500">Blog</span>
          </h1>
        </div>

        {blogsList.length > 0 ? (
          <div className="space-y-8">
            {blogsList.map((blog: any) => (
              <article 
                key={blog.id} 
                className="bg-white dark:bg-[#0c0c1d] p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-colors shadow-lg"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer">
                  {blog.judul}
                </h2>
                
                <p className="text-xs text-cyan-600 dark:text-cyan-500 mb-6 font-mono tracking-wider transition-colors">
                  {new Date(blog.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap transition-colors">
                  {blog.konten_lengkap}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#0c0c1d] border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors">
            <p className="text-slate-500">Belum ada artikel yang dipublikasikan.</p>
          </div>
        )}
      </div>

      <Chatbot />
    </main>
  );
}