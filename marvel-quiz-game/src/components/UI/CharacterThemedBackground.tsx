import React, { useState, useEffect } from 'react';
import { MarvelCharacterDetailed } from '../../data/characters';

export interface ThemedBackgroundProps {
  character?: MarvelCharacterDetailed;
  theme?: string;
  intensity?: 'subtle' | 'medium' | 'intense';
  animated?: boolean;
  children: React.ReactNode;
}

export interface BackgroundTheme {
  name: string;
  gradients: string[];
  particles?: {
    color: string;
    count: number;
    size: number;
  };
  overlay?: string;
  animation?: string;
}

const CharacterThemedBackground: React.FC<ThemedBackgroundProps> = ({
  character,
  theme,
  intensity = 'medium',
  animated = true,
  children
}) => {
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme | null>(null);
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    size: number;
    color: string;
    velocity: { x: number; y: number };
  }>>([]);

  useEffect(() => {
    const selectedTheme = getThemeForCharacter(character, theme);
    setCurrentTheme(selectedTheme);
    
    if (animated && selectedTheme.particles) {
      createParticles(selectedTheme.particles);
    }
  }, [character, theme, animated]);

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
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
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

  if (!currentTheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {children}
      </div>
    );
  }

  const intensityClasses = {
    subtle: 'opacity-30',
    medium: 'opacity-60',
    intense: 'opacity-90'
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base Background */}
      <div 
        className={`absolute inset-0 ${currentTheme.gradients[0]} ${intensityClasses[intensity]}`}
        style={{
          background: currentTheme.gradients.length > 1 
            ? `linear-gradient(135deg, ${currentTheme.gradients.join(', ')})` 
            : currentTheme.gradients[0]
        }}
      />

      {/* Animated Background Layers */}
      {animated && currentTheme.animation && (
        <div className={`absolute inset-0 ${currentTheme.animation}`} />
      )}

      {/* Particles */}
      {animated && particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
        />
      ))}

      {/* Overlay Pattern */}
      {currentTheme.overlay && (
        <div 
          className={`absolute inset-0 ${currentTheme.overlay} opacity-10`}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Character-specific theme definitions
const characterThemes: Record<string, BackgroundTheme> = {
  'spider-man': {
    name: 'Spider-Man',
    gradients: ['#DC2626', '#1E40AF', '#000000'],
    particles: {
      color: '#DC2626',
      count: 15,
      size: 4
    },
    overlay: 'bg-web-pattern',
    animation: 'animate-web-swing'
  },
  'iron-man': {
    name: 'Iron Man',
    gradients: ['#DC2626', '#FBBF24', '#92400E'],
    particles: {
      color: '#FBBF24',
      count: 20,
      size: 3
    },
    overlay: 'bg-tech-pattern',
    animation: 'animate-tech-glow'
  },
  'captain-america': {
    name: 'Captain America',
    gradients: ['#1E40AF', '#DC2626', '#F3F4F6'],
    particles: {
      color: '#1E40AF',
      count: 12,
      size: 5
    },
    overlay: 'bg-stars-pattern',
    animation: 'animate-patriotic'
  },
  'thor': {
    name: 'Thor',
    gradients: ['#FBBF24', '#1E40AF', '#374151'],
    particles: {
      color: '#FBBF24',
      count: 25,
      size: 6
    },
    overlay: 'bg-lightning-pattern',
    animation: 'animate-thunder'
  },
  'hulk': {
    name: 'Hulk',
    gradients: ['#059669', '#065F46', '#1F2937'],
    particles: {
      color: '#10B981',
      count: 18,
      size: 8
    },
    overlay: 'bg-smash-pattern',
    animation: 'animate-rage'
  },
  'black-widow': {
    name: 'Black Widow',
    gradients: ['#000000', '#DC2626', '#374151'],
    particles: {
      color: '#DC2626',
      count: 10,
      size: 2
    },
    overlay: 'bg-spy-pattern',
    animation: 'animate-stealth'
  },
  'doctor-strange': {
    name: 'Doctor Strange',
    gradients: ['#7C3AED', '#F59E0B', '#1F2937'],
    particles: {
      color: '#A855F7',
      count: 30,
      size: 4
    },
    overlay: 'bg-mystic-pattern',
    animation: 'animate-mystic'
  },
  'black-panther': {
    name: 'Black Panther',
    gradients: ['#000000', '#7C3AED', '#374151'],
    particles: {
      color: '#8B5CF6',
      count: 15,
      size: 3
    },
    overlay: 'bg-wakanda-pattern',
    animation: 'animate-vibranium'
  },
  'cosmic': {
    name: 'Cosmic',
    gradients: ['#1E1B4B', '#7C3AED', '#EC4899', '#F59E0B'],
    particles: {
      color: '#A855F7',
      count: 40,
      size: 2
    },
    overlay: 'bg-stars-pattern',
    animation: 'animate-cosmic'
  },
  'villain': {
    name: 'Villain',
    gradients: ['#7F1D1D', '#000000', '#374151'],
    particles: {
      color: '#DC2626',
      count: 20,
      size: 5
    },
    overlay: 'bg-evil-pattern',
    animation: 'animate-menacing'
  },
  'x-men': {
    name: 'X-Men',
    gradients: ['#1E40AF', '#FBBF24', '#000000'],
    particles: {
      color: '#3B82F6',
      count: 22,
      size: 4
    },
    overlay: 'bg-x-pattern',
    animation: 'animate-mutation'
  },
  'avengers': {
    name: 'Avengers',
    gradients: ['#DC2626', '#1E40AF', '#FBBF24', '#059669'],
    particles: {
      color: '#3B82F6',
      count: 25,
      size: 4
    },
    overlay: 'bg-hero-pattern',
    animation: 'animate-assemble'
  }
};

// Theme-specific themes
const themeBackgrounds: Record<string, BackgroundTheme> = {
  'spider-verse': {
    name: 'Spider-Verse',
    gradients: ['#DC2626', '#EC4899', '#8B5CF6', '#3B82F6'],
    particles: {
      color: '#DC2626',
      count: 30,
      size: 3
    },
    animation: 'animate-multiverse'
  },
  'cosmic-entities': {
    name: 'Cosmic Entities',
    gradients: ['#1E1B4B', '#581C87', '#BE185D', '#F59E0B'],
    particles: {
      color: '#A855F7',
      count: 50,
      size: 2
    },
    animation: 'animate-cosmic-power'
  },
  'street-level': {
    name: 'Street Level',
    gradients: ['#374151', '#1F2937', '#111827'],
    particles: {
      color: '#6B7280',
      count: 8,
      size: 2
    },
    animation: 'animate-urban'
  },
  'asgardian': {
    name: 'Asgardian',
    gradients: ['#FBBF24', '#F59E0B', '#D97706', '#92400E'],
    particles: {
      color: '#FBBF24',
      count: 35,
      size: 5
    },
    animation: 'animate-divine'
  },
  'wakanda': {
    name: 'Wakanda',
    gradients: ['#7C3AED', '#000000', '#374151'],
    particles: {
      color: '#8B5CF6',
      count: 20,
      size: 4
    },
    animation: 'animate-technology'
  }
};

function getThemeForCharacter(character?: MarvelCharacterDetailed, theme?: string): BackgroundTheme {
  // If a specific theme is provided, use it
  if (theme && themeBackgrounds[theme.toLowerCase()]) {
    return themeBackgrounds[theme.toLowerCase()];
  }

  // If a character is provided, use character-specific theme
  if (character) {
    const characterKey = character.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (characterThemes[characterKey]) {
      return characterThemes[characterKey];
    }

    // Fallback based on character properties
    if (character.teams?.includes('Avengers')) {
      return characterThemes['avengers'];
    }
    if (character.teams?.includes('X-Men')) {
      return characterThemes['x-men'];
    }
    if (character.powers?.some(power => power.toLowerCase().includes('cosmic'))) {
      return characterThemes['cosmic'];
    }
  }

  // Default theme
  return {
    name: 'Default',
    gradients: ['#1F2937', '#374151', '#4B5563'],
    particles: {
      color: '#6B7280',
      count: 10,
      size: 3
    },
    animation: 'animate-subtle'
  };
}

// Background Pattern Components
export const WebPattern: React.FC = () => (
  <div className="absolute inset-0 opacity-10">
    <svg width="100%" height="100%" className="absolute inset-0">
      <defs>
        <pattern id="web" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M0,50 Q25,25 50,50 T100,50" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M50,0 Q75,25 50,50 T50,100" stroke="currentColor" strokeWidth="1" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#web)" />
    </svg>
  </div>
);

export const TechPattern: React.FC = () => (
  <div className="absolute inset-0 opacity-10">
    <svg width="100%" height="100%" className="absolute inset-0">
      <defs>
        <pattern id="tech" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="25" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M15,25 L35,25 M25,15 L25,35" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tech)" />
    </svg>
  </div>
);

export const StarsPattern: React.FC = () => (
  <div className="absolute inset-0 opacity-20">
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`
        }}
      />
    ))}
  </div>
);

export default CharacterThemedBackground;