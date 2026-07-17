'use client';

import { useState, useRef, useEffect } from 'react';
// 🔥 TAMBAH IKON Copy & Check dari lucide-react
import { X, Send, Image as ImageIcon, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/* ---------- KOMPONEN ROBOT & LOADING ---------- */
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
      @keyframes antenna { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(8deg); } 75% { transform: rotate(-6deg); } }
      @keyframes blink { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
    `}</style>
  </div>
);

const ThinkingIndicator = () => (
  <div className="flex items-center gap-1.5 px-1">
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-[wave_1.2s_ease-in-out_infinite] shadow-[0_0_8px_#3b82f6]" style={{ animationDelay: '0s' }}></span>
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-[wave_1.2s_ease-in-out_infinite] shadow-[0_0_8px_#3b82f6]" style={{ animationDelay: '0.2s' }}></span>
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-[wave_1.2s_ease-in-out_infinite] shadow-[0_0_8px_#3b82f6]" style={{ animationDelay: '0.4s' }}></span>
    <style>{`@keyframes wave { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }`}</style>
  </div>
);

/* ---------- KOMPONEN TOMBOL COPY (BARU) ---------- */
// Dibuat terpisah agar masing-masing blok kode punya state "Copied" sendiri
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const codeString = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    // Kembalikan tombol ke "Copy" setelah 2 detik
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="rounded-lg overflow-hidden my-3 border border-slate-700 shadow-xl group">
        <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 border-b border-slate-700 flex justify-between items-center">
          <span className="uppercase font-bold tracking-wider">{match[1]}</span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all duration-200 ${
              isCopied ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-700 hover:text-white text-slate-400'
            }`}
            title="Copy code"
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            <span className={isCopied ? 'font-semibold' : ''}>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: '1rem', background: '#0f172a' }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  }
  return (
    <code className={`${className} bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs`} {...props}>
      {children}
    </code>
  );
};

/* ---------- KOMPONEN UTAMA CHATBOT ---------- */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; hasImage?: boolean }[]>([
    { role: 'ai', text: 'Yoo! Ada yang mau ditanyain soal project Kak Riley? Kirim screenshot kodingan error juga bisa bro!' }
  ]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, imagePreview]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !imagePreview) || isLoading) return;

    const userMessage = input || "Tolong analisis gambar ini.";
    const attachedImage = imagePreview;
    
    setInput('');
    setImagePreview(null);
    setIsLoading(true);

    const historyToAPI = messages.filter(m => m.text !== 'Yoo! Ada yang mau ditanyain soal project Kak Riley? Kirim screenshot kodingan error juga bisa bro!');

    setMessages((prev) => [...prev, { role: 'user', text: userMessage, hasImage: !!attachedImage }]);
    setMessages((prev) => [...prev, { role: 'ai', text: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: historyToAPI, message: userMessage, image: attachedImage }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = res.status === 429 ? 'Waduh, limit harian abis nih bro! Balik besok ya.' : (errData.reply || 'Waduh, error bro.');
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

          const lines = decoder.decode(value).split('\n');
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
        updated[updated.length - 1].text = 'Koneksi putus cuy, coba lagi nanti ya.';
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
        .animate-msg-in { animation: fadeSlideIn 0.25s ease-out forwards; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      {isOpen ? (
        <div className="bg-slate-900/95 backdrop-blur-3xl rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-blue-500/30 w-[calc(100vw-2rem)] sm:w-[26rem] md:w-[32rem] overflow-hidden flex flex-col"
             style={{ height: 'min(650px, 85vh)' }}>
          
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-3 sm:p-4 flex items-center gap-3 shadow-lg shadow-blue-900/30">
            <RobotLogo />
            <div className="flex-1">
              <h2 className="text-white font-bold text-sm sm:text-base tracking-tight">AI Riley Assistant</h2>
              {/* Note: Teks Search dihapus dari Header karena fitur Search di-disable */}
              <p className="text-blue-200 text-[10px] sm:text-xs flex items-center gap-1.5">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-green-500"></span></span>
                Vision Engine Active
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all duration-200"><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 chat-scroll bg-slate-950/60">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-msg-in`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed break-words ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 rounded-br-md'
                      : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 border border-slate-700/50 shadow-md rounded-bl-md'
                  }`}>
                  
                  {msg.hasImage && (
                    <div className="mb-2 text-[10px] bg-white/20 inline-block px-2 py-1 rounded border border-white/30 text-white font-bold flex items-center gap-1 w-fit">
                      <ImageIcon size={12}/> Gambar terlampir
                    </div>
                  )}

                  {msg.role === 'user' ? ( msg.text ) : (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-code:text-blue-300">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          // 🔥 MENGGUNAKAN KOMPONEN CODEBLOCK YANG BARU DIBUAT
                          code: CodeBlock
                        }}
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

          {imagePreview && (
            <div className="px-4 py-3 bg-slate-800/90 border-t border-blue-500/30 flex items-center justify-between animate-msg-in">
              <div className="flex items-center gap-3">
                <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg border-2 border-blue-500/50 shadow-lg" />
                <span className="text-xs font-semibold text-blue-300">Gambar siap dikirim...</span>
              </div>
              <button onClick={() => setImagePreview(null)} className="text-slate-400 hover:text-red-400 bg-slate-900 p-2 rounded-full transition-colors"><X size={16}/></button>
            </div>
          )}

          <div className="p-2.5 sm:p-3 bg-slate-900/90 backdrop-blur-xl border-t border-blue-500/30 flex items-center gap-2 relative">
            <label className={`cursor-pointer p-2.5 rounded-full transition-colors ${isLoading ? 'text-slate-600 pointer-events-none' : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'}`} title="Kirim Screenshot/Gambar">
              <ImageIcon size={20} />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
            </label>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              placeholder={isLoading ? "AI sedang mengetik..." : "Ketik pesan atau lampirkan gambar..."}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            <button
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && !imagePreview)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/20 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 transition-all duration-200 active:scale-95"
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