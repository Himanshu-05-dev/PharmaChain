/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030816',
          900: '#071224',
          850: '#0b1b36',
          800: '#0f244a',
          750: '#142f5e',
          700: '#1a3b75',
          600: '#25529f',
          500: '#346ec9',
        },
        gov: {
          blue: '#003366',
          navy: '#0b2545',
          gold: '#c59b27',
          goldLight: '#fdf6b2',
          amber: '#d97706',
          amberBg: '#fef3c7',
          emerald: '#047857',
          emeraldBg: '#d1fae5',
          crimson: '#be123c',
          crimsonBg: '#ffe4e6',
          slate: '#334155',
          slateBg: '#f8fafc',
        }
      },
      fontFamily: {
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 30px -5px rgba(37, 82, 159, 0.25)',
        'glow-emerald': '0 0 30px -5px rgba(4, 120, 87, 0.25)',
        'glow-amber': '0 0 30px -5px rgba(217, 119, 6, 0.25)',
        'glow-gold': '0 0 30px -5px rgba(197, 155, 39, 0.3)',
        'card-light': '0 2px 10px -2px rgba(15, 23, 42, 0.06), 0 1px 3px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 28px -6px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
