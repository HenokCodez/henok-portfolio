/** Copy to project root as tailwind.config.js (Tailwind v3.4). */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0B',
        surface: { DEFAULT: '#111113', 2: '#18181B', 3: '#212125' },
        line: { DEFAULT: 'rgba(255,255,255,0.10)', strong: 'rgba(255,255,255,0.22)' },
        text: '#F2F0EB',
        muted: '#8C8A85',
        faint: '#55534F',
        accent: { DEFAULT: '#FF4D1F', soft: 'rgba(255,77,31,0.14)', ink: '#120400' },
        ok: '#3DDC97',
        danger: '#FF5A5F',
      },
      fontFamily: {
        display: ['"Inter Tight"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(120px, 24vw, 360px)', { lineHeight: '0.8' }],
        'page': ['clamp(64px, 13vw, 200px)', { lineHeight: '0.85' }],
        'h2': ['clamp(36px, 5.2vw, 76px)', { lineHeight: '0.95' }],
        'h3-list': ['clamp(24px, 3vw, 44px)', { lineHeight: '1' }],
        'lead': ['clamp(22px, 2.2vw, 32px)', { lineHeight: '1.3' }],
      },
      letterSpacing: { display: '-0.045em', mono: '0.14em' },
      borderRadius: { card: '16px', reel: '20px', player: '18px' },
      spacing: { section: '160px', 'section-m': '96px' },
      maxWidth: { site: '1360px' },
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 40s linear infinite' },
    },
  },
  plugins: [],
};
/*
 Add these utilities in src/index.css under @layer components:
 .container-x { @apply mx-auto w-full max-w-site px-5 md:px-10; }
 .py-section  { @apply py-24 md:py-40; }          // 96px mobile / 160px desktop
*/
