import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Javid — AI Engineer',
  description: 'Portfolio of Javid — AI Engineer specializing in production multi-agent systems, LangGraph, and autonomous workflows.',
  keywords: ['AI Engineer', 'AI / ML Engineer', 'LangGraph', 'Multi-Agent Systems', 'GraphRAG', 'Mohamed Javid', 'Javid'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="bg-bg text-ink antialiased selection:bg-copper selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
