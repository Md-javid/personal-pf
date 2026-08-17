'use client';

export default function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-white/10 text-center text-xs text-mute font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} Javid — AI Engineer.</span>
        <span>Built with Next.js, React, Tailwind CSS, Python (FastAPI), &amp; ☕ coffee.</span>
      </div>
    </footer>
  );
}
