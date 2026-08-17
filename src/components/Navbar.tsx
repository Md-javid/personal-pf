'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowRight, Code, Cpu, Layers, Terminal, User, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'Matrix', href: '#matrix', icon: Layers },
    { name: 'Stack', href: '#stack', icon: Cpu },
    { name: 'Work', href: '#work', icon: Code },
    { name: 'AI Agent', href: '#agentic-resume', icon: Sparkles, isAgent: true },
    { name: 'Playground', href: '#terminal', icon: Terminal },
    { name: 'About', href: '#about', icon: User },
  ];

  return (
    <header id="site-nav" className="fixed top-0 inset-x-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div
          id="nav-inner"
          className={`mt-3 sm:mt-4 flex items-center justify-between rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 transition-all duration-500 ${
            scrolled || mobileMenuOpen ? 'glass-strong backdrop-blur-xl border border-white/10' : 'bg-bg/40 backdrop-blur-md border border-white/5'
          }`}
          style={scrolled ? { boxShadow: 'rgba(0, 0, 0, 0.6) 0px 10px 40px -20px' } : {}}
        >
          {/* Brand Logo */}
          <Link
            href="#top"
            onClick={() => setMobileMenuOpen(false)}
            className="font-display font-semibold text-lg tracking-tight flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-copper shadow-[0_0_12px_2px_rgba(217,138,74,0.8)] animate-pulse" />
            <span id="brand-name" className="text-ink font-semibold">Javid</span>
            <span className="text-copper-soft font-mono text-sm font-normal">.dev</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-mute font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link transition-colors ${
                  link.isAgent
                    ? 'hover:text-copper text-copper-soft flex items-center gap-1.5 font-semibold'
                    : 'hover:text-ink'
                }`}
              >
                {link.isAgent && <span className="w-1.5 h-1.5 rounded-full bg-copper animate-ping" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Action + Mobile Hamburger Button */}
          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hidden sm:inline-flex btn-primary text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl text-white hover:opacity-90 transition-opacity shadow-glow items-center gap-1.5"
            >
              <span>Let's Talk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              id="mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.06] border border-white/10 text-ink hover:text-copper hover:bg-white/[0.1] transition-all focus:outline-none focus:ring-2 focus:ring-copper/50"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-copper transition-transform rotate-90 duration-200" />
              ) : (
                <Menu className="w-5 h-5 text-ink transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden mt-2 rounded-2xl glass-strong backdrop-blur-2xl border border-white/15 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                        link.isAgent
                          ? 'bg-copper/10 border border-copper/30 text-copper-soft font-semibold'
                          : 'text-ink/90 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${link.isAgent ? 'bg-copper/20 text-copper' : 'bg-white/5 text-mute'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{link.name}</span>
                      </div>
                      {link.isAgent ? (
                        <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-copper/20 text-copper border border-copper/30">
                          Active
                        </span>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-mute/50" />
                      )}
                    </Link>
                  );
                })}

                {/* Mobile CTA */}
                <div className="pt-2 mt-1 border-t border-white/10">
                  <Link
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full btn-primary text-sm font-semibold py-3 rounded-xl text-white shadow-glow"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Get in Touch (Let's Talk)</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
