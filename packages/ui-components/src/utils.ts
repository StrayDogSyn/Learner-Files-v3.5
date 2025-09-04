import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Hunter Green color palette
 */
export const colors = {
  hunter: {
    50: '#f0f7e8',
    100: '#ddecc4',
    200: '#c7e09d',
    300: '#b0d474',
    400: '#9cc954',
    500: '#8FBC8F', // Justice accent
    600: '#6B8E23', // Education accent
    700: '#4A7C59', // Tech accent
    800: '#2D5016', // Primary Hunter Green
    900: '#1A3009', // Dark Hunter Green
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.2)',
  }
} as const;

/**
 * Glassmorphic style variants
 */
export const glassVariants = {
  default: 'bg-white/10 backdrop-blur-md border border-white/20',
  light: 'bg-white/15 backdrop-blur-lg border border-white/25',
  dark: 'bg-white/5 backdrop-blur-sm border border-white/10',
  strong: 'bg-white/20 backdrop-blur-xl border border-white/30',
} as const;

/**
 * Domain-specific color mappings
 */
export const domainColors = {
  corporate: {
    primary: '#2D5016',
    accent: '#4A7C59',
    light: '#f0f7e8',
    gradient: 'from-[#2D5016] to-[#4A7C59]',
  },
  technical: {
    primary: '#4A7C59',
    accent: '#6B8E23',
    light: '#ddecc4',
    gradient: 'from-[#4A7C59] to-[#6B8E23]',
  },
  educational: {
    primary: '#6B8E23',
    accent: '#8FBC8F',
    light: '#c7e09d',
    gradient: 'from-[#6B8E23] to-[#8FBC8F]',
  },
  'justice-reform': {
    primary: '#8FBC8F',
    accent: '#9cc954',
    light: '#b0d474',
    gradient: 'from-[#8FBC8F] to-[#9cc954]',
  },
} as const;

/**
 * Animation variants
 */
export const animations = {
  fadeIn: 'animate-[fadeIn_0.6s_ease-out]',
  slideUp: 'animate-[slideUp_0.8s_ease-out]',
  scaleIn: 'animate-[scaleIn_0.5s_ease-out]',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
} as const;

/**
 * Shadow variants for glassmorphic effects
 */
export const shadows = {
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  glassHover: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
  hunter: '0 4px 15px 0 rgba(45, 80, 22, 0.4)',
  hunterHover: '0 6px 20px 0 rgba(45, 80, 22, 0.6)',
} as const;

/**
 * Responsive breakpoint helpers
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Format utility functions
 */
export const formatters = {
  /**
   * Format a number with commas
   */
  number: (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  },
  
  /**
   * Format a percentage
   */
  percentage: (num: number, decimals = 1): string => {
    return `${num.toFixed(decimals)}%`;
  },
  
  /**
   * Format currency
   */
  currency: (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },
  
  /**
   * Format date
   */
  date: (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(dateObj);
  },
  
  /**
   * Format time ago
   */
  timeAgo: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return formatters.date(dateObj);
  },
};

/**
 * Validation utilities
 */
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },
};

/**
 * Accessibility helpers
 */
export const a11y = {
  /**
   * Generate ARIA label for screen readers
   */
  label: (text: string, context?: string): string => {
    return context ? `${text}, ${context}` : text;
  },
  
  /**
   * Generate description for complex UI elements
   */
  description: (element: string, state?: string): string => {
    return state ? `${element} is ${state}` : element;
  },
};

// Type exports
export type DomainType = keyof typeof domainColors;
export type GlassVariant = keyof typeof glassVariants;
export type AnimationType = keyof typeof animations;