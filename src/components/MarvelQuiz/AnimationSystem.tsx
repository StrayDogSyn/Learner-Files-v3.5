import React, { useEffect, useRef, useState } from 'react';

interface AnimationSystemProps {
  children: React.ReactNode;
  className?: string;
}

interface ParticleSystemProps {
  active: boolean;
  type: 'success' | 'error' | 'powerup' | 'achievement';
  onComplete?: () => void;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: string;
}

interface FloatingTextProps {
  text: string;
  x: number;
  y: number;
  color?: string;
  size?: number;
  duration?: number;
  onComplete?: () => void;
}

interface ScreenShakeProps {
  intensity: number;
  duration: number;
  active: boolean;
  onComplete?: () => void;
}

// Floating Text Component
const FloatingText: React.FC<FloatingTextProps> = ({
  text,
  x,
  y,
  color = '#ffffff',
  size = 24,
  duration = 2000,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={elementRef}
      className="floating-text pointer-events-none absolute z-50 font-bold animate-float-up"
      style={{
        left: x,
        top: y,
        color,
        fontSize: size,
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        animation: `floatUp ${duration}ms ease-out forwards`
      }}
    >
      {text}
    </div>
  );
};

// Screen Shake Component
const ScreenShake: React.FC<ScreenShakeProps & { children: React.ReactNode }> = ({
  children,
  intensity,
  duration,
  active,
  onComplete
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    setIsShaking(true);
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        container.style.transform = 'translate(0, 0)';
        setIsShaking(false);
        onComplete?.();
        return;
      }

      const currentIntensity = intensity * (1 - progress); // Fade out
      const x = (Math.random() - 0.5) * currentIntensity;
      const y = (Math.random() - 0.5) * currentIntensity;
      
      container.style.transform = `translate(${x}px, ${y}px)`;
      animationId = requestAnimationFrame(shake);
    };

    animationId = requestAnimationFrame(shake);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (container) {
        container.style.transform = 'translate(0, 0)';
      }
    };
  }, [active, intensity, duration, onComplete]);

  return (
    <div
      ref={containerRef}
      className={`screen-shake-container ${isShaking ? 'shaking' : ''}`}
    >
      {children}
    </div>
  );
};

// Particle System Component
const ParticleSystem: React.FC<ParticleSystemProps> = ({
  active,
  type,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const getParticleConfig = (type: string) => {
    switch (type) {
      case 'success':
        return {
          count: 30,
          colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
          shapes: ['circle', 'star'],
          speed: { min: 2, max: 6 },
          life: { min: 1000, max: 2000 }
        };
      case 'error':
        return {
          count: 20,
          colors: ['#EF4444', '#F87171', '#FCA5A5'],
          shapes: ['circle', 'x'],
          speed: { min: 1, max: 4 },
          life: { min: 800, max: 1500 }
        };
      case 'powerup':
        return {
          count: 40,
          colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
          shapes: ['circle', 'diamond', 'star'],
          speed: { min: 3, max: 8 },
          life: { min: 1500, max: 2500 }
        };
      case 'achievement':
        return {
          count: 50,
          colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
          shapes: ['circle', 'star', 'diamond'],
          speed: { min: 2, max: 7 },
          life: { min: 2000, max: 3000 }
        };
      default:
        return {
          count: 20,
          colors: ['#ffffff'],
          shapes: ['circle'],
          speed: { min: 2, max: 5 },
          life: { min: 1000, max: 2000 }
        };
    }
  };

  const createParticles = (config: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const particles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 * i) / config.count + Math.random() * 0.5;
      const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
      const life = config.life.min + Math.random() * (config.life.max - config.life.min);
      
      particles.push({
        id: `particle-${i}`,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        size: 3 + Math.random() * 5,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        type: config.shapes[Math.floor(Math.random() * config.shapes.length)]
      });
    }

    particlesRef.current = particles;
  };

  const updateParticles = (deltaTime: number) => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.vy += 0.1 * deltaTime; // Gravity
      particle.life -= deltaTime * 16; // Assuming 60fps
      
      return particle.life > 0;
    });
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    particlesRef.current.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      
      ctx.save();
      ctx.translate(particle.x, particle.y);
      
      switch (particle.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'star':
          drawStar(ctx, 0, 0, particle.size, particle.size * 0.5, 5);
          break;
          
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.lineTo(particle.size, 0);
          ctx.lineTo(0, particle.size);
          ctx.lineTo(-particle.size, 0);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'x':
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-particle.size, -particle.size);
          ctx.lineTo(particle.size, particle.size);
          ctx.moveTo(particle.size, -particle.size);
          ctx.lineTo(-particle.size, particle.size);
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    });
    
    ctx.globalAlpha = 1;
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, outerRadius: number, innerRadius: number, points: number) => {
    ctx.beginPath();
    
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
  };

  const animate = (currentTime: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    updateParticles(1);
    drawParticles(ctx);

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const config = getParticleConfig(type);
    createParticles(config);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, type]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particle-system absolute inset-0 pointer-events-none z-40"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Main Animation System Component
const AnimationSystem: React.FC<AnimationSystemProps> = ({
  children,
  className = ''
}) => {
  const [floatingTexts, setFloatingTexts] = useState<Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    color?: string;
    size?: number;
    duration?: number;
  }>>([]);
  
  const [particles, setParticles] = useState<{
    active: boolean;
    type: 'success' | 'error' | 'powerup' | 'achievement';
  }>({ active: false, type: 'success' });
  
  const [screenShake, setScreenShake] = useState<{
    active: boolean;
    intensity: number;
    duration: number;
  }>({ active: false, intensity: 0, duration: 0 });

  // Animation trigger functions
  const showFloatingText = (text: string, x?: number, y?: number, options?: {
    color?: string;
    size?: number;
    duration?: number;
  }) => {
    const id = `text-${Date.now()}-${Math.random()}`;
    const newText = {
      id,
      text,
      x: x ?? Math.random() * 300 + 50,
      y: y ?? Math.random() * 200 + 100,
      ...options
    };
    
    setFloatingTexts(prev => [...prev, newText]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, options?.duration ?? 2000);
  };

  const triggerParticles = (type: 'success' | 'error' | 'powerup' | 'achievement') => {
    setParticles({ active: true, type });
  };

  const triggerScreenShake = (intensity: number = 10, duration: number = 500) => {
    setScreenShake({ active: true, intensity, duration });
  };

  const handleParticlesComplete = () => {
    setParticles(prev => ({ ...prev, active: false }));
  };

  const handleScreenShakeComplete = () => {
    setScreenShake(prev => ({ ...prev, active: false }));
  };

  const handleFloatingTextComplete = (id: string) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  };

  // Expose animation functions to parent components
  useEffect(() => {
    const animationSystem = {
      showFloatingText,
      triggerParticles,
      triggerScreenShake
    };

    // Store in global context or event system
    (window as any).animationSystem = animationSystem;

    return () => {
      delete (window as any).animationSystem;
    };
  }, []);

  return (
    <div className={`animation-system relative ${className}`}>
      <ScreenShake
        intensity={screenShake.intensity}
        duration={screenShake.duration}
        active={screenShake.active}
        onComplete={handleScreenShakeComplete}
      >
        {children}
      </ScreenShake>
      
      {/* Floating Texts */}
      {floatingTexts.map(textData => (
        <FloatingText
          key={textData.id}
          text={textData.text}
          x={textData.x}
          y={textData.y}
          color={textData.color}
          size={textData.size}
          duration={textData.duration}
          onComplete={() => handleFloatingTextComplete(textData.id)}
        />
      ))}
      
      {/* Particle System */}
      <ParticleSystem
        active={particles.active}
        type={particles.type}
        onComplete={handleParticlesComplete}
      />
    </div>
  );
};

// Animation utility functions
export const animationUtils = {
  showFloatingText: (text: string, x?: number, y?: number, options?: any) => {
    const system = (window as any).animationSystem;
    if (system) {
      system.showFloatingText(text, x, y, options);
    }
  },
  
  triggerParticles: (type: 'success' | 'error' | 'powerup' | 'achievement') => {
    const system = (window as any).animationSystem;
    if (system) {
      system.triggerParticles(type);
    }
  },
  
  triggerScreenShake: (intensity?: number, duration?: number) => {
    const system = (window as any).animationSystem;
    if (system) {
      system.triggerScreenShake(intensity, duration);
    }
  }
};

export default AnimationSystem;
export { FloatingText, ParticleSystem, ScreenShake };