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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a6f6',
          500: '#0c87eb',
          600: '#0069c7',
          700: '#0154a1',
          800: '#054784',
          900: '#0a3c6e',
          950: '#072649',
        },
        navy: {
          800: '#111c30',
          900: '#0b1324',
          950: '#060a14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
        'glow-brand': '0 0 20px -3px rgba(12, 135, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
