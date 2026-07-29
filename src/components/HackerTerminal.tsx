'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';

interface HackerTerminalProps {
  onClose: () => void;
}

export default function HackerTerminal({ onClose }: HackerTerminalProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([
    'Welcome to R.I.L.E.Y System [Version 10.0.19045.3086]',
    '(c) 2026 Nolan Corporation. All rights reserved.',
    '',
    'Type "help" to see available commands.'
  ]);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [output]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newOutput = [...output, `root@riley:~$ ${cmd}`];

    switch (trimmedCmd) {
      case 'help':
        newOutput.push('Available commands:');
        newOutput.push('  whoami     - Display user information');
        newOutput.push('  skills     - List technical skills');
        newOutput.push('  projects   - Fetch latest projects from database');
        newOutput.push('  clear      - Clear terminal screen');
        newOutput.push('  exit       - Close terminal');
        break;
      case 'whoami':
        newOutput.push('USER: Nolan Fortino Ramadhany');
        newOutput.push('ROLE: Full-Stack Developer & AI Enthusiast');
        newOutput.push('LOCATION: Indonesia');
        break;
      case 'skills':
        newOutput.push('ACCESSING SKILL DATABASE...');
        newOutput.push('[||||||||||] 100%');
        newOutput.push('- Frontend: React, Next.js, TailwindCSS, Three.js');
        newOutput.push('- Backend: Node.js, Express, REST APIs');
        newOutput.push('- Database: MySQL, PostgreSQL');
        newOutput.push('- AI/ML: Google Gemini API, OpenAI');
        break;
      case 'projects':
        newOutput.push('FETCHING FROM SECURE SERVER...');
        newOutput.push('1. R.I.L.E.Y AI Chatbot (Active)');
        newOutput.push('2. Advanced CMS Dashboard (Active)');
        newOutput.push('3. Quantum 3D Portfolio (Active)');
        break;
      case 'clear':
        setOutput([]);
        setInput('');
        return;
      case 'exit':
        onClose();
        return;
      case '':
        break;
      default:
        newOutput.push(`Command not found: ${trimmedCmd}. Type "help" for a list of commands.`);
    }

    setOutput(newOutput);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl h-[80vh] bg-black border-2 border-green-500/30 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.2)] overflow-hidden flex flex-col font-mono text-sm sm:text-base">
        
        {/* Terminal Header */}
        <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-green-500/30">
          <div className="flex items-center gap-2 text-green-500">
            <TerminalIcon size={16} />
            <span>root@riley:~</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto text-green-500 cursor-text" onClick={() => inputRef.current?.focus()}>
          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          ))}
          <div className="flex items-center mt-2">
            <span className="mr-2">root@riley:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
              className="flex-1 bg-transparent outline-none border-none text-green-500 caret-green-500"
              autoFocus
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <div ref={endOfTerminalRef} />
        </div>
      </div>
    </div>
  );
}