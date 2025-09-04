import React from 'react';
import { cn, domainColors, type DomainType, type GlassVariant } from './utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  domain?: DomainType;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    domain = 'corporate',
    hover = false,
    padding = 'md',
    children,
    ...props
  }, ref) => {
    const domainColor = domainColors[domain];
    
    const baseClasses = cn(
      'rounded-xl transition-all duration-300',
      'shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]',
      hover && [
        'hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)]',
        'hover:-translate-y-1',
        'cursor-pointer'
      ]
    );
    
    const variantClasses = {
      default: 'bg-white/10 backdrop-blur-md border border-white/20',
      light: 'bg-white/15 backdrop-blur-lg border border-white/25',
      dark: 'bg-white/5 backdrop-blur-sm border border-white/10',
      strong: 'bg-white/20 backdrop-blur-xl border border-white/30',
    };
    
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };
    
    return (
      <div
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        ref={ref}
        style={{
          borderColor: `${domainColor.accent}40`,
        }}
        {...props}
      >
        <div className="relative z-10">{children}</div>
        {/* Subtle domain-colored gradient overlay */}
        <div 
          className="absolute inset-0 rounded-xl opacity-5 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${domainColor.primary}, ${domainColor.accent})`
          }}
        />
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };