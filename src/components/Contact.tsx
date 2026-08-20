'use client';

import { useState } from 'react';
import { getApiBaseUrl } from '@/utils/apiConfig';
import { Send, Mail, ExternalLink, CheckCircle2, AlertCircle, ChevronDown, Sparkles, PenLine } from 'lucide-react';
import { COUNTRY_CODES } from '@/data/countryCodes';
import ScrollReveal from './ScrollReveal';

const PRESET_SERVICES = [
  'Multi-Agent Systems & LangGraph',
  'Advanced RAG & GraphRAG Retrieval',
  'Web Scraping & Intelligence Pipelines (Playwright)',
  'LLM Fine-Tuning & Local Serving (vLLM/Ollama)',
  'Full Stack AI Web Application (Next.js/FastAPI)',
  'AI Workflow Automation (n8n / Python)',
  'Freelance Consultation / Full-Time Hire',
  'Custom / Other (Type your own)'
];

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: 'Multi-Agent Systems & LangGraph',
    custom_service: '',
    phone_code: '+91',
    phone_number: '',
    message: ''
  });
  const [isCustomService, setIsCustomService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleServiceChange = (val: string) => {
    if (val === 'Custom / Other (Type your own)') {
      setIsCustomService(true);
      setFormState(prev => ({ ...prev, service: val, custom_service: '' }));
    } else {
      setIsCustomService(false);
      setFormState(prev => ({ ...prev, service: val, custom_service: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const finalService = isCustomService && formState.custom_service.trim()
      ? `Custom: ${formState.custom_service.trim()}`
      : formState.service;

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          service: finalService,
          phone_code: formState.phone_code,
          phone_number: formState.phone_number,
          message: formState.message
        })
      });
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        setStatusMsg({ text: data.message || 'Thank you! Your enquiry has been received and forwarded to Javid.', isError: false });
        setFormState({
          name: '',
          email: '',
          service: 'Multi-Agent Systems & LangGraph',
          custom_service: '',
          phone_code: '+91',
          phone_number: '',
          message: ''
        });
        setIsCustomService(false);
      } else {
        setStatusMsg({ text: data.message || 'Something went wrong. Please try again or reach out directly via email.', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: 'Enquiry received! Javid will contact you shortly.', isError: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12 text-center">
        
        <ScrollReveal className="space-y-4">
          <span className="eyebrow">Get In Touch</span>
          <h2 className="font-display font-semibold text-2xl sm:text-5xl text-ink tracking-tight">
            Have a project or AI system worth building?
          </h2>
          <p className="text-mute max-w-lg mx-auto text-sm sm:text-base px-2">
            Open to AI engineering roles, high-impact freelance builds, and research collaborations worldwide.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <form onSubmit={handleSubmit} suppressHydrationWarning className="glass-strong rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 md:p-12 space-y-6 sm:space-y-7 text-left shadow-glow border border-white/10 relative overflow-hidden">
            
            {/* Ambient inner subtle glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-copper/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 relative z-10">
              <div className="space-y-2">
                <label className="chip text-mute uppercase text-xs font-mono">Your Name *</label>
                <input
                  type="text"
                  required
                  suppressHydrationWarning
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3.5 rounded-2xl glass text-ink text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all placeholder:text-mute2"
                />
              </div>
              <div className="space-y-2">
                <label className="chip text-mute uppercase text-xs font-mono">Email Address *</label>
                <input
                  type="email"
                  required
                  suppressHydrationWarning
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                  placeholder="jane@company.com"
                  className="w-full px-4 py-3.5 rounded-2xl glass text-ink text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all placeholder:text-mute2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 relative z-10">
              
              {/* Project Focus with Custom Select + Custom Write-In Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="chip text-mute uppercase text-xs font-mono">Project Focus</label>
                  {isCustomService && (
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => setIsCustomService(false)}
                      className="text-[11px] font-mono text-copper-soft hover:underline"
                    >
                      ← Back to presets
                    </button>
                  )}
                </div>

                {!isCustomService ? (
                  <div className="relative">
                    <select
                      value={formState.service}
                      suppressHydrationWarning
                      onChange={e => handleServiceChange(e.target.value)}
                      className="w-full appearance-none px-4 py-3.5 pr-11 rounded-2xl bg-[#0B0F19] border border-white/15 text-ink text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all cursor-pointer truncate shadow-inner"
                    >
                      {PRESET_SERVICES.map(s => (
                        <option key={s} value={s} className="bg-[#0B0F19] text-ink py-2">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-copper-soft pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-transform opacity-75" />
                  </div>
                ) : (
                  <div className="relative animate-fadeIn">
                    <input
                      type="text"
                      required
                      autoFocus
                      suppressHydrationWarning
                      value={formState.custom_service}
                      onChange={e => setFormState({ ...formState, custom_service: e.target.value })}
                      placeholder="e.g., Healthcare Edge AI Agent, Document OCR..."
                      className="w-full px-4 py-3.5 pr-10 rounded-2xl bg-[#0B0F19] border border-copper/60 text-ink text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/30 transition-all shadow-[0_0_15px_rgba(217,138,74,0.2)]"
                    />
                    <PenLine className="w-4 h-4 text-copper pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                )}
              </div>

              {/* Phone Number with Polished Country Selector */}
              <div className="space-y-2">
                <label className="chip text-mute uppercase text-xs font-mono">Phone Number <span className="text-mute2">(Optional)</span></label>
                <div className="flex gap-2 min-w-0">
                  <div className="relative w-28 sm:w-36 shrink-0">
                    <select
                      value={formState.phone_code}
                      suppressHydrationWarning
                      onChange={e => setFormState({ ...formState, phone_code: e.target.value })}
                      className="w-full appearance-none px-2.5 sm:px-3.5 py-3.5 pr-7 sm:pr-8 rounded-2xl bg-[#0B0F19] border border-white/15 text-ink text-xs sm:text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all cursor-pointer truncate shadow-inner"
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={`${c.code}-${c.dial_code}`} value={c.dial_code} className="bg-[#0B0F19] text-ink">
                          {c.flag} {c.dial_code} ({c.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-copper-soft pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 opacity-75" />
                  </div>
                  <input
                    type="tel"
                    suppressHydrationWarning
                    value={formState.phone_number}
                    onChange={e => setFormState({ ...formState, phone_number: e.target.value })}
                    placeholder="9876543210"
                    className="min-w-0 flex-1 px-3.5 sm:px-4 py-3.5 rounded-2xl glass text-ink text-xs sm:text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all placeholder:text-mute2"
                  />
                </div>
              </div>

            </div>

            <div className="space-y-2 relative z-10">
              <label className="chip text-mute uppercase text-xs font-mono">Project Brief / Message *</label>
              <textarea
                required
                rows={4}
                suppressHydrationWarning
                value={formState.message}
                onChange={e => setFormState({ ...formState, message: e.target.value })}
                placeholder="Tell me about what you'd like to build or automate..."
                className="w-full px-4 py-3.5 rounded-2xl glass text-ink text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all resize-none leading-relaxed placeholder:text-mute2"
              />
            </div>

            {statusMsg && (
              <div
                className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-3 animate-fadeIn relative z-10 ${
                  statusMsg.isError
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {statusMsg.isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full btn-primary py-4 rounded-2xl text-white font-semibold text-sm hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-glow relative z-10 active:scale-[0.99]"
            >
              <Send className={`w-4 h-4 ${loading ? 'animate-bounce' : ''}`} />
              <span>{loading ? 'Submitting & Forwarding...' : 'Submit Project Enquiry'}</span>
            </button>
          </form>
        </ScrollReveal>

        {/* Social Connect Links */}
        <ScrollReveal delay={0.3} direction="up" className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="https://linkedin.com/in/javidsiast"
            target="_blank"
            rel="noopener noreferrer"
            className="glass hover:bg-white/[0.08] hover:border-copper/40 px-5 py-3 rounded-2xl text-xs font-mono text-mute hover:text-ink flex items-center gap-2 transition-all"
          >
            <svg className="w-4 h-4 text-copper fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>
          <a
            href="https://github.com/Md-javid"
            target="_blank"
            rel="noopener noreferrer"
            className="glass hover:bg-white/[0.08] hover:border-copper/40 px-5 py-3 rounded-2xl text-xs font-mono text-mute hover:text-ink flex items-center gap-2 transition-all"
          >
            <svg className="w-4 h-4 text-copper fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>
          <a
            href="mailto:connectjavid27@gmail.com"
            className="glass hover:bg-white/[0.08] hover:border-copper/40 px-5 py-3 rounded-2xl text-xs font-mono text-mute hover:text-ink flex items-center gap-2 transition-all"
          >
            <Mail className="w-4 h-4 text-copper" />
            <span>Email</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
