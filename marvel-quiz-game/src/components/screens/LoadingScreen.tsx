'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Shield, Star } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { cn } from '../../lib/utils';

const loadingMessages = [
  "Assembling the Avengers...",
  "Charging arc reactor...",
  "Consulting the Ancient One...",
  "Activating Vibranium protocols...",
  "Scanning the multiverse...",
  "Powering up Infinity Stones...",
  "Connecting to S.H.I.E.L.D. database...",
  "Calibrating Spider-sense...",
  "Initializing Stark technology...",
  "Preparing cosmic questions...",
  "Loading Marvel knowledge...",
  "Synchronizing with the Time Stone..."
];

const heroQuotes = [
  { quote: "I am Iron Man.", hero: "Tony Stark" },
  { quote: "I can do this all day.", hero: "Steve Rogers" },
  { quote: "With great power comes great responsibility.", hero: "Spider-Man" },
  { quote: "I am Groot.", hero: "Groot" },
  { quote: "Hulk smash!", hero: "Bruce Banner" },
  { quote: "Wakanda forever!", hero: "T'Challa" },
  { quote: "I am inevitable.", hero: "Thanos" },
  { quote: "Avengers, assemble!", hero: "Captain America" }
];

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'arc-reactor' | 'vibranium' | 'cosmic';
}

function LoadingSpinner({ size = 'md', variant = 'arc-reactor' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const variants = {
    'arc-reactor': {
      className: 'text-yellow-400',
      animation: 'animate-spin'
    },
    'vibranium': {
      className: 'text-purple-400',
      animation: 'animate-vibranium-pulse'
    },
    'cosmic': {
      className: 'text-blue-400',
      animation: 'animate-cosmic-drift'
    }
  };

  const config = variants[variant];

  return (
    <div className={cn(sizeClasses[size], config.className, config.animation)}>
      {variant === 'arc-reactor' && <Loader2 className="w-full h-full" />}
      {variant === 'vibranium' && <Shield className="w-full h-full" />}
      {variant === 'cosmic' && <Star className="w-full h-full" />}
    </div>
  );
}

function InfinityStoneLoader() {
  const stones = [
    { color: 'bg-purple-500', name: 'Power' },
    { color: 'bg-blue-500', name: 'Space' },
    { color: 'bg-red-500', name: 'Reality' },
    { color: 'bg-green-500', name: 'Time' },
    { color: 'bg-orange-500', name: 'Soul' },
    { color: 'bg-yellow-500', name: 'Mind' }
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {stones.map((stone, index) => (
        <motion.div
          key={stone.name}
          className={cn(
            "w-4 h-4 rounded-full",
            stone.color,
            "shadow-lg"
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              `0 0 10px ${stone.color.replace('bg-', '').replace('-500', '')}`,
              `0 0 20px ${stone.color.replace('bg-', '').replace('-500', '')}`,
              `0 0 10px ${stone.color.replace('bg-', '').replace('-500', '')}`
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.3
          }}
        />
      ))}
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Loading...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    // Show quotes periodically
    const quoteInterval = setInterval(() => {
      setShowQuote(true);
      setCurrentQuote(prev => (prev + 1) % heroQuotes.length);
      
      setTimeout(() => {
        setShowQuote(false);
      }, 3000);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 relative"
    >
      <FloatingParticles />
      
      <div className="text-center max-w-lg w-full relative z-10">
        {/* Main Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-hero mb-2 font-['Orbitron']">
            MARVEL
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-white text-glow">
            QUIZ GAME
          </h2>
        </motion.div>

        {/* Loading Content */}
        <GlassPanel className="p-8 relative">
          {/* Infinity Stones Loader */}
          <InfinityStoneLoader />
          
          {/* Main Spinner */}
          <div className="flex justify-center mb-6">
            <LoadingSpinner size="lg" variant="arc-reactor" />
          </div>
          
          {/* Progress Bar */}
          <ProgressBar progress={progress} />
          
          {/* Loading Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-white font-medium mb-4"
            >
              {loadingMessages[currentMessage]}
            </motion.div>
          </AnimatePresence>
          
          {/* Hero Quote */}
          <AnimatePresence>
            {showQuote && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <blockquote className="text-gray-300 italic mb-2">
                  "{heroQuotes[currentQuote].quote}"
                </blockquote>
                <cite className="text-yellow-400 text-sm font-semibold">
                  — {heroQuotes[currentQuote].hero}
                </cite>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Loading Tips */}
          <div className="mt-6 text-xs text-gray-400">
            <p>💡 Tip: Use the hint system wisely in Story Mode!</p>
          </div>
        </GlassPanel>
        
        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          />
        </div>
        
        <div className="absolute -bottom-10 -right-10 w-32 h-32">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: 1
            }}
          />
        </div>
      </div>
      
      {/* Background Arc Reactor Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-96 h-96 border border-blue-500/20 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 4,
              repeat: Infinity
            }
          }}
        />
        <motion.div
          className="absolute w-64 h-64 border border-yellow-500/20 rounded-full"
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1]
          }}
          transition={{
            rotate: {
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 3,
              repeat: Infinity,
              delay: 1
            }
          }}
        />
      </div>
    </motion.div>
  );
}

export default LoadingScreen;