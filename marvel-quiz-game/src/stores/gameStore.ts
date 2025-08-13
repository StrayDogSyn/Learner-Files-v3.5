import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Player, 
  PlayerStatistics,
  GameSession, 
  UIState, 
  GameSettings, 
  MultiplayerRoom, 
  GameMode, 
  QuizQuestion,
  PlayerAnswer,
  Achievement,
  Notification,
  Modal,
  Screen,
  DeepPartial
} from '../types';
import { questionGenerator } from '../services/questionGenerator';
import { generateId } from '../lib/utils';

interface GameStore {
  // Player state
  player: Player | null;
  setPlayer: (player: Player) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  
  // Game session state
  currentSession: GameSession | null;
  setCurrentSession: (session: GameSession) => void;
  updateSession: (updates: Partial<GameSession>) => void;
  
  // UI state
  ui: UIState;
  setCurrentScreen: (screen: Screen) => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  addModal: (modal: Omit<Modal, 'id'>) => void;
  removeModal: (id: string) => void;
  
  // Game settings
  settings: GameSettings;
  updateSettings: (updates: DeepPartial<GameSettings>) => void;
  
  // Multiplayer state
  multiplayerRoom: MultiplayerRoom | null;
  setMultiplayerRoom: (room: MultiplayerRoom | null) => void;
  
  // Game actions
  startGame: (gameMode: GameMode, difficulty: string) => Promise<void>;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  
  // Achievement actions
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;
  
  // Statistics actions
  updateStatistics: (sessionData: GameSession) => void;
  updatePlayerStats: (stats: Partial<PlayerStatistics>) => void;
}

const defaultPlayer: Player = {
  id: 'player-1',
  name: 'Marvel Fan',
  username: 'MarvelFan',
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
  },
  stats: {
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
};

const defaultUIState: UIState = {
  currentScreen: 'home',
  isLoading: false,
  showSettings: false,
  showAchievements: false,
  showLeaderboard: false,
  notifications: [],
  modals: []
};

const defaultSettings: GameSettings = {
  audio: {
    masterVolume: 0.8,
    soundEffects: true,
    music: true,
    voiceCommands: false
  },
  graphics: {
    animations: true,
    particles: true,
    quality: 'high'
  },
  gameplay: {
    difficulty: 'medium',
    autoAdvance: false,
    showHints: true,
    confirmAnswers: false
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  }
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      player: defaultPlayer,
      currentSession: null,
      ui: defaultUIState,
      settings: defaultSettings,
      multiplayerRoom: null,

      // Player actions
      setPlayer: (player) => set({ player }),
      
      updatePlayer: (updates) => set((state) => ({
        player: state.player ? { ...state.player, ...updates } : null
      })),

      // Game session actions
      setCurrentSession: (session) => set({ currentSession: session }),
      
      updateSession: (updates) => set((state) => ({
        currentSession: state.currentSession ? { ...state.currentSession, ...updates } : null
      })),

      // UI actions
      setCurrentScreen: (screen) => set((state) => ({
        ui: { ...state.ui, currentScreen: screen }
      })),
      
      setLoading: (loading) => set((state) => ({
        ui: { ...state.ui, isLoading: loading }
      })),
      
      addNotification: (notification) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: [
            ...state.ui.notifications,
            { ...notification, id: generateId() }
          ]
        }
      })),
      
      removeNotification: (id) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== id)
        }
      })),
      
      addModal: (modal) => set((state) => ({
        ui: {
          ...state.ui,
          modals: [
            ...state.ui.modals,
            { ...modal, id: generateId() }
          ]
        }
      })),
      
      removeModal: (id) => set((state) => ({
        ui: {
          ...state.ui,
          modals: state.ui.modals.filter(m => m.id !== id)
        }
      })),

      // Settings actions
      updateSettings: (updates) => set((state) => {
        const mergeDeep = (target: any, source: any): any => {
          const result = { ...target };
          for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
              result[key] = mergeDeep(target[key] || {}, source[key]);
            } else {
              result[key] = source[key];
            }
          }
          return result;
        };
        
        return {
          settings: mergeDeep(state.settings, updates)
        };
      }),

      // Multiplayer actions
      setMultiplayerRoom: (room) => set({ multiplayerRoom: room }),

      // Game actions
      startGame: async (gameMode, difficulty) => {
        const { player, setLoading, setCurrentSession, setCurrentScreen } = get();
        
        if (!player) return;
        
        try {
          setLoading(true);
          
          // Generate questions based on game mode and difficulty
          const questionCount = gameMode === 'blitz' ? 30 : gameMode === 'survival' ? 50 : 20;
          const questions = await questionGenerator.generateQuestions(
            10,
            difficulty as any
          );
          
          const session: GameSession = {
            id: generateId(),
            playerId: player.id,
            gameMode,
            difficulty: difficulty as any,
            questions,
            currentQuestionIndex: 0,
            score: 0,
            lives: gameMode === 'survival' ? 1 : gameMode === 'story' ? 3 : 0,
            streak: 0,
            timeRemaining: gameMode === 'blitz' ? 300 : 0, // 5 minutes for blitz
            startTime: Date.now(),
            status: 'active',
            answers: []
          };
          
          setCurrentSession(session);
          setCurrentScreen('game-arena');
          
        } catch (error) {
          console.error('Failed to start game:', error);
          get().addNotification({
            type: 'error',
            title: 'Game Start Failed',
            message: 'Unable to start the game. Please try again.',
            duration: 5000
          });
        } finally {
          setLoading(false);
        }
      },

      submitAnswer: (answer) => {
        const { currentSession, updateSession, player, updatePlayer } = get();
        
        if (!currentSession || !player || currentSession.status !== 'active') return;
        
        const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
        if (!currentQuestion) return;
        
        const isCorrect = parseInt(answer.toString()) === currentQuestion.correctAnswer;
        const responseTime = Date.now() - (currentSession.startTime + (currentSession.currentQuestionIndex * 20000)); // Approximate
        
        const playerAnswer: PlayerAnswer = {
          questionId: currentQuestion.id,
          selectedAnswer: answer,
          isCorrect,
          responseTime: Math.max(0, responseTime),
          pointsEarned: isCorrect ? (currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 20 : 30) : 0,
          hintsUsed: 0,
          timestamp: Date.now()
        };
        
        const newAnswers = [...currentSession.answers, playerAnswer];
        const newScore = currentSession.score + playerAnswer.pointsEarned;
        const newStreak = isCorrect ? currentSession.streak + 1 : 0;
        const newLives = !isCorrect && currentSession.gameMode === 'survival' ? 0 : 
                         !isCorrect && currentSession.gameMode === 'story' ? currentSession.lives - 1 : 
                         currentSession.lives;
        
        updateSession({
          answers: newAnswers,
          score: newScore,
          streak: newStreak,
          lives: newLives
        });
        
        // Update player statistics
        const correctAnswers = newAnswers.filter(a => a.isCorrect).length;
        const totalAnswers = newAnswers.length;
        const avgResponseTime = newAnswers.reduce((sum, a) => sum + a.responseTime, 0) / totalAnswers;
        
        updatePlayer({
          statistics: {
            ...player.statistics,
            totalQuestionsAnswered: player.statistics.totalQuestionsAnswered + 1,
            correctAnswers: player.statistics.correctAnswers + (isCorrect ? 1 : 0),
            averageResponseTime: avgResponseTime,
            bestStreak: Math.max(player.statistics.bestStreak, newStreak)
          }
        });
        
        // Check for game over conditions
        if (newLives === 0 || currentSession.currentQuestionIndex >= currentSession.questions.length - 1) {
          get().endGame();
        }
      },

      nextQuestion: () => {
        const { currentSession, updateSession } = get();
        
        if (!currentSession || currentSession.status !== 'active') return;
        
        const nextIndex = currentSession.currentQuestionIndex + 1;
        
        if (nextIndex >= currentSession.questions.length) {
          get().endGame();
        } else {
          updateSession({
            currentQuestionIndex: nextIndex
          });
        }
      },

      pauseGame: () => {
        const { updateSession } = get();
        updateSession({ status: 'paused' });
      },

      resumeGame: () => {
        const { updateSession } = get();
        updateSession({ status: 'active' });
      },

      endGame: () => {
        const { currentSession, updateSession, updateStatistics, setCurrentScreen, checkAchievements } = get();
        
        if (!currentSession) return;
        
        const endTime = Date.now();
        const finalSession = {
          ...currentSession,
          endTime,
          status: 'completed' as const
        };
        
        updateSession({ endTime, status: 'completed' });
        updateStatistics(finalSession);
        checkAchievements();
        setCurrentScreen('results');
      },

      resetGame: () => {
        set({
          currentSession: null,
          ui: { ...get().ui, currentScreen: 'home' }
        });
      },

      // Achievement actions
      unlockAchievement: (achievementId) => {
        const { player, updatePlayer, addNotification } = get();
        
        if (!player) return;
        
        const hasAchievement = player.achievements.some(a => a.id === achievementId);
        if (hasAchievement) return;
        
        // This would typically fetch achievement data from a service
        const achievement: Achievement = {
          id: achievementId,
          name: 'Achievement Unlocked',
          description: 'You earned a new achievement!',
          icon: 'trophy',
          category: 'milestone-badges',
          rarity: 'common',
          points: 100,
          unlockedAt: Date.now()
        };
        
        updatePlayer({
          achievements: [...player.achievements, achievement],
          experience: player.experience + achievement.points
        });
        
        addNotification({
          type: 'success',
          title: 'Achievement Unlocked!',
          message: achievement.name,
          duration: 5000
        });
      },

      checkAchievements: () => {
        const { player, currentSession } = get();
        
        if (!player || !currentSession) return;
        
        // Check various achievement conditions
        const { statistics } = player;
        const { score, streak, answers } = currentSession;
        
        // First game achievement
        if (statistics.totalQuestionsAnswered === 1) {
          get().unlockAchievement('first-question');
        }
        
        // Perfect score achievement
        if (answers.length > 0 && answers.every(a => a.isCorrect)) {
          get().unlockAchievement('perfect-score');
        }
        
        // Streak achievements
        if (streak >= 5) {
          get().unlockAchievement('streak-5');
        }
        if (streak >= 10) {
          get().unlockAchievement('streak-10');
        }
        
        // Score achievements
        if (score >= 1000) {
          get().unlockAchievement('score-1000');
        }
        if (score >= 5000) {
          get().unlockAchievement('score-5000');
        }
      },

      updateStatistics: (sessionData) => {
        const { player, updatePlayer } = get();
        
        if (!player) return;
        
        const sessionDuration = sessionData.endTime ? 
          (sessionData.endTime - sessionData.startTime) / 1000 / 60 : 0; // in minutes
        
        updatePlayer({
          totalScore: player.totalScore + sessionData.score,
          gamesPlayed: player.gamesPlayed + 1,
          statistics: {
            ...player.statistics,
            timeSpentPlaying: player.statistics.timeSpentPlaying + sessionDuration
          }
        });
      },

      updatePlayerStats: (stats) => {
        const { player, updatePlayer } = get();
        
        if (!player) return;
        
        updatePlayer({
          statistics: {
            ...player.statistics,
            ...stats
          }
        });
      }
    }),
    {
      name: 'marvel-quiz-game-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        player: state.player,
        settings: state.settings
      })
    }
  )
);

export default useGameStore;