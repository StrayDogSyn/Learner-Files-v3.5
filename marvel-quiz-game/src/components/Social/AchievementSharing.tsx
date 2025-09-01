import React, { useState, useRef } from 'react';
import { Achievement, GameStats } from '../../types/marvel';
import { FadeAnimation, ScaleAnimation } from '../UI/EnhancedAnimations';

export interface AchievementSharingProps {
  achievement: Achievement;
  playerName: string;
  playerStats?: GameStats;
  onShare?: (platform: SharePlatform, achievement: Achievement) => void;
  onClose?: () => void;
}

export interface SharePlatform {
  name: string;
  icon: string;
  color: string;
  action: 'copy' | 'url' | 'download';
}

export interface ShareableAchievement {
  achievement: Achievement;
  playerName: string;
  timestamp: string;
  stats?: {
    score: number;
    accuracy: number;
    streak: number;
  };
  gameContext?: string;
}

const AchievementSharing: React.FC<AchievementSharingProps> = ({
  achievement,
  playerName,
  playerStats,
  onShare,
  onClose
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<SharePlatform | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sharePlatforms: SharePlatform[] = [
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-500',
      action: 'url'
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      action: 'url'
    },
    {
      name: 'Discord',
      icon: '💬',
      color: 'bg-indigo-600',
      action: 'copy'
    },
    {
      name: 'Reddit',
      icon: '🔴',
      color: 'bg-orange-600',
      action: 'copy'
    },
    {
      name: 'Copy Link',
      icon: '🔗',
      color: 'bg-gray-600',
      action: 'copy'
    },
    {
      name: 'Download Image',
      icon: '📷',
      color: 'bg-green-600',
      action: 'download'
    }
  ];

  const generateShareMessage = (platform: SharePlatform): string => {
    const baseMessage = `🎉 Just unlocked "${achievement.name}" in Marvel Quiz! ${achievement.description}`;
    
    const statsText = playerStats ? 
      ` | Score: ${playerStats.totalScore} | Accuracy: ${Math.round((playerStats.correctAnswers / playerStats.totalQuestions) * 100)}%` : 
      '';
    
    switch (platform.name) {
      case 'Twitter':
        return `${baseMessage}${statsText} #MarvelQuiz #Achievement #Marvel`;
      case 'Discord':
        return `**${baseMessage}**${statsText} 🦸‍♂️`;
      case 'Reddit':
        return `${baseMessage}${statsText}`;
      default:
        return `${baseMessage}${statsText}`;
    }
  };

  const generateShareImage = async (): Promise<string> => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e3a8a'); // blue-800
    gradient.addColorStop(0.5, '#7c3aed'); // violet-600
    gradient.addColorStop(1, '#dc2626'); // red-600
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 4 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ACHIEVEMENT UNLOCKED!', canvas.width / 2, 100);

    // Achievement icon (large)
    ctx.font = '120px Arial';
    ctx.fillText(achievement.icon, canvas.width / 2, 220);

    // Achievement name
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText(achievement.name, canvas.width / 2, 280);

    // Achievement description
    ctx.font = '24px Arial';
    ctx.fillStyle = '#e5e7eb'; // gray-200
    const words = achievement.description.split(' ');
    let line = '';
    let y = 320;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > 600 && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Player name
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#60a5fa'; // blue-400
    ctx.fillText(`Achieved by ${playerName}`, canvas.width / 2, y + 60);

    // Stats (if available)
    if (playerStats) {
      const statsY = y + 120;
      ctx.font = '20px Arial';
      ctx.fillStyle = '#d1d5db'; // gray-300
      
      const accuracy = Math.round((playerStats.correctAnswers / playerStats.totalQuestions) * 100);
      const statsText = `Score: ${playerStats.totalScore} | Accuracy: ${accuracy}% | Streak: ${playerStats.longestStreak}`;
      ctx.fillText(statsText, canvas.width / 2, statsY);
    }

    // Footer
    ctx.font = '18px Arial';
    ctx.fillStyle = '#9ca3af'; // gray-400
    ctx.fillText('Marvel Quiz Game', canvas.width / 2, canvas.height - 40);

    return canvas.toDataURL('image/png');
  };

  const handleShare = async (platform: SharePlatform) => {
    setIsSharing(true);
    setSelectedPlatform(platform);
    
    try {
      const message = generateShareMessage(platform);
      setShareMessage(message);

      switch (platform.action) {
        case 'copy':
          await navigator.clipboard.writeText(message);
          break;
          
        case 'url':
          const encodedMessage = encodeURIComponent(message);
          let url = '';
          
          switch (platform.name) {
            case 'Twitter':
              url = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
              break;
            case 'Facebook':
              url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedMessage}`;
              break;
          }
          
          if (url) {
            window.open(url, '_blank', 'width=600,height=400');
          }
          break;
          
        case 'download':
          const imageData = await generateShareImage();
          const link = document.createElement('a');
          link.download = `marvel-quiz-achievement-${achievement.id}.png`;
          link.href = imageData;
          link.click();
          break;
      }

      if (onShare) {
        onShare(platform, achievement);
      }
    } catch (error) {
      console.error('Error sharing achievement:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <ScaleAnimation>
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Share Achievement</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Achievement Display */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 mb-6 text-center">
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h3 className="text-lg font-bold text-white mb-1">{achievement.name}</h3>
            <p className="text-yellow-100 text-sm">{achievement.description}</p>
            
            {playerStats && (
              <div className="mt-3 pt-3 border-t border-yellow-300 border-opacity-30">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="font-bold text-white">{playerStats.totalScore}</div>
                    <div className="text-yellow-200">Score</div>
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {Math.round((playerStats.correctAnswers / playerStats.totalQuestions) * 100)}%
                    </div>
                    <div className="text-yellow-200">Accuracy</div>
                  </div>
                  <div>
                    <div className="font-bold text-white">{playerStats.longestStreak}</div>
                    <div className="text-yellow-200">Streak</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Share Platforms */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Share on:</h4>
            
            {sharePlatforms.map((platform, index) => (
              <FadeAnimation key={platform.name} delay={index * 50}>
                <button
                  onClick={() => handleShare(platform)}
                  disabled={isSharing}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isSharing && selectedPlatform?.name === platform.name
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 hover:shadow-lg'
                  } ${platform.color} text-white`}
                >
                  <span className="text-xl">{platform.icon}</span>
                  <span className="flex-1 text-left font-medium">{platform.name}</span>
                  {isSharing && selectedPlatform?.name === platform.name && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  )}
                  {platform.action === 'copy' && (
                    <span className="text-xs opacity-75">Copy</span>
                  )}
                  {platform.action === 'download' && (
                    <span className="text-xs opacity-75">Save</span>
                  )}
                </button>
              </FadeAnimation>
            ))}
          </div>

          {/* Share Message Preview */}
          {shareMessage && (
            <FadeAnimation>
              <div className="mt-6 p-3 bg-gray-700 rounded-lg">
                <h5 className="text-sm font-medium text-gray-300 mb-2">Message Preview:</h5>
                <p className="text-sm text-gray-200 break-words">{shareMessage}</p>
              </div>
            </FadeAnimation>
          )}

          {/* Hidden canvas for image generation */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
            width={800}
            height={600}
          />
        </div>
      </ScaleAnimation>
    </div>
  );
};

// Achievement Gallery Component
export interface AchievementGalleryProps {
  achievements: Achievement[];
  playerName: string;
  onShareAchievement?: (achievement: Achievement) => void;
  compact?: boolean;
}

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({
  achievements,
  playerName,
  onShareAchievement,
  compact = false
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  const handleAchievementClick = (achievement: Achievement) => {
    if (achievement.unlockedAt) {
      setSelectedAchievement(achievement);
    }
  };

  const handleShare = (achievement: Achievement) => {
    if (onShareAchievement) {
      onShareAchievement(achievement);
    }
    setSelectedAchievement(achievement);
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Recent Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {unlockedAchievements.slice(0, 8).map((achievement, index) => (
            <FadeAnimation key={achievement.id} delay={index * 50}>
              <div
                className="bg-gray-700 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className="text-xs text-white font-medium truncate">
                  {achievement.name}
                </div>
              </div>
            </FadeAnimation>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unlocked Achievements */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Unlocked Achievements ({unlockedAchievements.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {unlockedAchievements.map((achievement, index) => (
            <FadeAnimation key={achievement.id} delay={index * 30}>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="text-white font-bold text-sm mb-1">{achievement.name}</h4>
                <p className="text-yellow-100 text-xs mb-3">{achievement.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAchievementClick(achievement)}
                    className="flex-1 bg-white bg-opacity-20 text-white text-xs py-1 px-2 rounded hover:bg-opacity-30 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleShare(achievement)}
                    className="flex-1 bg-white bg-opacity-20 text-white text-xs py-1 px-2 rounded hover:bg-opacity-30 transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            </FadeAnimation>
          ))}
        </div>
      </div>

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            Locked Achievements ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lockedAchievements.map((achievement, index) => (
              <FadeAnimation key={achievement.id} delay={index * 30}>
                <div className="bg-gray-700 rounded-lg p-4 text-center opacity-60">
                  <div className="text-3xl mb-2 grayscale">🔒</div>
                  <h4 className="text-gray-300 font-bold text-sm mb-1">???</h4>
                  <p className="text-gray-400 text-xs">{achievement.description}</p>
                  <div className="mt-3">
                    <div className="bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress || 0)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {achievement.progress || 0}% complete
                    </div>
                  </div>
                </div>
              </FadeAnimation>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {selectedAchievement && (
        <AchievementSharing
          achievement={selectedAchievement}
          playerName={playerName}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
};

export default AchievementSharing;