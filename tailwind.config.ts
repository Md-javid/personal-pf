import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0C',
        obsidian2: '#111114',
        glass: 'rgba(255,255,255,0.045)',
        glassBorder: 'rgba(255,255,255,0.09)',
        copper: {
          DEFAULT: '#D98A4A',
          soft: '#F0B87E',
          dim: '#8A5A30',
        },
        slate: {
          DEFAULT: '#6B7685',
          soft: '#9AA3B0',
        },
        ink: '#EDEDEF',
        mute: '#93949C',
        mute2: '#5C5D64',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(217,138,74,0.30)',
        glowViolet: '0 0 40px -8px rgba(107,118,133,0.30)',
      },
    },
  },
  plugins: [],
}
export default config
