import React, { useEffect, useRef, useState } from 'react';
import { SoundEffect, SoundConfig } from '../../types/marvel';

interface SoundManagerProps {
  config: SoundConfig;
  onConfigChange?: (config: SoundConfig) => void;
  className?: string;
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private masterVolume: number = 1;
  private musicVolume: number = 0.7;
  private effectsVolume: number = 0.8;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context on user interaction (required by browsers)
      if (this.audioContext.state === 'suspended') {
        document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
        document.addEventListener('keydown', this.resumeAudioContext.bind(this), { once: true });
      }
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async loadSound(id: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(id, audioBuffer);
    } catch (error) {
      console.warn(`Failed to load sound ${id}:`, error);
    }
  }

  playSound(id: string, volume: number = 1): void {
    if (!this.audioContext || this.isMuted) return;

    const audioBuffer = this.sounds.get(id);
    if (!audioBuffer) {
      console.warn(`Sound ${id} not found`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.value = volume * this.effectsVolume * this.masterVolume;
      
      source.start();
      this.activeSources.add(source);
      
      source.onended = () => {
        this.activeSources.delete(source);
      };
    } catch (error) {
      console.warn(`Failed to play sound ${id}:`, error);
    }
  }

  playBackgroundMusic(url: string): void {
    if (this.isMuted) return;

    try {
      if (this.backgroundMusic) {
        this.backgroundMusic.pause();
      }

      this.backgroundMusic = new Audio(url);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
      this.backgroundMusic.play().catch(error => {
        console.warn('Failed to play background music:', error);
      });
    } catch (error) {
      console.warn('Failed to create background music:', error);
    }
  }

  stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
    }
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
    }
  }

  setEffectsVolume(volume: number): void {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopBackgroundMusic();
      this.stopAllSounds();
    }
  }

  stopAllSounds(): void {
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch (error) {
        // Source might already be stopped
      }
    });
    this.activeSources.clear();
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  getEffectsVolume(): number {
    return this.effectsVolume;
  }

  isMutedState(): boolean {
    return this.isMuted;
  }
}

// Global audio manager instance
const audioManager = new AudioManager();

const SoundManager: React.FC<SoundManagerProps> = ({
  config,
  onConfigChange,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initRef = useRef(false);

  // Initialize sound effects
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initializeSounds = async () => {
      setIsLoading(true);
      
      // Load default sound effects (using data URLs for demo)
      const defaultSounds = {
        correct: generateTone(800, 0.2, 'sine'),
        incorrect: generateTone(200, 0.3, 'sawtooth'),
        powerup: generateTone(1000, 0.15, 'square'),
        achievement: generateChord([523, 659, 784], 0.5),
        tick: generateTone(1200, 0.05, 'sine'),
        gameStart: generateChord([261, 329, 392], 0.3),
        gameEnd: generateChord([196, 247, 294], 0.8),
        buttonClick: generateTone(600, 0.1, 'sine')
      };

      for (const [id, audioData] of Object.entries(defaultSounds)) {
        try {
          const blob = new Blob([audioData], { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          await audioManager.loadSound(id, url);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn(`Failed to load sound ${id}:`, error);
        }
      }
      
      setIsLoading(false);
    };

    initializeSounds();
  }, []);

  // Apply config changes
  useEffect(() => {
    audioManager.setMasterVolume(config.masterVolume);
    audioManager.setMusicVolume(config.musicVolume);
    audioManager.setEffectsVolume(config.effectsVolume);
    audioManager.setMuted(config.muted);
  }, [config]);

  const handleVolumeChange = (type: 'master' | 'music' | 'effects', value: number) => {
    const newConfig = { ...config };
    
    switch (type) {
      case 'master':
        newConfig.masterVolume = value;
        break;
      case 'music':
        newConfig.musicVolume = value;
        break;
      case 'effects':
        newConfig.effectsVolume = value;
        break;
    }
    
    onConfigChange?.(newConfig);
  };

  const handleMuteToggle = () => {
    const newConfig = { ...config, muted: !config.muted };
    onConfigChange?.(newConfig);
  };

  const testSound = (soundId: string) => {
    audioManager.playSound(soundId);
  };

  return (
    <div className={`sound-manager ${className}`}>
      {/* Sound Control Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
      >
        <span className="text-lg">
          {config.muted ? '🔇' : '🔊'}
        </span>
        <span className="text-sm text-gray-300">Sound</span>
        <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded Sound Controls */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-xl z-50">
          <div className="space-y-4">
            {/* Master Controls */}
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Audio Settings</h3>
              <button
                onClick={handleMuteToggle}
                className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                  config.muted
                    ? 'bg-red-600 text-white'
                    : 'bg-green-600 text-white'
                }`}
              >
                {config.muted ? 'Unmute' : 'Mute'}
              </button>
            </div>

            {/* Volume Sliders */}
            <div className="space-y-3">
              {/* Master Volume */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm text-gray-300">Master Volume</label>
                  <span className="text-xs text-gray-400">{Math.round(config.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.masterVolume}
                  onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  disabled={config.muted}
                />
              </div>

              {/* Music Volume */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm text-gray-300">Music</label>
                  <span className="text-xs text-gray-400">{Math.round(config.musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.musicVolume}
                  onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  disabled={config.muted}
                />
              </div>

              {/* Effects Volume */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm text-gray-300">Sound Effects</label>
                  <span className="text-xs text-gray-400">{Math.round(config.effectsVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.effectsVolume}
                  onChange={(e) => handleVolumeChange('effects', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  disabled={config.muted}
                />
              </div>
            </div>

            {/* Sound Test Buttons */}
            <div>
              <h4 className="text-sm text-gray-300 mb-2">Test Sounds</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'correct', label: 'Correct', icon: '✅' },
                  { id: 'incorrect', label: 'Wrong', icon: '❌' },
                  { id: 'powerup', label: 'Power-up', icon: '⚡' },
                  { id: 'achievement', label: 'Achievement', icon: '🏆' }
                ].map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => testSound(sound.id)}
                    disabled={config.muted || isLoading}
                    className="flex items-center space-x-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span>{sound.icon}</span>
                    <span>{sound.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span>Loading sounds...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to generate simple tones
function generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): ArrayBuffer {
  const sampleRate = 44100;
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);
  
  // Generate tone
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    
    switch (type) {
      case 'sine':
        sample = Math.sin(2 * Math.PI * frequency * t);
        break;
      case 'square':
        sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
        break;
      case 'sawtooth':
        sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
        break;
      case 'triangle':
        sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
        break;
    }
    
    // Apply envelope
    const envelope = Math.exp(-t * 3); // Exponential decay
    sample *= envelope * 0.3; // Reduce volume
    
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }
  
  return buffer;
}

// Helper function to generate chord
function generateChord(frequencies: number[], duration: number): ArrayBuffer {
  const sampleRate = 44100;
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  
  // WAV header (same as above)
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);
  
  // Generate chord
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    
    // Sum all frequencies
    for (const freq of frequencies) {
      sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
    }
    
    // Apply envelope
    const envelope = Math.exp(-t * 2);
    sample *= envelope * 0.3;
    
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }
  
  return buffer;
}

// Export the audio manager for use in other components
export { audioManager };
export default SoundManager;