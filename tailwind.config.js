/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#faf6f1',
        cream: '#f5ede2',
        pearl: '#f1e6d8',
        blush: {
          50: '#fbf3ef',
          100: '#f5e1d8',
          200: '#edc9bb',
          300: '#e0a991',
          400: '#cf8268',
          500: '#b86949',
          600: '#9b5236',
        },
        rosegold: {
          50: '#fbf3ee',
          100: '#f3dccd',
          200: '#e6b89c',
          300: '#d49170',
          400: '#bf7150',
          500: '#a35a3e',
        },
        champagne: {
          50: '#faf2e3',
          100: '#f1dfba',
          200: '#e8c895',
          300: '#d8a763',
          400: '#bd8740',
        },
        mocha: {
          400: '#9b7a5e',
          500: '#7a5a40',
          600: '#5c4530',
          700: '#3d2e20',
        },
        espresso: '#1f1813',
        ink: '#0d0a08',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        'wider-2': '0.18em',
        'wider-3': '0.28em',
      },
      boxShadow: {
        'soft': '0 10px 40px -20px rgba(61, 46, 32, 0.18)',
        'softer': '0 6px 24px -12px rgba(61, 46, 32, 0.14)',
        'glow': '0 30px 80px -40px rgba(191, 113, 80, 0.55)',
        'inner-soft': 'inset 0 1px 0 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'grain':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.06'/></svg>\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'shimmer': 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
