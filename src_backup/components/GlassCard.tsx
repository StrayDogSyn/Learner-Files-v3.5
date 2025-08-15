import React from 'react';

interface GlassCardProps {
  variant?: 'primary' | 'secondary' | 'premium' | 'hunter';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'primary',
  children,
  className = '',
  onClick,
  hover = true,
  padding = 'md',
  style,
  ...props
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'sm':
        return 'p-4';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const hoverClasses = hover ? 'transition-all duration-300 hover:transform hover:-translate-y-1' : '';
  const cardClasses = variant === 'hunter' ? 'glass-card-hunter' : 'glass-card';
  
  const combinedClassName = `${cardClasses} ${getPaddingClasses()} ${hoverClasses} ${className}`;

  return (
    <div
      className={combinedClassName}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;