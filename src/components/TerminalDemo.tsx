'use client';

import { useState, useRef, useEffect } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { Webhook, Repeat, Search, Play } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const iconMap: Record<string, React.ElementType> = {
  webhook: Webhook,
  repeat: Repeat,
  search: Search
};

export default function TerminalDemo() {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const runDemo = (index: number) => {
    if (isBusy) return;
    setIsBusy(true);
    setActiveTab(index);
    setLines([]);
    setResult(null);

    // Clear previous timeouts
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    const preset = PORTFOLIO_DATA.terminalPresets[index];
    let currentDelay = 0;

    preset.lines.forEach((line, i) => {
      currentDelay += 420;
      const t = setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, currentDelay);
      timerRefs.current.push(t);
    });

    currentDelay += 480;
    const finalT = setTimeout(() => {
      setResult(preset.result);
      setIsBusy(false);
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, currentDelay);
    timerRefs.current.push(finalT);
  };

  // Run first demo initially on load
  useEffect(() => {
    runDemo(0);
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <section id="terminal" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow">Try it yourself</span>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-3 tracking-tight text-ink">
            A small window into how these agents run.
          </h2>
          <p className="text-mute mt-4 leading-relaxed">
            Trigger a simulated pipeline below. Nothing here calls a real backend — it's a preview of the interaction pattern used in production.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <div className="glass-strong rounded-[1.75rem] overflow-hidden shadow-[0_0_40px_-8px_rgba(107,118,133,0.30)] border border-white/10">
            
            {/* window chrome */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]"></span>
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]"></span>
                <span className="w-3 h-3 rounded-full bg-[#28C840]"></span>
              </div>
              <span className="chip text-mute2 font-mono text-xs">agent-playground — zsh</span>
              <div className="flex items-center gap-2 text-xs font-mono text-copper-soft">
                {isBusy && <span className="w-2 h-2 rounded-full bg-copper animate-ping"></span>}
                <span>{isBusy ? 'executing...' : 'ready'}</span>
              </div>
            </div>

            {/* output area */}
            <div
              ref={outputRef}
              className="font-mono text-[13px] leading-relaxed p-6 h-72 overflow-y-auto bg-obsidian/60 space-y-1.5 scroll-smooth"
            >
              {lines.length === 0 && !result && (
                <p className="text-mute2 italic">Select a demo below to trigger a simulated run →</p>
              )}

              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className={`animate-fadeIn ${
                    idx === 0
                      ? 'text-ink font-semibold flex items-center gap-2 text-sm pb-1 border-b border-white/5'
                      : line.startsWith('→')
                      ? 'text-mute pl-2 flex items-start gap-1.5'
                      : 'text-slate-300'
                  }`}
                >
                  {idx === 0 && <span className="text-emerald-400">➜ <span className="text-copper-soft">~</span></span>}
                  <span>{line}</span>
                </div>
              ))}

              {result && (
                <div className="mt-4 pt-2 border-t border-white/10 text-emerald-400 font-medium flex items-center gap-2 animate-fadeIn">
                  <span>{result}</span>
                  <span className="inline-block w-2 h-4 bg-copper animate-pulse ml-1" />
                </div>
              )}
            </div>

            {/* preset triggers */}
            <div className="flex flex-wrap gap-3 px-6 pb-6 pt-4 bg-obsidian/80 border-t border-white/10">
              {PORTFOLIO_DATA.terminalPresets.map((preset, idx) => {
                const Icon = iconMap[preset.icon] || Search;
                const isSelected = activeTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    suppressHydrationWarning
                    disabled={isBusy}
                    onClick={() => runDemo(idx)}
                    className={`flex items-center gap-2 chip px-4 py-2.5 rounded-xl transition-all font-mono text-xs ${
                      isSelected
                        ? 'btn-primary text-white border-copper/40 shadow-glow'
                        : 'glass hover:bg-white/[0.08] hover:border-copper/30 text-mute hover:text-ink'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-copper-soft'}`} />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
