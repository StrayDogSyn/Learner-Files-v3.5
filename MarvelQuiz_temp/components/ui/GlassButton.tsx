import React from 'react';
import { motion } from 'framer-motion';
import { type LucideProps } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ComponentType<LucideProps>;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
  pulse?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const variantClasses = {
  default: 'glass-button text-white hover:text-marvel-gold',
  primary: 'glass-button bg-marvel-red/20 text-white border-marvel-red/30 hover:bg-marvel-red/30 hover:border-marvel-red/50',
  secondary: 'glass-button bg-marvel-blue/20 text-white border-marvel-blue/30 hover:bg-marvel-blue/30 hover:border-marvel-blue/50',
  danger: 'glass-button bg-red-500/20 text-white border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50',
  success: 'glass-button bg-green-500/20 text-white border-green-500/30 hover:bg-green-500/30 hover:border-green-500/50',
  hero: 'glass-button hero-gradient text-white border-marvel-gold/50 hover:border-marvel-gold shadow-neon-gold'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  glow = false,
  pulse = false,
  type = 'button',
  fullWidth = false
}) => {
  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-marvel-blue/50 focus:ring-offset-2 focus:ring-offset-transparent',
    'active:scale-95 select-none',
    variantClasses[variant],
    sizeClasses[size],
    {
      'w-full': fullWidth,
      'opacity-50 cursor-not-allowed': disabled || loading,
      'cursor-pointer': !disabled && !loading,
      'animate-pulse-slow': pulse,
      'shadow-neon-blue': glow && variant === 'primary',
      'shadow-neon-red': glow && variant === 'danger',
      'shadow-neon-gold': glow && variant === 'hero'
    },
    className
  );

  const motionProps = {
    whileHover: disabled || loading ? {} : {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    whileTap: disabled || loading ? {} : {
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...motionProps}
    >
      {/* Glow effect */}
      {glow && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-current/20 via-current/10 to-current/20 blur-lg -z-10" />
      )}
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <div className={cn('flex items-center gap-2', { 'opacity-0': loading })}>
        {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-inherit overflow-hidden">
        <div className="absolute inset-0 bg-white/10 transform scale-0 rounded-inherit transition-transform duration-300 group-active:scale-100" />
      </div>
    </motion.button>
  );
};

// Specialized button variants
export const HeroButton: React.FC<Omit<GlassButtonProps, 'variant'>> = (props) => (
  <GlassButton {...props} variant="hero" glow pulse />
);

export const PrimaryButton: React.FC<Omit<GlassButtonProps, 'variant'>> = (props) => (
  <GlassButton {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<GlassButtonProps, 'variant'>> = (props) => (
  <GlassButton {...props} variant="secondary" />
);

export const DangerButton: React.FC<Omit<GlassButtonProps, 'variant'>> = (props) => (
  <GlassButton {...props} variant="danger" />
);

export const SuccessButton: React.FC<Omit<GlassButtonProps, 'variant'>> = (props) => (
  <GlassButton {...props} variant="success" />
);

// Marvel-themed action buttons
export const RepulsorButton: React.FC<Omit<GlassButtonProps, 'variant' | 'className'>> = (props) => (
  <GlassButton
    {...props}
    variant="primary"
    className="animate-arc-reactor hover:animate-repulsor"
    glow
  />
);

export const VibraniumButton: React.FC<Omit<GlassButtonProps, 'variant' | 'className'>> = (props) => (
  <GlassButton
    {...props}
    variant="secondary"
    className="animate-vibranium-glow hover:animate-shield-bounce"
    glow
  />
);

export const CosmicButton: React.FC<Omit<GlassButtonProps, 'variant' | 'className'>> = (props) => (
  <div className="relative">
    <div className="absolute inset-0 cosmic-bg rounded-xl opacity-50 blur-sm" />
    <GlassButton
      {...props}
      variant="hero"
      className="relative z-10 border-none"
      glow
    />
  </div>
);

export const InfinityButton: React.FC<Omit<GlassButtonProps, 'variant' | 'className'> & { 
  stone?: 'power' | 'space' | 'reality' | 'soul' | 'time' | 'mind' 
}> = ({ stone = 'power', ...props }) => {
  const stoneColors = {
    power: 'from-purple-500 to-purple-700',
    space: 'from-blue-500 to-blue-700',
    reality: 'from-red-500 to-red-700',
    soul: 'from-orange-500 to-orange-700',
    time: 'from-green-500 to-green-700',
    mind: 'from-yellow-500 to-yellow-700'
  };

  return (
    <div className="relative">
      <div className={cn(
        'absolute inset-0 bg-gradient-to-r rounded-xl opacity-60 animate-pulse-slow blur-sm',
        stoneColors[stone]
      )} />
      <GlassButton
        {...props}
        variant="hero"
        className="relative z-10 border-none"
        glow
      />
    </div>
  );
};

export default GlassButton;