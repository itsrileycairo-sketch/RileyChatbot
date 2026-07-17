'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// IMPORT BARU: Alat untuk membaca Markdown & Rumus Matematika
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

/* ---------- KOMPONEN ROBOT BERGERAK ---------- */
const RobotLogo = () => (
  <div className="relative w-10 h-10 sm:w-11 sm:h-11">
    <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]">
      <g className="origin-bottom animate-[antenna_2s_ease-in-out_infinite]">
        <line x1="20" y1="2" x2="20" y2="8" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="2" r="2.5" fill="#60a5fa" className="animate-pulse" />
      </g>
      <rect x="8" y="8" width="24" height="20" rx="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
      <ellipse cx="15" cy="17" rx="3" ry="3.5" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
      <ellipse cx="15" cy="17" rx="1.5" ry="1.5" fill="#facc15" className="animate-[blink_3s_infinite]" />
      <ellipse cx="25" cy="17" rx="3" ry="3.5" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
      <ellipse cx="25" cy="17" rx="1.5" ry="1.5" fill="#facc15" className="animate-[blink_3s_infinite]" />
      <path d="M14 24 Q20 28 26 24" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="4" y="14" width="4" height="8" rx="2" fill="#1e40af" />
      <rect x="32" y="14" width="4" height="8" rx="2" fill="#1e40af" />
    </svg>
    <style>{`
      @keyframes antenna {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(8deg); }
        75% { transform: rotate(-6deg); }
      }
      @keyframes blink {
        0%, 96%, 100% { transform: scaleY(1); }
        98% { transform: scaleY(0.1); }
      }
    `}</style>
  </div>
);

/* ---------- ANIMASI LOADING ---------- */
const ThinkingIndicator = () => (
  <div className="flex items-center gap-1.5 px-1">
    <span className="sr-only">AI sedang berpikir</span>
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-[wave_1.2s_ease-in-out_infinite] shadow-[0_0_8px_#3b82f6]" style={{ animationDelay: '0s' }}></span>
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-[wave_1.2s_ease-in-out_infinite] shadow-[0_0_8px_#3b82f6]" style={{ animationDelay: '0.2s' }}></span>
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-[wave_1.2s_ease-in-out_infinite] shadow-[0_0_8px_#3b82f6]" style={{ animationDelay: '0.4s' }}></span>
    <style>{`
      @keyframes wave {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }
    `}</style>
  </div>
);

/* ---------- KOMPONEN UTAMA CHATBOT ---------- */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Yoo! Ada yang mau ditanyain soal project Kak Riley?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    // 🔥 PERBAIKAN 1: GEMBOK TOTAL! Tolak request jika input kosong ATAU AI masih loading membalas
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput(''); // Langsung kosongkan input agar tidak bisa ditekan Enter berulang kali
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setMessages((prev) => [...prev, { role: 'ai', text: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          // Tampilkan pesan error spesifik jika limit habis, agar user tahu
          updated[updated.length - 1].text = res.status === 429 
            ? 'Waduh, limit obrolan AI harian Kak Riley udah habis nih bro! Coba balik lagi besok ya. 🙏' 
            : (errData.reply || 'Waduh, error bro.');
          return updated;
        });
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (!dataStr || dataStr.startsWith('[') || dataStr === 'null') continue;

              try {
                const data = JSON.parse(dataStr);
                const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                aiResponse += textChunk;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].text = aiResponse;
                  return updated;
                });
              } catch (e) {}
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = 'Wah putus koneksi nih bro, coba lagi nanti ya.';
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.3); border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: #60a5fa; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-msg-in {
          animation: fadeSlideIn 0.25s ease-out forwards;
        }
      `}</style>

      {isOpen ? (
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-blue-500/20 w-[calc(100vw-2rem)] sm:w-[26rem] md:w-[30rem] overflow-hidden flex flex-col"
             style={{ height: 'min(620px, 80vh)' }}>
          
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-3 sm:p-4 flex items-center gap-3 shadow-lg shadow-blue-900/30">
            <RobotLogo />
            <div className="flex-1">
              <h2 className="text-white font-bold text-sm sm:text-base tracking-tight">AI Riley Assistant</h2>
              <p className="text-blue-200 text-[10px] sm:text-xs flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online sekarang
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all duration-200"
              aria-label="Tutup chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 chat-scroll bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-msg-in`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed break-words ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 rounded-br-md'
                      : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 border border-slate-700/50 shadow-md rounded-bl-md'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.text
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-blue-200 prose-code:text-blue-300">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.text === '' && (
              <div className="flex justify-start animate-msg-in">
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-md flex items-center gap-2">
                  <RobotLogo />
                  <ThinkingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-900/80 backdrop-blur-md border-t border-blue-500/20 flex items-center gap-2">
            {/* 🔥 PERBAIKAN 2: Nonaktifkan kolom ketik (input) secara visual & fungsi ketika loading */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              placeholder={isLoading ? "AI sedang mengetik balasan..." : "Ketik pesan..."}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {/* 🔥 PERBAIKAN 3: Tombol kirim mati total (disabled) selama proses loading */}
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-2.5 rounded-full shadow-lg shadow-blue-500/20 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 transition-all duration-200 active:scale-95"
              aria-label="Kirim"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all duration-300 hover:scale-110 group"
          aria-label="Buka chat"
        >
          <span className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></span>
          <RobotLogo />
        </button>
      )}
    </div>
  );
}