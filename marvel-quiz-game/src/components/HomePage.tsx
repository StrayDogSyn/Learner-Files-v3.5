import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getRandomQuestions } from '../data/questions';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { startGame } = useGame();

  const handleStartQuiz = () => {
    const questions = getRandomQuestions(10);
    startGame(questions);
    navigate('/quiz');
  };

  const handleBackToPortfolio = () => {
    window.location.href = '../index.html';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="hero-title text-6xl md:text-8xl font-black mb-6 tracking-wider">
            MARVEL
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 marvel-text">
            QUIZ CHALLENGE
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Test your knowledge of the Marvel Cinematic Universe! 
            Can you prove you're a true Marvel hero?
          </p>
        </div>

        {/* Game Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="quiz-card p-6 rounded-lg">
            <div className="text-4xl mb-4">🦸‍♂️</div>
            <h3 className="text-xl font-bold mb-2">10 Questions</h3>
            <p className="text-gray-300">Challenge yourself with carefully selected Marvel questions</p>
          </div>
          <div className="quiz-card p-6 rounded-lg">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold mb-2">5 Minutes</h3>
            <p className="text-gray-300">Race against time to prove your Marvel knowledge</p>
          </div>
          <div className="quiz-card p-6 rounded-lg">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Score & Rank</h3>
            <p className="text-gray-300">Get your final score and Marvel hero ranking</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleStartQuiz}
            className="marvel-button px-12 py-4 text-2xl font-bold rounded-lg transform transition-all duration-300 hover:scale-105 pulse-animation"
          >
            START QUIZ
          </button>
          
          <div className="mt-8">
            <button
              onClick={handleBackToPortfolio}
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-300"
            >
              ← Back to Portfolio
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 quiz-card p-6 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-4">How to Play</h3>
          <ul className="text-left space-y-2 text-gray-300">
            <li>• Answer 10 multiple-choice questions about Marvel characters and movies</li>
            <li>• You have 5 minutes to complete the entire quiz</li>
            <li>• Each correct answer earns you points</li>
            <li>• Get your final score and see how you rank among Marvel fans</li>
          </ul>
        </div>

        {/* Marvel Characters Animation */}
        <div className="mt-12 text-6xl space-x-4 animate-pulse">
          <span>🕷️</span>
          <span>🛡️</span>
          <span>⚡</span>
          <span>🔨</span>
          <span>💚</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;