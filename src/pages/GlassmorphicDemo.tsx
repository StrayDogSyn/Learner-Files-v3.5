import React, { useState } from 'react';
import { GlassContainer, GlassCard, GlassButton, theme } from '../components/glassmorphic-system';
import { motion } from 'framer-motion';

/**
 * Demo page showcasing the glassmorphic component system
 * with Hunter Green branding and tech accent variations
 */
const GlassmorphicDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<'primary' | 'tech' | 'cyber' | 'matrix'>('primary');

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div 
      className="min-h-screen p-8"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.jetBlack} 0%, ${theme.colors.hunterGreen} 50%, ${theme.colors.graphite} 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Glassmorphic Component System
          </h1>
          <p className="text-lg text-gray-300">
            Hunter Green theme with advanced tech accent variations
          </p>
        </motion.div>

        {/* Variant Selector */}
        <GlassContainer variant="base" className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Theme Variants</h2>
          <div className="flex flex-wrap gap-4">
            {(['primary', 'tech', 'cyber', 'matrix'] as const).map((variant) => (
              <GlassButton
                key={variant}
                variant={variant}
                size="sm"
                glow={selectedVariant === variant}
                onClick={() => setSelectedVariant(variant)}
                className="capitalize"
              >
                {variant}
              </GlassButton>
            ))}
          </div>
        </GlassContainer>

        {/* Glass Containers Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassContainer variant="primary" blur="light" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Primary Light</h3>
            <p className="text-gray-300 text-sm">Hunter Green with light blur</p>
          </GlassContainer>

          <GlassContainer variant="tech" blur="medium" glow className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Tech Medium</h3>
            <p className="text-gray-300 text-sm">Electric Mint with glow effect</p>
          </GlassContainer>

          <GlassContainer variant="cyber" blur="heavy" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Cyber Heavy</h3>
            <p className="text-gray-300 text-sm">Purple with heavy blur</p>
          </GlassContainer>

          <GlassContainer variant="matrix" blur="medium" glow className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Matrix Glow</h3>
            <p className="text-gray-300 text-sm">Matrix Green with effects</p>
          </GlassContainer>
        </div>

        {/* Glass Cards Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard variant={selectedVariant} hoverable clickable>
            <h3 className="text-xl font-semibold text-white mb-3">Interactive Card</h3>
            <p className="text-gray-300 mb-4">
              This card responds to hover and click interactions with smooth animations.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Hoverable & Clickable</span>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </GlassCard>

          <GlassCard variant={selectedVariant} loading={loading}>
            <h3 className="text-xl font-semibold text-white mb-3">Loading State</h3>
            <p className="text-gray-300 mb-4">
              Demonstrates the loading state with animated spinner.
            </p>
          </GlassCard>

          <GlassCard variant={selectedVariant} hoverable={false}>
            <h3 className="text-xl font-semibold text-white mb-3">Static Card</h3>
            <p className="text-gray-300 mb-4">
              A static card without hover effects for content display.
            </p>
            <div className="space-y-2">
              <div className="h-2 bg-gray-600 rounded w-3/4"></div>
              <div className="h-2 bg-gray-600 rounded w-1/2"></div>
            </div>
          </GlassCard>
        </div>

        {/* Buttons Demo */}
        <GlassContainer variant="base" className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Button Variations</h2>
          
          {/* Size Variations */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <GlassButton variant="primary" size="sm">Small</GlassButton>
              <GlassButton variant="primary" size="md">Medium</GlassButton>
              <GlassButton variant="primary" size="lg">Large</GlassButton>
            </div>
          </div>

          {/* Variant Demonstrations */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Theme Variants</h3>
            <div className="flex flex-wrap gap-4">
              <GlassButton variant="primary" glow>Primary Hunter</GlassButton>
              <GlassButton variant="tech" glow>Tech Electric</GlassButton>
              <GlassButton variant="cyber" glow>Cyber Purple</GlassButton>
              <GlassButton variant="matrix" glow>Matrix Green</GlassButton>
              <GlassButton variant="ghost">Ghost</GlassButton>
            </div>
          </div>

          {/* Interactive Demo */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Interactive States</h3>
            <div className="flex flex-wrap gap-4">
              <GlassButton 
                variant="primary" 
                onClick={handleLoadingDemo}
                disabled={loading}
              >
                Trigger Loading
              </GlassButton>
              <GlassButton variant="tech" loading={loading}>
                Loading Button
              </GlassButton>
              <GlassButton variant="cyber" disabled>
                Disabled State
              </GlassButton>
            </div>
          </div>
        </GlassContainer>

        {/* Color Palette Display */}
        <GlassContainer variant="primary" className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Hunter Green Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(theme.colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div 
                  className="w-full h-16 rounded-lg mb-2 border border-white/20"
                  style={{ backgroundColor: color }}
                ></div>
                <p className="text-sm text-white font-medium capitalize">
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-xs text-gray-400 font-mono">{color}</p>
              </div>
            ))}
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};

export default GlassmorphicDemo;