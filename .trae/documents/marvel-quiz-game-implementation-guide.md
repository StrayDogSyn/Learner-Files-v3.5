# 🛠️ Marvel Quiz Game - Implementation Guide

## 1. Project Setup & Dependencies

### 1.1 Initialize Project
```bash
# Create new Vite + React + TypeScript project
npm create vite@latest marvel-quiz-game -- --template react-ts
cd marvel-quiz-game

# Install core dependencies
npm install framer-motion three @react-three/fiber @react-three/drei
npm install @supabase/supabase-js zustand @tanstack/react-query
npm install socket.io-client dexie crypto-js
npm install tailwindcss @tailwindcss/typography
npm install @heroicons/react lucide-react

# Install development dependencies
npm install -D @types/three @types/crypto-js
npm install -D eslint-plugin-react-hooks @typescript-eslint/eslint-plugin
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test
```

### 1.2 Tailwind Configuration with Glassmorphism
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'electric-blue': '#00D4FF',
        'arc-gold': '#FFD700',
        'deep-space': '#0A0A0A',
        'cosmic-purple': '#6B46C1',
        'energy-red': '#EF4444',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'rotate-infinity': 'rotate-infinity 3s linear infinite',
        'repulsor-blast': 'repulsor-blast 0.5s ease-out',
        'thanos-snap': 'thanos-snap 1s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)' },
        },
        'rotate-infinity': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'repulsor-blast': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'thanos-snap': {
          '0%': { opacity: '1', filter: 'blur(0px)' },
          '50%': { opacity: '0.5', filter: 'blur(2px)' },
          '100%': { opacity: '0', filter: 'blur(5px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-panel': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        },
        '.glass-button': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
        },
        '.glass-button:hover': {
          background: 'rgba(255, 255, 255, 0.15)',
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 25px rgba(0, 212, 255, 0.3)',
        },
        '.cosmic-gradient': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        '.arc-reactor-glow': {
          background: 'radial-gradient(circle, #FFD700 0%, #FFA500 50%, #FF6347 100%)',
          animation: 'pulse-glow 2s ease-in-out infinite alternate',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
```

## 2. Core Architecture Setup

### 2.1 Zustand Store Configuration
```typescript
// src/store/gameStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Question {
  id: string
  characterId: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  questionText: string
  options: Record<string, string>
  correctAnswer: string
  explanation: string
}

export interface GameSession {
  id: string
  mode: 'story' | 'blitz' | 'survival' | 'multiplayer'
  difficulty: string
  score: number
  questionsAnswered: number
  correctAnswers: number
  streak: number
  multiplier: number
  timeSpent: number
  startedAt: Date
  currentQuestion?: Question
  questions: Question[]
}

export interface Player {
  id: string
  username: string
  email: string
  avatarUrl?: string
  totalScore: number
  gamesPlayed: number
  accuracyRate: number
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  type: string
  name: string
  description: string
  iconUrl: string
  unlockedAt?: Date
}

interface GameState {
  // Player state
  player: Player | null
  isAuthenticated: boolean
  
  // Game session state
  currentSession: GameSession | null
  gameMode: string | null
  isGameActive: boolean
  isPaused: boolean
  
  // UI state
  isLoading: boolean
  error: string | null
  showAchievement: Achievement | null
  
  // Settings
  soundEnabled: boolean
  animationsEnabled: boolean
  difficulty: string
  
  // Actions
  setPlayer: (player: Player) => void
  startGame: (mode: string, difficulty: string) => void
  endGame: () => void
  submitAnswer: (answer: string, timeSpent: number) => void
  pauseGame: () => void
  resumeGame: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  showAchievementNotification: (achievement: Achievement) => void
  updateSettings: (settings: Partial<{ soundEnabled: boolean; animationsEnabled: boolean; difficulty: string }>) => void
}

export const useGameStore = create<GameState>()()
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        player: null,
        isAuthenticated: false,
        currentSession: null,
        gameMode: null,
        isGameActive: false,
        isPaused: false,
        isLoading: false,
        error: null,
        showAchievement: null,
        soundEnabled: true,
        animationsEnabled: true,
        difficulty: 'medium',
        
        // Actions
        setPlayer: (player) => set({ player, isAuthenticated: true }),
        
        startGame: (mode, difficulty) => {
          const session: GameSession = {
            id: crypto.randomUUID(),
            mode: mode as any,
            difficulty,
            score: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            streak: 0,
            multiplier: 1,
            timeSpent: 0,
            startedAt: new Date(),
            questions: [],
          }
          set({ 
            currentSession: session, 
            gameMode: mode, 
            isGameActive: true, 
            isPaused: false 
          })
        },
        
        endGame: () => set({ 
          currentSession: null, 
          gameMode: null, 
          isGameActive: false, 
          isPaused: false 
        }),
        
        submitAnswer: (answer, timeSpent) => {
          const { currentSession } = get()
          if (!currentSession?.currentQuestion) return
          
          const isCorrect = answer === currentSession.currentQuestion.correctAnswer
          const newStreak = isCorrect ? currentSession.streak + 1 : 0
          const multiplier = Math.min(Math.floor(newStreak / 5) + 1, 10)
          const points = isCorrect ? 100 * multiplier : 0
          
          set({
            currentSession: {
              ...currentSession,
              score: currentSession.score + points,
              questionsAnswered: currentSession.questionsAnswered + 1,
              correctAnswers: currentSession.correctAnswers + (isCorrect ? 1 : 0),
              streak: newStreak,
              multiplier,
              timeSpent: currentSession.timeSpent + timeSpent,
            }
          })
        },
        
        pauseGame: () => set({ isPaused: true }),
        resumeGame: () => set({ isPaused: false }),
        setError: (error) => set({ error }),
        setLoading: (isLoading) => set({ isLoading }),
        showAchievementNotification: (achievement) => set({ showAchievement: achievement }),
        
        updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
      }),
      {
        name: 'marvel-quiz-storage',
        partialize: (state) => ({ 
          player: state.player, 
          soundEnabled: state.soundEnabled,
          animationsEnabled: state.animationsEnabled,
          difficulty: state.difficulty,
        }),
      }
    )
  )
)
```

### 2.2 Marvel API Service
```typescript
// src/services/marvelApi.ts
import CryptoJS from 'crypto-js'

const MARVEL_BASE_URL = import.meta.env.VITE_MARVEL_API_BASE_URL
const PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_KEY
const PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_KEY

interface MarvelCharacter {
  id: number
  name: string
  description: string
  thumbnail: {
    path: string
    extension: string
  }
  comics: {
    available: number
    items: Array<{ name: string }>
  }
  events: {
    available: number
    items: Array<{ name: string }>
  }
}

interface MarvelApiResponse<T> {
  code: number
  status: string
  data: {
    offset: number
    limit: number
    total: number
    count: number
    results: T[]
  }
}

class MarvelApiService {
  private generateAuthParams() {
    const timestamp = Date.now().toString()
    const hash = CryptoJS.MD5(timestamp + PRIVATE_KEY + PUBLIC_KEY).toString()
    
    return {
      ts: timestamp,
      apikey: PUBLIC_KEY,
      hash,
    }
  }
  
  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const authParams = this.generateAuthParams()
    const searchParams = new URLSearchParams({ ...authParams, ...params })
    
    const response = await fetch(`${MARVEL_BASE_URL}${endpoint}?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }
  
  async getCharacters(params: {
    limit?: number
    offset?: number
    nameStartsWith?: string
    orderBy?: string
  } = {}): Promise<MarvelApiResponse<MarvelCharacter>> {
    return this.makeRequest('/characters', {
      limit: 20,
      orderBy: 'name',
      ...params,
    })
  }
  
  async getCharacter(characterId: number): Promise<MarvelApiResponse<MarvelCharacter>> {
    return this.makeRequest(`/characters/${characterId}`)
  }
  
  async getCharacterComics(characterId: number, limit = 10): Promise<any> {
    return this.makeRequest(`/characters/${characterId}/comics`, { limit })
  }
  
  async getCharacterEvents(characterId: number, limit = 10): Promise<any> {
    return this.makeRequest(`/characters/${characterId}/events`, { limit })
  }
  
  async getRandomCharacters(count = 10): Promise<MarvelCharacter[]> {
    // Get total count first
    const initialResponse = await this.getCharacters({ limit: 1 })
    const totalCharacters = initialResponse.data.total
    
    // Generate random offsets
    const characters: MarvelCharacter[] = []
    const usedOffsets = new Set<number>()
    
    while (characters.length < count && usedOffsets.size < totalCharacters) {
      const randomOffset = Math.floor(Math.random() * totalCharacters)
      
      if (!usedOffsets.has(randomOffset)) {
        usedOffsets.add(randomOffset)
        
        try {
          const response = await this.getCharacters({ limit: 1, offset: randomOffset })
          if (response.data.results.length > 0) {
            characters.push(response.data.results[0])
          }
        } catch (error) {
          console.warn('Failed to fetch character at offset', randomOffset, error)
        }
      }
    }
