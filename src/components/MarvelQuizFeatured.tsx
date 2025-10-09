import React, { useState, useEffect, useCallback } from 'react';
import './MarvelQuizFeatured.css';

interface QuizQuestion {
  question: string;
  answers: string[];
  correctIndex: number;
}

const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    question: "Which Avenger wields Mjolnir?",
    answers: ["Iron Man", "Thor", "Hulk", "Hawkeye"],
    correctIndex: 1
  },
  {
    question: "Who is the 'Friendly Neighborhood' hero?",
    answers: ["Daredevil", "Spider-Man", "Luke Cage", "Iron Fist"],
    correctIndex: 1
  },
  {
    question: "What is Tony Stark's superhero name?",
    answers: ["War Machine", "Iron Patriot", "Iron Man", "Steel Man"],
    correctIndex: 2
  },
  {
    question: "Which Infinity Stone is blue?",
    answers: ["Power", "Space", "Reality", "Mind"],
    correctIndex: 1
  },
  {
    question: "Who leads the Guardians of the Galaxy?",
    answers: ["Rocket", "Drax", "Star-Lord", "Gamora"],
    correctIndex: 2
  }
];

const QUIZ_URL = 'https://straydogsyn.github.io/Learner-Files-v3.5/marvel-quiz-game/';
const REPO_URL = 'https://github.com/StrayDogSyn/Learner-Files-v3.5/tree/main/marvel-quiz-game';

export default function MarvelQuizFeatured() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Auto-advance questions
  useEffect(() => {
    if (isPaused || showResult) return;

    const timer = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % DEMO_QUESTIONS.length);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, showResult]);

  const handleAnswerClick = useCallback((answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === DEMO_QUESTIONS[currentQuestion].correctIndex;
    
    if (isCorrect) {
      setScore((prev) => prev + 100);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Track interaction
    trackInteraction('answer_clicked', { isCorrect });

    // Auto-advance after showing result
    setTimeout(() => {
      setCurrentQuestion((prev) => (prev + 1) % DEMO_QUESTIONS.length);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 2000);
  }, [currentQuestion, selectedAnswer]);

  const trackInteraction = (action: string, metadata?: any) => {
    // Analytics placeholder - integrate with your analytics solution
    console.log('Interaction:', { action, metadata, timestamp: Date.now() });
  };

  const question = DEMO_QUESTIONS[currentQuestion];

  return (
    <div className="marvel-featured-project">
      {/* Header Section */}
      <div className="featured-header">
        <div className="featured-badge">
          <span className="badge-icon">⭐</span>
          <span className="badge-text">Featured Project</span>
        </div>
        <div className="featured-status">
          <span className="status-dot live"></span>
          <span className="status-text">LIVE IN PRODUCTION</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="featured-title">Marvel Quiz Game - Interactive PWA</h2>
      <p className="featured-subtitle">
        A cutting-edge Progressive Web Application showcasing advanced frontend development with 
        Marvel API integration, glassmorphic design, offline functionality, and real-time performance 
        monitoring. Built with vanilla JavaScript and modern web standards.
      </p>

      {/* Main Content Grid */}
      <div className="featured-content-grid">
        
        {/* Interactive Demo - The Hero */}
        <div 
          className="demo-section"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="demo-header">
            <span className="demo-label">🎮 LIVE DEMO</span>
            <span className="demo-status">
              {isPaused ? '⏸ Paused • Click to interact' : '↻ Auto-playing'}
            </span>
          </div>

          <div className="quiz-demo-container">
            <div className="quiz-demo-header">
              <span className="question-counter">
                Question {currentQuestion + 1} of {DEMO_QUESTIONS.length}
              </span>
              <div className="quiz-demo-stats">
                <span className="stat-item">
                  Streak: {streak > 0 && '🔥'}{streak}
                </span>
                <span className="stat-item">Score: {score}</span>
              </div>
            </div>

            <div className="quiz-question">
              <p className="question-text">{question.question}</p>
            </div>

            <div className="quiz-answers">
              {question.answers.map((answer, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === question.correctIndex;
                const shouldShowCorrect = showResult && isCorrect;
                const shouldShowWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    className={`quiz-answer ${isSelected ? 'selected' : ''} ${
                      shouldShowCorrect ? 'correct' : ''
                    } ${shouldShowWrong ? 'wrong' : ''}`}
                    onClick={() => handleAnswerClick(idx)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="answer-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="answer-text">{answer}</span>
                    {shouldShowCorrect && <span className="answer-icon">✓</span>}
                    {shouldShowWrong && <span className="answer-icon">✗</span>}
                  </button>
                );
              })}
            </div>

            <div className="quiz-progress">
              <div 
                className="quiz-progress-fill" 
                style={{ 
                  width: `${((currentQuestion + 1) / DEMO_QUESTIONS.length) * 100}%` 
                }}
              />
            </div>
          </div>

          <p className="demo-hint">
            💡 Hover to pause auto-play • Click answers to test your Marvel knowledge
          </p>
        </div>

        {/* Features & Tech Stack */}
        <div className="details-section">
          
          {/* Key Features */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <div className="feature-content">
                <h3 className="feature-title">Interactive Gameplay</h3>
                <p className="feature-description">
                  Real-time scoring, streak tracking, and smooth animations 
                  for an engaging quiz experience
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <div className="feature-content">
                <h3 className="feature-title">Marvel API Integration</h3>
                <p className="feature-description">
                  Live character data from Marvel's official API with 
                  intelligent fallback system
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <div className="feature-content">
                <h3 className="feature-title">Progressive Web App</h3>
                <p className="feature-description">
                  Install on any device, works offline, and provides 
                  native app-like experience
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <div className="feature-content">
                <h3 className="feature-title">Glassmorphism Design</h3>
                <p className="feature-description">
                  Modern UI with frosted glass effects, smooth transitions, 
                  and responsive layouts
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="tech-stack-section">
            <h3 className="tech-stack-title">Tech Stack</h3>
            <div className="tech-badges">
              <span className="tech-badge vanilla-js">Vanilla JS</span>
              <span className="tech-badge css3">CSS3</span>
              <span className="tech-badge api">Marvel API</span>
              <span className="tech-badge pwa">PWA</span>
              <span className="tech-badge responsive">Responsive</span>
              <span className="tech-badge glass">Glassmorphism</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <a 
              href={QUIZ_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
              onClick={() => trackInteraction('play_full_game')}
            >
              <span className="btn-icon">🎮</span>
              <span className="btn-text">Play Full Game</span>
            </a>
            <a 
              href={REPO_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
              onClick={() => trackInteraction('view_source')}
            >
              <span className="btn-icon">📂</span>
              <span className="btn-text">View Source</span>
            </a>
          </div>

          {/* Performance Stats */}
          <div className="performance-stats">
            <div className="stat-box">
              <div className="stat-value">✅</div>
              <div className="stat-label">API Status</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">~150ms</div>
              <div className="stat-label">Response</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">PWA</div>
              <div className="stat-label">Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
