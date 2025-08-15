import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { state, resetGame } = useGame();

  // Redirect if no game completed
  useEffect(() => {
    if (!state.isGameFinished && state.questions.length === 0) {
      navigate('/');
    }
  }, [state.isGameFinished, state.questions.length, navigate]);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  const handleBackToPortfolio = () => {
    window.location.href = '../index.html';
  };

  const getScorePercentage = () => {
    return Math.round((state.score / state.questions.length) * 100);
  };

  const getMarvelRank = () => {
    const percentage = getScorePercentage();
    
    if (percentage >= 90) {
      return {
        title: "🏆 MARVEL LEGEND",
        description: "You're a true Marvel expert! You know the MCU inside and out!",
        color: "text-yellow-400",
        bgColor: "bg-yellow-900"
      };
    } else if (percentage >= 80) {
      return {
        title: "🦸‍♂️ SUPER HERO",
        description: "Excellent knowledge! You're definitely a Marvel superfan!",
        color: "text-blue-400",
        bgColor: "bg-blue-900"
      };
    } else if (percentage >= 70) {
      return {
        title: "🛡️ AVENGER",
        description: "Great job! You've got solid Marvel knowledge!",
        color: "text-green-400",
        bgColor: "bg-green-900"
      };
    } else if (percentage >= 60) {
      return {
        title: "🕷️ HERO IN TRAINING",
        description: "Not bad! Keep watching and you'll be an expert soon!",
        color: "text-purple-400",
        bgColor: "bg-purple-900"
      };
    } else if (percentage >= 40) {
      return {
        title: "👤 CIVILIAN",
        description: "You know some basics, but there's room for improvement!",
        color: "text-orange-400",
        bgColor: "bg-orange-900"
      };
    } else {
      return {
        title: "🤔 NEWCOMER",
        description: "Time to start your Marvel journey! Watch some movies and try again!",
        color: "text-red-400",
        bgColor: "bg-red-900"
      };
    }
  };

  const rank = getMarvelRank();
  const percentage = getScorePercentage();

  const getCorrectAnswers = () => {
    return state.answers.filter((answer, index) => {
      return answer === state.questions[index]?.correctAnswer;
    }).length;
  };

  const getTimeSpent = () => {
    const timeSpent = 300 - state.timeRemaining; // 5 minutes - remaining time
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (state.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading Results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black mb-4 hero-title">
            QUIZ COMPLETE!
          </h1>
          <p className="text-xl text-gray-300">Here's how you performed...</p>
        </div>

        {/* Score Card */}
        <div className="quiz-card p-8 rounded-lg mb-8">
          <div className="text-8xl font-black mb-4 text-yellow-400">
            {percentage}%
          </div>
          <div className="text-3xl font-bold mb-2">
            {state.score} out of {state.questions.length} correct
          </div>
          <div className="text-gray-400">
            You answered {getCorrectAnswers()} questions correctly
          </div>
        </div>

        {/* Rank Card */}
        <div className={`quiz-card p-8 rounded-lg mb-8 ${rank.bgColor} bg-opacity-20`}>
          <div className={`text-4xl font-black mb-4 ${rank.color}`}>
            {rank.title}
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {rank.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="quiz-card p-6 rounded-lg">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {getCorrectAnswers()}/{state.questions.length}
            </div>
            <div className="text-gray-400">Correct Answers</div>
          </div>
          <div className="quiz-card p-6 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {getTimeSpent()}
            </div>
            <div className="text-gray-400">Time Spent</div>
          </div>
          <div className="quiz-card p-6 rounded-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {percentage}%
            </div>
            <div className="text-gray-400">Accuracy</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handlePlayAgain}
            className="marvel-button px-8 py-3 text-xl font-bold rounded-lg transform transition-all duration-300 hover:scale-105"
          >
            PLAY AGAIN
          </button>
          
          <div className="mt-6">
            <button
              onClick={handleBackToPortfolio}
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-300"
            >
              ← Back to Portfolio
            </button>
          </div>
        </div>

        {/* Share Results */}
        <div className="mt-12 quiz-card p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Share Your Results</h3>
          <p className="text-gray-300 mb-4">
            I scored {percentage}% on the Marvel Quiz and earned the rank of {rank.title}! 🦸‍♂️
          </p>
          <div className="text-sm text-gray-400">
            Challenge your friends to beat your score!
          </div>
        </div>

        {/* Marvel Characters Celebration */}
        <div className="mt-8 text-6xl space-x-4 animate-bounce">
          {percentage >= 80 ? (
            <>
              <span>🎉</span>
              <span>🏆</span>
              <span>🦸‍♂️</span>
              <span>🏆</span>
              <span>🎉</span>
            </>
          ) : (
            <>
              <span>🕷️</span>
              <span>🛡️</span>
              <span>⚡</span>
              <span>🔨</span>
              <span>💚</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;