import React from 'react';
import { cn, domainColors, type DomainType } from './utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  domain?: DomainType;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    domain = 'corporate',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const domainColor = domainColors[domain];
    
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'relative overflow-hidden group',
      fullWidth && 'w-full'
    );
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
      xl: 'px-8 py-4 text-lg rounded-xl gap-3',
    };
    
    const variantClasses = {
      primary: cn(
        'text-white shadow-lg',
        `bg-[${domainColor.primary}] hover:bg-[${domainColor.accent}]`,
        `focus:ring-[${domainColor.accent}]`,
        'hover:shadow-xl hover:-translate-y-0.5',
        'active:translate-y-0 active:shadow-lg'
      ),
      secondary: cn(
        'text-white bg-white/10 backdrop-blur-md border border-white/20',
        'hover:bg-white/15 hover:border-white/30',
        'focus:ring-white/50',
        'hover:shadow-lg hover:-translate-y-0.5'
      ),
      ghost: cn(
        'text-gray-300 hover:text-white hover:bg-white/10',
        'focus:ring-white/30',
        'hover:backdrop-blur-sm'
      ),
      glass: cn(
        'text-white bg-white/10 backdrop-blur-md border border-white/20',
        'hover:bg-white/20 hover:border-white/30',
        'focus:ring-white/50',
        'shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]',
        'hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)]',
        'hover:-translate-y-1'
      ),
      outline: cn(
        `text-[${domainColor.primary}] border-2`,
        `border-[${domainColor.primary}] hover:bg-[${domainColor.primary}]`,
        'hover:text-white',
        `focus:ring-[${domainColor.accent}]`,
        'hover:shadow-lg hover:-translate-y-0.5'
      ),
    };
    
    const shimmerEffect = (
      <div className="absolute inset-0 -top-full group-hover:top-full transition-all duration-700 bg-gradient-to-b from-transparent via-white/20 to-transparent transform -skew-y-12" />
    );
    
    const content = (
      <>
        {loading && (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 18 : size === 'xl' ? 20 : 16} />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span className={cn(loading && 'opacity-0')}>{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {variant === 'primary' && shimmerEffect}
      </>
    );
    
    return (
      <button
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };