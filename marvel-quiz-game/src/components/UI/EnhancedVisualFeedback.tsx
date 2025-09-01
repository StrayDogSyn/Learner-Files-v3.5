import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star, Zap, Trophy, Target } from 'lucide-react';

export interface VisualFeedbackProps {
  isCorrect: boolean;
  points: number;
  streak: number;
  bonusPoints?: number;
  achievement?: string;
  onAnimationComplete?: () => void;
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

export interface FloatingTextEffect {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

const EnhancedVisualFeedback: React.FC<VisualFeedbackProps> = ({
  isCorrect,
  points,
  streak,
  bonusPoints = 0,
  achievement,
  onAnimationComplete
}) => {
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextEffect[]>([]);
  const [showFeedback, setShowFeedback] = useState(true);
  const [screenShake, setScreenShake] = useState(false);

  useEffect(() => {
    // Create initial effects
    createParticleExplosion();
    createFloatingText();
    
    if (isCorrect && streak >= 5) {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
    }

    // Hide feedback after animation
    const timer = setTimeout(() => {
      setShowFeedback(false);
      onAnimationComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCorrect, points, streak, bonusPoints, achievement]);

  useEffect(() => {
    // Animate particles and floating text
    const animationFrame = requestAnimationFrame(updateEffects);
    return () => cancelAnimationFrame(animationFrame);
  }, [particles, floatingTexts]);

  const createParticleExplosion = () => {
    const newParticles: ParticleEffect[] = [];
    const particleCount = isCorrect ? (streak >= 10 ? 30 : 20) : 10;
    const colors = isCorrect 
      ? ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#FBBF24', '#F59E0B']
      : ['#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20
        },
        life: 1,
        maxLife: 1
      });
    }

    setParticles(newParticles);
  };

  const createFloatingText = () => {
    const newTexts: FloatingTextEffect[] = [];
    
    // Main points text
    newTexts.push({
      id: `text-points-${Date.now()}`,
      text: `+${points}`,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 50,
      color: isCorrect ? '#10B981' : '#EF4444',
      fontSize: 32,
      velocity: { x: 0, y: -2 },
      life: 1,
      maxLife: 1
    });

    // Bonus points text
    if (bonusPoints > 0) {
      newTexts.push({
        id: `text-bonus-${Date.now()}`,
        text: `Bonus +${bonusPoints}`,
        x: window.innerWidth / 2 + 100,
        y: window.innerHeight / 2 - 30,
        color: '#FBBF24',
        fontSize: 20,
        velocity: { x: 1, y: -1.5 },
        life: 1,
        maxLife: 1
      });
    }

    // Streak text
    if (streak >= 3) {
      newTexts.push({
        id: `text-streak-${Date.now()}`,
        text: `${streak} Streak!`,
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 30,
        color: '#8B5CF6',
        fontSize: 24,
        velocity: { x: -1, y: -1.5 },
        life: 1,
        maxLife: 1
      });
    }

    // Achievement text
    if (achievement) {
      newTexts.push({
        id: `text-achievement-${Date.now()}`,
        text: achievement,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 + 50,
        color: '#F59E0B',
        fontSize: 28,
        velocity: { x: 0, y: -1 },
        life: 1,
        maxLife: 1
      });
    }

    setFloatingTexts(newTexts);
  };

  const updateEffects = () => {
    setParticles(prevParticles => 
      prevParticles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          velocity: {
            x: particle.velocity.x * 0.98,
            y: particle.velocity.y * 0.98 + 0.2 // gravity
          },
          life: particle.life - 0.02
        }))
        .filter(particle => particle.life > 0)
    );

    setFloatingTexts(prevTexts =>
      prevTexts
        .map(text => ({
          ...text,
          x: text.x + text.velocity.x,
          y: text.y + text.velocity.y,
          life: text.life - 0.015
        }))
        .filter(text => text.life > 0)
    );
  };

  if (!showFeedback) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${screenShake ? 'animate-shake' : ''}`}>
      {/* Central Feedback Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`
          transform transition-all duration-500 ease-out
          ${showFeedback ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}
        `}>
          {isCorrect ? (
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-400 animate-bounce" />
              {streak >= 5 && (
                <div className="absolute -top-2 -right-2">
                  <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
              )}
              {streak >= 10 && (
                <div className="absolute -bottom-2 -left-2">
                  <Star className="w-6 h-6 text-purple-400 animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <XCircle className="w-24 h-24 text-red-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`
          }}
        />
      ))}

      {/* Floating Text */}
      {floatingTexts.map(text => (
        <div
          key={text.id}
          className="absolute font-bold text-center pointer-events-none"
          style={{
            left: text.x - 50,
            top: text.y,
            color: text.color,
            fontSize: text.fontSize,
            opacity: text.life,
            transform: `scale(${text.life}) translateY(${(1 - text.life) * -50}px)`,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {text.text}
        </div>
      ))}

      {/* Streak Indicator */}
      {streak >= 5 && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-6 py-3 animate-pulse">
            <div className="flex items-center gap-2 text-white font-bold">
              <Zap className="w-5 h-5" />
              <span>ON FIRE! {streak} STREAK</span>
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Achievement Banner */}
      {achievement && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg px-8 py-4 animate-bounce">
            <div className="flex items-center gap-3 text-white font-bold text-lg">
              <Trophy className="w-6 h-6" />
              <span>Achievement Unlocked!</span>
              <Trophy className="w-6 h-6" />
            </div>
            <div className="text-center text-yellow-200 mt-1">
              {achievement}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Ring Component
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3B82F6',
  backgroundColor = '#374151',
  children 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

// Animated Counter Component
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  className?: string;
}> = ({ value, duration = 1000, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className={className}>{displayValue.toLocaleString()}</span>;
};

// Pulse Effect Component
export const PulseEffect: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, isActive, color = 'blue', intensity = 'medium' }) => {
  const intensityClasses = {
    low: 'animate-pulse',
    medium: 'animate-pulse shadow-lg',
    high: 'animate-pulse shadow-2xl'
  };

  const colorClasses = {
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    red: 'shadow-red-500/50',
    yellow: 'shadow-yellow-500/50',
    purple: 'shadow-purple-500/50'
  };

  return (
    <div className={`
      transition-all duration-300
      ${isActive ? intensityClasses[intensity] : ''}
      ${isActive ? colorClasses[color as keyof typeof colorClasses] : ''}
    `}>
      {children}
    </div>
  );
};

export default EnhancedVisualFeedback;