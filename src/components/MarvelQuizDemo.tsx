import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaCode,
  FaChartBar,
  FaQuestionCircle,
  FaTimes,
  FaGithub,
  FaCopy,
  FaShare,
  FaVolumeUp,
  FaVolumeMute,
  FaTrophy,
  FaStar,
  FaClock,
  FaUser,
  FaGamepad,
} from 'react-icons/fa';
import type { DemoConfiguration, DemoState, DemoPreset, GameDemoConfig } from '../types/demo';
// Demo integration service temporarily removed
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
  onError,
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
    leaderboard: [],
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
      const newSessionId = 'demo-session-' + Date.now();
      setSessionId(newSessionId);
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
          timeRemaining: prev.timeRemaining - 1,
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sessionId]);

  const startQuiz = useCallback(
    async (preset?: DemoPreset) => {
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
              timeRemaining: preset.configuration.timeLimit || 60,
            }));
          }
        }

        onDemoStart?.(sessionId);

        // Start the quiz
        setQuizState(prev => ({
          ...prev,
          isPlaying: true,
          score: 0,
          questionsAnswered: 0,
          correctAnswers: 0,
          streak: 0,
          achievements: [],
        }));

        setIsLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to start quiz';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsLoading(false);
      }
    },
    [sessionId, onDemoStart, onError]
  );

  const endQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isPlaying: false,
    }));

    if (sessionId) {
      const analytics = {
        score: quizState.score,
        questionsAnswered: quizState.questionsAnswered,
        correctAnswers: quizState.correctAnswers,
        accuracy:
          quizState.questionsAnswered > 0
            ? (quizState.correctAnswers / quizState.questionsAnswered) * 100
            : 0,
        difficulty: quizState.currentDifficulty,
        streak: quizState.streak,
        achievements: quizState.achievements,
      };
      onDemoComplete?.(sessionId, analytics);
    }
  }, [sessionId, quizState, onDemoComplete]);

  const pauseQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const resumeQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isPlaying: true,
    }));
  }, []);

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

  const copyDemoCode = useCallback(() => {
    const codeSnippet = `
// Marvel Quiz Demo Integration
import { MarvelQuizDemo } from './components/MarvelQuizDemo';

const config = {
  demoType: 'interactive',
  difficulty: '${quizState.currentDifficulty}',
  timeLimit: ${quizState.timeRemaining},
  features: ['scoring', 'leaderboard', 'achievements']
};

<MarvelQuizDemo 
  config={config}
  onDemoStart={(sessionId) => console.log('Quiz started:', sessionId)}
  onDemoComplete={(sessionId, analytics) => console.log('Quiz completed:', analytics)}
/>
    `;
    navigator.clipboard.writeText(codeSnippet);
  }, [quizState]);

  if (error) {
    return (
      <GlassCard className={`demo-container error ${className}`}>
        <div className="text-center p-8">
          <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Demo Error</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-glass-accent text-white rounded-lg hover:bg-opacity-80 transition-all"
          >
            Reload Demo
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <div ref={demoRef} className={`demo-container ${className} ${isFullscreen ? 'fullscreen' : ''}`}>
      <GlassCard className="demo-wrapper">
        {/* Demo Header */}
        <div className="demo-header flex items-center justify-between p-4 border-b border-glass-border">
          <div className="demo-title flex items-center gap-3">
            <FaGamepad className="text-glass-accent text-xl" />
            <h3 className="text-lg font-semibold text-white">Marvel Quiz Demo</h3>
            <span className="px-2 py-1 bg-glass-accent bg-opacity-20 text-glass-accent text-xs rounded-full">
              {quizState.currentDifficulty}
            </span>
          </div>

          <div className="demo-controls flex items-center gap-2">
            {/* Quiz Stats */}
            <div className="stats flex items-center gap-4 text-sm text-gray-300 mr-4">
              <div className="flex items-center gap-1">
                <FaTrophy className="text-yellow-500" />
                <span>{quizState.score}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock className="text-blue-500" />
                <span>{quizState.timeRemaining}s</span>
              </div>
              <div className="flex items-center gap-1">
                <FaStar className="text-purple-500" />
                <span>{quizState.streak}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <button
              onClick={quizState.isPlaying ? pauseQuiz : () => startQuiz()}
              className="p-2 bg-glass-accent text-white rounded-lg hover:bg-opacity-80 transition-all"
              disabled={isLoading}
            >
              {quizState.isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-all ${
                soundEnabled ? 'bg-glass-accent text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>

            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-2 rounded-lg transition-all ${
                showAnalytics ? 'bg-glass-accent text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              <FaChartBar />
            </button>

            <button
              onClick={() => setShowCode(!showCode)}
              className={`p-2 rounded-lg transition-all ${
                showCode ? 'bg-glass-accent text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              <FaCode />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 transition-all"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>

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
          <div className="demo-main" style={{ height: config.height || '400px' }}>
            {config.demoType === 'iframe' && config.embedUrl ? (
              <iframe
                ref={iframeRef}
                src={config.embedUrl}
                className="w-full h-full border-0"
                title="Marvel Quiz Demo"
              />
            ) : (
              <div className="interactive-demo p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <FaGamepad className="text-6xl text-glass-accent mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Marvel Quiz Game</h4>
                  <p className="text-gray-300 mb-6">
                    Test your knowledge of the Marvel Cinematic Universe!
                  </p>
                  {!quizState.isPlaying ? (
                    <button
                      onClick={() => startQuiz()}
                      className="px-6 py-3 bg-glass-accent text-white rounded-lg hover:bg-opacity-80 transition-all flex items-center gap-2 mx-auto"
                      disabled={isLoading}
                    >
                      <FaPlay />
                      Start Quiz
                    </button>
                  ) : (
                    <div className="quiz-active">
                      <p className="text-white text-lg mb-4">Quiz in progress...</p>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={pauseQuiz}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
                        >
                          <FaPause className="mr-2" />
                          Pause
                        </button>
                        <button
                          onClick={endQuiz}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                        >
                          <FaTimes className="mr-2" />
                          End Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Analytics Panel */}
          {showAnalytics && (
            <div className="analytics-panel absolute top-0 right-0 w-80 h-full bg-glass-dark border-l border-glass-border p-4 overflow-y-auto">
              <h4 className="text-lg font-semibold text-white mb-4">Quiz Analytics</h4>
              <div className="space-y-4">
                <div className="stat-item">
                  <label className="text-gray-300 text-sm">Score</label>
                  <div className="text-2xl font-bold text-glass-accent">{quizState.score}</div>
                </div>
                <div className="stat-item">
                  <label className="text-gray-300 text-sm">Questions Answered</label>
                  <div className="text-xl text-white">{quizState.questionsAnswered}</div>
                </div>
                <div className="stat-item">
                  <label className="text-gray-300 text-sm">Correct Answers</label>
                  <div className="text-xl text-green-500">{quizState.correctAnswers}</div>
                </div>
                <div className="stat-item">
                  <label className="text-gray-300 text-sm">Accuracy</label>
                  <div className="text-xl text-blue-500">
                    {quizState.questionsAnswered > 0
                      ? Math.round((quizState.correctAnswers / quizState.questionsAnswered) * 100)
                      : 0}%
                  </div>
                </div>
                <div className="stat-item">
                  <label className="text-gray-300 text-sm">Current Streak</label>
                  <div className="text-xl text-purple-500">{quizState.streak}</div>
                </div>
              </div>
            </div>
          )}

          {/* Code Panel */}
          {showCode && (
            <div className="code-panel absolute bottom-0 left-0 right-0 h-64 bg-gray-900 border-t border-glass-border p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">Integration Code</h4>
                <button
                  onClick={copyDemoCode}
                  className="p-2 bg-glass-accent text-white rounded-lg hover:bg-opacity-80 transition-all"
                >
                  <FaCopy />
                </button>
              </div>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`// Marvel Quiz Demo Integration
import { MarvelQuizDemo } from './components/MarvelQuizDemo';

const config = {
  demoType: 'interactive',
  difficulty: '${quizState.currentDifficulty}',
  timeLimit: ${quizState.timeRemaining},
  features: ['scoring', 'leaderboard', 'achievements']
};

<MarvelQuizDemo 
  config={config}
  onDemoStart={(sessionId) => console.log('Quiz started:', sessionId)}
  onDemoComplete={(sessionId, analytics) => console.log('Quiz completed:', analytics)}
/>`}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="tutorial-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-glass-dark border border-glass-border rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-white mb-2">Marvel Quiz Tutorial</h3>
              <p className="text-gray-300 mb-4">
                Answer questions about the Marvel Cinematic Universe to earn points and achievements.
                Build streaks for bonus points and compete on the leaderboard!
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Skip
                </button>
                <button
                  onClick={() => {
                    setShowTutorial(false);
                    startQuiz();
                  }}
                  className="px-4 py-2 bg-glass-accent text-white rounded-lg hover:bg-opacity-80 transition-all"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default MarvelQuizDemo;