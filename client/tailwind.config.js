/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bsafe: {
          blue: '#0B63E5',
          lightBlue: '#3B82F6',
          darkBlue: '#0045B5',
          navy: '#0F172A',
          deepNavy: '#0A0F1D',
          sky: '#E0F2FE',
          red: '#EF4444',
          crimson: '#DC2626',
          emerald: '#10B981',
          amber: '#F59E0B',
          gray: '#64748B',
          lightGray: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'bsafe': '0 10px 25px -5px rgba(11, 99, 229, 0.25), 0 8px 10px -6px rgba(11, 99, 229, 0.2)',
        'bsafe-glow': '0 0 35px rgba(11, 99, 229, 0.35)',
        'sos-glow': '0 0 35px rgba(239, 68, 68, 0.45)',
      }
    },
  },
  plugins: [],
}
