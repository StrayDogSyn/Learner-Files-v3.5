import React, { useState } from 'react';
import { FiExternalLink, FiGithub, FiPlay, FiInfo } from 'react-icons/fi';
import { SiReact, SiTypescript, SiTailwindcss } from 'react-icons/si';
import GlassCard from './GlassCard';

export const MarvelQuizShowcase: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [demoScore, setDemoScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  // Simulate a mini quiz demo
  const simulateQuiz = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setShowDemo(true);
    setDemoScore(0);
    setCurrentQuestion(0);
    
    let score = 0;
    let questionCount = 0;
    
    const interval = setInterval(() => {
      score += Math.floor(Math.random() * 250) + 100;
      questionCount += 1;
      setDemoScore(score);
      setCurrentQuestion(questionCount);
      
      if (questionCount >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlaying(false);
          setShowDemo(false);
        }, 2000);
      }
    }, 1500);
  };

  const techStack = [
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' }
  ];

  const features = [
    'Dynamic question generation from Marvel API',
    'Progressive difficulty system',
    'Real-time score tracking',
    'Responsive design for all devices',
    'Local storage for high scores',
    'Animated UI transitions'
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <GlassCard className="overflow-hidden">
        <div 
          className="relative p-8 bg-gradient-to-br from-red-900/20 via-red-800/20 to-yellow-700/20 border border-red-500/30"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-6xl text-red-500">⚡</div>
            <div className="absolute bottom-4 left-4 text-4xl text-yellow-500">🛡️</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-red-600/20">🦸</div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-red-500">🎮</span>
                  Marvel Quiz Game
                  <span className="text-yellow-500 text-sm bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-500/30">
                    FEATURED
                  </span>
                </h3>
                <p className="text-gray-300 text-lg">
                  Interactive MCU trivia game with dynamic difficulty scaling and real-time scoring
                </p>
              </div>
              
              <div className="flex gap-3">
                <a 
                  href="https://marvel-quiz-straydogsyn.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <FiExternalLink className="w-5 h-5" />
                  <span className="hidden sm:inline">Play Live</span>
                </a>
                <a 
                  href="https://github.com/StrayDogSyn/marvel-quiz-game" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <FiGithub className="w-5 h-5" />
                  <span className="hidden sm:inline">Code</span>
                </a>
              </div>
            </div>

            {/* Demo Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Interactive Demo */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FiPlay className="text-red-500" />
                  Interactive Demo
                </h4>
                
                <div className="bg-black/30 rounded-lg p-6 border border-red-500/30">
                  {!showDemo ? (
                    <div className="text-center">
                      <button
                        onClick={simulateQuiz}
                        disabled={isPlaying}
                        className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPlaying ? 'Playing...' : 'Start Demo Quiz'}
                      </button>
                      <p className="text-gray-400 mt-2 text-sm">
                        Experience the quiz gameplay
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-2xl font-bold text-yellow-400">
                        Question {currentQuestion}/5
                      </div>
                      <div className="text-4xl font-bold text-red-400">
                        Score: {demoScore.toLocaleString()}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(currentQuestion / 5) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-gray-300 animate-pulse">
                        {isPlaying ? 'Answering questions...' : 'Demo Complete!'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FiInfo className="text-yellow-500" />
                  Tech Stack
                </h4>
                
                <div className="grid grid-cols-1 gap-3">
                  {techStack.map((tech, index) => {
                    const IconComponent = tech.icon;
                    return (
                      <div 
                        key={tech.name}
                        className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
                        style={{
                          animationDelay: `${index * 150}ms`
                        }}
                      >
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: tech.color }}
                        />
                        <span className="text-white font-medium">{tech.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white">Key Features</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-2 p-3 bg-black/20 rounded-lg border border-gray-600/30 hover:border-red-500/30 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <span className="text-red-500 mt-1">✓</span>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hover Effect */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br from-red-500/10 to-yellow-500/10 transition-opacity duration-300 pointer-events-none ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default MarvelQuizShowcase;