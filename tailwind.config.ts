import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9ec',
          100: '#faefc3',
          200: '#f4de85',
          300: '#efc647',
          400: '#ebb01e',
          500: '#d59410',
          600: '#b8710b',
          700: '#944f0c',
          800: '#7a3e11',
          900: '#673312',
        },
        dark: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0bac8',
          400: '#8594a9',
          500: '#66778f',
          600: '#515f75',
          700: '#424d60',
          800: '#394251',
          900: '#0f172a',
          950: '#0c111d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(235, 176, 30, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(235, 176, 30, 0.6)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
