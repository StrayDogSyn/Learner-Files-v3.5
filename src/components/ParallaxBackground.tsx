import React, { useEffect, useState } from 'react';

interface ParallaxBackgroundProps {
  variant?: 'pattern' | 'geometric' | 'minimal';
  speed?: number;
  opacity?: number;
  className?: string;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  variant = 'pattern',
  speed = 0.5,
  opacity = 0.03,
  className = ''
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transform = `translateY(${scrollY * speed}px)`;

  const renderPattern = () => (
    <svg
      className="w-full h-full"
      viewBox="0 0 800 600"
      style={{ transform, opacity }}
    >
      <defs>
        <pattern id="parallaxPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="3" fill="var(--brand-primary)" />
          <path d="M20,20 L60,60 M60,20 L20,60" stroke="var(--brand-secondary)" strokeWidth="1" opacity="0.5" />
          <rect x="30" y="30" width="20" height="20" fill="none" stroke="var(--brand-accent)" strokeWidth="0.5" />
        </pattern>
        
        <linearGradient id="parallaxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.1" />
          <stop offset="50%" stopColor="var(--brand-secondary)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Background pattern */}
      <rect width="800" height="600" fill="url(#parallaxPattern)" />
      
      {/* Floating geometric shapes */}
      <g opacity="0.6">
        <circle cx="150" cy="100" r="20" fill="var(--brand-primary)" opacity="0.2" />
        <circle cx="650" cy="150" r="15" fill="var(--brand-secondary)" opacity="0.3" />
        <circle cx="200" cy="400" r="25" fill="var(--brand-accent)" opacity="0.2" />
        <circle cx="600" cy="450" r="18" fill="var(--brand-primary)" opacity="0.25" />
        
        <polygon points="100,300 120,280 140,300 120,320" fill="var(--brand-secondary)" opacity="0.2" />
        <polygon points="700,200 720,180 740,200 720,220" fill="var(--brand-accent)" opacity="0.3" />
        <polygon points="300,500 320,480 340,500 320,520" fill="var(--brand-primary)" opacity="0.2" />
        
        <rect x="500" y="300" width="30" height="30" fill="none" stroke="var(--brand-secondary)" strokeWidth="2" opacity="0.3" transform="rotate(45 515 315)" />
        <rect x="80" y="450" width="25" height="25" fill="none" stroke="var(--brand-accent)" strokeWidth="2" opacity="0.2" transform="rotate(30 92.5 462.5)" />
      </g>
      
      {/* Gradient overlay */}
      <rect width="800" height="600" fill="url(#parallaxGradient)" />
    </svg>
  );

  const renderGeometric = () => (
    <svg
      className="w-full h-full"
      viewBox="0 0 800 600"
      style={{ transform, opacity }}
    >
      <defs>
        <linearGradient id="geoGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="geoGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Large geometric shapes */}
      <g opacity="0.4">
        <path d="M0,0 L200,100 L150,300 L-50,200 Z" fill="url(#geoGradient1)" />
        <path d="M600,0 L800,50 L850,250 L650,200 Z" fill="url(#geoGradient2)" />
        <path d="M200,400 L400,350 L450,550 L250,600 Z" fill="url(#geoGradient1)" />
        <path d="M500,300 L700,280 L750,480 L550,500 Z" fill="url(#geoGradient2)" />
      </g>
      
      {/* Connecting lines */}
      <g stroke="var(--brand-primary)" strokeWidth="1" opacity="0.2" fill="none">
        <path d="M100,100 Q400,50 700,150" />
        <path d="M150,200 Q450,150 750,250" />
        <path d="M50,300 Q350,250 650,350" />
        <path d="M200,400 Q500,350 800,450" />
      </g>
      
      {/* Small accent dots */}
      <g opacity="0.6">
        {Array.from({ length: 20 }, (_, i) => {
          const x = (i * 40 + 50) % 800;
          const y = (i * 30 + 80) % 600;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={i % 3 === 0 ? 'var(--brand-primary)' : i % 3 === 1 ? 'var(--brand-secondary)' : 'var(--brand-accent)'}
              opacity="0.4"
            />
          );
        })}
      </g>
    </svg>
  );

  const renderMinimal = () => (
    <svg
      className="w-full h-full"
      viewBox="0 0 800 600"
      style={{ transform, opacity }}
    >
      <defs>
        <radialGradient id="minimalGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0.02" />
        </radialGradient>
      </defs>
      
      {/* Subtle background gradient */}
      <rect width="800" height="600" fill="url(#minimalGradient)" />
      
      {/* Minimal geometric elements */}
      <g opacity="0.3">
        <circle cx="200" cy="150" r="80" fill="none" stroke="var(--brand-primary)" strokeWidth="1" opacity="0.2" />
        <circle cx="600" cy="350" r="60" fill="none" stroke="var(--brand-secondary)" strokeWidth="1" opacity="0.3" />
        <circle cx="400" cy="450" r="40" fill="none" stroke="var(--brand-accent)" strokeWidth="1" opacity="0.2" />
        
        <line x1="100" y1="300" x2="300" y2="200" stroke="var(--brand-primary)" strokeWidth="1" opacity="0.2" />
        <line x1="500" y1="150" x2="700" y2="250" stroke="var(--brand-secondary)" strokeWidth="1" opacity="0.3" />
        <line x1="150" y1="500" x2="650" y2="400" stroke="var(--brand-accent)" strokeWidth="1" opacity="0.2" />
      </g>
      
      {/* Brand logo silhouette */}
      <g transform="translate(400,300)" opacity="0.1">
        <circle r="50" fill="none" stroke="var(--brand-primary)" strokeWidth="2" />
        <polygon points="-20,-20 20,-20 25,0 20,20 -20,20 -25,0" fill="var(--brand-primary)" opacity="0.5" />
        <circle r="8" fill="var(--brand-secondary)" />
      </g>
    </svg>
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {variant === 'pattern' && renderPattern()}
      {variant === 'geometric' && renderGeometric()}
      {variant === 'minimal' && renderMinimal()}
    </div>
  );
};

export default ParallaxBackground;