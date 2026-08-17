'use client';

import { useEffect, useRef } from 'react';

export default function SpotlightGlow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('ontouchstart' in window && window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let currentRadius = 320;
    let targetRadius = 320;
    let isHoveringInteractive = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      const target = e.target as HTMLElement | null;
      isHoveringInteractive = !!(
        target?.closest('a, button, input, textarea, select, label, [role="button"], .cursor-pointer, .glass-card, #chat-mascot-container')
      );
      targetRadius = isHoveringInteractive ? 420 : 320;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.24;
      mouse.y += (mouse.targetY - mouse.y) * 0.24;
      currentRadius += (targetRadius - currentRadius) * 0.18;

      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, currentRadius
      );

      if (isHoveringInteractive) {
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
        gradient.addColorStop(0.35, 'rgba(59, 130, 246, 0.07)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
        gradient.addColorStop(0.4, 'rgba(99, 102, 241, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
    />
  );
}
