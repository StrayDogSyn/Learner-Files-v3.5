/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marvel: {
          red: '#ED1D24',
          blue: '#0078D4',
          gold: '#FFD700',
          silver: '#C0C0C0',
          dark: '#1A1A1A',
          light: '#F8F9FA'
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          black: 'rgba(0, 0, 0, 0.1)',
          red: 'rgba(237, 29, 36, 0.1)',
          blue: 'rgba(0, 120, 212, 0.1)',
          gold: 'rgba(255, 215, 0, 0.1)',
          purple: 'rgba(139, 92, 246, 0.1)'
        }
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'repulsor': 'repulsor 0.8s ease-out',
        'thanos-snap': 'thanos-snap 2s ease-in-out',
        'power-surge': 'power-surge 1.5s ease-in-out',
        'shield-bounce': 'shield-bounce 0.6s ease-out',
        'web-swing': 'web-swing 1.2s ease-in-out',
        'lightning': 'lightning 0.4s ease-out',
        'gamma-pulse': 'gamma-pulse 2s ease-in-out infinite',
        'arc-reactor': 'arc-reactor 3s ease-in-out infinite',
        'vibranium-glow': 'vibranium-glow 2.5s ease-in-out infinite',
        'cosmic-energy': 'cosmic-energy 4s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        repulsor: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' }
        },
        'thanos-snap': {
          '0%': { transform: 'scale(1)', opacity: '1', filter: 'blur(0px)' },
          '50%': { transform: 'scale(0.8)', opacity: '0.5', filter: 'blur(2px)' },
          '100%': { transform: 'scale(0)', opacity: '0', filter: 'blur(10px)' }
        },
        'power-surge': {
          '0%': { boxShadow: '0 0 0 0 rgba(237, 29, 36, 0.7)' },
          '70%': { boxShadow: '0 0 0 20px rgba(237, 29, 36, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(237, 29, 36, 0)' }
        },
        'shield-bounce': {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(90deg)' },
          '50%': { transform: 'translateY(0) rotate(180deg)' },
          '75%': { transform: 'translateY(-5px) rotate(270deg)' },
          '100%': { transform: 'translateY(0) rotate(360deg)' }
        },
        'web-swing': {
          '0%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
          '100%': { transform: 'rotate(-15deg)' }
        },
        lightning: {
          '0%': { opacity: '0', transform: 'scaleY(0)' },
          '50%': { opacity: '1', transform: 'scaleY(1)' },
          '100%': { opacity: '0', transform: 'scaleY(0)' }
        },
        'gamma-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 197, 94, 0.8)' }
        },
        'arc-reactor': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 120, 212, 0.6), inset 0 0 20px rgba(0, 120, 212, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 120, 212, 0.9), inset 0 0 30px rgba(0, 120, 212, 0.5)' 
          }
        },
        'vibranium-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.7)' }
        },
        'cosmic-energy': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      },
      fontFamily: {
        'marvel': ['Orbitron', 'sans-serif'],
        'hero': ['Exo 2', 'sans-serif']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'neon-red': '0 0 20px rgba(237, 29, 36, 0.5)',
        'neon-blue': '0 0 20px rgba(0, 120, 212, 0.5)',
        'neon-gold': '0 0 20px rgba(255, 215, 0, 0.5)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cosmic': 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        'infinity': 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)'
      },
      backgroundSize: {
        '400%': '400% 400%'
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-panel': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        },
        '.glass-button': {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
          transition: 'all 0.3s ease'
        },
        '.glass-button:hover': {
          background: 'rgba(255, 255, 255, 0.25)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px 0 rgba(31, 38, 135, 0.35)'
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.3)'
        },
        '.glass-input': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)'
        },
        '.glass-modal': {
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)'
        },
        '.text-glow': {
          textShadow: '0 0 10px currentColor'
        },
        '.text-glow-lg': {
          textShadow: '0 0 20px currentColor, 0 0 40px currentColor'
        },
        '.border-glow': {
          boxShadow: '0 0 10px currentColor'
        },
        '.hero-gradient': {
          background: 'linear-gradient(135deg, rgba(237, 29, 36, 0.8) 0%, rgba(0, 120, 212, 0.8) 100%)'
        },
        '.cosmic-bg': {
          background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
          backgroundSize: '400% 400%',
          animation: 'cosmic-energy 15s ease infinite'
        }
      }
      addUtilities(newUtilities)
    }
  ],
}
