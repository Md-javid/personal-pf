'use client';

import Link from 'next/link';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import InteractiveGraph from './InteractiveGraph';
import { Rocket } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="eyebrow text-mute" id="hero-status">
              Open to AI Engineering Internships &amp; Collaborations
            </span>
          </div>

          <h1 className="font-display font-semibold text-5xl sm:text-6xl lg:text-[3.4rem] xl:text-6xl leading-[1.06] tracking-tight">
            I build <span className="grad-text">autonomous systems</span> that turn hours of manual work into seconds.
          </h1>

          <p className="mt-6 text-lg text-mute leading-relaxed max-w-xl">
            {PORTFOLIO_DATA.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#work"
              className="btn-primary text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center gap-2.5 hover:opacity-90 transition-all shadow-glow"
            >
              <Rocket className="w-4 h-4" />
              <span>View Case Studies</span>
            </Link>
            <Link
              href="#terminal"
              className="glass hover:bg-white/[0.08] hover:border-copper/40 text-ink font-semibold px-6 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all"
            >
              <span className="text-copper font-mono font-bold text-sm tracking-tight">&gt;_</span>
              <span>Deploy an Agent</span>
            </Link>
          </div>

          <div className="mt-14 flex items-center gap-8 text-sm text-mute2" id="hero-stats">
            {PORTFOLIO_DATA.heroStats.map((stat, idx) => (
              <div key={idx} className={`space-y-0.5 ${idx > 0 ? 'border-l border-white/10 pl-8' : ''}`}>
                <p className="font-display font-semibold text-xl sm:text-2xl text-ink">{stat.value}</p>
                <p className="text-xs text-mute font-mono">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Agent Orchestration Visual */}
        <div>
          <InteractiveGraph />
        </div>

      </div>
    </section>
  );
}
