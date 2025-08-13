import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { useGameStore } from './stores/gameStore';
import { ParticleBackground } from './components/3d/ParticleBackground';
import { HomeScreen } from './components/screens/HomeScreen';
import { GameArenaScreen } from './components/screens/GameArenaScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { MultiplayerLobbyScreen } from './components/screens/MultiplayerLobbyScreen';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { NotificationManager } from './components/ui/NotificationManager';
import { ModalManager } from './components/ui/ModalManager';
import { AudioManager } from './components/audio/AudioManager';
import { cn } from './lib/utils';
import './styles/globals.css';

function App() {
  const { 
    ui, 
    settings, 
    player,
    setPlayer 
  } = useGameStore();

  // Initialize player if not exists
  useEffect(() => {
    if (!player) {
      setPlayer({
        id: crypto.randomUUID(),
        name: 'Marvel Fan',
        level: 1,
        experience: 0,
        totalScore: 0,
        gamesPlayed: 0,
        achievements: [],
        preferences: {
          soundEnabled: true,
          musicEnabled: true,
          animationsEnabled: true,
          difficulty: 'medium',
          theme: 'auto',
          language: 'en'
        },
        statistics: {
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
          averageResponseTime: 0,
          bestStreak: 0,
          favoriteCategory: 'general',
          timeSpentPlaying: 0,
          totalScore: 0,
          averageAccuracy: 0,
          gamesPlayed: 0
        }
      });
    }
  }, [player, setPlayer]);

  // Apply theme and accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    if (settings.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (settings.accessibility.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    if (settings.accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [settings.accessibility]);

  const renderCurrentScreen = () => {
    switch (ui.currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'game-arena':
        return <GameArenaScreen />;
      case 'results':
        return <ResultsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'multiplayer-lobby':
        return <MultiplayerLobbyScreen />;
      case 'loading':
        return <LoadingScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-marvel-red via-marvel-blue to-marvel-gold',
      'relative overflow-hidden',
      settings.accessibility.highContrast && 'high-contrast',
      settings.accessibility.reducedMotion && 'reduce-motion',
      settings.accessibility.largeText && 'text-lg'
    )}>
      {/* Particle Background */}
      {settings.graphics.particles && (
        <div className="fixed inset-0 z-0">
          <ParticleBackground />
        </div>
      )}
      
      {/* Cosmic Background Overlay */}
      <div className="fixed inset-0 z-0 cosmic-bg opacity-30" />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {ui.isLoading ? (
            <LoadingScreen key="loading" />
          ) : (
            <div key={ui.currentScreen}>
              {renderCurrentScreen()}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Audio Manager */}
      <AudioManager />
      
      {/* Notification System */}
      <NotificationManager />
      
      {/* Modal System */}
      <ModalManager />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      />
      
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
    </div>
  );
}

export default App;