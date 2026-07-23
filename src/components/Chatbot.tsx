'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Image as ImageIcon, Copy, Check, Volume2, Loader2, Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
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

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const codeString = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="rounded-lg overflow-hidden my-3 border border-slate-700 shadow-xl group">
        <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 border-b border-slate-700 flex justify-between items-center">
          <span className="uppercase font-bold tracking-wider">{match[1]}</span>
          <button onClick={handleCopy} className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all duration-200 ${isCopied ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-700 hover:text-white text-slate-400'}`} title="Copy code">
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            <span className={isCopied ? 'font-semibold' : ''}>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1rem', background: '#0f172a' }} {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  }
  return <code className={`${className} bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs`} {...props}>{children}</code>;
};

/* ---------- KOMPONEN UTAMA CHATBOT ---------- */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; hasImage?: boolean; aiImage?: string }[]>([
    { role: 'ai', text: 'Yoo! Ada yang mau ditanyain? Kirim error kodingan, tanya project, buatin gambar, atau panggil telepon langsung (Live Mode) juga bisa!' }
  ]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [ttsLoadingIdx, setTtsLoadingIdx] = useState<number | null>(null);
  const [ttsPlayingIdx, setTtsPlayingIdx] = useState<number | null>(null);
  
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Refs untuk Live Call
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  // Refs Speaker Output Queue
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  
  // 🔥 Ref Tracking Node Suara Aktif untuk Interupsi (Barge-in)
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  
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

  /* ---------- FUNGSI PLAY TTS BIASA ---------- */
  const playTTS = async (text: string, index: number) => {
    if (ttsLoadingIdx !== null || ttsPlayingIdx !== null) return; 
    setTtsLoadingIdx(index);

    try {
      const cleanText = text.replace(/```[\s\S]*?```/g, "Berikut kodenya.").replace(/[#*`_]/g, '');
      
      const res = await fetch('/api/generate-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cleanText, type: 'tts' })
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textError = await res.text();
        throw new Error("Server mengembalikan HTML, bukan JSON. Cek log server.");
      }

      const data = await res.json();
      if (!res.ok || !data.audio) throw new Error(data.error || "Gagal ambil audio dari server");

      const binaryString = window.atob(data.audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const dataView = new DataView(bytes.buffer);
      const numSamples = Math.floor(bytes.length / 2);
      const float32Array = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        float32Array[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      if (ctx.state === 'suspended') await ctx.resume();

      let sampleRate = 24000;
      const match = data.mimeType?.match(/rate=(\d+)/);
      if (match) sampleRate = parseInt(match[1], 10);

      const buffer = ctx.createBuffer(1, float32Array.length, sampleRate);
      buffer.getChannelData(0).set(float32Array);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      setTtsLoadingIdx(null);
      setTtsPlayingIdx(index);

      source.onended = () => {
        setTtsPlayingIdx(null);
        ctx.close();
      };

      source.start(0);

    } catch (error: any) {
      console.error("Gagal putar TTS:", error.message);
      alert("Error Play Audio: " + error.message);
      setTtsLoadingIdx(null);
      setTtsPlayingIdx(null);
    }
  };

  /* ---------- FUNGSI LIVE CALL FIX INTERUPSI ---------- */
  const startLiveCall = async () => {
    try {
      setIsLiveConnecting(true);

      const tokenRes = await fetch('/api/live-token');
      const contentType = tokenRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server endpoint /api/live-token rusak.");
      }

      const { apiKey, error } = await tokenRes.json();
      if (error || !apiKey) throw new Error(error || "Gagal mengambil API Key");

      const modelName = "models/gemini-3.1-flash-live-preview";
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const playbackCtx = new AudioCtxClass({ sampleRate: 24000 });
      playbackCtxRef.current = playbackCtx;
      nextPlayTimeRef.current = 0;

      ws.onopen = async () => {
        try {
          setIsLiveConnecting(false);
          setIsLiveActive(true);

          const setupMsg = {
            setup: {
              model: modelName,
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
                }
              }
            }
          };
          ws.send(JSON.stringify(setupMsg));

          const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
          mediaStreamRef.current = stream;

          const ctx = new AudioCtxClass({ sampleRate: 16000 });
          audioCtxRef.current = ctx;

          const micSource = ctx.createMediaStreamSource(stream);
          const processor = ctx.createScriptProcessor(2048, 1, 1);

          processor.onaudioprocess = (e) => {
            if (isMuted) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
            }

            let binary = '';
            const bytes = new Uint8Array(pcm16.buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64Audio = window.btoa(binary);

            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                realtimeInput: {
                  audio: {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64Audio
                  }
                }
              }));
            }
          };

          micSource.connect(processor);
          processor.connect(ctx.destination);

        } catch (micError: any) {
          console.error("Mic error:", micError);
          alert("Gagal masuk mode Live: Pastikan lu ngasih izin Microphone di browser ya bro!");
          stopLiveCall();
        }
      };

      ws.onmessage = async (event) => {
        try {
          let textData = event.data;
          if (event.data instanceof Blob) {
            textData = await event.data.text();
          }
          const response = JSON.parse(textData);
          
          // 🔥 LOGIKA INTERUPSI (BARGE-IN): Google nyuruh stop karena user ngomong!
          if (response.serverContent?.interrupted) {
            console.log("AI diinterupsi oleh user!");
            activeSourcesRef.current.forEach(src => {
              try { src.stop(); } catch (e) {} // Stop paksa audio yang lagi ngantre/jalan
            });
            activeSourcesRef.current = []; // Kosongkan daftar antrean
            
            // Reset waktu antrean sesuai waktu putar saat ini biar AI bisa langsung ngomong lagi
            if (playbackCtxRef.current) {
               nextPlayTimeRef.current = playbackCtxRef.current.currentTime;
            } else {
               nextPlayTimeRef.current = 0;
            }
            return; // Berhenti memproses antrean pesan yang ini
          }

          const parts = response.serverContent?.modelTurn?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.inlineData?.data) {
                const b64 = part.inlineData.data;
                const binary = window.atob(b64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

                const dataView = new DataView(bytes.buffer);
                const samples = Math.floor(bytes.length / 2);
                const float32 = new Float32Array(samples);
                for (let i = 0; i < samples; i++) {
                  float32[i] = dataView.getInt16(i * 2, true) / 32768.0;
                }

                const pCtx = playbackCtxRef.current;
                if (!pCtx) return;

                if (pCtx.state === 'suspended') {
                  await pCtx.resume();
                }

                const buf = pCtx.createBuffer(1, float32.length, 24000);
                buf.getChannelData(0).set(float32);

                const src = pCtx.createBufferSource();
                src.buffer = buf;
                src.connect(pCtx.destination);

                // Tambahin ke daftar tracking buat siap-siap disetop (diinterupsi)
                activeSourcesRef.current.push(src);
                src.onended = () => {
                  // Hapus dari memori kalau audionya beneran kelar tanpa diinterupsi
                  activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== src);
                };

                if (nextPlayTimeRef.current < pCtx.currentTime) {
                  nextPlayTimeRef.current = pCtx.currentTime + 0.05;
                }
                
                src.start(nextPlayTimeRef.current);
                nextPlayTimeRef.current += buf.duration;
              }
            }
          }
        } catch (err) {
          console.error("Error decoding server audio:", err);
        }
      };

      ws.onclose = (event) => {
        console.log("Koneksi Live API terputus:", event.code, event.reason);
        if (event.code !== 1000 && event.code !== 1005) {
          alert(`Koneksi Live API ditutup oleh Google: ${event.reason || "Batas waktu sesi habis atau Cek terminal."}`);
        }
        stopLiveCall();
      };

      ws.onerror = (e) => {
        console.error("Live WebSocket Error:", e);
      };

    } catch (err: any) {
      console.error("Gagal memulai Live Call:", err.message);
      alert("Error: " + err.message);
      setIsLiveConnecting(false);
      setIsLiveActive(false);
    }
  };

  const stopLiveCall = () => {
    const ws = wsRef.current;
    if (ws) {
      wsRef.current = null;
      ws.close();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close();
      playbackCtxRef.current = null;
    }
    
    // Hentikan sisa suara pas telepon dimatikan
    activeSourcesRef.current.forEach(src => {
      try { src.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
    
    setIsLiveActive(false);
    setIsLiveConnecting(false);
  };

  /* ---------- FUNGSI KIRIM PESAN UTAMA ---------- */
  const sendMessage = async () => {
    if ((!input.trim() && !imagePreview) || isLoading) return;

    const userMessage = input || "Tolong analisis gambar ini.";
    const attachedImage = imagePreview;
    
    setInput('');
    setImagePreview(null);
    setIsLoading(true);

    const historyToAPI = messages.filter(m => !m.text.includes('Yoo!'));

    setMessages((prev) => [...prev, { role: 'user', text: userMessage, hasImage: !!attachedImage }]);
    setMessages((prev) => [...prev, { role: 'ai', text: '' }]);

    const isImageCommand = /buat(in|kan) gambar|bikin gambar|generate gambar|gambarkan/i.test(userMessage);

    try {
      if (isImageCommand) {
        const res = await fetch('/api/generate-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userMessage, type: 'image' })
        });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Server /api/generate-media mengembalikan format yang salah (HTML).");
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = 'Ini gambar yang lu minta bro! 🎨';
          updated[updated.length - 1].aiImage = `data:image/jpeg;base64,${data.result}`;
          return updated;
        });

      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history: historyToAPI, message: userMessage, image: attachedImage }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(res.status === 429 ? 'Limit harian abis bro!' : (errData.reply || 'Waduh, error bro.'));
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
      }
    } catch (error: any) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = error.message || 'Koneksi putus cuy, coba lagi ya.';
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50" suppressHydrationWarning>
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.3); border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: #60a5fa; }
        .animate-msg-in { animation: fadeSlideIn 0.25s ease-out forwards; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .chat-window { height: min(650px, 85vh); height: min(650px, 85dvh); }
      `}</style>

      {isOpen ? (
        <div suppressHydrationWarning className="chat-window bg-slate-900/95 backdrop-blur-3xl rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-blue-500/30 w-[calc(100vw-2rem)] sm:w-[26rem] md:w-[32rem] overflow-hidden flex flex-col relative">
          
          {/* HEADER CHATBOT */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-3 sm:p-4 flex items-center gap-3 shadow-lg shadow-blue-900/30">
            <RobotLogo />
            <div className="flex-1">
              <h2 className="text-white font-bold text-sm sm:text-base tracking-tight">AI Assistant</h2>
              <p className="text-blue-200 text-[10px] sm:text-xs flex items-center gap-1.5">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-green-500"></span></span>
                Live API & Vision Active
              </p>
            </div>
            
            {/* 🔥 TOMBOL TELEPON LIVE API */}
            {!isLiveActive ? (
              <button 
                onClick={startLiveCall}
                disabled={isLiveConnecting}
                className="text-white bg-green-600 hover:bg-green-500 p-2 rounded-full transition-all shadow-md active:scale-95 disabled:opacity-50"
                title="Mulai Teleponan Real-time"
              >
                {isLiveConnecting ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
              </button>
            ) : null}

            <button suppressHydrationWarning onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all duration-200"><X size={18} /></button>
          </div>

          {/* OVERLAY TAMPILAN SAAT TELEPONAN BERLANGSUNG */}
          {isLiveActive && (
            <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-msg-in">
              <div className="relative mb-6">
                <span className="absolute -inset-4 rounded-full bg-blue-500/30 animate-ping"></span>
                <div className="p-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400 shadow-2xl">
                  <RobotLogo />
                </div>
              </div>

              <h3 className="text-white font-bold text-lg mb-1">Live Voice Call Active</h3>
              <p className="text-blue-300 text-xs mb-8">Langsung ngomong aja bro, AI bakal dengerin & ngebales!</p>

              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full border transition-all ${isMuted ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                >
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                <button 
                  onClick={stopLiveCall}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all active:scale-95"
                  title="Matikan Telepon"
                >
                  <PhoneOff size={22} />
                </button>
              </div>
            </div>
          )}

          {/* AREA PESAN CHAT */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 chat-scroll bg-slate-950/60" suppressHydrationWarning>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-msg-in`} suppressHydrationWarning>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed break-words relative group ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 rounded-br-md'
                      : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 border border-slate-700/50 shadow-md rounded-bl-md'
                  }`}>
                  
                  {msg.role === 'ai' && msg.text && !isLoading && !msg.aiImage && (
                    <button 
                      onClick={() => playTTS(msg.text, idx)}
                      disabled={ttsLoadingIdx !== null || ttsPlayingIdx === idx}
                      className={`absolute -right-8 top-1 p-1.5 rounded-full bg-slate-800 border transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 disabled:opacity-100 ${
                        ttsPlayingIdx === idx 
                          ? 'border-green-500/50 text-green-400' 
                          : 'border-slate-700 text-slate-400 hover:text-blue-400 hover:bg-slate-700'
                      }`}
                      title="Bacakan Pesan"
                    >
                      {ttsLoadingIdx === idx ? <Loader2 size={14} className="animate-spin text-blue-400" /> : 
                       ttsPlayingIdx === idx ? <Volume2 size={14} className="animate-pulse text-green-400" /> : 
                       <Volume2 size={14} />}
                    </button>
                  )}

                  {msg.hasImage && (
                    <div className="mb-2 text-[10px] bg-white/20 inline-block px-2 py-1 rounded border border-white/30 text-white font-bold flex items-center gap-1 w-fit">
                      <ImageIcon size={12}/> Gambar terlampir
                    </div>
                  )}

                  {msg.role === 'user' ? ( msg.text ) : (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-code:text-blue-300">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{ code: CodeBlock }}>
                        {msg.text}
                      </ReactMarkdown>
                      
                      {msg.aiImage && (
                        <div className="mt-3">
                          <img src={msg.aiImage} alt="Generated by AI" className="rounded-lg border border-blue-500/30 w-full object-cover shadow-lg" />
                        </div>
                      )}
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
            <div className="px-4 py-3 bg-slate-800/90 border-t border-blue-500/30 flex items-center justify-between animate-msg-in" suppressHydrationWarning>
              <div className="flex items-center gap-3">
                <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg border-2 border-blue-500/50 shadow-lg" />
                <span className="text-xs font-semibold text-blue-300">Gambar siap dikirim...</span>
              </div>
              <button suppressHydrationWarning onClick={() => setImagePreview(null)} className="text-slate-400 hover:text-red-400 bg-slate-900 p-2 rounded-full transition-colors"><X size={16}/></button>
            </div>
          )}

          {/* INPUT FORM CHAT */}
          <div className="p-2.5 sm:p-3 bg-slate-900/90 backdrop-blur-xl border-t border-blue-500/30 flex items-center gap-1.5 sm:gap-2 relative" suppressHydrationWarning>
            <label className={`cursor-pointer p-2 sm:p-2.5 rounded-full transition-colors ${isLoading ? 'text-slate-600 pointer-events-none' : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'}`} title="Kirim Screenshot/Gambar">
              <ImageIcon size={20} />
              <input suppressHydrationWarning type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
            </label>
            
            <input
              suppressHydrationWarning
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              placeholder={isLoading ? "AI sedang bekerja..." : "Ketik pertanyaan atau 'buatin gambar'..."}
              className="min-w-0 flex-1 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            <button
              suppressHydrationWarning
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && !imagePreview)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg shadow-blue-500/20 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 transition-all duration-200 active:scale-95 shrink-0"
              aria-label="Kirim"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          suppressHydrationWarning
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