'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Calendar, Cpu, Bot, MessageSquare, ArrowUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiBaseUrl } from '@/utils/apiConfig';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function MascotChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome! Ask me about Javid's AI engineering work, multi-agent architectures, project case studies, or schedule a direct consultation." }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Position & Scroll state
  const mascotRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ left: 0, top: 0 });
  const dragDistRef = useRef(0);

  const [posStyle, setPosStyle] = useState<React.CSSProperties>({
    bottom: '24px',
    right: '24px',
    position: 'fixed'
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Global window listeners for drag & drop
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - startPosRef.current.x;
      const dy = clientY - startPosRef.current.y;
      dragDistRef.current = Math.hypot(dx, dy);

      if (dragDistRef.current > 5) {
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        let newLeft = initialPosRef.current.left + dx;
        let newTop = initialPosRef.current.top + dy;

        // Clamp inside screen bounds
        newLeft = Math.max(10, Math.min(newLeft, winWidth - 90));
        newTop = Math.max(10, Math.min(newTop, winHeight - 120));

        setPosStyle({
          position: 'fixed',
          left: `${newLeft}px`,
          top: `${newTop}px`,
          bottom: 'auto',
          right: 'auto',
        });
      }
    };

    const onEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (dragDistRef.current <= 5) {
          setIsOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    dragDistRef.current = 0;
    startPosRef.current = { x: clientX, y: clientY };

    if (mascotRef.current) {
      const rect = mascotRef.current.getBoundingClientRect();
      initialPosRef.current = { left: rect.left, top: rect.top };
    }
  };

  const getChatPanelStyle = (): React.CSSProperties => {
    if (typeof window === 'undefined') return { bottom: '110px', right: '24px', position: 'fixed' };
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    const panelWidth = Math.min(winWidth * 0.92, 380);

    if (mascotRef.current) {
      const rect = mascotRef.current.getBoundingClientRect();

      // Navbar clearance: 85px from top
      const minTop = 85;
      const availableSpaceAbove = rect.top - minTop - 12;
      const spaceBelow = winHeight - rect.bottom - 20;

      let top: number;
      let panelHeight: number;
      let transformOrigin = '85% 100%';

      if (availableSpaceAbove >= 280) {
        // Place panel ABOVE mascot, capped below Navbar at 85px
        panelHeight = Math.min(520, availableSpaceAbove);
        top = rect.top - panelHeight - 12;
        transformOrigin = '85% 100%';
      } else if (spaceBelow >= 280) {
        // Place panel BELOW mascot
        panelHeight = Math.min(520, spaceBelow);
        top = rect.bottom + 12;
        transformOrigin = '85% 0%';
      } else {
        // Fallback: place panel to left of mascot
        panelHeight = Math.min(winHeight - minTop - 20, 520);
        top = Math.max(minTop, Math.min(rect.top, winHeight - panelHeight - 10));
        transformOrigin = '100% 50%';
      }

      // Align right edge of panel with right edge of mascot
      let left = rect.right - panelWidth;
      if (left < 10) left = 10;
      if (left + panelWidth > winWidth - 10) left = winWidth - panelWidth - 10;

      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: `${panelWidth}px`,
        height: `${panelHeight}px`,
        transformOrigin,
      };
    }

    return {
      position: 'fixed',
      bottom: '110px',
      right: '24px',
      width: `${panelWidth}px`,
      height: '520px',
      transformOrigin: '85% 100%',
    };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const apiBase = getApiBaseUrl();
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyPayload })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I am currently offline or disconnected from the backend server. Please ensure FastAPI is running."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Draggable Mascot Container */}
      <div
        ref={mascotRef}
        style={posStyle}
        className="z-50 flex flex-col items-end select-none cursor-grab active:cursor-grabbing group touch-none"
        onMouseDown={e => handleStart(e.clientX, e.clientY)}
        onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      >
        {/* Waving Speech Badge (Only this badge disappears when chat window is open!) */}
        <div
          className={`mb-2 bg-white/[0.04] backdrop-blur-xl px-3.5 py-1.5 rounded-2xl rounded-br-none text-[11px] font-semibold text-ink shadow-glow flex items-center gap-1.5 border border-white/10 pointer-events-none transition-all duration-300 ${
            isOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
        >
          <span className="text-copper-soft font-mono tracking-wide">Ask Javi!</span>
        </div>

        {/* Mascot Robot SVG */}
        <div className="relative group-hover:scale-105 transition-transform duration-200">
          <svg viewBox="0 0 100 120" className="w-20 h-24 drop-shadow-[0_10px_25px_rgba(59,130,246,0.5)]">
            <defs>
              <linearGradient id="mascotBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4F46E5"/>
                <stop offset="50%" stopColor="#3B82F6"/>
                <stop offset="100%" stopColor="#1D4ED8"/>
              </linearGradient>
              <linearGradient id="mascotScreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B0F19"/>
                <stop offset="100%" stopColor="#1E293B"/>
              </linearGradient>
            </defs>
            <path d="M 28 32 C 18 32, 12 42, 18 52 C 12 58, 14 70, 24 74 C 30 78, 70 78, 76 74 C 86 70, 88 58, 82 52 C 88 42, 82 32, 72 32 C 66 24, 34 24, 28 32 Z" fill="url(#mascotBlue)" stroke="#818CF8" strokeWidth="2.5"/>
            <rect x="36" y="74" width="10" height="16" rx="5" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1.5"/>
            <rect x="54" y="74" width="10" height="16" rx="5" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1.5"/>
            <ellipse cx="41" cy="90" rx="6" ry="3" fill="#3B82F6"/>
            <ellipse cx="59" cy="90" rx="6" ry="3" fill="#3B82F6"/>
            <rect x="30" y="38" width="40" height="26" rx="7" fill="url(#mascotScreen)" stroke="#38BDF8" strokeWidth="2"/>
            <path d="M 36 46 L 42 51 L 36 56" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <line x1="52" y1="56" x2="60" y2="56" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round"/>
            <rect x="40" y="66" width="20" height="9" rx="3" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1"/>
            <path d="M 43 69.5 L 45 71 L 43 72.5" stroke="#A5B4FC" strokeWidth="1" fill="none"/>
            <line x1="47" y1="72.5" x2="50" y2="72.5" stroke="#A5B4FC" strokeWidth="1"/>
            <g className="animate-arm-wave" style={{ transformOrigin: '22px 56px' }}>
              <path d="M 22 56 C 14 50, 10 38, 16 30" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round" fill="none"/>
              <circle cx="16" cy="30" r="4.5" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1"/>
            </g>
            <path d="M 78 56 C 85 60, 86 68, 82 74" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <circle cx="82" cy="74" r="4" fill="#93C5FD"/>
            <circle cx="76" cy="28" r="4" fill="#10B981" stroke="#065F46" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* Holographic Expansion out from inside Mascot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.05, transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            style={getChatPanelStyle()}
            className="z-40 glass-strong backdrop-blur-md rounded-[1.75rem] shadow-glow flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-copper-soft" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-obsidian2"></span>
                </div>
                <div>
                  <p className="font-display font-semibold text-sm leading-tight flex items-center gap-2 text-ink">
                    Ask Javid
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-mono">LIVE</span>
                  </p>
                  <p className="text-[11px] text-mute2">AI Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-mute2 hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-[13.5px] leading-relaxed">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 shrink-0 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-copper-soft" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] ${
                      m.role === 'user'
                        ? 'bg-copper text-white rounded-br-sm'
                        : 'bg-white/[0.04] border border-white/10 text-mute rounded-tl-sm'
                    }`}
                    dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>') }}
                  />
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-copper-soft animate-pulse" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 text-mute2 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs italic font-mono">
                    Ask Javi is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-3.5 py-2 border-t border-white/5 flex flex-wrap gap-1.5 bg-white/[0.01]">
              <button onClick={() => sendMessage("Schedule a meeting with Javid")} className="chip hover:bg-white/10 transition-colors text-[11px] py-1 px-2.5 rounded-lg border border-white/10 text-copper-soft flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Schedule Consultation
              </button>
              <button onClick={() => sendMessage("What are his core skills and tech stack?")} className="chip hover:bg-white/10 transition-colors text-[11px] py-1 px-2.5 rounded-lg border border-white/10 text-mute flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Core Stack
              </button>
              <button onClick={() => sendMessage("Tell me about his multi-agent workflows")} className="chip hover:bg-white/10 transition-colors text-[11px] py-1 px-2.5 rounded-lg border border-white/10 text-mute flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> Agent Workflows
              </button>
              <button onClick={() => sendMessage("I want to talk to Javid directly")} className="chip hover:bg-white/10 transition-colors text-[11px] py-1 px-2.5 rounded-lg border border-white/10 text-mute flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Talk to Javid
              </button>
            </div>

            {/* Chat Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                sendMessage(inputVal);
              }}
              className="flex items-center gap-2 px-4 py-3.5 border-t border-white/10 bg-white/[0.02]"
            >
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="How is Javid, actually?"
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-mute2 focus:outline-none focus:border-copper/40 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="btn-primary w-10 h-10 rounded-xl flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
