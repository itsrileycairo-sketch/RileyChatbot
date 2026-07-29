'use client';

// 🔥 FIX SAKTI: Tambahin kurung kurawal di sini!
import { GitHubCalendar } from 'react-github-calendar'; 

export default function GithubStats() {
  // GANTI DENGAN USERNAME GITHUB ASLI LU YA!
  const username = "itsrileycairo-sketch"; 

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 sm:p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] sm:rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500">
      
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">My Coding Activity</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Real-time GitHub Contributions</p>
      </div>

      <div className="overflow-x-auto w-full flex justify-center pb-2 custom-scrollbar">
        <GitHubCalendar 
          username={username} 
          blockSize={12}
          blockMargin={4}
          fontSize={12}
          colorScheme="dark" 
          theme={{
            dark: ['#0f172a', '#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6'],
          }}
        />
      </div>
      
    </div>
  );
}