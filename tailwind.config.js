/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Theme Colors
        'ocean': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'wave': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        'coral': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'sand': {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'incois-blue': '#0ea5e9',
        'incois-light-blue': '#38bdf8',
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
        'wave-gradient': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)',
        'coral-gradient': 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
        'sand-gradient': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
      },
      animation: {
        'wave': 'wave 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'bubble': 'bubble 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0px) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-30px) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(-60px) scale(0.8)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
