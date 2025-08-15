import React from 'react';

interface BrandWatermarkProps {
  variant?: 'pattern' | 'logo' | 'text';
  opacity?: number;
  size?: 'small' | 'medium' | 'large';
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const BrandWatermark: React.FC<BrandWatermarkProps> = ({
  variant = 'pattern',
  opacity = 0.03,
  size = 'medium',
  position = 'center',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-32 h-32';
      case 'medium': return 'w-64 h-64';
      case 'large': return 'w-96 h-96';
      default: return 'w-64 h-64';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'center': return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default: return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  const renderPattern = () => (
    <svg
      viewBox="0 0 200 200"
      className={`${getSizeClasses()} ${className}`}
      style={{ opacity }}
    >
      {/* Geometric Pattern inspired by StrayDog Syndications branding */}
      <defs>
        <pattern id="brandPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="currentColor" />
          <path d="M10,10 L30,30 M30,10 L10,30" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="50%" stopColor="var(--brand-secondary)" />
          <stop offset="100%" stopColor="var(--brand-accent)" />
        </linearGradient>
      </defs>
      
      {/* Background pattern */}
      <rect width="200" height="200" fill="url(#brandPattern)" />
      
      {/* Central logo-inspired shape */}
      <g transform="translate(100,100)">
        {/* Outer ring */}
        <circle r="80" fill="none" stroke="url(#brandGradient)" strokeWidth="2" />
        
        {/* Inner geometric shapes */}
        <polygon points="-30,-30 30,-30 40,0 30,30 -30,30 -40,0" fill="url(#brandGradient)" />
        
        {/* Center dot */}
        <circle r="8" fill="var(--brand-primary)" />
        
        {/* Radiating lines */}
        <g stroke="var(--brand-secondary)" strokeWidth="1">
          <line x1="-60" y1="0" x2="-45" y2="0" />
          <line x1="45" y1="0" x2="60" y2="0" />
          <line x1="0" y1="-60" x2="0" y2="-45" />
          <line x1="0" y1="45" x2="0" y2="60" />
          <line x1="-42" y1="-42" x2="-32" y2="-32" />
          <line x1="32" y1="32" x2="42" y2="42" />
          <line x1="42" y1="-42" x2="32" y2="-32" />
          <line x1="-32" y1="32" x2="-42" y2="42" />
        </g>
      </g>
    </svg>
  );

  const renderLogo = () => (
    <svg
      viewBox="0 0 120 120"
      className={`${getSizeClasses()} ${className}`}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-secondary)" />
        </linearGradient>
      </defs>
      
      {/* Simplified StrayDog logo representation */}
      <g transform="translate(60,60)">
        {/* Main shape */}
        <path
          d="M-40,-20 Q-40,-40 -20,-40 L20,-40 Q40,-40 40,-20 L40,20 Q40,40 20,40 L-20,40 Q-40,40 -40,20 Z"
          fill="url(#logoGradient)"
        />
        
        {/* Inner details */}
        <circle cx="-15" cy="-10" r="4" fill="white" />
        <circle cx="15" cy="-10" r="4" fill="white" />
        <path d="M-10,10 Q0,20 10,10" stroke="white" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );

  const renderText = () => (
    <div
      className={`${getSizeClasses()} ${className} flex items-center justify-center`}
      style={{ opacity }}
    >
      <div className="text-center transform rotate-45">
        <div className="text-2xl font-bold text-[var(--brand-primary)] mb-2">
          STRAYDOG
        </div>
        <div className="text-lg font-medium text-[var(--brand-secondary)]">
          SYNDICATIONS
        </div>
      </div>
    </div>
  );

  return (
    <div className={`absolute pointer-events-none z-0 ${getPositionClasses()}`}>
      {variant === 'pattern' && renderPattern()}
      {variant === 'logo' && renderLogo()}
      {variant === 'text' && renderText()}
    </div>
  );
};

export default BrandWatermark;