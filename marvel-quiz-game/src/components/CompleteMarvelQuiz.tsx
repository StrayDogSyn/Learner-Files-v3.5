import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Star, Clock, Trophy, Zap,
  Crown, Settings, User, Calendar, Target,
  Shield, Users, BookOpen, Award, TrendingUp, Home
} from 'lucide-react';

// Enhanced Marvel Character Database
interface MarvelCharacter {
  id: number;
  name: string;
  realName: string;
  powers: string[];
  firstAppearance: {
    comic: string;
    year: number;
  };
  creators: string[];
  imageUrl: string;
  facts: string[];
  category: 'hero' | 'villain' | 'antihero';
}

const marvelCharacters: MarvelCharacter[] = [
  {
    id: 1,
    name: "Spider-Man",
    realName: "Peter Benjamin Parker",
    powers: ["Spider-sense", "Wall-crawling", "Superhuman strength", "Web-shooting"],
    firstAppearance: { comic: "Amazing Fantasy #15", year: 1962 },
    creators: ["Stan Lee", "Steve Ditko"],
    imageUrl: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Spider-Man%20in%20classic%20red%20and%20blue%20costume%20web%20slinging%20through%20New%20York%20City%20skyscrapers%20dynamic%20action%20pose%20Marvel%20comic%20book%20style&image_size=portrait_4_3",
    facts: [
      "His web-shooters are mechanical devices he invented",
      "He can lift approximately 10 tons",
      "His spider-sense warns him of danger"
    ],
    category: "hero"
  },
  {
    id: 2,
    name: "Iron Man",
    realName: "Anthony Edward Stark",
    powers: ["Powered armor", "Flight", "Energy repulsors", "Enhanced strength"],
    firstAppearance: { comic: "Tales of Suspense #39", year: 1963 },
    creators: ["Stan Lee", "Larry Lieber", "Don Heck", "Jack Kirby"],
    imageUrl: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Iron%20Man%20in%20red%20and%20gold%20armor%20flying%20through%20sky%20with%20repulsors%20glowing%20heroic%20pose%20Marvel%20comic%20book%20style&image_size=portrait_4_3",
    facts: [
      "His arc reactor keeps shrapnel from reaching his heart",
      "He has created over 50 different armor suits",
      "He is a founding member of the Avengers"
    ],
    category: "hero"
  },
  {
    id: 3,
    name: "Captain America",
    realName: "Steven Grant Rogers",
    powers: ["Enhanced strength", "Enhanced speed", "Enhanced durability", "Shield mastery"],
    firstAppearance: { comic: "Captain America Comics #1", year: 1941 },
    creators: ["Joe Simon", "Jack Kirby"],
    imageUrl: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Captain%20America%20holding%20vibranium%20shield%20in%20patriotic%20red%20white%20blue%20costume%20heroic%20stance%20Marvel%20comic%20book%20style&image_size=portrait_4_3",
    facts: [
      "His shield is made of vibranium",
      "He was frozen in ice for nearly 70 years",
      "He represents the peak of human physical perfection"
    ],
    category: "hero"
  },
  {
    id: 4,
    name: "Thor",
    realName: "Thor Odinson",
    powers: ["Weather control", "Superhuman strength", "Flight", "Mjolnir mastery"],
    firstAppearance: { comic: "Journey into Mystery #83", year: 1962 },
    creators: ["Stan Lee", "Larry Lieber", "Jack Kirby"],
    imageUrl: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Thor%20Norse%20god%20holding%20Mjolnir%20hammer%20with%20lightning%20and%20cape%20flowing%20Asgardian%20armor%20Marvel%20comic%20book%20style&image_size=portrait_4_3",
    facts: [
      "Only those worthy can lift Mjolnir",
      "He is the God of Thunder from Asgard",
      "His hammer can summon lightning and storms"
    ],
    category: "hero"
  },
  {
    id: 5,
    name: "Hulk",
    realName: "Robert Bruce Banner",
    powers: ["Superhuman strength", "Invulnerability", "Regeneration", "Anger empowerment"],
    firstAppearance: { comic: "The Incredible Hulk #1", year: 1962 },
    creators: ["Stan Lee", "Jack Kirby"],
    imageUrl: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Hulk%20massive%20green%20muscular%20figure%20roaring%20with%20torn%20purple%20pants%20incredible%20strength%20Marvel%20comic%20book%20style&image_size=portrait_4_3",
    facts: [
      "His strength increases with his anger level",
      "He can leap several miles in a single bound",
      "Bruce Banner is a brilliant nuclear physicist"
    ],
    category: "hero"
  },
  {
    id: 6,
    name: "Black Widow",
    realName: "Natasha Alianovna Romanoff",
    powers: ["Enhanced conditioning", "Master spy", "Expert marksman", "Martial arts mastery"],
    firstAppearance: { comic: "Tales of Suspense #52", year: 1964 },
    creators: ["Stan Lee", "Don Rico", "Don Heck"],
    imageUrl: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Black%20Widow%20in%20black%20tactical%20suit%20with%20red%20hair%20holding%20weapons%20spy%20pose%20Marvel%20comic%20book%20style&image_size=portrait_4_3",
    facts: [
      "She was trained in the Red Room program",
      "Her 'Widow's Bite' can deliver electric shocks",
      "She has no actual superpowers, just peak human conditioning"
    ],
    category: "hero"
  },
  {
    id: 7,
    name: "Doctor Strange",
    realName: "Stephen Vincent Strange",
    powers: ["Mystic arts", "Astral projection", "Time manipulation", "Reality alteration"],
    firstAppearance: { comic: "Strange Tales #110", year: 1963 },
    creators: ["Stan Lee", "Steve Ditko"],
    imageUrl: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Doctor%20Strange%20Sorcerer%20Supreme%20with%20mystical%20energy%20and%20Eye%20of%20Agamotto%20magical%20pose%20Marvel%20comic%20book%20style&image_size=portrait_4_3",
    facts: [
      "He is the Sorcerer Supreme of Earth",
      "His hands were damaged in a car accident",
      "The Eye of Agamotto contains the Time Stone"
    ],
    category: "hero"
  },
  {
    id: 8,
    name: "Green Goblin",
    realName: "Norman Osborn",
    powers: ["Enhanced strength", "Enhanced durability", "Goblin glider", "Pumpkin bombs"],
    firstAppearance: { comic: "The Amazing Spider-Man #14", year: 1964 },
    creators: ["Stan Lee", "Steve Ditko"],
    imageUrl: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Green%20Goblin%20villain%20with%20purple%20and%20green%20costume%20on%20glider%20throwing%20pumpkin%20bombs%20menacing%20expression%20Marvel%20comic%20book%20style&image_size=portrait_4_3",
    facts: [
      "He is Spider-Man's greatest enemy",
      "His Goblin formula gave him enhanced abilities",
      "He killed Gwen Stacy, Peter Parker's first love"
    ],
    category: "villain"
  }
];

// Question Types and Quiz Engine
type QuestionType = 'identity' | 'powers' | 'realName' | 'firstAppearance' | 'creators' | 'trivia';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  character: MarvelCharacter;
  points: number;
}

class QuizEngine {
  private characters: MarvelCharacter[];
  private usedQuestions: Set<string> = new Set();
  
  constructor(characters: MarvelCharacter[]) {
    this.characters = characters;
  }
  
  generateQuestion(difficulty: DifficultyLevel = 'medium'): QuizQuestion {
    const questionTypes: QuestionType[] = ['identity', 'powers', 'realName', 'firstAppearance', 'creators', 'trivia'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const character = this.characters[Math.floor(Math.random() * this.characters.length)];
    
    const questionId = `${type}-${character.id}-${difficulty}`;
    
    // Avoid recent duplicates
    if (this.usedQuestions.has(questionId) && this.usedQuestions.size < this.characters.length * questionTypes.length) {
      return this.generateQuestion(difficulty);
    }
    
    this.usedQuestions.add(questionId);
    
    // Clear used questions if we've used too many
    if (this.usedQuestions.size > 20) {
      this.usedQuestions.clear();
    }
    
    return this.createQuestionByType(type, character, difficulty);
  }
  
  private createQuestionByType(type: QuestionType, character: MarvelCharacter, difficulty: DifficultyLevel): QuizQuestion {
    const points = { easy: 10, medium: 20, hard: 30 }[difficulty];
    
    switch (type) {
      case 'identity':
        return this.createIdentityQuestion(character, difficulty, points);
      case 'powers':
        return this.createPowersQuestion(character, difficulty, points);
      case 'realName':
        return this.createRealNameQuestion(character, difficulty, points);
      case 'firstAppearance':
        return this.createFirstAppearanceQuestion(character, difficulty, points);
      case 'creators':
        return this.createCreatorsQuestion(character, difficulty, points);
      case 'trivia':
        return this.createTriviaQuestion(character, difficulty, points);
      default:
        return this.createIdentityQuestion(character, difficulty, points);
    }
  }
  
  private createIdentityQuestion(character: MarvelCharacter, difficulty: DifficultyLevel, points: number): QuizQuestion {
    const otherCharacters = this.characters.filter(c => c.id !== character.id);
    const wrongAnswers = this.getRandomItems(otherCharacters, 3).map(c => c.name);
    const options = this.shuffleArray([character.name, ...wrongAnswers]);
    const correctAnswer = options.indexOf(character.name);
    
    return {
      id: `identity-${character.id}`,
      type: 'identity',
      difficulty,
      question: `Who is this character?`,
      options,
      correctAnswer,
      explanation: `This is ${character.name} (${character.realName}), who first appeared in ${character.firstAppearance.comic} in ${character.firstAppearance.year}.`,
      character,
      points
    };
  }
  
  private createPowersQuestion(character: MarvelCharacter, difficulty: DifficultyLevel, points: number): QuizQuestion {
    const power = character.powers[Math.floor(Math.random() * character.powers.length)];
    const otherCharacters = this.characters.filter(c => c.id !== character.id);
    const wrongAnswers = this.getRandomItems(otherCharacters, 3).map(c => c.name);
    const options = this.shuffleArray([character.name, ...wrongAnswers]);
    const correctAnswer = options.indexOf(character.name);
    
    return {
      id: `powers-${character.id}`,
      type: 'powers',
      difficulty,
      question: `Which character has the power of ${power}?`,
      options,
      correctAnswer,
      explanation: `${character.name} has ${power} among their abilities. ${character.facts[0]}`,
      character,
      points
    };
  }
  
  private createRealNameQuestion(character: MarvelCharacter, difficulty: DifficultyLevel, points: number): QuizQuestion {
    const otherCharacters = this.characters.filter(c => c.id !== character.id);
    const wrongAnswers = this.getRandomItems(otherCharacters, 3).map(c => c.realName);
    const options = this.shuffleArray([character.realName, ...wrongAnswers]);
    const correctAnswer = options.indexOf(character.realName);
    
    return {
      id: `realName-${character.id}`,
      type: 'realName',
      difficulty,
      question: `What is ${character.name}'s real name?`,
      options,
      correctAnswer,
      explanation: `${character.name}'s real name is ${character.realName}.`,
      character,
      points
    };
  }
  
  private createFirstAppearanceQuestion(character: MarvelCharacter, difficulty: DifficultyLevel, points: number): QuizQuestion {
    const otherCharacters = this.characters.filter(c => c.id !== character.id);
    const wrongYears = this.getRandomItems(otherCharacters, 3).map(c => c.firstAppearance.year.toString());
    const options = this.shuffleArray([character.firstAppearance.year.toString(), ...wrongYears]);
    const correctAnswer = options.indexOf(character.firstAppearance.year.toString());
    
    return {
      id: `firstAppearance-${character.id}`,
      type: 'firstAppearance',
      difficulty,
      question: `When did ${character.name} first appear in comics?`,
      options,
      correctAnswer,
      explanation: `${character.name} first appeared in ${character.firstAppearance.comic} in ${character.firstAppearance.year}.`,
      character,
      points
    };
  }
  
  private createCreatorsQuestion(character: MarvelCharacter, difficulty: DifficultyLevel, points: number): QuizQuestion {
    const creator = character.creators[0];
    const otherCreators = ['Jack Kirby', 'Steve Ditko', 'John Romita', 'Gene Colan', 'John Buscema']
      .filter(c => !character.creators.includes(c));
    const wrongAnswers = this.getRandomItems(otherCreators, 3);
    const options = this.shuffleArray([creator, ...wrongAnswers]);
    const correctAnswer = options.indexOf(creator);
    
    return {
      id: `creators-${character.id}`,
      type: 'creators',
      difficulty,
      question: `Who was one of the creators of ${character.name}?`,
      options,
      correctAnswer,
      explanation: `${character.name} was created by ${character.creators.join(' and ')}.`,
      character,
      points
    };
  }
  
  private createTriviaQuestion(character: MarvelCharacter, difficulty: DifficultyLevel, points: number): QuizQuestion {
    const fact = character.facts[Math.floor(Math.random() * character.facts.length)];
    const otherCharacters = this.characters.filter(c => c.id !== character.id);
    const wrongAnswers = this.getRandomItems(otherCharacters, 3).map(c => c.name);
    const options = this.shuffleArray([character.name, ...wrongAnswers]);
    const correctAnswer = options.indexOf(character.name);
    
    return {
      id: `trivia-${character.id}`,
      type: 'trivia',
      difficulty,
      question: `Which character is known for this fact: "${fact}"?`,
      options,
      correctAnswer,
      explanation: `This fact applies to ${character.name}. ${fact}`,
      character,
      points
    };
  }
  
  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Timer Component
interface TimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime, isActive }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getColor = () => {
    if (percentage > 50) return '#10B981'; // Green
    if (percentage > 25) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };
  
  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#374151"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={getColor()}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ${isActive ? 'animate-pulse' : ''}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-bold ${getColor() === '#EF4444' ? 'text-red-400' : 'text-white'}`}>
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

// Main Quiz Component
type GameState = 'menu' | 'playing' | 'finished';
type AnswerState = 'none' | 'correct' | 'incorrect' | 'timeout';

interface GameSettings {
  difficulty: DifficultyLevel;
  questionCount: number;
  timePerQuestion: number;
}

interface GameStats {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  streak: number;
  bestStreak: number;
  totalTime: number;
  averageTime: number;
}

const CompleteMarvelQuiz: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('none');
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Game settings
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'medium',
    questionCount: 8,
    timePerQuestion: 30
  });
  
  // Game statistics
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    streak: 0,
    bestStreak: 0,
    totalTime: 0,
    averageTime: 0
  });
  
  // Quiz engine
  const quizEngine = useMemo(() => new QuizEngine(marvelCharacters), []);
  
  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && gameState === 'playing' && answerState === 'none') {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && answerState === 'none') {
      handleTimeout();
    }
  }, [isTimerActive, timeLeft, gameState, answerState]);
  
  // Start new game
  const startGame = useCallback(() => {
    const question = quizEngine.generateQuestion(settings.difficulty);
    setCurrentQuestion(question);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerState('none');
    setShowExplanation(false);
    setTimeLeft(settings.timePerQuestion);
    setIsTimerActive(true);
    setGameState('playing');
    setStats({
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      streak: 0,
      bestStreak: 0,
      totalTime: 0,
      averageTime: 0
    });
  }, [quizEngine, settings]);
  
  // Handle answer selection
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (answerState !== 'none' || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setIsTimerActive(false);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeBonus = Math.max(0, Math.floor((timeLeft / settings.timePerQuestion) * 10));
    const questionTime = settings.timePerQuestion - timeLeft;
    
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    
    setStats(prev => {
      const newStats = {
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        totalTime: prev.totalTime + questionTime,
        averageTime: (prev.totalTime + questionTime) / (prev.totalQuestions + 1)
      };
      
      if (isCorrect) {
        const points = currentQuestion.points + timeBonus;
        newStats.score = prev.score + points;
        newStats.correctAnswers = prev.correctAnswers + 1;
        newStats.streak = prev.streak + 1;
        newStats.bestStreak = Math.max(prev.bestStreak, newStats.streak);
      } else {
        newStats.streak = 0;
      }
      
      return newStats;
    });
    
    setShowExplanation(true);
    
    // Auto-advance after showing explanation
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  }, [answerState, currentQuestion, timeLeft, settings.timePerQuestion]);
  
  // Handle timeout
  const handleTimeout = useCallback(() => {
    if (answerState !== 'none') return;
    
    setAnswerState('timeout');
    setIsTimerActive(false);
    
    setStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      streak: 0,
      totalTime: prev.totalTime + settings.timePerQuestion,
      averageTime: (prev.totalTime + settings.timePerQuestion) / (prev.totalQuestions + 1)
    }));
    
    setShowExplanation(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  }, [answerState, settings.timePerQuestion]);
  
  // Next question
  const nextQuestion = useCallback(() => {
    if (questionIndex + 1 >= settings.questionCount) {
      setGameState('finished');
      return;
    }
    
    const question = quizEngine.generateQuestion(settings.difficulty);
    setCurrentQuestion(question);
    setQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setAnswerState('none');
    setShowExplanation(false);
    setTimeLeft(settings.timePerQuestion);
    setIsTimerActive(true);
  }, [questionIndex, settings, quizEngine]);
  
  // Skip question
  const skipQuestion = useCallback(() => {
    if (answerState !== 'none') return;
    
    setStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      streak: 0
    }));
    
    nextQuestion();
  }, [answerState, nextQuestion]);
  
  // Get performance grade
  const getGrade = useCallback((accuracy: number) => {
    if (accuracy >= 90) return { grade: 'S', color: 'text-yellow-400', message: 'Legendary Marvel Expert!' };
    if (accuracy >= 80) return { grade: 'A', color: 'text-green-400', message: 'Excellent Marvel Knowledge!' };
    if (accuracy >= 70) return { grade: 'B', color: 'text-blue-400', message: 'Good Marvel Fan!' };
    if (accuracy >= 60) return { grade: 'C', color: 'text-orange-400', message: 'Keep Learning!' };
    return { grade: 'D', color: 'text-red-400', message: 'Study More Marvel!' };
  }, []);
  
  // Render menu
  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border border-gray-700"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Marvel Quiz</h1>
          <p className="text-gray-300">Test your Marvel knowledge!</p>
        </motion.div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select
              value={settings.difficulty}
              onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as DifficultyLevel }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy (10 pts)</option>
              <option value="medium">Medium (20 pts)</option>
              <option value="hard">Hard (30 pts)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Questions</label>
            <select
              value={settings.questionCount}
              onChange={(e) => setSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 Questions</option>
              <option value={8}>8 Questions</option>
              <option value={12}>12 Questions</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time per Question</label>
            <select
              value={settings.timePerQuestion}
              onChange={(e) => setSettings(prev => ({ ...prev, timePerQuestion: parseInt(e.target.value) }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value={20}>20 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={45}>45 seconds</option>
            </select>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Quiz
        </motion.button>
      </motion.div>
    </div>
  );
  
  // Render game
  const renderGame = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-blue-900 to-purple-900 p-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Timer timeLeft={timeLeft} totalTime={settings.timePerQuestion} isActive={isTimerActive} />
                <div>
                  <div className="text-white font-semibold">Question {questionIndex + 1} of {settings.questionCount}</div>
                  <div className="text-gray-300 text-sm">Score: {stats.score.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-white font-semibold flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Streak: {stats.streak}
                  </div>
                  <div className="text-gray-300 text-sm">Best: {stats.bestStreak}</div>
                </div>
                
                <button
                  onClick={skipQuestion}
                  disabled={answerState !== 'none'}
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((questionIndex + 1) / settings.questionCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Question */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            {/* Character Image */}
            <div className="text-center mb-6">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={currentQuestion.character.imageUrl}
                alt="Marvel Character"
                className="w-48 h-64 object-cover rounded-lg mx-auto border-4 border-gray-600 shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20silhouette%20comic%20book%20style&image_size=portrait_4_3';
                }}
              />
            </div>
            
            {/* Question Text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white text-center mb-6"
            >
              {currentQuestion.question}
            </motion.h2>
            
            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "w-full p-4 rounded-lg border-2 transition-all duration-200 text-left font-medium ";
                
                if (answerState === 'none') {
                  buttonClass += "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500";
                } else {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += "bg-green-600 border-green-500 text-white";
                  } else if (index === selectedAnswer && answerState === 'incorrect') {
                    buttonClass += "bg-red-600 border-red-500 text-white";
                  } else {
                    buttonClass += "bg-gray-700 border-gray-600 text-gray-400";
                  }
                }
                
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={answerState === 'none' ? { scale: 1.02 } : {}}
                    whileTap={answerState === 'none' ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answerState !== 'none'}
                    className={buttonClass}
                  >
                    <span className="text-lg">{String.fromCharCode(65 + index)}.</span> {option}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg border-2 ${
                    answerState === 'correct'
                      ? 'bg-green-900/50 border-green-500 text-green-100'
                      : answerState === 'incorrect'
                      ? 'bg-red-900/50 border-red-500 text-red-100'
                      : 'bg-orange-900/50 border-orange-500 text-orange-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {answerState === 'correct' && <Trophy className="w-5 h-5" />}
                    {answerState === 'incorrect' && <Target className="w-5 h-5" />}
                    {answerState === 'timeout' && <Clock className="w-5 h-5" />}
                    <span className="font-semibold">
                      {answerState === 'correct' && 'Correct!'}
                      {answerState === 'incorrect' && 'Incorrect!'}
                      {answerState === 'timeout' && 'Time\'s Up!'}
                    </span>
                    {answerState === 'correct' && (
                      <span className="text-sm">
                        +{currentQuestion.points + Math.max(0, Math.floor((timeLeft / settings.timePerQuestion) * 10))} points
                      </span>
                    )}
                  </div>
                  <p>{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };
  
  // Render results
  const renderResults = () => {
    const accuracy = stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions) * 100 : 0;
    const grade = getGrade(accuracy);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full border border-gray-700"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`text-8xl font-bold ${grade.color} mb-4`}
            >
              {grade.grade}
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">{grade.message}</h2>
            <p className="text-gray-300">Quiz Complete!</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.score.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Final Score</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{Math.round(accuracy)}%</div>
              <div className="text-sm text-gray-300">Accuracy</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.bestStreak}</div>
              <div className="text-sm text-gray-300">Best Streak</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{Math.round(stats.averageTime)}s</div>
              <div className="text-sm text-gray-300">Avg. Time</div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Performance Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Questions Answered:</span>
                <span className="text-white">{stats.correctAnswers}/{stats.totalQuestions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Total Time:</span>
                <span className="text-white">{Math.round(stats.totalTime)}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Difficulty:</span>
                <span className="text-white capitalize">{settings.difficulty}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState('menu')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Main Menu
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  };
  
  // Main render
  return (
    <div className="relative">
      {/* Particle background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
            }}
          />
        ))}
      </div>
      
      {/* Game content */}
      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderMenu()}
          </motion.div>
        )}
        
        {gameState === 'playing' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderGame()}
          </motion.div>
        )}
        
        {gameState === 'finished' && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompleteMarvelQuiz;