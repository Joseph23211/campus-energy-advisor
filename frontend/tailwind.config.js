/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        void: {
          950: '#07090a',
          900: '#0a0e0f',
          800: '#0f1518',
          700: '#141c1f',
          600: '#1b262a',
        },
        current: {
          teal: '#3ee6a8',
          cyan: '#4fd1ff',
          amber: '#f5b942',
          coral: '#ff6b5e',
          violet: '#8b7cf6',
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(62,230,168,0.12), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(62,230,168,0.35)',
        'glow-cyan': '0 0 40px -8px rgba(79,209,255,0.35)',
        card: '0 8px 32px -12px rgba(0,0,0,0.5)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
        drift: {
          '0%': { transform: 'translate(0,0)' },
          '100%': { transform: 'translate(-40px,-30px)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        drift: 'drift 40s linear infinite alternate',
        spinSlow: 'spinSlow 40s linear infinite',
      },
    },
  },
  plugins: [],
};
