import React, { useState, useEffect } from 'react';
import { PowerUp, QuizQuestion } from '../../types/marvel';
import { Zap, Clock, Eye, Shield, Target, Star } from 'lucide-react';

interface PowerUpSystemProps {
  availablePowerUps: PowerUp[];
  onUsePowerUp: (powerUpId: string, questionId?: string) => void;
  currentQuestion?: QuizQuestion;
  isGameActive: boolean;
  className?: string;
}

interface PowerUpEffect {
  id: string;
  type: 'visual' | 'functional';
  duration: number;
  startTime: number;
}

const PowerUpSystem: React.FC<PowerUpSystemProps> = ({
  availablePowerUps,
  onUsePowerUp,
  currentQuestion,
  isGameActive,
  className = ''
}) => {
  const [activePowerUps, setActivePowerUps] = useState<PowerUpEffect[]>([]);
  const [selectedPowerUp, setSelectedPowerUp] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [animatingPowerUp, setAnimatingPowerUp] = useState<string | null>(null);

  // Clean up expired power-up effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActivePowerUps(prev => 
        prev.filter(effect => now - effect.startTime < effect.duration)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getPowerUpIcon = (type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'fifty_fifty': <Target className="w-5 h-5" />,
      'extra_time': <Clock className="w-5 h-5" />,
      'hint': <Eye className="w-5 h-5" />,
      'shield': <Shield className="w-5 h-5" />,
      'double_points': <Star className="w-5 h-5" />,
      'skip_question': <Zap className="w-5 h-5" />
    };
    return iconMap[type] || <Zap className="w-5 h-5" />;
  };

  const getPowerUpColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      'fifty_fifty': 'from-blue-500 to-blue-700',
      'extra_time': 'from-green-500 to-green-700',
      'hint': 'from-yellow-500 to-yellow-700',
      'shield': 'from-purple-500 to-purple-700',
      'double_points': 'from-orange-500 to-orange-700',
      'skip_question': 'from-red-500 to-red-700'
    };
    return colorMap[type] || 'from-gray-500 to-gray-700';
  };

  const getPowerUpDescription = (type: string) => {
    const descriptions: { [key: string]: string } = {
      'fifty_fifty': 'Remove two wrong answers',
      'extra_time': 'Add 15 seconds to timer',
      'hint': 'Reveal a helpful hint',
      'shield': 'Protect from one wrong answer',
      'double_points': 'Double points for next correct answer',
      'skip_question': 'Skip current question without penalty'
    };
    return descriptions[type] || 'Special power-up';
  };

  const canUsePowerUp = (powerUp: PowerUp) => {
    if (!isGameActive || powerUp.quantity <= 0) return false;
    
    // Some power-ups require a current question
    const questionRequiredTypes = ['fifty_fifty', 'hint', 'extra_time', 'skip_question'];
    if (questionRequiredTypes.includes(powerUp.type) && !currentQuestion) {
      return false;
    }

    // Check if power-up is already active
    const isActive = activePowerUps.some(effect => effect.id === powerUp.id);
    if (isActive) return false;

    return true;
  };

  const handlePowerUpClick = (powerUp: PowerUp) => {
    if (!canUsePowerUp(powerUp)) return;

    setSelectedPowerUp(powerUp.id);
    setShowConfirmation(true);
  };

  const confirmUsePowerUp = () => {
    if (!selectedPowerUp) return;

    const powerUp = availablePowerUps.find(p => p.id === selectedPowerUp);
    if (!powerUp) return;

    // Add visual effect
    setAnimatingPowerUp(powerUp.id);
    setTimeout(() => setAnimatingPowerUp(null), 1000);

    // Add active effect for duration-based power-ups
    if (powerUp.duration && powerUp.duration > 0) {
      const effect: PowerUpEffect = {
        id: powerUp.id,
        type: 'functional',
        duration: powerUp.duration,
        startTime: Date.now()
      };
      setActivePowerUps(prev => [...prev, effect]);
    }

    // Execute power-up
    onUsePowerUp(powerUp.id, currentQuestion?.id);
    
    setShowConfirmation(false);
    setSelectedPowerUp(null);
  };

  const cancelPowerUp = () => {
    setShowConfirmation(false);
    setSelectedPowerUp(null);
  };

  const getActivePowerUpStatus = (powerUpId: string) => {
    const effect = activePowerUps.find(e => e.id === powerUpId);
    if (!effect) return null;

    const elapsed = Date.now() - effect.startTime;
    const remaining = Math.max(0, effect.duration - elapsed);
    const progress = (elapsed / effect.duration) * 100;

    return {
      remaining: Math.ceil(remaining / 1000),
      progress: Math.min(progress, 100)
    };
  };

  const renderPowerUpButton = (powerUp: PowerUp) => {
    const isUsable = canUsePowerUp(powerUp);
    const isAnimating = animatingPowerUp === powerUp.id;
    const activeStatus = getActivePowerUpStatus(powerUp.id);
    const isActive = activeStatus !== null;

    return (
      <div key={powerUp.id} className="relative">
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
            ${isActive ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''}
          `}
        >
          {/* Power-up icon */}
          <div className={`flex items-center justify-center w-full h-full text-white ${
            isUsable ? '' : 'text-gray-500'
          }`}>
            {getPowerUpIcon(powerUp.type)}
          </div>

          {/* Quantity badge */}
          {powerUp.quantity > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
              {powerUp.quantity}
            </div>
          )}

          {/* Active timer */}
          {isActive && activeStatus && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                {activeStatus.remaining}s
              </div>
            </div>
          )}

          {/* Progress ring for active power-ups */}
          {isActive && activeStatus && (
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="30"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
              />
              <circle
                cx="50%"
                cy="50%"
                r="30"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (activeStatus.progress / 100)}`}
                className="transition-all duration-100"
              />
            </svg>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap border border-gray-700">
            <div className="font-semibold">{powerUp.name}</div>
            <div className="text-gray-400">{getPowerUpDescription(powerUp.type)}</div>
            {powerUp.cooldown > 0 && (
              <div className="text-yellow-400">Cooldown: {powerUp.cooldown}s</div>
            )}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Power-ups grid */}
      <div className="flex flex-wrap gap-3 justify-center">
        {availablePowerUps.map(renderPowerUpButton)}
      </div>

      {/* Active power-ups status */}
      {activePowerUps.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
          <div className="text-sm font-semibold text-yellow-400 mb-2">Active Power-ups:</div>
          <div className="flex flex-wrap gap-2">
            {activePowerUps.map((effect) => {
              const powerUp = availablePowerUps.find(p => p.id === effect.id);
              const status = getActivePowerUpStatus(effect.id);
              
              return powerUp && status ? (
                <div key={effect.id} className="flex items-center space-x-2 bg-yellow-800/30 rounded-lg px-3 py-1">
                  {getPowerUpIcon(powerUp.type)}
                  <span className="text-sm text-yellow-300">{powerUp.name}</span>
                  <span className="text-xs text-yellow-400">{status.remaining}s</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirmation && selectedPowerUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm mx-4">
            {(() => {
              const powerUp = availablePowerUps.find(p => p.id === selectedPowerUp);
              return powerUp ? (
                <>
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${getPowerUpColor(powerUp.type)} mb-3`}>
                      {getPowerUpIcon(powerUp.type)}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{powerUp.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{getPowerUpDescription(powerUp.type)}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Remaining:</span>
                      <span className="text-white">{powerUp.quantity}</span>
                    </div>
                    {powerUp.duration > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{powerUp.duration / 1000}s</span>
                      </div>
                    )}
                    {powerUp.cooldown > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cooldown:</span>
                        <span className="text-white">{powerUp.cooldown}s</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={cancelPowerUp}
                      className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmUsePowerUp}
                      className={`flex-1 py-2 px-4 bg-gradient-to-r ${getPowerUpColor(powerUp.type)} text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-semibold`}
                    >
                      Use Power-up
                    </button>
                  </div>
                </>
              ) : null;
            })()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerUpSystem;