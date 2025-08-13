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
    
    return characters
  }
}

export const marvelApi = new MarvelApiService()
export type { MarvelCharacter, MarvelApiResponse }
```

### 2.3 Question Generation Service
```typescript
// src/services/questionGenerator.ts
import { marvelApi, type MarvelCharacter } from './marvelApi'
import type { Question } from '../store/gameStore'

interface QuestionTemplate {
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  template: string
  generateOptions: (character: MarvelCharacter, allCharacters: MarvelCharacter[]) => Record<string, string>
  getCorrectAnswer: (character: MarvelCharacter) => string
  getExplanation: (character: MarvelCharacter) => string
}

const questionTemplates: QuestionTemplate[] = [
  {
    category: 'Origins',
    difficulty: 'easy',
    template: 'What is the real name of {characterName}?',
    generateOptions: (character, others) => {
      const options = [character.name]
      const otherNames = others.slice(0, 3).map(c => c.name)
      return {
        A: options[0],
        B: otherNames[0] || 'Unknown Hero',
        C: otherNames[1] || 'Secret Identity',
        D: otherNames[2] || 'Classified',
      }
    },
    getCorrectAnswer: () => 'A',
    getExplanation: (character) => `${character.name} is the correct answer. ${character.description || 'A legendary Marvel character.'}`
  },
  {
    category: 'Powers',
    difficulty: 'medium',
    template: 'Which of these best describes {characterName}?',
    generateOptions: (character, others) => {
      const description = character.description || 'A mysterious Marvel character'
      const otherDescriptions = others.slice(0, 3).map(c => 
        c.description?.substring(0, 50) + '...' || 'Unknown abilities'
      )
      
      return {
        A: description.substring(0, 50) + '...',
        B: otherDescriptions[0],
        C: otherDescriptions[1],
        D: otherDescriptions[2],
      }
    },
    getCorrectAnswer: () => 'A',
    getExplanation: (character) => `${character.description || 'This character has unique abilities in the Marvel universe.'}`
  },
  {
    category: 'Comics',
    difficulty: 'hard',
    template: 'How many comics has {characterName} appeared in?',
    generateOptions: (character) => {
      const actualCount = character.comics.available
      const options = [
        actualCount,
        Math.max(0, actualCount - 10),
        actualCount + 15,
        actualCount + 30,
      ].sort(() => Math.random() - 0.5)
      
      return {
        A: options[0].toString(),
        B: options[1].toString(),
        C: options[2].toString(),
        D: options[3].toString(),
      }
    },
    getCorrectAnswer: (character) => {
      const actualCount = character.comics.available
      // Find which option matches the actual count
      return 'A' // Simplified for demo
    },
    getExplanation: (character) => `${character.name} has appeared in ${character.comics.available} comics according to Marvel's database.`
  },
]

class QuestionGeneratorService {
  private usedCharacters = new Set<number>()
  private questionCache = new Map<string, Question[]>()
  
  async generateQuestions(
    count: number, 
    difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium',
    category?: string
  ): Promise<Question[]> {
    const cacheKey = `${count}-${difficulty}-${category || 'all'}`
    
    if (this.questionCache.has(cacheKey)) {
      return this.questionCache.get(cacheKey)!
    }
    
    try {
      // Fetch random characters
      const characters = await marvelApi.getRandomCharacters(count * 2)
      const questions: Question[] = []
      
      // Filter available templates
      const availableTemplates = questionTemplates.filter(template => 
        template.difficulty === difficulty && 
        (!category || template.category === category)
      )
      
      if (availableTemplates.length === 0) {
        throw new Error(`No templates available for difficulty: ${difficulty}, category: ${category}`)
      }
      
      for (let i = 0; i < count && i < characters.length; i++) {
        const character = characters[i]
        
        if (this.usedCharacters.has(character.id)) continue
        
        const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
        const otherCharacters = characters.filter(c => c.id !== character.id)
        
        const question: Question = {
          id: crypto.randomUUID(),
          characterId: character.id,
          category: template.category,
          difficulty: template.difficulty,
          questionText: template.template.replace('{characterName}', character.name),
          options: template.generateOptions(character, otherCharacters),
          correctAnswer: template.getCorrectAnswer(character),
          explanation: template.getExplanation(character),
        }
        
        questions.push(question)
        this.usedCharacters.add(character.id)
      }
      
      this.questionCache.set(cacheKey, questions)
      return questions
      
    } catch (error) {
      console.error('Failed to generate questions:', error)
      throw new Error('Failed to generate questions. Please try again.')
    }
  }
  
  async generateAdaptiveQuestion(
    playerStats: {
      accuracy: number
      averageTime: number
      streak: number
    }
  ): Promise<Question> {
    // Adaptive difficulty based on player performance
    let difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium'
    
    if (playerStats.accuracy > 0.8 && playerStats.streak > 5) {
      difficulty = 'hard'
    } else if (playerStats.accuracy > 0.9 && playerStats.streak > 10) {
      difficulty = 'expert'
    } else if (playerStats.accuracy < 0.5) {
      difficulty = 'easy'
    }
    
    const questions = await this.generateQuestions(1, difficulty)
    return questions[0]
  }
  
  clearCache() {
    this.questionCache.clear()
    this.usedCharacters.clear()
  }
}

export const questionGenerator = new QuestionGeneratorService()
```

## 3. Core Components

### 3.1 Glassmorphic UI Components
```typescript
// src/components/ui/GlassPanel.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  animated?: boolean
  onClick?: () => void
}

const variantStyles = {
  default: 'border-white/20',
  success: 'border-green-400/30 bg-green-400/5',
  error: 'border-red-400/30 bg-red-400/5',
  warning: 'border-yellow-400/30 bg-yellow-400/5',
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  variant = 'default',
  animated = true,
  onClick,
}) => {
  const Component = animated ? motion.div : 'div'
  
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { duration: 0.3, ease: 'easeOut' },
    whileHover: onClick ? { scale: 1.02, y: -2 } : undefined,
    whileTap: onClick ? { scale: 0.98 } : undefined,
  } : {}
  
  return (
    <Component
      className={cn(
        'glass-panel rounded-xl p-6',
        variantStyles[variant],
        onClick && 'cursor-pointer transition-all duration-300 hover:bg-white/10',
        className
      )}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </Component>
  )
}
```

```typescript
// src/components/ui/GlassButton.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface GlassButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}

const variantStyles = {
  primary: 'bg-electric-blue/20 border-electric-blue/40 text-electric-blue hover:bg-electric-blue/30',
  secondary: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
  success: 'bg-green-400/20 border-green-400/40 text-green-400 hover:bg-green-400/30',
  danger: 'bg-red-400/20 border-red-400/40 text-red-400 hover:bg-red-400/30',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
}) => {
  return (
    <motion.button
      className={cn(
        'glass-button rounded-lg font-medium transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-electric-blue/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  )
}
```

### 3.2 Game Arena Component
```typescript
// src/components/game/GameArena.tsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { GlassPanel } from '../ui/GlassPanel'
import { GlassButton } from '../ui/GlassButton'
import { QuestionDisplay } from './QuestionDisplay'
import { ScoreDisplay } from './ScoreDisplay'
import { TimerComponent } from './TimerComponent'
import { AnswerFeedback } from './AnswerFeedback'
import { questionGenerator } from '../../services/questionGenerator'

export const GameArena: React.FC = () => {
  const {
    currentSession,
    isGameActive,
    isPaused,
    submitAnswer,
    endGame,
    setError,
    setLoading,
  } = useGameStore()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  
  // Load questions when game starts
  useEffect(() => {
    if (isGameActive && currentSession && currentSession.questions.length === 0) {
      loadQuestions()
    }
  }, [isGameActive, currentSession])
  
  // Start timer for current question
  useEffect(() => {
    if (isGameActive && !isPaused && !showFeedback) {
      setStartTime(Date.now())
    }
  }, [currentQuestionIndex, isGameActive, isPaused, showFeedback])
  
  const loadQuestions = async () => {
    if (!currentSession) return
    
    setLoading(true)
    try {
      const questions = await questionGenerator.generateQuestions(
        getQuestionCount(currentSession.mode),
        currentSession.difficulty as any
      )
      
      // Update session with questions
      useGameStore.setState({
        currentSession: {
          ...currentSession,
          questions,
          currentQuestion: questions[0],
        }
      })
    } catch (error) {
      setError('Failed to load questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const getQuestionCount = (mode: string): number => {
    switch (mode) {
      case 'blitz': return 20
      case 'story': return 15
      case 'survival': return 50
      default: return 10
    }
  }
  
  const handleAnswerSelect = (answer: string) => {
    if (showFeedback || !isGameActive) return
    
    const currentTime = Date.now()
    const questionTime = currentTime - startTime
    
    setSelectedAnswer(answer)
    setTimeSpent(questionTime)
    setShowFeedback(true)
    
    // Submit answer to store
    submitAnswer(answer, questionTime)
    
    // Show feedback for 2 seconds, then move to next question
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }
  
  const nextQuestion = () => {
    if (!currentSession) return
    
    const nextIndex = currentQuestionIndex + 1
    
    if (nextIndex >= currentSession.questions.length) {
      // Game completed
      endGame()
      return
    }
    
    // Move to next question
    setCurrentQuestionIndex(nextIndex)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimeSpent(0)
    
    // Update current question in store
    useGameStore.setState({
      currentSession: {
        ...currentSession,
        currentQuestion: currentSession.questions[nextIndex],
      }
    })
  }
  
  if (!isGameActive || !currentSession?.currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassPanel className="text-center">
          <h2 className="text-2xl font-orbitron text-white mb-4">Loading Game...</h2>
          <motion.div
            className="w-12 h-12 border-4 border-electric-blue border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </GlassPanel>
      </div>
    )
  }
  
  const currentQuestion = currentSession.currentQuestion
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-cosmic-purple/20 to-deep-space p-4">
      {/* Background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-electric-blue rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Game UI */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <ScoreDisplay />
          <TimerComponent 
            timeLimit={getTimeLimit(currentSession.mode)}
            onTimeUp={() => handleAnswerSelect('')}
            paused={isPaused || showFeedback}
          />
        </div>
        
        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100, rotateY: -90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 90 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <QuestionDisplay
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              disabled={showFeedback}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={currentSession.questions.length}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Answer Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <AnswerFeedback
              isCorrect={isCorrect}
              explanation={currentQuestion.explanation}
              timeSpent={timeSpent}
              score={currentSession.score}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const getTimeLimit = (mode: string): number => {
  switch (mode) {
    case 'blitz': return 15
    case 'story': return 30
    case 'survival': return 25
    default: return 30
  }
}
```

## 4. Animation System

### 4.1 Answer Feedback Animations
```typescript
// src/components/game/AnswerFeedback.tsx
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassPanel } from '../ui/GlassPanel'

interface AnswerFeedbackProps {
  isCorrect: boolean
  explanation: string
  timeSpent: number
  score: number
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isCorrect,
  explanation,
  timeSpent,
  score,
}) => {
  // Screen shake effect for wrong answers
  useEffect(() => {
    if (!isCorrect) {
      document.body.style.animation = 'shake 0.5s ease-in-out'
      setTimeout(() => {
        document.body.style.animation = ''
      }, 500)
    }
  }, [isCorrect])
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlassPanel
        variant={isCorrect ? 'success' : 'error'}
        className="max-w-md mx-4 text-center"
      >
        {/* Correct Answer Animation */}
        {isCorrect ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {/* Repulsor Blast Effect */}
            <motion.div
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-arc-gold to-electric-blue"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 20px rgba(255, 215, 0, 0.5)',
                  '0 0 40px rgba(255, 215, 0, 0.8)',
                  '0 0 20px rgba(255, 215, 0, 0.5)',
                ],
              }}
              transition={{ duration: 0.5, repeat: 1 }}
            >
              <div className="w-full h-full flex items-center justify-center text-4xl">⚡</div>
            </motion.div>
            
            <motion.h2
              className="text-2xl font-orbitron text-green-400 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Correct!
            </motion.h2>
            
            <motion.div
              className="text-arc-gold text-lg font-bold mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              +{score} Points
            </motion.div>
          </motion.div>
        ) : (
          /* Incorrect Answer Animation */
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: [1, 0.5, 1],
              filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
            }}
            transition={{ duration: 1 }}
          >
            {/* Thanos Snap Effect */}
            <motion.div
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-energy-red to-cosmic-purple"
              animate={{
                scale: [1, 0.8, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 1 }}
            >
              <div className="w-full h-full flex items-center justify-center text-4xl">💥</div>
            </motion.div>
            
            <motion.h2
              className="text-2xl font-orbitron text-red-400 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Incorrect
            </motion.h2>
          </motion.div>
        )}
        
        {/* Explanation */}
        <motion.p
          className="text-white/80 text-sm mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {explanation}
        </motion.p>
        
        {/* Time Display */}
        <motion.div
          className="text-electric-blue text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Time: {(timeSpent / 1000).toFixed(1)}s
        </motion.div>
      </GlassPanel>
      
      {/* Particle Effects */}
      {isCorrect && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-arc-gold rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: [1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Add shake animation to global CSS
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   25% { transform: translateX(-5px); }
//   75% { transform: translateX(5px); }
// }
```

## 5. Deployment Configuration

### 5.1 Vercel Configuration
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_MARVEL_API_BASE_URL": "https://gateway.marvel.com/v1/public",
    "VITE_MARVEL_PUBLIC_KEY": "@marvel_public_key",
    "VITE_API_BASE_URL": "@api_base_url",
    "VITE_WEBSOCKET_URL": "@websocket_url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 5.2 Package.json Scripts
```json
{
  "name": "marvel-quiz-game",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "analyze": "npx vite-bundle-analyzer"
  }
}
```

This implementation guide provides a solid foundation for building the Marvel Quiz Game with all the specified features. The next steps would be to implement the remaining components (Character Gallery, Leaderboards, Multiplayer system) and integrate the backend services.