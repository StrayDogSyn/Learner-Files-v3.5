import React, { useState, useEffect } from 'react';
import { PowerUp, SoundEffect } from '../../types/marvel';

interface PowerUpSystemProps {
  powerUps: PowerUp[];
  onUsePowerUp: (powerUpId: string) => void;
  disabled?: boolean;
  className?: string;
}

const PowerUpSystem: React.FC<PowerUpSystemProps> = ({
  powerUps,
  onUsePowerUp,
  disabled = false,
  className = ''
}) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState<string | null>(null);
  const [animatingPowerUps, setAnimatingPowerUps] = useState<Set<string>>(new Set());
  const [cooldowns, setCooldowns] = useState<Map<string, number>>(new Map());

  // Handle cooldown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const newCooldowns = new Map(prev);
        let hasChanges = false;
        
        for (const [id, time] of newCooldowns.entries()) {
          if (time > 0) {
            newCooldowns.set(id, time - 1);
            hasChanges = true;
          } else {
            newCooldowns.delete(id);
            hasChanges = true;
          }
        }
        
        return hasChanges ? newCooldowns : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePowerUpClick = (powerUp: PowerUp) => {
    if (disabled || !powerUp.available || cooldowns.has(powerUp.id)) {
      return;
    }

    // Add animation
    setAnimatingPowerUps(prev => new Set([...prev, powerUp.id]));
    
    // Remove animation after delay
    setTimeout(() => {
      setAnimatingPowerUps(prev => {
        const newSet = new Set(prev);
        newSet.delete(powerUp.id);
        return newSet;
      });
    }, 500);

    // Set cooldown if applicable
    if (powerUp.cooldown && powerUp.cooldown > 0) {
      setCooldowns(prev => new Map([...prev, [powerUp.id, powerUp.cooldown]]));
    }

    // Trigger the power-up
    onUsePowerUp(powerUp.id);
    setSelectedPowerUp(null);
  };

  const getPowerUpIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      'fifty_fifty': '🎯',
      'time_freeze': '⏰',
      'double_points': '💎',
      'hint': '💡',
      'skip_question': '⏭️',
      'extra_life': '❤️',
      'shield': '🛡️',
      'multiplier': '✨',
      'reveal_answer': '👁️',
      'time_bonus': '⚡'
    };
    return iconMap[type] || '🔮';
  };

  const getPowerUpColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      'fifty_fifty': 'from-blue-500 to-blue-700',
      'time_freeze': 'from-cyan-500 to-cyan-700',
      'double_points': 'from-yellow-500 to-yellow-700',
      'hint': 'from-green-500 to-green-700',
      'skip_question': 'from-purple-500 to-purple-700',
      'extra_life': 'from-red-500 to-red-700',
      'shield': 'from-gray-500 to-gray-700',
      'multiplier': 'from-pink-500 to-pink-700',
      'reveal_answer': 'from-orange-500 to-orange-700',
      'time_bonus': 'from-indigo-500 to-indigo-700'
    };
    return colorMap[type] || 'from-gray-500 to-gray-700';
  };

  const formatCooldown = (seconds: number): string => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return seconds.toString();
  };

  const getUsageText = (powerUp: PowerUp): string => {
    if (powerUp.maxUses && powerUp.maxUses > 0) {
      const used = powerUp.maxUses - powerUp.usesRemaining;
      return `${used}/${powerUp.maxUses} used`;
    }
    return `${powerUp.usesRemaining} remaining`;
  };

  const isPowerUpUsable = (powerUp: PowerUp): boolean => {
    return powerUp.available && 
           powerUp.usesRemaining > 0 && 
           !cooldowns.has(powerUp.id) && 
           !disabled;
  };

  const renderPowerUpTooltip = (powerUp: PowerUp) => (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg border border-gray-700 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="font-semibold">{powerUp.name}</div>
      <div className="text-gray-300 text-xs mt-1">{powerUp.description}</div>
      {powerUp.cost > 0 && (
        <div className="text-yellow-400 text-xs mt-1">Cost: {powerUp.cost} points</div>
      )}
      {powerUp.cooldown && powerUp.cooldown > 0 && (
        <div className="text-blue-400 text-xs mt-1">Cooldown: {powerUp.cooldown}s</div>
      )}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  );

  return (
    <div className={`power-up-system ${className}`}>
      <div className="flex flex-wrap gap-3 justify-center">
        {powerUps.map((powerUp) => {
          const isUsable = isPowerUpUsable(powerUp);
          const isAnimating = animatingPowerUps.has(powerUp.id);
          const cooldownTime = cooldowns.get(powerUp.id);
          const isSelected = selectedPowerUp === powerUp.id;

          return (
            <div
              key={powerUp.id}
              className="relative group"
            >
              <button
                onClick={() => handlePowerUpClick(powerUp)}
                disabled={!isUsable}
                className={`
                  relative w-16 h-16 rounded-xl border-2 transition-all duration-300 transform
                  ${isUsable
                    ? `bg-gradient-to-br ${getPowerUpColor(powerUp.type)} border-white/30 hover:scale-110 hover:shadow-lg cursor-pointer`
                    : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                  }
                  ${isAnimating ? 'animate-pulse scale-125' : ''}
                  ${isSelected ? 'ring-2 ring-white ring-opacity-50' : ''}
                `}
              >
                {/* Power-up Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  {getPowerUpIcon(powerUp.type)}
                </div>

                {/* Uses Remaining Indicator */}
                {powerUp.usesRemaining > 0 && powerUp.usesRemaining < 10 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {powerUp.usesRemaining}
                  </div>
                )}

                {/* Cooldown Overlay */}
                {cooldownTime && cooldownTime > 0 && (
                  <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                    <div className="text-white text-xs font-bold">
                      {formatCooldown(cooldownTime)}
                    </div>
                  </div>
                )}

                {/* Unavailable Overlay */}
                {!powerUp.available && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-red-400 text-lg">🔒</div>
                  </div>
                )}

                {/* Cost Indicator */}
                {powerUp.cost > 0 && isUsable && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white text-xs px-1 rounded">
                    {powerUp.cost}
                  </div>
                )}
              </button>

              {/* Tooltip */}
              {renderPowerUpTooltip(powerUp)}
            </div>
          );
        })}
      </div>

      {/* Power-up Instructions */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          Click power-ups to activate special abilities
        </div>
        {powerUps.some(p => p.cost > 0) && (
          <div className="text-xs text-yellow-400 mt-1">
            Some power-ups cost points to use
          </div>
        )}
      </div>

      {/* Active Effects Display */}
      <div className="mt-3">
        {powerUps
          .filter(p => p.active)
          .map(powerUp => (
            <div
              key={`active-${powerUp.id}`}
              className="inline-flex items-center space-x-2 bg-green-900/30 border border-green-700/50 rounded-lg px-3 py-1 mr-2 mb-2"
            >
              <span className="text-lg">{getPowerUpIcon(powerUp.type)}</span>
              <span className="text-green-400 text-sm font-medium">{powerUp.name} Active</span>
              {powerUp.duration && powerUp.duration > 0 && (
                <span className="text-green-300 text-xs">({powerUp.duration}s)</span>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
};

// Individual Power-up Component for detailed view
export const PowerUpCard: React.FC<{
  powerUp: PowerUp;
  onSelect: () => void;
  selected?: boolean;
  disabled?: boolean;
}> = ({ powerUp, onSelect, selected = false, disabled = false }) => {
  const getPowerUpIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      'fifty_fifty': '🎯',
      'time_freeze': '⏰',
      'double_points': '💎',
      'hint': '💡',
      'skip_question': '⏭️',
      'extra_life': '❤️',
      'shield': '🛡️',
      'multiplier': '✨',
      'reveal_answer': '👁️',
      'time_bonus': '⚡'
    };
    return iconMap[type] || '🔮';
  };

  const getPowerUpColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      'fifty_fifty': 'from-blue-500 to-blue-700',
      'time_freeze': 'from-cyan-500 to-cyan-700',
      'double_points': 'from-yellow-500 to-yellow-700',
      'hint': 'from-green-500 to-green-700',
      'skip_question': 'from-purple-500 to-purple-700',
      'extra_life': 'from-red-500 to-red-700',
      'shield': 'from-gray-500 to-gray-700',
      'multiplier': 'from-pink-500 to-pink-700',
      'reveal_answer': 'from-orange-500 to-orange-700',
      'time_bonus': 'from-indigo-500 to-indigo-700'
    };
    return colorMap[type] || 'from-gray-500 to-gray-700';
  };

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
        ${selected
          ? 'border-blue-500 bg-blue-900/30'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
      `}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getPowerUpColor(powerUp.type)} flex items-center justify-center text-2xl`}>
          {getPowerUpIcon(powerUp.type)}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-white">{powerUp.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{powerUp.description}</p>
          
          <div className="flex items-center space-x-4 mt-2 text-xs">
            {powerUp.cost > 0 && (
              <span className="text-yellow-400">Cost: {powerUp.cost}</span>
            )}
            {powerUp.cooldown && powerUp.cooldown > 0 && (
              <span className="text-blue-400">Cooldown: {powerUp.cooldown}s</span>
            )}
            <span className="text-green-400">
              {powerUp.usesRemaining} uses left
            </span>
          </div>
        </div>
        
        {!powerUp.available && (
          <div className="text-red-400 text-lg">🔒</div>
        )}
      </div>
    </div>
  );
};

export default PowerUpSystem;