import React from 'react';
import { cn, domainColors, type DomainType } from './utils';
import { X } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  domain?: DomainType;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    domain = 'corporate',
    removable = false,
    onRemove,
    icon,
    children,
    ...props
  }, ref) => {
    const domainColor = domainColors[domain];
    
    const baseClasses = cn(
      'inline-flex items-center font-medium transition-all duration-200',
      'border backdrop-blur-sm',
      removable && 'pr-1'
    );
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs rounded-md gap-1',
      md: 'px-2.5 py-1 text-sm rounded-lg gap-1.5',
      lg: 'px-3 py-1.5 text-sm rounded-lg gap-2',
    };
    
    const variantClasses = {
      default: cn(
        'text-white border-white/20',
        `bg-[${domainColor.primary}]/80`,
        'shadow-sm'
      ),
      secondary: cn(
        'text-gray-200 bg-white/10 border-white/20',
        'hover:bg-white/15'
      ),
      success: cn(
        'text-green-100 bg-green-500/20 border-green-400/30',
        'shadow-[0_0_10px_rgba(34,197,94,0.3)]'
      ),
      warning: cn(
        'text-yellow-100 bg-yellow-500/20 border-yellow-400/30',
        'shadow-[0_0_10px_rgba(234,179,8,0.3)]'
      ),
      error: cn(
        'text-red-100 bg-red-500/20 border-red-400/30',
        'shadow-[0_0_10px_rgba(239,68,68,0.3)]'
      ),
      glass: cn(
        'text-white bg-white/10 backdrop-blur-md border-white/20',
        'shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]',
        'hover:bg-white/15 hover:border-white/30'
      ),
    };
    
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
    
    return (
      <div
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0">
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement, { size: iconSize })
              : icon
            }
          </span>
        )}
        
        <span className="truncate">{children}</span>
        
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className={cn(
              'ml-1 flex-shrink-0 rounded-full p-0.5',
              'hover:bg-white/20 transition-colors duration-200',
              'focus:outline-none focus:ring-1 focus:ring-white/50'
            )}
            aria-label="Remove badge"
          >
            <X size={iconSize} />
          </button>
        )}
        
        {/* Subtle glow effect for certain variants */}
        {(variant === 'success' || variant === 'warning' || variant === 'error') && (
          <div 
            className="absolute inset-0 rounded-lg opacity-30 blur-sm pointer-events-none"
            style={{
              background: variant === 'success' 
                ? 'rgba(34,197,94,0.2)' 
                : variant === 'warning'
                ? 'rgba(234,179,8,0.2)'
                : 'rgba(239,68,68,0.2)'
            }}
          />
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };