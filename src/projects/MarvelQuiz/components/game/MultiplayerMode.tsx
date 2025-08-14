import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Crown, 
  Clock,
  Zap,
  Trophy,
  Sword,
  Shield,
  Timer,
  Wifi,
  WifiOff,
  MessageCircle,
  Send
} from 'lucide-react';

import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

// Mock multiplayer data (in real app, this would come from Socket.io)
const mockPlayers = [
  {
    id: 'current',
    username: 'MarvelFan2024',
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20logo%20avatar%20profile%20picture%20red%20comic%20book%20style&image_size=square',
    score: 0,
    streak: 0,
    accuracy: 0,
    answered: false,
    isCurrentPlayer: true,
    powerUps: { shield: 1, boost: 1, freeze: 1 }
  },
  {
    id: '2',
    username: 'StarkGenius',
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Iron%20Man%20helmet%20avatar%20profile%20picture%20red%20gold%20metallic&image_size=square',
    score: 0,
    streak: 0,
    accuracy: 0,
    answered: false,
    isCurrentPlayer: false,
    powerUps: { shield: 1, boost: 1, freeze: 1 }
  },
  {
    id: '3',
    username: 'WebSlinger',
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Spider-Man%20mask%20avatar%20profile%20picture%20red%20blue%20web&image_size=square',
    score: 0,
    streak: 0,
    accuracy: 0,
    answered: false,
    isCurrentPlayer: false,
    powerUps: { shield: 1, boost: 1, freeze: 1 }
  },
  {
    id: '4',
    username: 'ShieldAgent',
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Captain%20America%20shield%20avatar%20profile%20picture%20blue%20red%20white&image_size=square',
    score: 0,
    streak: 0,
    accuracy: 0,
    answered: false,
    isCurrentPlayer: false,
    powerUps: { shield: 1, boost: 1, freeze: 1 }
  }
];

const mockQuestions = [
  {
    id: '1',
    question: 'What is Spider-Man\'s real name?',
    options: ['Peter Parker', 'Miles Morales', 'Ben Reilly', 'Kaine Parker'],
    correctAnswer: 0,
    difficulty: 'easy',
    timeLimit: 15
  },
  {
    id: '2',
    question: 'Which Infinity Stone is red?',
    options: ['Power Stone', 'Reality Stone', 'Soul Stone', 'Mind Stone'],
    correctAnswer: 1,
    difficulty: 'medium',
    timeLimit: 20
  },
  {
    id: '3',
    question: 'What is the name of Thor\'s hammer?',
    options: ['Stormbreaker', 'Gungnir', 'Mjolnir', 'Gram'],
    correctAnswer: 2,
    difficulty: 'easy',
    timeLimit: 15
  }
];

const mockChatMessages = [
  { id: '1', username: 'StarkGenius', message: 'Good luck everyone! 🚀', timestamp: Date.now() - 30000 },
  { id: '2', username: 'WebSlinger', message: 'May the best hero win! 🕷️', timestamp: Date.now() - 20000 },
  { id: '3', username: 'ShieldAgent', message: 'I can do this all day! 🛡️', timestamp: Date.now() - 10000 }
];

interface MultiplayerModeProps {
  onGameEnd: (results: any) => void;
  roomId: string;
}

export function MultiplayerMode({ onGameEnd, roomId }: MultiplayerModeProps) {
  const [players, setPlayers] = useState(mockPlayers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'results'>('playing');
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [isConnected] = useState(true);
  const [chatMessages, setChatMessages] = useState(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState<{[key: string]: string}>({});
  const [frozenPlayers, setFrozenPlayers] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const currentQuestion = mockQuestions[currentQuestionIndex % mockQuestions.length];
  const currentPlayer = players.find(p => p.isCurrentPlayer)!;
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gamePhase === 'playing') {
      handleTimeOut();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gamePhase]);
  
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || frozenPlayers.includes('current')) return;
    
    setSelectedAnswer(answerIndex);
    
    // Update current player as answered
    setPlayers(prev => prev.map(p => 
      p.isCurrentPlayer ? { ...p, answered: true } : p
    ));
    
    // Simulate other players answering
    setTimeout(() => {
      setPlayers(prev => prev.map(p => ({ ...p, answered: Math.random() > 0.3 })));
      setShowResult(true);
      
      // Calculate results
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      
      if (isCorrect) {
        const points = Math.max(100, (timeLeft * 10) + (currentPlayer.streak * 50));
        setPlayers(prev => prev.map(p => 
          p.isCurrentPlayer ? {
            ...p,
            score: p.score + points,
            streak: p.streak + 1,
            accuracy: ((p.accuracy * (round - 1)) + 100) / round
          } : {
            ...p,
            score: p.score + Math.floor(Math.random() * 200),
            streak: Math.random() > 0.5 ? p.streak + 1 : 0,
            accuracy: Math.random() * 100
          }
        ));
      } else {
        setPlayers(prev => prev.map(p => 
          p.isCurrentPlayer ? {
            ...p,
            streak: 0,
            accuracy: ((p.accuracy * (round - 1)) + 0) / round
          } : {
            ...p,
            score: p.score + Math.floor(Math.random() * 200),
            streak: Math.random() > 0.5 ? p.streak + 1 : 0,
            accuracy: Math.random() * 100
          }
        ));
      }
      
      // Move to next question after delay
      setTimeout(() => {
        if (round >= totalRounds) {
          endGame();
        } else {
          nextRound();
        }
      }, 3000);
    }, 1000 + Math.random() * 2000);
  };
  
  const handleTimeOut = () => {
    setPlayers(prev => prev.map(p => 
      p.isCurrentPlayer ? { ...p, answered: true, streak: 0 } : p
    ));
    setShowResult(true);
    
    setTimeout(() => {
      if (round >= totalRounds) {
        endGame();
      } else {
        nextRound();
      }
    }, 3000);
  };
  
  const nextRound = () => {
    setRound(prev => prev + 1);
    setCurrentQuestionIndex(prev => prev + 1);
    setTimeLeft(mockQuestions[(currentQuestionIndex + 1) % mockQuestions.length].timeLimit);
    setSelectedAnswer(null);
    setShowResult(false);
    setPlayers(prev => prev.map(p => ({ ...p, answered: false })));
    setFrozenPlayers([]);
  };
  
  const endGame = () => {
    setGamePhase('results');
    
    const finalResults = {
      mode: 'multiplayer',
      roomId,
      players: sortedPlayers,
      currentPlayerRank: sortedPlayers.findIndex(p => p.isCurrentPlayer) + 1,
      totalPlayers: players.length,
      rounds: totalRounds
    };
    
    onGameEnd(finalResults);
  };
  
  const usePowerUp = (type: string, targetPlayerId?: string) => {
    if (currentPlayer.powerUps[type as keyof typeof currentPlayer.powerUps] <= 0) return;
    
    setPlayers(prev => prev.map(p => 
      p.isCurrentPlayer ? {
        ...p,
        powerUps: { ...p.powerUps, [type]: p.powerUps[type as keyof typeof p.powerUps] - 1 }
      } : p
    ));
    
    switch (type) {
      case 'shield':
        setActivePowerUps(prev => ({ ...prev, current: 'shield' }));
        setTimeout(() => {
          setActivePowerUps(prev => {
            const { current, ...rest } = prev;
            return rest;
          });
        }, 10000);
        break;
      case 'boost':
        setTimeLeft(prev => Math.min(prev + 5, currentQuestion.timeLimit));
        break;
      case 'freeze':
        if (targetPlayerId) {
          setFrozenPlayers(prev => [...prev, targetPlayerId]);
          setTimeout(() => {
            setFrozenPlayers(prev => prev.filter(id => id !== targetPlayerId));
          }, 5000);
        }
        break;
    }
  };
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      username: currentPlayer.username,
      message: newMessage,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };
  
  if (gamePhase === 'results') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Game Complete!</h2>
          <p className="text-gray-400">Final Rankings</p>
        </div>
        
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <GlassPanel key={player.id} className={cn(
              "p-4",
              player.isCurrentPlayer && "bg-blue-500/20 border-blue-400/50"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-yellow-400">#{index + 1}</div>
                  <img
                    src={player.avatar}
                    alt={player.username}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20avatar%20profile%20picture&image_size=square';
                    }}
                  />
                  <div>
                    <div className="font-bold text-white">{player.username}</div>
                    <div className="text-sm text-gray-400">{Math.round(player.accuracy)}% accuracy</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-yellow-400">{player.score.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Max streak: {player.streak}</div>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Game Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Multiplayer Battle</h2>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
            isConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <p className="text-gray-400">Round {round} of {totalRounds}</p>
      </motion.div>
      
      {/* Players Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassPanel className="p-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Live Rankings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-300",
                  player.isCurrentPlayer 
                    ? "bg-blue-500/20 border-blue-400/50" 
                    : "bg-white/5 border-white/10",
                  player.answered && "ring-2 ring-green-400/50",
                  frozenPlayers.includes(player.id) && "ring-2 ring-blue-400/50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative">
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20avatar%20profile%20picture&image_size=square';
                      }}
                    />
                    {index === 0 && (
                      <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                    )}
                    {player.answered && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {frozenPlayers.includes(player.id) && (
                      <div className="absolute inset-0 bg-blue-500/50 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">❄️</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{player.username}</div>
                    <div className="text-xs text-gray-400">#{index + 1}</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className="text-yellow-400 font-bold">{player.score.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Streak:</span>
                    <span className="text-orange-400">{player.streak}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>
      
      {/* Power-Ups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassPanel className="p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Power-Ups
            {activePowerUps.current && (
              <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs text-blue-400">
                {activePowerUps.current.toUpperCase()} ACTIVE
              </span>
            )}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <GlassButton
              onClick={() => usePowerUp('shield')}
              disabled={currentPlayer.powerUps.shield <= 0}
              className={cn(
                "p-3 text-center",
                currentPlayer.powerUps.shield > 0 ? "hover:bg-blue-500/30" : "opacity-50 cursor-not-allowed"
              )}
            >
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className="text-sm text-white">Shield</div>
              <div className="text-xs text-gray-400">({currentPlayer.powerUps.shield})</div>
            </GlassButton>
            
            <GlassButton
              onClick={() => usePowerUp('boost')}
              disabled={currentPlayer.powerUps.boost <= 0}
              className={cn(
                "p-3 text-center",
                currentPlayer.powerUps.boost > 0 ? "hover:bg-green-500/30" : "opacity-50 cursor-not-allowed"
              )}
            >
              <Timer className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <div className="text-sm text-white">Time Boost</div>
              <div className="text-xs text-gray-400">({currentPlayer.powerUps.boost})</div>
            </GlassButton>
            
            <GlassButton
              onClick={() => {
                // In real app, this would show a player selection modal
                const targetPlayer = players.find(p => !p.isCurrentPlayer && !p.answered);
                if (targetPlayer) usePowerUp('freeze', targetPlayer.id);
              }}
              disabled={currentPlayer.powerUps.freeze <= 0}
              className={cn(
                "p-3 text-center",
                currentPlayer.powerUps.freeze > 0 ? "hover:bg-purple-500/30" : "opacity-50 cursor-not-allowed"
              )}
            >
              <Sword className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <div className="text-sm text-white">Freeze</div>
              <div className="text-xs text-gray-400">({currentPlayer.powerUps.freeze})</div>
            </GlassButton>
          </div>
        </GlassPanel>
      </motion.div>
      
      {/* Current Question */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassPanel className="p-6">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-bold",
                currentQuestion.difficulty === 'easy' ? "bg-green-500/20 text-green-400" :
                currentQuestion.difficulty === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              )}>
                {currentQuestion.difficulty.toUpperCase()}
              </div>
              <div className="text-sm text-gray-400">
                Round {round} of {totalRounds}
              </div>
            </div>
            
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-lg font-bold",
              timeLeft <= 5 ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
            )}>
              <Clock className="w-5 h-5" />
              {timeLeft}s
            </div>
          </div>
          
          {/* Question */}
          <h3 className="text-xl font-bold text-white mb-6">{currentQuestion.question}</h3>
          
          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showIncorrect = showResult && isSelected && !isCorrect;
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: selectedAnswer === null && !frozenPlayers.includes('current') ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GlassButton
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null || frozenPlayers.includes('current')}
                    className={cn(
                      "w-full p-4 text-left transition-all duration-300",
                      showCorrect && "bg-green-500/30 border-green-400",
                      showIncorrect && "bg-red-500/30 border-red-400",
                      !showResult && "hover:bg-white/10",
                      selectedAnswer === null && !frozenPlayers.includes('current') && "cursor-pointer",
                      frozenPlayers.includes('current') && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{option}</span>
                      {showCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✓</span>
                        </motion.div>
                      )}
                      {showIncorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✗</span>
                        </motion.div>
                      )}
                    </div>
                  </GlassButton>
                </motion.div>
              );
            })}
          </div>
          
          {/* Result Feedback */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-center"
              >
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <div className="text-green-400">
                    <div className="text-lg font-bold">Correct! 🎉</div>
                    <div className="text-sm">Great job! Moving to next round...</div>
                  </div>
                ) : selectedAnswer !== null ? (
                  <div className="text-red-400">
                    <div className="text-lg font-bold">Incorrect 😞</div>
                    <div className="text-sm text-gray-400">
                      Correct answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                    </div>
                  </div>
                ) : (
                  <div className="text-yellow-400">
                    <div className="text-lg font-bold">Time's Up! ⏰</div>
                    <div className="text-sm text-gray-400">
                      Correct answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassPanel>
      </motion.div>
      
      {/* Chat Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <GlassButton
          onClick={() => setShowChat(!showChat)}
          className="p-3 bg-purple-500/30 hover:bg-purple-500/40"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </GlassButton>
        
        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-80"
            >
              <GlassPanel className="p-4">
                <h3 className="text-lg font-bold text-white mb-3">Chat</h3>
                <div
                  ref={chatRef}
                  className="h-40 overflow-y-auto mb-3 space-y-2"
                >
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <span className="font-bold text-blue-400">{msg.username}:</span>
                      <span className="text-gray-300 ml-2">{msg.message}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none text-sm"
                  />
                  <GlassButton
                    onClick={sendMessage}
                    className="p-2 hover:bg-blue-500/30"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </GlassButton>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default MultiplayerMode;