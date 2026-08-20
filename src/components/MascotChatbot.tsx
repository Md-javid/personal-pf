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

  // Position & Desktop Drag State
  const mascotRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ left: 0, top: 0 });

  const [posStyle, setPosStyle] = useState<React.CSSProperties>({
    bottom: '24px',
    right: '20px',
    position: 'fixed'
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Desktop Mouse Drag Listener (Zero touch listeners to ensure instant mobile taps)
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        didDragRef.current = true;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        let newLeft = initialPosRef.current.left + dx;
        let newTop = initialPosRef.current.top + dy;

        // Clamp inside safe viewport bounds (Never overlap navbar at top 85px)
        newLeft = Math.max(16, Math.min(newLeft, winWidth - 90));
        newTop = Math.max(90, Math.min(newTop, winHeight - 110));

        setPosStyle({
          position: 'fixed',
          left: `${newLeft}px`,
          top: `${newTop}px`,
          bottom: 'auto',
          right: 'auto',
        });
      }
    };

    const onMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left-click only
    isDraggingRef.current = true;
    didDragRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };

    if (mascotRef.current) {
      const rect = mascotRef.current.getBoundingClientRect();
      initialPosRef.current = { left: rect.left, top: rect.top };
    }
  };

  const toggleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    setIsOpen(prev => !prev);
  };

  const getChatPanelStyle = (): React.CSSProperties => {
    if (typeof window === 'undefined') return { bottom: '100px', right: '20px', position: 'fixed' };
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const NAV_HEIGHT = 85;

    // Mobile: Full width card cleanly pinned above bottom
    if (winWidth < 768) {
      return {
        position: 'fixed',
        bottom: '96px',
        left: '12px',
        right: '12px',
        width: 'auto',
        maxWidth: 'calc(100vw - 24px)',
        height: 'min(500px, 75vh)',
        transformOrigin: 'bottom right',
      };
    }

    // Desktop
    const panelWidth = Math.min(380, winWidth - 32);

    if (posStyle.left !== undefined) {
      const leftNum = parseFloat(String(posStyle.left));
      const topNum = parseFloat(String(posStyle.top));

      let panelLeft = leftNum - panelWidth + 70;
      if (panelLeft < 16) panelLeft = 16;
      if (panelLeft + panelWidth > winWidth - 16) panelLeft = winWidth - panelWidth - 16;

      const spaceBelow = winHeight - (topNum + 100);
      const spaceAbove = topNum - NAV_HEIGHT;
      const panelHeight = Math.min(500, Math.max(340, winHeight - NAV_HEIGHT - 130));

      let panelTop = topNum - panelHeight - 12;
      let transformOrigin = 'bottom right';

      if (spaceAbove < panelHeight && spaceBelow > spaceAbove) {
        panelTop = Math.min(topNum + 100, winHeight - panelHeight - 16);
        transformOrigin = 'top right';
      } else {
        panelTop = Math.max(NAV_HEIGHT + 10, panelTop);
      }

      return {
        position: 'fixed',
        left: `${panelLeft}px`,
        top: `${panelTop}px`,
        width: `${panelWidth}px`,
        height: `${panelHeight}px`,
        transformOrigin,
      };
    }

    // Default Desktop Position
    const maxAvailableHeight = Math.min(500, winHeight - NAV_HEIGHT - 130);
    return {
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      width: `${panelWidth}px`,
      height: `${maxAvailableHeight}px`,
      transformOrigin: 'bottom right',
    };
  };

  const formatMessageContent = (content: string) => {
    if (!content) return '';
    // Replace markdown links [text](url) with styled HTML links
    let formatted = content.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-copper-soft underline font-semibold hover:text-copper transition-colors">$1 ↗</a>'
    );
    // Replace bold **text**
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Replace newlines
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
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
    } catch {
      const wittyFallbacks = [
        "Javi's neural synapses are briefly calibrating new agent graphs! ⚡ Back online in a moment — in the meantime, feel free to drop a note in the project enquiry form below or email connectjavid27@gmail.com directly!",
        "Javi is currently synchronizing high-dimensional embeddings in the background! 🤖 Give me a quick second to reconnect, or reach out to Javid directly at connectjavid27@gmail.com!",
        "Upgrading autonomous agent nodes! 🚀 Javi is optimizing response latency and will be right back with you. Feel free to explore the project matrix above in the meantime!"
      ];
      const randomFallback = wittyFallbacks[Math.floor(Math.random() * wittyFallbacks.length)];
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: randomFallback
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Mascot Floating Trigger Button */}
      <div
        ref={mascotRef}
        style={posStyle}
        className="z-50 flex flex-col items-end select-none cursor-pointer group active:scale-95 transition-transform"
        onMouseDown={handleMouseDown}
        onClick={toggleChat}
        role="button"
        tabIndex={0}
        aria-label="Ask Javi AI Mascot"
      >
        {/* Waving Speech Badge */}
        <div
          className={`mb-1.5 bg-obsidian2/90 backdrop-blur-xl px-3 py-1 rounded-2xl rounded-br-none text-[11px] font-semibold text-ink shadow-glow flex items-center gap-1.5 border border-copper/30 pointer-events-none transition-all duration-300 ${
            isOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
        >
          <Sparkles className="w-3 h-3 text-copper" />
          <span className="text-copper-soft font-mono tracking-wide">Ask Javi!</span>
        </div>

        {/* Mascot Robot SVG */}
        <div className="relative group-hover:scale-105 transition-transform duration-200 pointer-events-auto">
          <svg viewBox="0 0 100 120" className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-[0_10px_25px_rgba(59,130,246,0.5)]">
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

      {/* Holographic Expansion Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.05, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.05, y: 20, transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            style={getChatPanelStyle()}
            className="z-50 glass-strong backdrop-blur-2xl rounded-[1.75rem] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-copper/20 border border-copper/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-copper-soft" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-obsidian2 animate-pulse"></span>
                </div>
                <div>
                  <p className="font-display font-semibold text-sm leading-tight flex items-center gap-2 text-ink">
                    Ask Javid
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-mono">LIVE</span>
                  </p>
                  <p className="text-[11px] text-mute2">AI Portfolio Representative</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-mute2 hover:text-ink hover:bg-white/10 transition-all focus:outline-none"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3.5 sm:py-4 space-y-3.5 text-[13.5px] leading-relaxed">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full bg-copper/20 border border-copper/40 flex items-center justify-center mt-0.5">
                      <Sparkles className="w-3 h-3 text-copper-soft" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-xs sm:text-[13.5px] ${
                      m.role === 'user'
                        ? 'bg-copper text-white rounded-br-sm shadow-md'
                        : 'bg-white/[0.05] border border-white/10 text-ink/90 rounded-tl-sm'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessageContent(m.content) }}
                  />
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full bg-copper/20 border border-copper/40 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-copper-soft animate-pulse" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 text-mute2 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs italic font-mono">
                    Ask Javi is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 sm:px-3.5 py-2 border-t border-white/10 flex flex-wrap gap-1.5 bg-white/[0.01]">
              <button onClick={() => sendMessage("How can I get in touch or book a consultation with Javid?")} className="chip hover:bg-white/10 transition-colors text-[11px] py-1 px-2.5 rounded-lg border border-copper/30 bg-copper/10 text-copper-soft flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Book Consultation
              </button>
              <button onClick={() => sendMessage("What are his core skills and tech stack?")} className="chip hover:bg-white/10 transition-colors text-[11px] py-1 px-2.5 rounded-lg border border-white/10 text-mute hover:text-ink flex items-center gap-1.5">
                <Cpu className="w-3 h-3" /> Core Stack
              </button>
              <button onClick={() => sendMessage("Tell me about his multi-agent workflows")} className="chip hover:bg-white/10 transition-colors text-[11px] py-1 px-2.5 rounded-lg border border-white/10 text-mute hover:text-ink flex items-center gap-1.5">
                <Bot className="w-3 h-3" /> Agent Workflows
              </button>
              <button onClick={() => sendMessage("How do I contact Javid directly?")} className="chip hover:bg-white/10 transition-colors text-[11px] py-1 px-2.5 rounded-lg border border-white/10 text-mute hover:text-ink flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" /> Contact Javid
              </button>
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                sendMessage(inputVal);
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 border-t border-white/10 bg-white/[0.02]"
            >
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask anything about Javid..."
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink placeholder:text-mute2 focus:outline-none focus:border-copper/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="btn-primary w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
                aria-label="Send message"
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
