'use client';

import { Code2, Database, Layout, Smartphone, Server, Globe, Cpu, Layers } from 'lucide-react';

export default function TechMarquee() {
  const techList = [
    { name: "Next.js", icon: Globe },
    { name: "React", icon: Layout },
    { name: "TypeScript", icon: Code2 },
    { name: "Tailwind CSS", icon: Layers },
    { name: "Node.js", icon: Server },
    { name: "MySQL", icon: Database },
    { name: "REST API", icon: Cpu },
    { name: "Responsive", icon: Smartphone },
  ];

  // Diduplikat biar jalannya infinite (gak putus)
  const marqueeItems = [...techList, ...techList];

  return (
    <div className="w-full bg-slate-900/5 dark:bg-black/40 border-y border-slate-200 dark:border-white/10 py-6 overflow-hidden relative flex items-center">
      {/* Bayangan efek fade di kiri dan kanan */}
      <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-slate-50 dark:from-[#050510] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-slate-50 dark:from-[#050510] to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex animate-[marquee_20s_linear_infinite] w-max whitespace-nowrap">
        {marqueeItems.map((tech, i) => (
          <div key={i} className="flex items-center gap-3 px-8 text-slate-600 dark:text-slate-400 group cursor-default">
            <tech.icon size={24} className="text-cyan-500/70 group-hover:text-cyan-400 group-hover:scale-125 transition-all duration-300" />
            <span className="font-bold text-lg tracking-widest uppercase group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{tech.name}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}