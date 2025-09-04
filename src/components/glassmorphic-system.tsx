import React, { ReactNode, forwardRef, HTMLAttributes } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '../shared/utils/cn';

/**
 * Advanced Glassmorphic Component System
 * Hunter Green theme with tech accent variations
 */

// Base glassmorphic styles with CSS-in-JS for maximum control
export const glassStyles = {
  base: {
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)', // Safari support
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  variants: {
    primary: {
      background: 'rgba(53, 94, 59, 0.15)', // Hunter Green with transparency
      border: '1px solid rgba(53, 94, 59, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(53, 94, 59, 0.2)',
    },
    tech: {
      background: 'rgba(0, 212, 170, 0.1)', // Electric Mint
      border: '1px solid rgba(0, 212, 170, 0.25)',
      boxShadow: '0 8px 32px 0 rgba(0, 212, 170, 0.15)',
    },
    cyber: {
      background: 'rgba(124, 58, 237, 0.1)', // Cyber Purple
      border: '1px solid rgba(124, 58, 237, 0.25)',
      boxShadow: '0 8px 32px 0 rgba(124, 58, 237, 0.15)',
    },
    matrix: {
      background: 'rgba(0, 255, 65, 0.08)', // Matrix Green
      border: '1px solid rgba(0, 255, 65, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(0, 255, 65, 0.1)',
    }
  }
};

// Theme colors
export const theme = {
  colors: {
    hunterGreen: '#355E3B',
    jetBlack: '#0B0B0B',
    techElectric: '#00D4AA',
    techCyber: '#7C3AED',
    techMatrix: '#00FF41',
    softWhite: '#F5F5F5',
    graphite: '#3F3F3F',
    metallicSilver: '#C2C2C2'
  }
} as const;

// Base Glass Container Component
export interface GlassContainerProps extends HTMLAttributes<HTMLDivElement>, MotionProps {
  variant?: 'base' | 'primary' | 'tech' | 'cyber' | 'matrix';
  blur?: 'light' | 'medium' | 'heavy';
  glow?: boolean;
  children: ReactNode;
  className?: string;
}

export const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ variant = 'base', blur = 'medium', glow = false, children, className, ...props }, ref) => {
    const blurLevels = {
      light: '8px',
      medium: '16px',
      heavy: '24px'
    };

    const glowEffects = {
      primary: '0 0 20px rgba(53, 94, 59, 0.3)',
      tech: '0 0 20px rgba(0, 212, 170, 0.3)',
      cyber: '0 0 20px rgba(124, 58, 237, 0.3)',
      matrix: '0 0 20px rgba(0, 255, 65, 0.2)'
    };

    const dynamicStyles = {
      ...glassStyles.base,
      ...(variant !== 'base' && glassStyles.variants[variant]),
      backdropFilter: `blur(${blurLevels[blur]})`,
      WebkitBackdropFilter: `blur(${blurLevels[blur]})`,
      ...(glow && variant !== 'base' && {
        boxShadow: `${glassStyles.variants[variant]?.boxShadow}, ${glowEffects[variant]}`
      })
    };

    return (
      <motion.div
        ref={ref}
        style={dynamicStyles}
        className={cn('glass-container', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassContainer.displayName = 'GlassContainer';

// Advanced Glass Card with Interactive States
export interface GlassCardProps extends GlassContainerProps {
  hoverable?: boolean;
  clickable?: boolean;
  loading?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ hoverable = true, clickable = false, loading = false, children, className, ...props }, ref) => {
    const hoverAnimation = hoverable ? {
      whileHover: {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }
    } : {};

    const clickAnimation = clickable ? {
      whileTap: {
        scale: 0.98,
        transition: { duration: 0.1 }
      }
    } : {};

    return (
      <GlassContainer
        ref={ref}
        className={cn(
          'p-6 transition-all duration-300 cursor-default',
          {
            'cursor-pointer': clickable,
            'hover:shadow-lg': hoverable,
            'animate-pulse': loading
          },
          className
        )}
        {...hoverAnimation}
        {...clickAnimation}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
          </div>
        ) : (
          children
        )}
      </GlassContainer>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// Glass Button with Tech Variations
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'tech' | 'cyber' | 'matrix' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ variant = 'primary', size = 'md', glow = false, loading = false, children, className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    const variantStyles = {
      primary: {
        background: 'rgba(53, 94, 59, 0.2)',
        border: '1px solid rgba(53, 94, 59, 0.4)',
        color: theme.colors.hunterGreen
      },
      tech: {
        background: 'rgba(0, 212, 170, 0.15)',
        border: '1px solid rgba(0, 212, 170, 0.3)',
        color: theme.colors.techElectric
      },
      cyber: {
        background: 'rgba(124, 58, 237, 0.15)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        color: theme.colors.techCyber
      },
      matrix: {
        background: 'rgba(0, 255, 65, 0.1)',
        border: '1px solid rgba(0, 255, 65, 0.25)',
        color: theme.colors.techMatrix
      },
      ghost: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: theme.colors.softWhite
      }
    };

    const glowEffects = {
      primary: '0 0 15px rgba(53, 94, 59, 0.4)',
      tech: '0 0 15px rgba(0, 212, 170, 0.4)',
      cyber: '0 0 15px rgba(124, 58, 237, 0.4)',
      matrix: '0 0 15px rgba(0, 255, 65, 0.3)',
      ghost: '0 0 15px rgba(255, 255, 255, 0.2)'
    };

    const buttonStyle = {
      ...variantStyles[variant],
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      ...(glow && {
        boxShadow: `${variantStyles[variant].background.replace('0.15', '0.3').replace('0.2', '0.3').replace('0.1', '0.2').replace('0.05', '0.1')}, ${glowEffects[variant]}`
      })
    };

    return (
      <motion.button
        ref={ref}
        style={buttonStyle}
        className={cn(
          'font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
          {
            'focus:ring-green-500': variant === 'primary',
            'focus:ring-cyan-400': variant === 'tech',
            'focus:ring-purple-500': variant === 'cyber',
            'focus:ring-green-400': variant === 'matrix',
            'focus:ring-white': variant === 'ghost'
          },
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            Loading...
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

// Export all components and theme
export { glassStyles };
export type { GlassContainerProps, GlassCardProps, GlassButtonProps };