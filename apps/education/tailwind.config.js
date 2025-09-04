/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Hunter Green base palette
        hunter: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8fd18f',
          400: '#5bb55b',
          500: '#355e3b',
          600: '#2a4a2f',
          700: '#233d27',
          800: '#1f3322',
          900: '#1a2b1d',
          950: '#0d1610',
        },
        // Education-themed colors
        education: {
          // Knowledge & Wisdom
          wisdom: '#4A90E2',      // Deep blue for knowledge
          insight: '#7B68EE',     // Purple for insights
          discovery: '#FF6B6B',   // Coral for discoveries
          growth: '#4ECDC4',      // Teal for growth
          // Learning states
          beginner: '#98D8C8',    // Light teal for beginners
          intermediate: '#F7DC6F', // Yellow for intermediate
          advanced: '#BB8FCE',    // Purple for advanced
          mastery: '#F8C471',     // Orange for mastery
        },
        // Interactive learning colors
        learning: {
          quiz: '#3498DB',        // Blue for quizzes
          lesson: '#2ECC71',      // Green for lessons
          practice: '#E74C3C',    // Red for practice
          review: '#9B59B6',      // Purple for review
          achievement: '#F39C12', // Orange for achievements
        },
        // Tech accent colors
        tech: {
          cyan: '#00D4FF',
          electric: '#0066FF',
          neon: '#00FF88',
          plasma: '#FF0080',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glass-shimmer': 'glassShimmer 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'pulse-learning': 'pulseLearning 1.5s ease-in-out infinite',
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
        glassShimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseLearning: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],