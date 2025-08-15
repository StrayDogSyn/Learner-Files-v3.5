import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const QuizGame: React.FC = () => {
  const navigate = useNavigate();
  const { state, answerQuestion, nextQuestion, finishGame, updateTime } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(state.timeRemaining);

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !state.isGameFinished) {
      const timer = setTimeout(() => {
        const newTime = timeLeft - 1;
        setTimeLeft(newTime);
        updateTime(newTime);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishGame();
      navigate('/results');
    }
  }, [timeLeft, state.isGameFinished, updateTime, finishGame, navigate]);

  // Redirect if no game started
  useEffect(() => {
    if (!state.isGameStarted) {
      navigate('/');
    }
  }, [state.isGameStarted, navigate]);

  // Handle game completion
  useEffect(() => {
    if (state.isGameFinished) {
      navigate('/results');
    }
  }, [state.isGameFinished, navigate]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answerIndex);
    answerQuestion(answerIndex);
    setShowResult(true);

    // Show result for 2 seconds then move to next question
    setTimeout(() => {
      if (state.currentQuestionIndex + 1 >= state.questions.length) {
        finishGame();
      } else {
        nextQuestion();
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnswerClass = (index: number) => {
    if (!showResult) {
      return 'answer-option';
    }
    
    if (index === currentQuestion.correctAnswer) {
      return 'answer-option answer-correct';
    }
    
    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return 'answer-option answer-incorrect';
    }
    
    return 'answer-option opacity-50';
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold">
            Question {state.currentQuestionIndex + 1} of {state.questions.length}
          </div>
          <div className="text-2xl font-bold text-red-400">
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-red-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Score */}
        <div className="text-center mb-8">
          <div className="text-xl">
            Score: <span className="text-yellow-400 font-bold">{state.score}</span> / {state.currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)}
          </div>
        </div>

        {/* Question Card */}
        <div className="quiz-card p-8 rounded-lg mb-8">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-400 mb-2">Character: {currentQuestion.character}</div>
            <div className="text-xs px-3 py-1 rounded-full bg-gray-700 inline-block mb-4">
              {currentQuestion.difficulty.toUpperCase()}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`${getAnswerClass(index)} p-4 rounded-lg text-left text-lg font-medium cursor-pointer disabled:cursor-not-allowed`}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className="mt-6 text-center">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <div className="text-green-400 text-xl font-bold">
                  ✅ Correct! Well done!
                </div>
              ) : (
                <div className="text-red-400 text-xl font-bold">
                  ❌ Incorrect. The correct answer was {String.fromCharCode(65 + currentQuestion.correctAnswer)}.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Character Hint */}
        <div className="text-center text-gray-400">
          <p>💡 This question is about <span className="text-yellow-400 font-semibold">{currentQuestion.character}</span></p>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;