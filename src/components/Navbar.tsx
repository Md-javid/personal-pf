'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="site-nav" className="fixed top-0 inset-x-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div
          id="nav-inner"
          className={`mt-4 flex items-center justify-between rounded-2xl px-5 py-3.5 transition-all duration-500 ${
            scrolled ? 'glass-strong backdrop-blur-md' : ''
          }`}
          style={scrolled ? { boxShadow: 'rgba(0, 0, 0, 0.6) 0px 10px 40px -20px' } : {}}
        >
          <Link href="#top" className="font-display font-semibold text-lg tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-copper shadow-[0_0_12px_2px_rgba(217,138,74,0.8)]" />
            <span id="brand-name" className="text-ink font-semibold">Javid</span>
            <span className="text-mute font-normal">.ai</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-mute font-medium">
            <Link href="#matrix" className="nav-link hover:text-ink transition-colors">Matrix</Link>
            <Link href="#stack" className="nav-link hover:text-ink transition-colors">Stack</Link>
            <Link href="#work" className="nav-link hover:text-ink transition-colors">Work</Link>
            <Link href="#agentic-resume" className="nav-link hover:text-copper transition-colors text-copper-soft flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-copper animate-ping" />
              <span>AI Agent</span>
            </Link>
            <Link href="#terminal" className="nav-link hover:text-ink transition-colors">Playground</Link>
            <Link href="#about" className="nav-link hover:text-ink transition-colors">About</Link>
          </nav>
          <Link href="#contact" className="btn-primary text-sm font-semibold px-4 py-2 rounded-xl text-white hover:opacity-90 transition-opacity shadow-glow">
            Let's Talk
          </Link>
        </div>
      </div>
    </header>
  );
}
