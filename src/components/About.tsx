'use client';

import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { Eye, Download } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Who is Javi & Badges & Resume */}
        <ScrollReveal direction="up" delay={0.1} duration={0.8} className="lg:col-span-2 space-y-8">
          <div>
            <span className="eyebrow">WHO IS JAVI</span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink mt-3 tracking-tight leading-tight">
              Still 3rd year. Already shipping to production.
            </h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {PORTFOLIO_DATA.badges.map((badge, idx) => (
              <div
                key={idx}
                className="chip px-3.5 py-2 rounded-xl glass hover:border-copper/40 transition-colors text-mute font-mono text-xs w-fit"
              >
                {badge}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/Mohamed_Javid_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 btn-primary text-sm px-5 py-3 rounded-2xl text-white font-semibold shadow-glow hover:opacity-95 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>View Resume</span>
            </a>
            <a
              href="/Mohamed_Javid_Resume.pdf"
              download="Mohamed_Javid_Resume.pdf"
              className="flex items-center gap-2 glass text-sm px-5 py-3 rounded-2xl text-ink font-semibold hover:bg-white/[0.08] hover:border-copper/40 transition-all"
            >
              <Download className="w-4 h-4 text-copper" />
              <span>Download Resume</span>
            </a>
          </div>
        </ScrollReveal>

        {/* Right Column: In-depth Story */}
        <ScrollReveal direction="up" delay={0.25} duration={0.8} className="lg:col-span-3 space-y-5 text-mute leading-relaxed text-[15px] sm:text-base pt-2">
          {(PORTFOLIO_DATA.aboutParagraphs || []).map((para, idx) => (
            <p key={idx}>
              {para}
            </p>
          ))}
        </ScrollReveal>

      </div>
    </section>
  );
}
