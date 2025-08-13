import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { cn } from '../../lib/utils';

// Repulsor Blast Animation
interface RepulsorBlastProps {
  isActive: boolean;
  onComplete?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'red' | 'gold';
}

export function RepulsorBlast({ 
  isActive, 
  onComplete, 
  className, 
  size = 'md',
  color = 'blue' 
}: RepulsorBlastProps) {
  const controls = useAnimation();
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  const colorClasses = {
    blue: 'from-blue-400 via-cyan-300 to-blue-600',
    red: 'from-red-400 via-orange-300 to-red-600',
    gold: 'from-yellow-400 via-orange-300 to-yellow-600'
  };
  
  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: [0, 1.5, 0.8, 2, 0],
        opacity: [0, 1, 0.8, 1, 0],
        rotate: [0, 180, 360],
        transition: {
          duration: 1.2,
          times: [0, 0.2, 0.4, 0.8, 1],
          ease: "easeInOut"
        }
      }).then(() => {
        onComplete?.();
      });
    }
  }, [isActive, controls, onComplete]);
  
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none z-50",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Core Blast */}
          <motion.div
            animate={controls}
            className={cn(
              "rounded-full bg-gradient-radial shadow-2xl",
              sizeClasses[size],
              colorClasses[color]
            )}
            style={{
              boxShadow: `0 0 50px ${color === 'blue' ? '#3b82f6' : color === 'red' ? '#ef4444' : '#f59e0b'}, 0 0 100px ${color === 'blue' ? '#1d4ed8' : color === 'red' ? '#dc2626' : '#d97706'}`
            }}
          />
          
          {/* Energy Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute rounded-full border-2 opacity-60",
                color === 'blue' ? 'border-blue-400' : 
                color === 'red' ? 'border-red-400' : 'border-yellow-400'
              )}
              animate={{
                scale: [0, 3, 6],
                opacity: [0.8, 0.4, 0],
                transition: {
                  duration: 1.2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }
              }}
              style={{
                width: `${(size === 'sm' ? 64 : size === 'md' ? 96 : 128) + i * 20}px`,
                height: `${(size === 'sm' ? 64 : size === 'md' ? 96 : 128) + i * 20}px`
              }}
            />
          ))}
          
          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className={cn(
                "absolute w-2 h-2 rounded-full",
                color === 'blue' ? 'bg-blue-400' : 
                color === 'red' ? 'bg-red-400' : 'bg-yellow-400'
              )}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                scale: [1, 0],
                opacity: [1, 0],
                transition: {
                  duration: 0.8,
                  delay: 0.3,
                  ease: "easeOut"
                }
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Thanos Snap Animation
interface ThanosSnapProps {
  isActive: boolean;
  onComplete?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function ThanosSnap({ isActive, onComplete, className, children }: ThanosSnapProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  
  useEffect(() => {
    if (isActive) {
      // Generate dust particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);
      
      // Complete animation after duration
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }
  }, [isActive, onComplete]);
  
  return (
    <div className={cn("relative", className)}>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dust Particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 bg-gray-400 rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`
                }}
                initial={{
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1.5, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200 + 50],
                  rotate: [0, Math.random() * 360]
                }}
                transition={{
                  duration: 1.5,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Infinity Stone Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-transparent to-transparent"
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.5, 2, 3]
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content with disintegration effect */}
      <motion.div
        animate={isActive ? {
          opacity: [1, 0.8, 0.3, 0],
          filter: [
            "blur(0px) brightness(1)",
            "blur(1px) brightness(0.9)",
            "blur(3px) brightness(0.7)",
            "blur(5px) brightness(0.3)"
          ]
        } : {}}
        transition={{
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Vibranium Pulse Animation
interface VibraniumPulseProps {
  isActive: boolean;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function VibraniumPulse({ isActive, className, intensity = 'medium' }: VibraniumPulseProps) {
  const intensityConfig = {
    low: { scale: 1.05, duration: 2 },
    medium: { scale: 1.1, duration: 1.5 },
    high: { scale: 1.2, duration: 1 }
  };
  
  const config = intensityConfig[intensity];
  
  return (
    <motion.div
      className={cn("relative", className)}
      animate={isActive ? {
        scale: [1, config.scale, 1],
        boxShadow: [
          "0 0 0 0 rgba(147, 51, 234, 0)",
          "0 0 20px 10px rgba(147, 51, 234, 0.3)",
          "0 0 0 0 rgba(147, 51, 234, 0)"
        ]
      } : {}}
      transition={{
        duration: config.duration,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {/* Vibranium Energy Rings */}
      <AnimatePresence>
        {isActive && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-purple-400/50"
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: config.duration,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Arc Reactor Glow Animation
interface ArcReactorGlowProps {
  isActive: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ArcReactorGlow({ isActive, className, size = 'md' }: ArcReactorGlowProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <motion.div
      className={cn(
        "relative rounded-full bg-gradient-radial from-cyan-400 via-blue-500 to-blue-700",
        sizeClasses[size],
        className
      )}
      animate={isActive ? {
        boxShadow: [
          "0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4",
          "0 0 20px #06b6d4, 0 0 40px #06b6d4, 0 0 60px #06b6d4",
          "0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4"
        ],
        scale: [1, 1.1, 1]
      } : {}}
      transition={{
        duration: 2,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {/* Inner Core */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-radial from-white via-cyan-200 to-transparent"
        animate={isActive ? {
          opacity: [0.8, 1, 0.8],
          scale: [0.8, 1, 0.8]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      
      {/* Energy Particles */}
      <AnimatePresence>
        {isActive && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-300 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '0 0'
                }}
                animate={{
                  rotate: [0, 360],
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 20],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 20],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Cosmic Energy Animation
interface CosmicEnergyProps {
  isActive: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function CosmicEnergy({ isActive, className, children }: CosmicEnergyProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      animate={isActive ? {
        background: [
          "linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc)",
          "linear-gradient(45deg, #c084fc, #8b5cf6, #a855f7)",
          "linear-gradient(45deg, #a855f7, #c084fc, #8b5cf6)"
        ]
      } : {}}
      transition={{
        duration: 3,
        repeat: isActive ? Infinity : 0,
        ease: "linear"
      }}
    >
      {/* Cosmic Particles */}
      <AnimatePresence>
        {isActive && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-300 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <motion.div
        animate={isActive ? {
          filter: [
            "hue-rotate(0deg) saturate(1)",
            "hue-rotate(60deg) saturate(1.2)",
            "hue-rotate(120deg) saturate(1)",
            "hue-rotate(180deg) saturate(1.2)",
            "hue-rotate(240deg) saturate(1)",
            "hue-rotate(300deg) saturate(1.2)",
            "hue-rotate(360deg) saturate(1)"
          ]
        } : {}}
        transition={{
          duration: 4,
          repeat: isActive ? Infinity : 0,
          ease: "linear"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Lightning Strike Animation
interface LightningStrikeProps {
  isActive: boolean;
  onComplete?: () => void;
  className?: string;
}

export function LightningStrike({ isActive, onComplete, className }: LightningStrikeProps) {
  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        onComplete?.();
      }, 800);
    }
  }, [isActive, onComplete]);
  
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={cn(
            "absolute inset-0 pointer-events-none z-50",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Lightning Bolt */}
          <motion.div
            className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-yellow-300 via-blue-400 to-purple-500"
            style={{
              height: '100%',
              clipPath: 'polygon(0 0, 100% 0, 80% 40%, 100% 40%, 0 100%, 20% 60%, 0 60%)'
            }}
            initial={{
              scaleY: 0,
              x: '-50%'
            }}
            animate={{
              scaleY: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
              filter: [
                "blur(0px) brightness(1)",
                "blur(2px) brightness(2)",
                "blur(1px) brightness(1.5)",
                "blur(0px) brightness(1)"
              ]
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.1, 0.7, 1],
              ease: "easeInOut"
            }}
          />
          
          {/* Flash Effect */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0, 0.4, 0]
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.1, 0.2, 0.6, 1]
            }}
          />
          
          {/* Electric Sparks */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-8 bg-yellow-300"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${Math.random() * 80}%`,
                rotate: `${Math.random() * 360}deg`
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, Math.random() * 180]
              }}
              transition={{
                duration: 0.3,
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Infinity Stone Collection Animation
interface InfinityStoneCollectionProps {
  stones: Array<{
    name: string;
    color: string;
    collected: boolean;
  }>;
  className?: string;
}

export function InfinityStoneCollection({ stones, className }: InfinityStoneCollectionProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {stones.map((stone, index) => (
        <motion.div
          key={stone.name}
          className={cn(
            "w-8 h-8 rounded-full border-2 relative overflow-hidden",
            stone.collected ? "border-yellow-400" : "border-gray-600"
          )}
          style={{
            backgroundColor: stone.collected ? stone.color : '#374151'
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: stone.collected ? [0, 1.2, 1] : 1,
            rotate: stone.collected ? [0, 360] : 0
          }}
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          {stone.collected && (
            <>
              {/* Inner Glow */}
              <motion.div
                className="absolute inset-1 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${stone.color}, transparent)`
                }}
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Energy Particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: stone.color,
                    left: '50%',
                    top: '50%'
                  }}
                  animate={{
                    x: [0, Math.cos(i * 90 * Math.PI / 180) * 15],
                    y: [0, Math.sin(i * 90 * Math.PI / 180) * 15],
                    opacity: [1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default {
  RepulsorBlast,
  ThanosSnap,
  VibraniumPulse,
  ArcReactorGlow,
  CosmicEnergy,
  LightningStrike,
  InfinityStoneCollection
};