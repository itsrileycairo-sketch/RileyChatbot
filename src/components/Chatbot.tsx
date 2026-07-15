'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// IMPORT BARU: Alat untuk membaca Markdown & Rumus Matematika
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Gaya (CSS) wajib agar rumus tampil cantik

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
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    // Siapkan kotak kosong untuk jawaban AI (nanti diisi pelan-pelan)
    setMessages((prev) => [...prev, { role: 'ai', text: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      // Kalau error (misal API key salah atau server 500)
      if (!res.ok) {
        const errData = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = errData.reply || 'Waduh, error bro.';
          return updated;
        });
        setIsLoading(false);
        return;
      }

      // 🚀 BACA STREAMING RESPONSE (Efek Ngetik)
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
              
              // Skip bagian empty array JSON atau penanda error
              if (!dataStr || dataStr.startsWith('[') || dataStr === 'null') continue;

              try {
                const data = JSON.parse(dataStr);
                const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                aiResponse += textChunk;

                // Update text secara real-time
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].text = aiResponse;
                  return updated;
                });
              } catch (e) {
                // Abaikan error parse saat chunking terpotong
              }
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
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col border border-gray-200" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="font-semibold flex items-center gap-2">
              <MessageCircle size={20} /> AI Asisten Riley
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          {/* Chat Box */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white self-end rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 self-start rounded-bl-none'
                }`}
              >
                {/* PERUBAHAN UTAMA: Render dengan ReactMarkdown */}
                {msg.role === 'user' ? (
                  msg.text 
                ) : (
                 <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.text === '' && (
              <div className="bg-gray-200 text-gray-800 self-start p-3 rounded-xl rounded-bl-none text-sm animate-pulse">
                Ngetik...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Tanya sesuatu..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500 text-sm text-gray-900"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading && messages[messages.length - 1]?.text === ''}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 hover:scale-105 transition-transform flex items-center justify-center"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}