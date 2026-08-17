'use client';

import { useRef } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import {
  Server,
  PlayCircle,
  Database,
  Code,
  GitMerge,
  Workflow,
  Layout,
  Box,
  Zap,
  Terminal,
  Bot,
  Cloud,
  ShieldCheck,
  Gauge
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  server: Server,
  'play-circle': PlayCircle,
  database: Database,
  code: Code,
  'git-merge': GitMerge,
  workflow: Workflow,
  layout: Layout,
  box: Box,
  zap: Zap,
  terminal: Terminal,
  bot: Bot,
  cloud: Cloud,
  'shield-check': ShieldCheck,
  gauge: Gauge
};

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    if (!trackRef.current) return;
    trackRef.current.getAnimations().forEach(anim => {
      anim.playbackRate = 0.35; // Smooth slowdown on hover
    });
  };

  const handleMouseLeave = () => {
    if (!trackRef.current) return;
    trackRef.current.getAnimations().forEach(anim => {
      anim.playbackRate = 1; // Normal speed
    });
  };

  const marqueeItems = [
    ...PORTFOLIO_DATA.marqueeTools,
    ...PORTFOLIO_DATA.marqueeTools,
    ...PORTFOLIO_DATA.marqueeTools,
    ...PORTFOLIO_DATA.marqueeTools
  ];

  return (
    <section
      id="marquee"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative py-12 border-y border-white/[0.04] overflow-hidden bg-white/[0.01]"
    >
      <div className="text-center mb-6">
        <span className="eyebrow tracking-[0.2em] text-[10px]">TOOLS I INTEGRATE &amp; ENGINEER WITH</span>
      </div>
      <div
        ref={trackRef}
        className="flex animate-marquee gap-10 sm:gap-20 items-center w-max pl-10 sm:pl-20"
      >
        {marqueeItems.map((tool, idx) => {
          const Icon = iconMap[tool.icon] || Box;
          return (
            <div key={idx} className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity cursor-default">
              <Icon className="w-4 h-4 text-copper-soft shrink-0" />
              <span className="font-display font-medium text-mute tracking-wide whitespace-nowrap text-sm">{tool.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
