import React, { useEffect, useRef, useState } from 'react';
import { SoundEffect, SoundConfig } from '../../types/marvel';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface SoundManagerProps {
  soundConfig: SoundConfig;
  onConfigChange: (config: SoundConfig) => void;
  className?: string;
}

interface AudioInstance {
  audio: HTMLAudioElement;
  id: string;
  type: 'effect' | 'music';
  loop: boolean;
}

const SoundManager: React.FC<SoundManagerProps> = ({
  soundConfig,
  onConfigChange,
  className = ''
}) => {
  const [audioInstances, setAudioInstances] = useState<Map<string, AudioInstance>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const effectsGainRef = useRef<GainNode | null>(null);

  // Sound effect definitions
  const soundEffects: { [key: string]: SoundEffect } = {
    correct: {
      id: 'correct',
      name: 'Correct Answer',
      url: '/sounds/correct.mp3',
      volume: 0.7,
      category: 'feedback'
    },
    incorrect: {
      id: 'incorrect',
      name: 'Incorrect Answer',
      url: '/sounds/incorrect.mp3',
      volume: 0.6,
      category: 'feedback'
    },
    powerup: {
      id: 'powerup',
      name: 'Power-up Activated',
      url: '/sounds/powerup.mp3',
      volume: 0.8,
      category: 'action'
    },
    achievement: {
      id: 'achievement',
      name: 'Achievement Unlocked',
      url: '/sounds/achievement.mp3',
      volume: 0.9,
      category: 'reward'
    },
    tick: {
      id: 'tick',
      name: 'Timer Tick',
      url: '/sounds/tick.mp3',
      volume: 0.3,
      category: 'ui'
    },
    warning: {
      id: 'warning',
      name: 'Time Warning',
      url: '/sounds/warning.mp3',
      volume: 0.8,
      category: 'alert'
    },
    gameStart: {
      id: 'gameStart',
      name: 'Game Start',
      url: '/sounds/game-start.mp3',
      volume: 0.7,
      category: 'transition'
    },
    gameEnd: {
      id: 'gameEnd',
      name: 'Game End',
      url: '/sounds/game-end.mp3',
      volume: 0.8,
      category: 'transition'
    }
  };

  // Initialize Web Audio API
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Create audio context
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create gain nodes for volume control
        masterGainRef.current = audioContextRef.current.createGain();
        musicGainRef.current = audioContextRef.current.createGain();
        effectsGainRef.current = audioContextRef.current.createGain();

        // Connect gain nodes
        musicGainRef.current.connect(masterGainRef.current);
        effectsGainRef.current.connect(masterGainRef.current);
        masterGainRef.current.connect(audioContextRef.current.destination);

        // Set initial volumes
        masterGainRef.current.gain.value = soundConfig.masterVolume;
        musicGainRef.current.gain.value = soundConfig.musicVolume;
        effectsGainRef.current.gain.value = soundConfig.effectsVolume;

        setIsInitialized(true);
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
        setIsInitialized(false);
      }
    };

    initializeAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update volume when config changes
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = soundConfig.masterVolume;
    }
    if (musicGainRef.current) {
      musicGainRef.current.gain.value = soundConfig.musicVolume;
    }
    if (effectsGainRef.current) {
      effectsGainRef.current.gain.value = soundConfig.effectsVolume;
    }
  }, [soundConfig]);

  // Create or get audio instance
  const getAudioInstance = (soundId: string, isMusic: boolean = false): HTMLAudioElement | null => {
    if (!soundConfig.enabled) return null;

    const existingInstance = audioInstances.get(soundId);
    if (existingInstance) {
      return existingInstance.audio;
    }

    const soundEffect = soundEffects[soundId];
    if (!soundEffect) return null;

    try {
      const audio = new Audio();
      audio.src = soundEffect.url;
      audio.volume = soundEffect.volume * (isMusic ? soundConfig.musicVolume : soundConfig.effectsVolume) * soundConfig.masterVolume;
      audio.preload = 'auto';
      
      if (isMusic) {
        audio.loop = true;
      }

      const instance: AudioInstance = {
        audio,
        id: soundId,
        type: isMusic ? 'music' : 'effect',
        loop: isMusic
      };

      setAudioInstances(prev => new Map(prev).set(soundId, instance));
      return audio;
    } catch (error) {
      console.warn(`Failed to create audio instance for ${soundId}:`, error);
      return null;
    }
  };

  // Play sound effect
  const playSound = async (soundId: string, options: { volume?: number; loop?: boolean } = {}) => {
    if (!soundConfig.enabled || !isInitialized) return;

    const audio = getAudioInstance(soundId, options.loop);
    if (!audio) return;

    try {
      // Reset audio to beginning
      audio.currentTime = 0;
      
      // Set volume if specified
      if (options.volume !== undefined) {
        audio.volume = options.volume * soundConfig.effectsVolume * soundConfig.masterVolume;
      }

      // Set loop if specified
      if (options.loop !== undefined) {
        audio.loop = options.loop;
      }

      // Resume audio context if suspended
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      await audio.play();
    } catch (error) {
      console.warn(`Failed to play sound ${soundId}:`, error);
    }
  };

  // Stop sound
  const stopSound = (soundId: string) => {
    const instance = audioInstances.get(soundId);
    if (instance) {
      instance.audio.pause();
      instance.audio.currentTime = 0;
    }
  };

  // Stop all sounds
  const stopAllSounds = () => {
    audioInstances.forEach((instance) => {
      instance.audio.pause();
      instance.audio.currentTime = 0;
    });
  };

  // Play background music
  const playBackgroundMusic = async () => {
    if (!soundConfig.musicEnabled) return;
    await playSound('backgroundMusic', { loop: true, volume: 0.3 });
  };

  // Stop background music
  const stopBackgroundMusic = () => {
    stopSound('backgroundMusic');
  };

  // Volume control handlers
  const handleMasterVolumeChange = (volume: number) => {
    onConfigChange({
      ...soundConfig,
      masterVolume: volume
    });
  };

  const handleMusicVolumeChange = (volume: number) => {
    onConfigChange({
      ...soundConfig,
      musicVolume: volume
    });
  };

  const handleEffectsVolumeChange = (volume: number) => {
    onConfigChange({
      ...soundConfig,
      effectsVolume: volume
    });
  };

  const toggleSound = () => {
    const newEnabled = !soundConfig.enabled;
    onConfigChange({
      ...soundConfig,
      enabled: newEnabled
    });

    if (!newEnabled) {
      stopAllSounds();
    }
  };

  const toggleMusic = () => {
    const newMusicEnabled = !soundConfig.musicEnabled;
    onConfigChange({
      ...soundConfig,
      musicEnabled: newMusicEnabled
    });

    if (!newMusicEnabled) {
      stopBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  };

  // Expose sound functions to parent component
  useEffect(() => {
    // Attach sound functions to window for global access
    (window as any).marvelQuizSounds = {
      playSound,
      stopSound,
      stopAllSounds,
      playBackgroundMusic,
      stopBackgroundMusic
    };

    return () => {
      delete (window as any).marvelQuizSounds;
    };
  }, [soundConfig, isInitialized]);

  return (
    <div className={`${className}`}>
      {/* Sound control button */}
      <div className="relative">
        <button
          onClick={() => setShowControls(!showControls)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 border border-gray-600"
          title="Sound Settings"
        >
          {soundConfig.enabled ? (
            <Volume2 className="w-5 h-5 text-white" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Sound controls panel */}
        {showControls && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-xl z-50">
            <div className="space-y-4">
              {/* Master controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Sound Settings</h3>
                <button
                  onClick={() => setShowControls(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              {/* Enable/Disable sound */}
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Enable Sound</span>
                <button
                  onClick={toggleSound}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    soundConfig.enabled ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    soundConfig.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {soundConfig.enabled && (
                <>
                  {/* Master volume */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Master Volume</span>
                      <span className="text-white text-sm">{Math.round(soundConfig.masterVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={soundConfig.masterVolume}
                      onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Music controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Music className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">Background Music</span>
                      </div>
                      <button
                        onClick={toggleMusic}
                        className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                          soundConfig.musicEnabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          soundConfig.musicEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    {soundConfig.musicEnabled && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Music Volume</span>
                          <span className="text-white text-sm">{Math.round(soundConfig.musicVolume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={soundConfig.musicVolume}
                          onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    )}
                  </div>

                  {/* Effects volume */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Sound Effects</span>
                      <span className="text-white text-sm">{Math.round(soundConfig.effectsVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={soundConfig.effectsVolume}
                      onChange={(e) => handleEffectsVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Test buttons */}
                  <div className="space-y-2">
                    <span className="text-gray-300 text-sm">Test Sounds:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => playSound('correct')}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        Correct
                      </button>
                      <button
                        onClick={() => playSound('incorrect')}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        Incorrect
                      </button>
                      <button
                        onClick={() => playSound('powerup')}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        Power-up
                      </button>
                      <button
                        onClick={() => playSound('achievement')}
                        className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        Achievement
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status indicator */}
      {soundConfig.enabled && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
      )}
    </div>
  );
};

// Audio manager utility functions
export const audioManager = {
  playSound: (soundId: string, options?: { volume?: number; loop?: boolean }) => {
    if ((window as any).marvelQuizSounds) {
      return (window as any).marvelQuizSounds.playSound(soundId, options);
    }
  },
  stopSound: (soundId: string) => {
    if ((window as any).marvelQuizSounds) {
      return (window as any).marvelQuizSounds.stopSound(soundId);
    }
  },
  stopAllSounds: () => {
    if ((window as any).marvelQuizSounds) {
      return (window as any).marvelQuizSounds.stopAllSounds();
    }
  },
  playBackgroundMusic: () => {
    if ((window as any).marvelQuizSounds) {
      return (window as any).marvelQuizSounds.playBackgroundMusic();
    }
  },
  stopBackgroundMusic: () => {
    if ((window as any).marvelQuizSounds) {
      return (window as any).marvelQuizSounds.stopBackgroundMusic();
    }
  }
};

export default SoundManager;