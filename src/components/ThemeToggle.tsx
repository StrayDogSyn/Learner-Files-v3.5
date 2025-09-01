import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAnalytics } from '../hooks/useAnalytics';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { trackThemeToggle } = useAnalytics();

  return (
    <button
      onClick={() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        toggleTheme();
        trackThemeToggle(newTheme);
      }}
      className="
        relative p-3 rounded-full transition-all duration-300 ease-in-out
        bg-white/10 dark:bg-black/20 backdrop-blur-md
        border border-white/20 dark:border-white/10
        hover:bg-white/20 dark:hover:bg-black/30
        hover:border-white/30 dark:hover:border-white/20
        hover:scale-105 active:scale-95
        shadow-lg hover:shadow-xl
        group
      "
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun 
          className={`
            absolute inset-0 w-6 h-6 transition-all duration-300
            text-amber-500 dark:text-amber-400
            ${theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-75'
            }
          `}
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`
            absolute inset-0 w-6 h-6 transition-all duration-300
            text-blue-400 dark:text-blue-300
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
            }
          `}
        />
      </div>
      
      {/* Glow effect */}
      <div className="
        absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        bg-gradient-to-r from-amber-500/20 to-blue-500/20
        blur-md -z-10
      " />
    </button>
  );
};

export default ThemeToggle;