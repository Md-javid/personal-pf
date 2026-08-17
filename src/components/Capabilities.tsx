'use client';

import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { Network, DatabaseZap, Workflow } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const iconMap: Record<string, React.ElementType> = {
  network: Network,
  'database-zap': DatabaseZap,
  workflow: Workflow
};

export default function Capabilities() {
  return (
    <section id="matrix" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="max-w-2xl mb-16">
          <span className="eyebrow">The Automation Matrix</span>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-3 tracking-tight text-ink">
            Where manual work goes to end.
          </h2>
          <p className="text-mute mt-4 leading-relaxed">
            Three core capabilities, applied together, to replace repetitive human effort with autonomous, auditable systems.
          </p>
        </ScrollReveal>

        <div id="matrix-grid" className="grid md:grid-cols-3 gap-6">
          {PORTFOLIO_DATA.capabilities.map((c, idx) => {
            const Icon = iconMap[c.icon] || Workflow;
            return (
              <ScrollReveal
                key={idx}
                delay={idx * 0.15}
                direction="up"
                className="h-full"
              >
                <div className="glass card-hover rounded-3xl p-7 h-full flex flex-col justify-between">
                  <div>
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(217,138,74,0.18), rgba(107,118,133,0.18))'
                      }}
                    >
                      <Icon className="w-5 h-5 text-copper-soft" />
                    </div>
                    <h3 className="font-display font-semibold text-lg tracking-tight text-ink">{c.title}</h3>
                    <p className="text-mute text-sm mt-3 leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {c.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="chip px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-mute"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
