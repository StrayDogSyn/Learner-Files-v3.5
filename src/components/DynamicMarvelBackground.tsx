import React, { useState, useEffect } from 'react';

interface BackgroundTheme {
  name: string;
  gradients: string[];
  particles?: {
    color: string;
    count: number;
    size: number;
  };
  animation?: string;
}

interface DynamicMarvelBackgroundProps {
  children: React.ReactNode;
  changeInterval?: number; // in milliseconds
  intensity?: 'subtle' | 'medium' | 'intense';
  animated?: boolean;
}

const marvelThemes: BackgroundTheme[] = [
  {
    name: 'Spider-Man',
    gradients: ['#DC2626', '#1E40AF', '#000000'],
    particles: {
      color: '#DC2626',
      count: 15,
      size: 4
    },
    animation: 'animate-pulse'
  },
  {
    name: 'Iron Man',
    gradients: ['#DC2626', '#FBBF24', '#92400E'],
    particles: {
      color: '#FBBF24',
      count: 20,
      size: 3
    },
    animation: 'animate-bounce'
  },
  {
    name: 'Captain America',
    gradients: ['#1E40AF', '#DC2626', '#F3F4F6'],
    particles: {
      color: '#1E40AF',
      count: 12,
      size: 5
    },
    animation: 'animate-pulse'
  },
  {
    name: 'Thor',
    gradients: ['#FBBF24', '#1E40AF', '#374151'],
    particles: {
      color: '#FBBF24',
      count: 25,
      size: 6
    },
    animation: 'animate-ping'
  },
  {
    name: 'Hulk',
    gradients: ['#059669', '#065F46', '#1F2937'],
    particles: {
      color: '#10B981',
      count: 18,
      size: 8
    },
    animation: 'animate-bounce'
  },
  {
    name: 'Black Widow',
    gradients: ['#000000', '#DC2626', '#374151'],
    particles: {
      color: '#DC2626',
      count: 10,
      size: 2
    },
    animation: 'animate-pulse'
  },
  {
    name: 'Doctor Strange',
    gradients: ['#7C3AED', '#F59E0B', '#1F2937'],
    particles: {
      color: '#A855F7',
      count: 30,
      size: 4
    },
    animation: 'animate-spin'
  },
  {
    name: 'Black Panther',
    gradients: ['#000000', '#7C3AED', '#374151'],
    particles: {
      color: '#8B5CF6',
      count: 15,
      size: 3
    },
    animation: 'animate-pulse'
  },
  {
    name: 'Avengers',
    gradients: ['#DC2626', '#1E40AF', '#FBBF24', '#059669'],
    particles: {
      color: '#3B82F6',
      count: 25,
      size: 4
    },
    animation: 'animate-bounce'
  },
  {
    name: 'Cosmic',
    gradients: ['#1E1B4B', '#7C3AED', '#EC4899', '#F59E0B'],
    particles: {
      color: '#A855F7',
      count: 40,
      size: 2
    },
    animation: 'animate-ping'
  }
];

const DynamicMarvelBackground: React.FC<DynamicMarvelBackgroundProps> = ({
  children,
  changeInterval = 15000, // 15 seconds
  intensity = 'medium',
  animated = true
}) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    size: number;
    color: string;
    velocity: { x: number; y: number };
  }>>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentTheme = marvelThemes[currentThemeIndex];

  // Change theme periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentThemeIndex((prev) => (prev + 1) % marvelThemes.length);
        setIsTransitioning(false);
      }, 500); // Half second transition
    }, changeInterval);

    return () => clearInterval(interval);
  }, [changeInterval]);

  // Create particles when theme changes
  useEffect(() => {
    if (animated && currentTheme.particles) {
      createParticles(currentTheme.particles);
    }
  }, [currentTheme, animated]);

  // Animate particles
  useEffect(() => {
    if (!animated || particles.length === 0) return;

    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          // Wrap around screen
          ...(particle.x > window.innerWidth && { x: -particle.size }),
          ...(particle.x < -particle.size && { x: window.innerWidth }),
          ...(particle.y > window.innerHeight && { y: -particle.size }),
          ...(particle.y < -particle.size && { y: window.innerHeight })
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [animated, particles.length]);

  const createParticles = (particleConfig: NonNullable<BackgroundTheme['particles']>) => {
    const newParticles = [];
    
    for (let i = 0; i < particleConfig.count; i++) {
      newParticles.push({
        id: `particle-${i}`,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
        size: Math.random() * particleConfig.size + 2,
        color: particleConfig.color,
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        }
      });
    }
    
    setParticles(newParticles);
  };

  const intensityClasses = {
    subtle: 'opacity-20',
    medium: 'opacity-40',
    intense: 'opacity-60'
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base Background with smooth transition */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          isTransitioning ? 'opacity-0' : intensityClasses[intensity]
        }`}
        style={{
          background: currentTheme.gradients.length > 1 
            ? `linear-gradient(135deg, ${currentTheme.gradients.join(', ')})` 
            : currentTheme.gradients[0]
        }}
      />

      {/* Animated Particles */}
      {animated && particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute rounded-full opacity-30 ${currentTheme.animation || 'animate-pulse'}`}
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}

      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="marvel-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              <path d="M20,50 L80,50 M50,20 L50,80" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#marvel-pattern)" />
        </svg>
      </div>

      {/* Theme indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="glass-subtle px-3 py-1 rounded-full">
          <span className="text-xs text-white/70 font-medium">
            {currentTheme.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DynamicMarvelBackground;