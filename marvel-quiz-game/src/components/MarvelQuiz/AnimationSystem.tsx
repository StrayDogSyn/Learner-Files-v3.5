import React, { useEffect, useRef, useState } from 'react';
import { AnimationState } from '../../types/marvel';

interface AnimationSystemProps {
  animationState: AnimationState;
  onAnimationComplete?: (animationId: string) => void;
  className?: string;
}

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'star' | 'circle' | 'explosion';
}

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  fontSize: number;
}

const AnimationSystem: React.FC<AnimationSystemProps> = ({
  animationState,
  onAnimationComplete,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation configurations
  const animationConfigs = {
    correctAnswer: {
      particles: 20,
      colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
      duration: 1500,
      text: '+100',
      textColor: '#10B981'
    },
    incorrectAnswer: {
      particles: 15,
      colors: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
      duration: 1000,
      text: 'Wrong!',
      textColor: '#EF4444'
    },
    powerUpActivated: {
      particles: 30,
      colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
      duration: 2000,
      text: 'Power-Up!',
      textColor: '#3B82F6'
    },
    achievementUnlocked: {
      particles: 40,
      colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
      duration: 2500,
      text: 'Achievement!',
      textColor: '#F59E0B'
    },
    streakBonus: {
      particles: 25,
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
      duration: 1800,
      text: 'Streak!',
      textColor: '#8B5CF6'
    },
    timeBonus: {
      particles: 20,
      colors: ['#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC'],
      duration: 1500,
      text: 'Time Bonus!',
      textColor: '#06B6D4'
    }
  };

  // Create particle effect
  const createParticleEffect = (type: keyof typeof animationConfigs, centerX: number, centerY: number) => {
    const config = animationConfigs[type];
    const newParticles: ParticleEffect[] = [];

    for (let i = 0; i < config.particles; i++) {
      const angle = (Math.PI * 2 * i) / config.particles + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      const life = config.duration + Math.random() * 500;

      newParticles.push({
        id: `${type}-${i}-${Date.now()}`,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: 3 + Math.random() * 5,
        type: type === 'achievementUnlocked' ? 'star' : type === 'powerUpActivated' ? 'explosion' : 'circle'
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  // Create floating text
  const createFloatingText = (type: keyof typeof animationConfigs, centerX: number, centerY: number) => {
    const config = animationConfigs[type];
    const newText: FloatingText = {
      id: `text-${type}-${Date.now()}`,
      text: config.text,
      x: centerX,
      y: centerY,
      vy: -2,
      life: config.duration,
      maxLife: config.duration,
      color: config.textColor,
      fontSize: type === 'achievementUnlocked' ? 32 : 24
    };

    setFloatingTexts(prev => [...prev, newText]);
  };

  // Trigger animation based on state
  useEffect(() => {
    if (!animationState.isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Determine animation type and trigger effects
    const animationType = animationState.type as keyof typeof animationConfigs;
    if (animationConfigs[animationType]) {
      createParticleEffect(animationType, centerX, centerY);
      createFloatingText(animationType, centerX, centerY);
      setIsAnimating(true);
    }
  }, [animationState]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            life: particle.life - 16 // assuming 60fps
          }))
          .filter(particle => particle.life > 0);

        // Draw particles
        updatedParticles.forEach(particle => {
          const alpha = particle.life / particle.maxLife;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;

          if (particle.type === 'star') {
            drawStar(ctx, particle.x, particle.y, particle.size);
          } else if (particle.type === 'explosion') {
            drawExplosion(ctx, particle.x, particle.y, particle.size, alpha);
          } else {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });

        return updatedParticles;
      });

      // Update and draw floating texts
      setFloatingTexts(prevTexts => {
        const updatedTexts = prevTexts
          .map(text => ({
            ...text,
            y: text.y + text.vy,
            life: text.life - 16
          }))
          .filter(text => text.life > 0);

        // Draw floating texts
        updatedTexts.forEach(text => {
          const alpha = text.life / text.maxLife;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = text.color;
          ctx.font = `bold ${text.fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(text.text, text.x, text.y);
          
          // Add text shadow for better visibility
          ctx.globalAlpha = alpha * 0.5;
          ctx.fillStyle = '#000000';
          ctx.fillText(text.text, text.x + 2, text.y + 2);
          ctx.restore();
        });

        return updatedTexts;
      });

      // Continue animation if there are active effects
      if (particles.length > 0 || floatingTexts.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onAnimationComplete?.(animationState.id || 'unknown');
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, particles.length, floatingTexts.length]);

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Helper function to draw star
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.5;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);

    for (let i = 0; i < spikes; i++) {
      const xOuter = x + Math.cos(rot) * outerRadius;
      const yOuter = y + Math.sin(rot) * outerRadius;
      ctx.lineTo(xOuter, yOuter);
      rot += step;

      const xInner = x + Math.cos(rot) * innerRadius;
      const yInner = y + Math.sin(rot) * innerRadius;
      ctx.lineTo(xInner, yInner);
      rot += step;
    }

    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  // Helper function to draw explosion effect
  const drawExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) => {
    const rays = 8;
    const innerRadius = size * 0.3;
    const outerRadius = size * (1 + (1 - alpha));

    ctx.beginPath();
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 * i) / rays;
      const x1 = x + Math.cos(angle) * innerRadius;
      const y1 = y + Math.sin(angle) * innerRadius;
      const x2 = x + Math.cos(angle) * outerRadius;
      const y2 = y + Math.sin(angle) * outerRadius;
      
      if (i === 0) {
        ctx.moveTo(x1, y1);
      }
      ctx.lineTo(x2, y2);
      
      const nextAngle = (Math.PI * 2 * (i + 1)) / rays;
      const x3 = x + Math.cos(nextAngle) * innerRadius;
      const y3 = y + Math.sin(nextAngle) * innerRadius;
      ctx.lineTo(x3, y3);
    }
    ctx.closePath();
    ctx.fill();
  };

  return (
    <div className={`animation-system ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* CSS-based animations for UI elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Screen flash effect */}
        {animationState.isActive && animationState.type === 'correctAnswer' && (
          <div className="absolute inset-0 bg-green-400 opacity-20 animate-ping" />
        )}
        
        {animationState.isActive && animationState.type === 'incorrectAnswer' && (
          <div className="absolute inset-0 bg-red-400 opacity-20 animate-pulse" />
        )}
        
        {animationState.isActive && animationState.type === 'achievementUnlocked' && (
          <div className="absolute inset-0 bg-yellow-400 opacity-30 animate-bounce" />
        )}
      </div>
      
      {/* Ripple effects */}
      {animationState.isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 border-4 border-white opacity-50 rounded-full animate-ping" />
          <div className="absolute w-16 h-16 border-2 border-white opacity-30 rounded-full animate-ping animation-delay-300" />
        </div>
      )}
    </div>
  );
};

export default AnimationSystem;