"use client";

import { useState, useEffect } from "react";
import { Terminal, Monitor } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";
import CyberpunkLoading from "@/components/CyberpunkLoading";

export default function Uses() {
  const [setupItems, setSetupItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUses = async () => {
      try {
        // 🔥 PERBAIKAN: TEMBAK LANGSUNG KE TABEL uses_setup, BUKAN portfolio!
        const res = await fetch("/api/admin-data?table=uses_setup", {
          cache: "no-store",
        });
        if (res.ok) {
          const usesData = await res.json();

          // 🔥 PERBAIKAN FILTER: Pakai .includes biar "Hardware (Workstation)" tetep masuk!
          const groupedData = [
            {
              category: "Hardware",
              icon: Monitor,
              items: usesData.filter((item: any) =>
                item.kategori?.toLowerCase().includes("hard"),
              ),
            },
            {
              category: "Software",
              icon: Terminal,
              items: usesData.filter((item: any) =>
                item.kategori?.toLowerCase().includes("soft"),
              ),
            },
          ].filter((group) => group.items.length > 0);

          setSetupItems(groupedData);
        }
      } catch (error) {
        console.error("Gagal load uses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUses();
  }, []);

  if (isLoading) {
    return <CyberpunkLoading text="Loading Setup..." />;
  }

  return (
    <div className="min-h-screen relative z-10 pt-28 pb-20 px-4 sm:px-6">
      <InteractiveBackground />

      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight drop-shadow-md">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
              Gear & Setup
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Daftar lengkap software, hardware, dan teknologi yang saya gunakan
            sehari-hari untuk merancang dan membangun website modern.
          </p>
        </div>

        {setupItems.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm">
            Belum ada alat tempur di database. Tambahkan lewat Admin!
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {setupItems.map((group, index) => (
              <div
                key={index}
                className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-6 sm:p-8 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <group.icon className="text-cyan-500" size={28} />
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                    {group.category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {group.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="group p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <h3 className="font-bold text-slate-900 dark:text-cyan-400 mb-1 flex items-center gap-2">
                        {item.nama_item}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                        {item.deskripsi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
