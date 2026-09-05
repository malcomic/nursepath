import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand teal (Figma #107c85)
        primary: {
          50: '#e8f5f6',
          100: '#d1ebed',
          200: '#a3d7db',
          300: '#75c3c9',
          400: '#47afb7',
          500: '#1e9ba5',
          600: '#107c85',
          700: '#0d636a',
          800: '#0a4a50',
          900: '#073136',
        },
        // Soft green secondary (kept for success states)
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Coral CTA (Figma #e76f51)
        accent: {
          50: '#fef4f1',
          100: '#fde8e2',
          200: '#fad1c5',
          300: '#f5a890',
          400: '#f08a6d',
          500: '#e76f51',
          600: '#d45a3c',
          700: '#b04530',
          800: '#8c3726',
          900: '#6b2a1d',
        },
        // Navy ink (Figma #0b1b3d)
        navy: {
          50: '#f2f4f8',
          100: '#e5e9f0',
          200: '#c5cedd',
          300: '#8a9bb8',
          400: '#52607a',
          500: '#3d4a63',
          600: '#2a3650',
          700: '#1a2742',
          800: '#0b1b3d',
          900: '#071229',
        },
        soft: '#faf9f6',
        border: {
          DEFAULT: '#e6e9ee',
        },
      },
      fontFamily: {
        sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px rgba(16, 124, 133, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
