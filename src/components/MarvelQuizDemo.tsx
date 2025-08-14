import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlay, FaPause, FaExpand, FaCompress, FaCode, FaChartBar, FaQuestionCircle, FaTimes, FaGithub, FaCopy, FaShare, FaVolumeUp, FaVolumeMute, FaTrophy, FaStar, FaClock, FaUser, FaGamepad } from 'react-icons/fa';
import type { DemoConfiguration, DemoState, DemoPreset, GameDemoConfig } from '../types/demo';
import { demoIntegration } from '../services/demoIntegration';
import GlassCard from './GlassCard';

interface MarvelQuizDemoProps {
  config: DemoConfiguration;
  className?: string;
  onDemoStart?: (sessionId: string) => void;
  onDemoComplete?: (sessionId: string, analytics: any) => void;
  onError?: (error: string) => void;
}

interface QuizState {
  isPlaying: boolean;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeRemaining: number;
  streak: number;
  achievements: string[];
  leaderboard: Array<{ name: string; score: number; date: string }>;
}

const MarvelQuizDemo: React.FC<MarvelQuizDemoProps> = ({
  config,
  className = '',
  onDemoStart,
  onDemoComplete,
  onError
}) => {
  const [demoState, setDemoState] = useState<DemoState | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [quizState, setQuizState] = useState<QuizState>({
    isPlaying: false,
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentDifficulty: 'medium',
    timeRemaining: 60,
    streak: 0,
    achievements: [],
    leaderboard: []
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCode, setShowCode] = useState(config.codeVisible);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<DemoPreset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const demoRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize demo session
  useEffect(() => {
    try {
      const newSessionId = demoIntegration.createDemoSession(config);
      setSessionId(newSessionId);
      setDemoState(demoIntegration.getSession(newSessionId) || null);
      setIsLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize demo';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [config, onError]);

  // Timer effect for quiz
  useEffect(() => {
    if (quizState.isPlaying && quizState.timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (quizState.timeRemaining === 0 && quizState.isPlaying) {
      endQuiz();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [quizState.isPlaying, quizState.timeRemaining]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        demoIntegration.stopDemo(sessionId);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sessionId]);

  const startQuiz = useCallback(async (preset?: DemoPreset) => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      setError(null);

      if (preset) {
        setCurrentPreset(preset);
        // Apply preset configuration to quiz
        if (preset.configuration.difficulty) {
          setQuizState(prev => ({
            ...prev,
            currentDifficulty: preset.configuration.difficulty,
            timeRemaining: preset.configuration.timeLimit || 60
          }));
        }
      }

      demoIntegration.startDemo(sessionId, preset);
      onDemoStart?.(sessionId);

      // Initialize game demo features
      demoIntegration.createGameDemo({
        difficulty: quizState.currentDifficulty,
        scoreTracking: true,
        leaderboard: true,
        achievements: true,
        tutorial: true,
        sound: soundEnabled,
        accessibility: {
          highContrast: false,
          reducedMotion: false,
          screenReader: false
        }
      });

      // Start the quiz
      setQuizState(prev => ({
        ...prev,
        isPlaying: true,
        score: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        streak: 0,
        achievements: []
      }));

      setIsLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start quiz';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsLoading(false);
    }
  }, [sessionId, quizState.currentDifficulty, soundEnabled, onDemoStart, onError]);

  const endQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isPlaying: false
    }));

    if (sessionId) {
      demoIntegration.trackInteraction(sessionId, 'quiz_complete', {
        score: quizState.score,
        questionsAnswered: quizState.questionsAnswered,
        correctAnswers: quizState.correctAnswers,
        accuracy: quizState.questionsAnswered > 0 ? (quizState.correctAnswers / quizState.questionsAnswered) * 100 : 0,
        streak: quizState.streak,
        achievements: quizState.achievements
      });

      // Update leaderboard
      const newEntry = {
        name: 'Demo Player',
        score: quizState.score,
        date: new Date().toISOString().split('T')[0]
      };

      setQuizState(prev => ({
        ...prev,
        leaderboard: [...prev.leaderboard, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10) // Keep top 10
      }));

      demoIntegration.stopDemo(sessionId);
      onDemoComplete?.(sessionId, {
        score: quizState.score,
        accuracy: quizState.questionsAnswered > 0 ? (quizState.correctAnswers / quizState.questionsAnswered) * 100 : 0,
        duration: 60 - quizState.timeRemaining
      });
    }
  }, [sessionId, quizState, onDemoComplete]);

  const answerQuestion = useCallback((isCorrect: boolean) => {
    if (!quizState.isPlaying) return;

    const newScore = quizState.score + (isCorrect ? 10 : 0);
    const newStreak = isCorrect ? quizState.streak + 1 : 0;
    const newCorrectAnswers = quizState.correctAnswers + (isCorrect ? 1 : 0);
    const newQuestionsAnswered = quizState.questionsAnswered + 1;

    // Check for achievements
    const newAchievements = [...quizState.achievements];
    if (newScore >= 100 && !newAchievements.includes('Century Club')) {
      newAchievements.push('Century Club');
    }
    if (newStreak >= 5 && !newAchievements.includes('Hot Streak')) {
      newAchievements.push('Hot Streak');
    }
    if (newCorrectAnswers >= 10 && !newAchievements.includes('Perfect 10')) {
      newAchievements.push('Perfect 10');
    }

    setQuizState(prev => ({
      ...prev,
      score: newScore,
      questionsAnswered: newQuestionsAnswered,
      correctAnswers: newCorrectAnswers,
      streak: newStreak,
      achievements: newAchievements
    }));

    if (sessionId) {
      demoIntegration.trackInteraction(sessionId, 'question_answered', {
        correct: isCorrect,
        score: newScore,
        streak: newStreak,
        achievements: newAchievements
      });
    }
  }, [quizState.isPlaying, quizState.score, quizState.streak, quizState.correctAnswers, quizState.questionsAnswered, quizState.achievements, sessionId]);

  const toggleFullscreen = useCallback(() => {
    if (!demoRef.current) return;

    if (!isFullscreen) {
      if (demoRef.current.requestFullscreen) {
        demoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const toggleCode = useCallback(() => {
    setShowCode(!showCode);
    if (sessionId) {
      demoIntegration.updateConfiguration(sessionId, { codeVisible: !showCode });
    }
  }, [showCode, sessionId]);

  const toggleAnalytics = useCallback(() => {
    setShowAnalytics(!showAnalytics);
  }, [showAnalytics]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled);
    if (sessionId) {
      demoIntegration.updateConfiguration(sessionId, { sound: !soundEnabled });
    }
  }, [soundEnabled, sessionId]);

  const startTutorial = useCallback(() => {
    setShowTutorial(true);
    if (sessionId) {
      demoIntegration.trackInteraction(sessionId, 'tutorial_started');
    }
  }, [sessionId]);

  const handlePresetChange = useCallback((preset: DemoPreset) => {
    setCurrentPreset(preset);
    startQuiz(preset);
  }, [startQuiz]);

  const copyDemoUrl = useCallback(() => {
    if (config.embedUrl) {
      navigator.clipboard.writeText(config.embedUrl);
    }
  }, [config.embedUrl]);

  const shareDemo = useCallback(() => {
    if (navigator.share && config.embedUrl) {
      navigator.share({
        title: 'Marvel Quiz Demo',
        text: `Check out my Marvel Quiz score: ${quizState.score} points!`,
        url: config.embedUrl
      });
    } else {
      copyDemoUrl();
    }
  }, [config.embedUrl, quizState.score, copyDemoUrl]);

  if (error) {
    return (
      <GlassCard className={`demo-error ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Demo Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry Demo
            </button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div ref={demoRef} className={`marvel-quiz-demo ${className}`}>
      {/* Demo Header */}
      <div className="demo-header bg-glass-dark border-b border-glass-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-white">Marvel Quiz Demo</h3>
            {currentPreset && (
              <span className="bg-glass-accent text-white px-2 py-1 rounded text-sm">
                {currentPreset.name}
              </span>
            )}
            {quizState.isPlaying && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm animate-pulse">
                LIVE
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {config.presets && config.presets.length > 0 && (
              <select
                value={currentPreset?.id || ''}
                onChange={(e) => {
                  const preset = config.presets?.find(p => p.id === e.target.value);
                  if (preset) handlePresetChange(preset);
                }}
                className="bg-glass-dark border border-glass-border text-white px-3 py-1 rounded text-sm"
                disabled={quizState.isPlaying}
              >
                <option value="">Select Difficulty</option>
                {config.presets.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            )}
            
            <button
              onClick={toggleCode}
              className={`p-2 rounded transition-colors ${showCode ? 'bg-glass-accent text-white' : 'text-gray-300 hover:text-white'}`}
              title="Toggle Code View"
            >
              <FaCode />
            </button>
            
            <button
              onClick={toggleAnalytics}
              className={`p-2 rounded transition-colors ${showAnalytics ? 'bg-glass-accent text-white' : 'text-gray-300 hover:text-white'}`}
              title="Show Analytics"
            >
              <FaChartBar />
            </button>
            
            <button
              onClick={startTutorial}
              className="p-2 rounded text-gray-300 hover:text-white transition-colors"
              title="Start Tutorial"
            >
              <FaQuestionCircle />
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Stats Bar */}
      {quizState.isPlaying && (
        <div className="quiz-stats bg-glass-dark border-b border-glass-border p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FaTrophy className="text-yellow-500" />
                <span className="text-white font-semibold">{quizState.score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaStar className="text-blue-500" />
                <span className="text-white">{quizState.streak}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUser className="text-green-500" />
                <span className="text-white">{quizState.correctAnswers}/{quizState.questionsAnswered}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-red-500" />
              <span className="text-white font-semibold">{quizState.timeRemaining}s</span>
            </div>
          </div>
        </div>
      )}

      {/* Demo Content */}
      <div className="demo-content relative">
        {isLoading && (
          <div className="absolute inset-0 bg-glass-dark bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glass-accent mx-auto mb-4"></div>
              <p className="text-white">Loading Marvel Quiz...</p>
            </div>
          </div>
        )}

        {/* Main Demo Area */}
        <div className="demo-main" style={{ height: config.height }}>
          {config.demoType === 'iframe' && config.embedUrl && (
            <iframe
              ref={iframeRef}
              src={config.embedUrl}
              className="w-full h-full border-0"
              title="Marvel Quiz Demo"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError('Failed to load Marvel Quiz');
                setIsLoading(false);
              }}
            />
          )}
          
          {/* Fallback Quiz Interface */}
          {(!config.embedUrl || config.demoType !== 'iframe') && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-glass-dark p-8">
              <div className="text-center max-w-2xl">
                <h4 className="text-2xl font-semibold mb-6 text-white">Marvel Quiz Demo</h4>
                
                {!quizState.isPlaying ? (
                  <div className="space-y-4">
                    <p className="text-gray-300 mb-6">
                      Test your Marvel Cinematic Universe knowledge with this interactive quiz!
                    </p>
                    <button
                      onClick={() => startQuiz()}
                      disabled={isLoading}
                      className="bg-glass-accent hover:bg-glass-accent-dark text-white px-8 py-4 rounded-lg transition-colors disabled:opacity-50 text-lg font-semibold"
                    >
                      <FaGamepad className="inline mr-2" />
                      Start Quiz
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-glass-card p-6 rounded-lg">
                      <h5 className="text-lg font-semibold mb-4 text-white">Sample Question</h5>
                      <p className="text-gray-300 mb-6">
                        Who played Iron Man in the Marvel Cinematic Universe?
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => answerQuestion(true)}
                          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors"
                        >
                          Robert Downey Jr.
                        </button>
                        <button
                          onClick={() => answerQuestion(false)}
                          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded transition-colors"
                        >
                          Chris Evans
                        </button>
                        <button
                          onClick={() => answerQuestion(false)}
                          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded transition-colors"
                        >
                          Chris Hemsworth
                        </button>
                        <button
                          onClick={() => answerQuestion(false)}
                          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded transition-colors"
                        >
                          Mark Ruffalo
                        </button>
                      </div>
                    </div>
                    
                    {quizState.achievements.length > 0 && (
                      <div className="bg-glass-card p-4 rounded-lg">
                        <h6 className="text-sm font-semibold mb-2 text-white">Achievements Unlocked!</h6>
                        <div className="flex flex-wrap gap-2">
                          {quizState.achievements.map(achievement => (
                            <span key={achievement} className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Code Panel */}
        {showCode && currentPreset?.code && (
          <div className="demo-code-panel bg-glass-dark border-t border-glass-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">Quiz Code</h4>
              <button
                onClick={() => navigator.clipboard.writeText(currentPreset.code!)}
                className="text-gray-300 hover:text-white transition-colors"
                title="Copy Code"
              >
                <FaCopy />
              </button>
            </div>
            <pre className="bg-black text-green-400 p-4 rounded text-sm overflow-x-auto">
              <code>{currentPreset.code}</code>
            </pre>
          </div>
        )}

        {/* Analytics Panel */}
        {showAnalytics && demoState && (
          <div className="demo-analytics-panel bg-glass-dark border-t border-glass-border p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Quiz Analytics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-300">Score:</span>
                <span className="text-white ml-2">{quizState.score}</span>
              </div>
              <div>
                <span className="text-gray-300">Accuracy:</span>
                <span className="text-white ml-2">
                  {quizState.questionsAnswered > 0 
                    ? `${Math.round((quizState.correctAnswers / quizState.questionsAnswered) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div>
                <span className="text-gray-300">Streak:</span>
                <span className="text-white ml-2">{quizState.streak}</span>
              </div>
              <div>
                <span className="text-gray-300">Time:</span>
                <span className="text-white ml-2">{60 - quizState.timeRemaining}s</span>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Panel */}
        {showLeaderboard && (
          <div className="demo-leaderboard-panel bg-glass-dark border-t border-glass-border p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Leaderboard</h4>
            <div className="space-y-2">
              {quizState.leaderboard.map((entry, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">#{index + 1} {entry.name}</span>
                  <span className="text-white font-semibold">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      {showControls && (
        <div className="demo-controls bg-glass-dark border-t border-glass-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!quizState.isPlaying ? (
                <button
                  onClick={() => startQuiz()}
                  disabled={isLoading}
                  className="bg-glass-accent hover:bg-glass-accent-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FaPlay className="inline mr-2" />
                  Start Quiz
                </button>
              ) : (
                <button
                  onClick={endQuiz}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  End Quiz
                </button>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="bg-glass-dark border border-glass-border text-white px-3 py-2 rounded transition-colors hover:bg-glass-accent"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>

              <button
                onClick={toggleSound}
                className={`p-2 rounded transition-colors ${soundEnabled ? 'text-green-400' : 'text-gray-400'}`}
                title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
              >
                {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>

              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className={`p-2 rounded transition-colors ${showLeaderboard ? 'bg-glass-accent text-white' : 'text-gray-300 hover:text-white'}`}
                title="Toggle Leaderboard"
              >
                <FaTrophy />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={copyDemoUrl}
                className="text-gray-300 hover:text-white transition-colors"
                title="Copy Demo URL"
              >
                <FaCopy />
              </button>
              
              <button
                onClick={shareDemo}
                className="text-gray-300 hover:text-white transition-colors"
                title="Share Demo"
              >
                <FaShare />
              </button>
              
              {config.githubRepo && (
                <a
                  href={config.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  title="View on GitHub"
                >
                  <FaGithub />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="tutorial-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-glass-dark border border-glass-border rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Marvel Quiz Tutorial</h3>
            <p className="text-gray-300 mb-4">
              Answer questions about the Marvel Cinematic Universe to earn points and achievements. 
              Build streaks for bonus points and compete on the leaderboard!
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowTutorial(false)}
                className="bg-glass-accent hover:bg-glass-accent-dark text-white px-4 py-2 rounded transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarvelQuizDemo;
