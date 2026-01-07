/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CASCADE specific colors
        cascade: {
          sovereign: 'rgb(16 185 129)', // emerald-500
          stable: 'rgb(6 182 212)', // cyan-500
          drifting: 'rgb(245 158 11)', // amber-500
          critical: 'rgb(239 68 68)', // red-500
          foundation: 'rgb(168 85 247)', // purple-500
          theory: 'rgb(59 130 246)', // blue-500
          edge: 'rgb(16 185 129)', // emerald-500
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'cascade': 'cascade 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(6 182 212 / 0.2)' },
          '50%': { boxShadow: '0 0 30px rgb(6 182 212 / 0.4)' },
        },
        cascade: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
