'use client';

import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function CaseStudies() {
  return (
    <section id="work" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="max-w-2xl mb-16">
          <span className="eyebrow">Proof of Impact</span>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-3 tracking-tight text-ink">
            From hours of manual work to seconds of autonomous processing.
          </h2>
          <p className="text-mute mt-4 leading-relaxed">
            Real pipelines, real time saved. This section updates as new projects ship — built to grow with the work.
          </p>
        </ScrollReveal>

        <div id="case-studies-list" className="space-y-6">
          {PORTFOLIO_DATA.caseStudies.map((cs, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.15}
              direction="up"
              duration={0.75}
            >
              <div className="glass card-hover rounded-3xl p-7 sm:p-9 grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <span className="chip text-mute2">{cs.industry}</span>
                  <h3 className="font-display font-semibold text-xl sm:text-2xl mt-2 tracking-tight text-ink">
                    {cs.title}
                  </h3>
                  <p className="text-mute text-sm mt-3 leading-relaxed">{cs.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {cs.stack.map((t, idx) => (
                      <span
                        key={idx}
                        className="chip px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-mute2"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex items-center justify-center gap-3">
                  <div className="text-center flex-1 rounded-2xl bg-white/[0.03] border border-white/10 py-5 px-3">
                    <p className="font-display font-semibold text-lg text-mute">{cs.before.value}</p>
                    <p className="text-[11px] text-mute2 mt-1">{cs.before.label}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-copper shrink-0" />
                  <div
                    className="text-center flex-1 rounded-2xl border border-copper/30 py-5 px-3"
                    style={{ background: 'linear-gradient(160deg, rgba(217,138,74,0.12), rgba(107,118,133,0.08))' }}
                  >
                    <p className="font-display font-semibold text-lg grad-text">{cs.after.value}</p>
                    <p className="text-[11px] text-mute2 mt-1">{cs.after.label}</p>
                  </div>
                </div>

                <div className="lg:col-span-3 flex lg:flex-col gap-4">
                  {cs.metrics.map((m, idx) => (
                    <div key={idx} className="flex-1">
                      <p className="font-display font-semibold text-base text-ink">{m.value}</p>
                      <p className="text-[11px] text-mute2 mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
