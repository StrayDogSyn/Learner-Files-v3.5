import { useEffect, useRef } from 'react';
import { useGameStore } from '../../../stores/gameStore';

export function AudioManager() {
  const { settings } = useGameStore();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    if (settings.audio.soundEffects && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [settings.audio.soundEffects]);

  // Play sound effect
  const playSound = (soundName: string, volume: number = 1) => {
    if (!settings.audio.soundEffects || !audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      const gainNode = audioContext.createGain();
      const oscillator = audioContext.createOscillator();

      // Configure sound based on type
      switch (soundName) {
        case 'correct':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
          break;
        case 'incorrect':
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
          break;
        case 'click':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          break;
        case 'achievement':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
          break;
        default:
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      }

      // Configure gain (volume)
      gainNode.gain.setValueAtTime(volume * settings.audio.masterVolume * 0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  };

  // Expose playSound function globally for use in other components
  useEffect(() => {
    (window as any).playSound = playSound;
    return () => {
      delete (window as any).playSound;
    };
  }, [settings.audio.soundEffects, settings.audio.masterVolume]);

  // Play background music (if implemented)
  const playBackgroundMusic = () => {
    if (!settings.audio.music || !audioContextRef.current) return;

    // This would typically load and play background music files
    // For now, we'll create a simple ambient tone
    try {
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(settings.audio.masterVolume * 0.05, audioContext.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      // Stop after 30 seconds (would loop in real implementation)
      setTimeout(() => {
        oscillator.stop();
      }, 30000);
    } catch (error) {
      console.warn('Error playing background music:', error);
    }
  };

  useEffect(() => {
    if (settings.audio.music) {
      playBackgroundMusic();
    }
  }, [settings.audio.music]);

  return null; // This component doesn't render anything
}

export default AudioManager;

// Helper function to play sounds from anywhere in the app
export const playGameSound = (soundName: string, volume: number = 1) => {
  if ((window as any).playSound) {
    (window as any).playSound(soundName, volume);
  }
};