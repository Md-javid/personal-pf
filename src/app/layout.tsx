import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mohamedjavid.dev'),
  title: 'Mohamed Javid — AI & Automation Engineer',
  description: 'Portfolio of Mohamed Javid — AI & Automation Engineer specializing in production multi-agent architectures, LangGraph, GraphRAG, and enterprise neural pipelines.',
  keywords: [
    'Mohamed Javid',
    'Javid',
    'AI Engineer',
    'AI / ML Engineer',
    'LangGraph',
    'Multi-Agent Systems',
    'GraphRAG',
    'Automation Engineer',
    'LLM Application Developer',
    'Mohamed Javid Portfolio',
  ],
  authors: [{ name: 'Mohamed Javid', url: 'https://mohamedjavid.dev' }],
  creator: 'Mohamed Javid',
  publisher: 'Mohamed Javid',
  alternates: {
    canonical: 'https://mohamedjavid.dev',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mohamedjavid.dev',
    title: 'Mohamed Javid — AI & Automation Engineer',
    description: 'Portfolio of Mohamed Javid — AI & Automation Engineer specializing in production multi-agent architectures, LangGraph, GraphRAG, and enterprise neural pipelines.',
    siteName: 'Mohamed Javid — AI & Automation Engineer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohamed Javid — AI & Automation Engineer',
    description: 'Specializing in production multi-agent architectures, LangGraph, GraphRAG, and enterprise neural pipelines.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://mohamedjavid.dev/#person',
      name: 'Mohamed Javid',
      givenName: 'Mohamed',
      familyName: 'Javid',
      url: 'https://mohamedjavid.dev',
      jobTitle: 'AI & Automation Engineer',
      email: 'mailto:connectjavid27@gmail.com',
      sameAs: [
        'https://linkedin.com/in/javidsiast',
        'https://github.com/Md-javid',
      ],
      knowsAbout: [
        'Artificial Intelligence',
        'Multi-Agent Systems',
        'LangGraph',
        'CrewAI',
        'GraphRAG',
        'Retrieval-Augmented Generation',
        'Full Stack Development',
        'FastAPI',
        'Next.js',
        'Enterprise Automation',
      ],
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'SNS College of Technology',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://mohamedjavid.dev/#website',
      url: 'https://mohamedjavid.dev',
      name: 'Mohamed Javid — AI & Automation Engineer',
      description: 'Official portfolio of Mohamed Javid showcasing production AI systems, multi-agent workflows, and enterprise automation.',
      publisher: {
        '@id': 'https://mohamedjavid.dev/#person',
      },
    },
    {
      '@type': 'ProfilePage',
      '@id': 'https://mohamedjavid.dev/#profile',
      url: 'https://mohamedjavid.dev',
      name: 'Mohamed Javid Profile',
      mainEntity: {
        '@id': 'https://mohamedjavid.dev/#person',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-ink antialiased selection:bg-copper selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
