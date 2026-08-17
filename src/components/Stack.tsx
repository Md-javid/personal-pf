'use client';

import { PORTFOLIO_DATA } from '@/data/portfolioData';
import ScrollReveal from './ScrollReveal';
import { Cpu, Globe, Layers, Server } from 'lucide-react';

const categoryIcons = [Cpu, Globe, Layers, Server];

export default function Stack() {
  return (
    <section id="stack" className="relative py-16 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" duration={0.8}>
          <div className="glass rounded-[2rem] p-8 sm:p-12 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="eyebrow">Tools of the trade</span>
                <h2 className="font-display font-semibold text-2xl sm:text-4xl mt-3 tracking-tight text-ink">
                  Production AI Stack &amp; Autonomous Infrastructure
                </h2>
                <p className="text-mute text-sm sm:text-base mt-2 max-w-xl">
                  Production tools engineered daily for multi-agent reasoning, resilient data scraping, and high-throughput full-stack systems.
                </p>
              </div>
            </div>

            <div id="stack-groups" className="grid md:grid-cols-2 gap-8">
              {PORTFOLIO_DATA.techStack.map((group, gi) => {
                const Icon = categoryIcons[gi % categoryIcons.length];
                return (
                  <div key={gi} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 text-copper-soft">
                      <Icon className="w-4 h-4 text-copper" />
                      <p className="chip uppercase text-xs font-mono font-semibold">{group.category}</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {group.items.map((item, ii) => (
                        <span
                          key={ii}
                          className="chip flex items-center gap-2 px-3.5 py-2 rounded-xl glass hover:bg-white/[0.08] hover:border-copper/40 transition-all cursor-default text-xs font-mono text-ink"
                        >
                          <span
                            className="dot"
                            style={{
                              background: item.color,
                              boxShadow: `0 0 8px ${item.color}`
                            }}
                          />
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
