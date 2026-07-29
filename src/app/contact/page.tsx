'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [pesanBalasan, setPesanBalasan] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data;
      try { data = await res.json(); } catch(err) { throw new Error("Server Crash / Bukan JSON"); }

      if (res.ok) {
        setStatus('success');
        setPesanBalasan(data.message);
        setFormData({ nama: '', email: '', pesan: '' });
      } else {
        setStatus('error');
        setPesanBalasan(`Gagal: ${data.error} | Detail: ${data.detail || ''}`);
      }
    } catch (error) {
      setStatus('error');
      setPesanBalasan('Terjadi kesalahan jaringan. Cek Terminal VS Code.');
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 min-h-screen relative z-10 flex flex-col items-center justify-center" suppressHydrationWarning>
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white transition-colors">
          Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Connect</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm md:text-base transition-colors font-light max-w-lg mx-auto">
          Punya ide proyek atau sekadar ingin menyapa? Pesan Anda akan langsung masuk ke database Admin secara real-time.
        </p>
      </div>

      <div className="w-full bg-white/60 dark:bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-colors animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        
        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-100/50 dark:bg-green-900/30 border border-green-500/50 rounded-2xl flex items-center gap-3 text-green-700 dark:text-green-400 backdrop-blur-sm transition-colors">
            <CheckCircle2 /> {pesanBalasan}
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-100/50 dark:bg-red-900/30 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-400 text-sm backdrop-blur-sm transition-colors">
            <AlertCircle className="flex-shrink-0" /> {pesanBalasan}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide transition-colors">Nama Anda</label>
              <input type="text" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full bg-slate-50/50 dark:bg-[#131326]/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide transition-colors">Email</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50/50 dark:bg-[#131326]/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide transition-colors">Pesan Keperluan</label>
            <textarea rows={5} required value={formData.pesan} onChange={e => setFormData({...formData, pesan: e.target.value})} className="w-full bg-slate-50/50 dark:bg-[#131326]/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 resize-none"></textarea>
          </div>
          <button type="submit" disabled={status === 'loading'} className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-500 dark:to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_15px_30px_rgba(6,182,212,0.4)] active:scale-[0.98]">
            {status === 'loading' ? 'MENGIRIM...' : <><Send size={18} /> KIRIM PESAN KE ADMIN</>}
          </button>
        </form>
      </div>
    </main>
  );
}