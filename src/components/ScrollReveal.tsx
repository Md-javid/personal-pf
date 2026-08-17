'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import React, { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 28,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-copper via-copper-soft to-amber-300 origin-left z-[100] shadow-[0_0_12px_rgba(240,184,126,0.8)]"
    />
  );
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.5
}: ScrollRevealProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 28, opacity: 0, filter: 'blur(10px)' };
      case 'down':
        return { y: -28, opacity: 0, filter: 'blur(10px)' };
      case 'left':
        return { x: 28, opacity: 0, filter: 'blur(10px)' };
      case 'right':
        return { x: -28, opacity: 0, filter: 'blur(10px)' };
      default:
        return { opacity: 0, scale: 0.97, filter: 'blur(10px)' };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)'
      }}
      viewport={{ once: false, margin: '-60px 0px -60px 0px', amount: 'some' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // Smooth Apple-grade cubic bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
