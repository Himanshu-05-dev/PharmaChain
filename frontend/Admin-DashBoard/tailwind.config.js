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
          950: '#060c18',
          900: '#0a1426',
          850: '#0e1c36',
          800: '#122445',
          700: '#1a3360',
          600: '#23447e',
          500: '#325ea6',
        },
        regulatory: {
          amber: '#D97706',
          amberBg: '#FEF3C7',
          emerald: '#059669',
          emeraldBg: '#D1FAE5',
          crimson: '#DC2626',
          crimsonBg: '#FEE2E2',
          slate: '#475569',
          slateBg: '#F1F5F9',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
