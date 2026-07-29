'use client';

export default function CyberpunkLoading({ text = "Decrypting Database..." }: { text?: string }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-transparent relative z-10">
      <div className="relative flex flex-col items-center">
        {/* Lingkaran Radar Hologram */}
        <div className="w-24 h-24 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin absolute opacity-40 blur-[1px]"></div>
        <div className="w-16 h-16 rounded-full border-b-2 border-l-2 border-purple-500 animate-[spin_2s_linear_infinite_reverse] absolute mt-4 opacity-60"></div>
        
        {/* Core Element */}
        <div className="w-8 h-8 bg-cyan-400 rounded-sm animate-pulse shadow-[0_0_30px_#22d3ee] mt-8 mb-12 rotate-45"></div>

        {/* Teks Futuristic */}
        <div className="flex flex-col items-center space-y-2 mt-4">
          <p className="text-cyan-600 dark:text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
            Establishing Link
          </p>
          <div className="w-48 h-[2px] bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-full origin-left animate-[scale-x_1.5s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">
            {text}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scale-x {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}