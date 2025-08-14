import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  glow?: boolean;
  variant?: 'default' | 'hero' | 'card' | 'modal';
}

const blurClasses = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
};

const shadowClasses = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

const variantClasses = {
  default: 'glass-panel',
  hero: 'glass-panel bg-gradient-to-br from-glass-white to-glass-blue',
  card: 'glass-card',
  modal: 'glass-modal'
};

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  blur = 'md',
  opacity = 0.1,
  border = true,
  shadow = 'lg',
  animate = true,
  glow = false,
  variant = 'default'
}) => {
  const baseClasses = cn(
    variantClasses[variant],
    blurClasses[blur],
    shadowClasses[shadow],
    {
      'border-0': !border,
      'border-glow': glow,
      'hover:shadow-glass-lg transition-all duration-300': animate
    },
    className
  );

  const customStyle = {
    '--glass-opacity': opacity
  } as React.CSSProperties;

  const motionProps = animate ? {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    whileHover: {
      scale: 1.02
    }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      style={customStyle}
      {...motionProps}
    >
      {glow && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-marvel-red/20 via-marvel-blue/20 to-marvel-gold/20 blur-xl -z-10" />
      )}
      {children}
    </motion.div>
  );
};

// Specialized glass panel variants
export const HeroGlassPanel: React.FC<Omit<GlassPanelProps, 'variant'>> = (props) => (
  <GlassPanel {...props} variant="hero" glow />
);

export const CardGlassPanel: React.FC<Omit<GlassPanelProps, 'variant'>> = (props) => (
  <GlassPanel {...props} variant="card" />
);

export const ModalGlassPanel: React.FC<Omit<GlassPanelProps, 'variant'>> = (props) => (
  <GlassPanel {...props} variant="modal" animate={false} />
);

// Glass panel with cosmic background
export const CosmicGlassPanel: React.FC<GlassPanelProps> = (props) => (
  <div className="relative">
    <div className="absolute inset-0 cosmic-bg rounded-2xl opacity-30" />
    <GlassPanel {...props} className={cn('relative z-10', props.className)} />
  </div>
);

// Glass panel with infinity stone effect
export const InfinityGlassPanel: React.FC<GlassPanelProps & { stone?: 'power' | 'space' | 'reality' | 'soul' | 'time' | 'mind' }> = ({
  stone = 'power',
  ...props
}) => {
  const stoneColors = {
    power: 'from-purple-500/20 to-purple-700/20',
    space: 'from-blue-500/20 to-blue-700/20',
    reality: 'from-red-500/20 to-red-700/20',
    soul: 'from-orange-500/20 to-orange-700/20',
    time: 'from-green-500/20 to-green-700/20',
    mind: 'from-yellow-500/20 to-yellow-700/20'
  };

  return (
    <div className="relative">
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br rounded-2xl opacity-40 animate-pulse-slow',
        stoneColors[stone]
      )} />
      <GlassPanel {...props} className={cn('relative z-10', props.className)} glow />
    </div>
  );
};

export default GlassPanel;