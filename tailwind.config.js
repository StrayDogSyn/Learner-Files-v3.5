/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // StrayDog Syndications Color Palette
        charcoal: {
          black: '#1C1C1C',
          slate: '#2B2B2B',
          graphite: '#3A3A3A',
        },
        hunter: {
          50: '#f0f7f1',
          100: '#dbeee0',
          200: '#b9dcc4',
          300: '#8fc49e',
          400: '#5a7c5a',
          500: '#355e3b',
          600: '#4a7c59',
          700: '#2d4f32',
          800: '#1a3d1a',
          900: '#0f2a0f',
        },
        emerald: {
          400: '#40e0d0',
          500: '#40e0d0',
        },
        metallic: {
          silver: '#C0C0C0',
          gunmetal: '#48494B',
          platinum: '#D7D7D7',
        },
        glass: {
          light: '#F5F5F5',
          pearl: '#FAFAFA',
        },
        // Legacy support
        primary: {
          50: '#eff6ff',
          500: '#50C878',
          600: '#355E3B',
          700: '#2A4B2F',
          900: '#1C1C1C',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'Audiowide', 'sans-serif'],
        body: ['Inter', 'Source Sans Pro', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'base': 'var(--text-base)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
      },
      backdropBlur: {
        'glass': 'var(--blur-medium)',
        'heavy': 'var(--blur-heavy)',
        'subtle': 'var(--blur-subtle)',
      },
      boxShadow: {
        'glass-soft': 'var(--shadow-glass-soft)',
        'glass-medium': 'var(--shadow-glass-medium)',
        'glass-strong': 'var(--shadow-glass-strong)',
        'metallic-glow': 'var(--shadow-metallic-glow)',
        'hunter-glow': 'var(--shadow-hunter-glow)',
        'premium': 'var(--shadow-premium)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
    },
  },
  plugins: [],
}